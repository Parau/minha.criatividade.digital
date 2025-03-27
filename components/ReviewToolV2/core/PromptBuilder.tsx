import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Stack, Text, Textarea, TextInput, Select, 
  MultiSelect, Switch, Combobox, useCombobox, InputBase,
  Card, Group, Alert, Badge, Transition
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconWand, IconClipboardCheck, IconAlertCircle } from '@tabler/icons-react';
import { PromptTemplate, PromptInputField } from './promptTypes';
import { evaluatePrompt, copyPromptToClipboard, CHATGPT_TOKEN_LIMIT, renderPromptTemplate } from './promptService';

interface PromptBuilderProps {
  template: PromptTemplate;
  onPromptGenerated?: (prompt: string) => void;
  textToReview: string;
}

export function PromptBuilder({ template, onPromptGenerated, textToReview }: PromptBuilderProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [evaluation, setEvaluation] = useState<ReturnType<typeof evaluatePrompt> | null>(null);
  
  // Configurar formulário baseado no template
  const initialValues = Object.fromEntries(
    template.inputs.map(input => [input.id, input.defaultValue ?? getDefaultValueForType(input.type)])
  );
  
  const form = useForm({
    initialValues,
    validate: template.validateInputs,
  });
  
  // Renderizar campo de entrada baseado no tipo
  const renderInputField = (field: PromptInputField) => {
    // Verificar dependências do campo
    if (field.dependsOn) {
      const dependencyValue = form.values[field.dependsOn.field];
      if (dependencyValue !== field.dependsOn.value) {
        return null;
      }
    }
    
    // Renderizar o campo apropriado baseado no tipo
    switch (field.type) {
      case 'HiddenInput': // para copiar o texto de entrada que fica fora do promptbuilder
      return (
        <TextInput
          hidden = {true}
          style={{ display: 'none' }} // Add this as a backup
          key={field.id}
          label={field.label}
        />
      );
      
      case 'text':
        return (
          <TextInput
            key={field.id}
            label={field.label}
            description={field.description ? field.description : undefined}
            placeholder={field.placeholder}
            required={field.required}
            icon={field.icon}
            {...form.getInputProps(field.id)}
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            key={field.id}
            label={field.label}
            description={field.description}
            placeholder={field.placeholder}
            required={field.required}
            autosize
            minRows={5}
            {...form.getInputProps(field.id)}
          />
        );
        
      case 'select':
        return (
          <Select
            key={field.id}
            label={field.label}
            description={field.description}
            placeholder={field.placeholder}
            required={field.required}
            data={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
            {...form.getInputProps(field.id)}
          />
        );
        
      case 'multiselect':
        return (
          <MultiSelect
            key={field.id}
            label={field.label}
            description={field.description}
            placeholder={field.placeholder}
            required={field.required}
            data={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
            {...form.getInputProps(field.id)}
          />
        );
        
      case 'switch':
        return (
          <Switch
            key={field.id}
            label={field.label}
            description={field.description}
            {...form.getInputProps(field.id, { type: 'checkbox' })}
          />
        );
        
      case 'combobox':
        return renderCombobox(field);
        
      default:
        return <Text key={field.id}>Tipo de campo não suportado: {field.type}</Text>;
    }
  };
  
  // Função auxiliar para renderizar Combobox com criação de opções
  const renderCombobox = (field: PromptInputField) => {
    const combobox = useCombobox({
      onDropdownClose: () => combobox.resetSelectedOption(),
    });
    
    // Extrair valores e labels das opções
    const initialOptions = field.options?.map(opt => ({ 
      value: opt.value, 
      label: opt.label || opt.value 
    })) || [];
    
    const [data, setData] = useState(initialOptions);
    const [value, setValue] = useState<string | null>(form.values[field.id] || null);
    const [displayValue, setDisplayValue] = useState('');
    const [search, setSearch] = useState('');
    
    // Efeito para atualizar o display quando um valor é selecionado inicialmente
    useEffect(() => {
      if (value) {
        const selectedOption = data.find(item => item.value === value);
        if (selectedOption) {
          setDisplayValue(selectedOption.label);
          setSearch(selectedOption.label);
        }
      }
    }, [value, data]);
    
    // Filtrar opções baseado na pesquisa
    const filteredOptions = data.filter((item) => 
      item.label.toLowerCase().includes(search.toLowerCase().trim()) || 
      item.value.toLowerCase().includes(search.toLowerCase().trim())
    );
    
    // Verificar se existe correspondência exata com o texto de pesquisa
    const exactMatch = data.some(item => 
      item.label.toLowerCase() === search.toLowerCase() || 
      item.value.toLowerCase() === search.toLowerCase()
    );
    
    // Mapear opções para componentes de opção
    const options = filteredOptions.map((item) => (
      <Combobox.Option value={item.value} key={item.value}>
        {item.label}
      </Combobox.Option>
    ));
    
    return (
      <Box key={field.id} mb="md">
        <Text weight={500} size="sm" mb={5}>{field.label}</Text>
        {field.description && <Text size="xs" color="dimmed" mb={5}>{field.description}</Text>}
        
        <Combobox
          store={combobox}
          withinPortal={false}
          onOptionSubmit={(val) => {
            if (val === '$create') {
              // Ao criar nova opção, usar o mesmo valor para label e value
              const newOption = { value: search, label: search };
              setData((current) => [...current, newOption]);
              setValue(search);
              setDisplayValue(search);
              form.setFieldValue(field.id, search);
            } else {
              // Ao selecionar opção existente, usar o value para o form e o label para display
              const selectedOption = data.find(item => item.value === val);
              if (selectedOption) {
                setValue(val);
                setDisplayValue(selectedOption.label);
                setSearch(selectedOption.label);
                form.setFieldValue(field.id, val);
              }
            }
            combobox.closeDropdown();
          }}
        >
          <Combobox.Target>
            <InputBase
              rightSection={<Combobox.Chevron />}
              value={search}
              onChange={(event) => {
                combobox.openDropdown();
                combobox.updateSelectedOptionIndex();
                setSearch(event.currentTarget.value);
              }}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => {
                combobox.closeDropdown();
                setSearch(displayValue || '');
              }}
              placeholder={field.placeholder}
              rightSectionPointerEvents="none"
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {options}
              {!exactMatch && search.trim().length > 0 && (
                <Combobox.Option value="$create">+ Criar [{search}]</Combobox.Option>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        
        {form.errors[field.id] && (
          <Text color="red" size="xs" mt={5}>
            {form.errors[field.id]}
          </Text>
        )}
      </Box>
    );
  };
  
  // Gerar o prompt baseado nos valores do formulário
  const handleGeneratePrompt = () => {
    //const { hasErrors, errors } = form.validate();

    //if (!hasErrors) {
      //Copia o texto de entrada que fica fora do promptbuilder
      form.values["texto"] = textToReview;

      const formValues = form.values;
      const prompt = renderPromptTemplate(template.template, formValues);

      setGeneratedPrompt(prompt);
      setEvaluation(evaluatePrompt(prompt, formValues, template));
      
      if (onPromptGenerated) {
        onPromptGenerated(prompt);
      }
    //}
  };
  
  // Copiar o prompt para a área de transferência
  const handleCopyPrompt = async () => {
    if (generatedPrompt) {
      const success = await copyPromptToClipboard(generatedPrompt);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };
  
  return (
    <>
      {template.description && template.description.trim() !== '' && (
        <Text size="sm" mb="xl">
        <div dangerouslySetInnerHTML={{ __html: template.description }} />
        </Text>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleGeneratePrompt(); }}>

          {template.inputs.map(renderInputField)}
          
          <Button 
            type="submit" 
            leftSection={<IconWand size={16} />}
            variant="light"
            color="blue"
            mt="md"
          >
            Gerar Prompt
          </Button>

      </form>
      
      {generatedPrompt && evaluation && (
        <>
        <br />
        <Card p="md" radius="md" withBorder>
          <Group position="apart" mb="md">
            <Text fw={500}>Prompt Gerado</Text>
            <Button
              leftSection={isCopied ? <IconClipboardCheck size={16} /> : undefined}
              variant="subtle"
              color={isCopied ? "green" : "blue"}
              onClick={handleCopyPrompt}
            >
              {isCopied ? "Copiado!" : "Copiar para área de transferência"}
            </Button>
          </Group>
         
          {evaluation.errors.length > 0 && (
            <Stack gap={2}>
              {evaluation.errors.map((error, i) => (
                <Text key={i} size="sm">{error}</Text>
              ))}
              <Text size="sm">✔️ O prompt foi copiado para a área de transferência.</Text>
            </Stack>
          )}
          <Stack mt={10}>
            <Badge color={evaluation.isWithinLimits ? "green" : "red"}>
              {evaluation.tokens} tokens
            </Badge>
          </Stack>
          <br />
          <Textarea
            value={generatedPrompt}
            minRows={8}
            autosize
            readOnly
            styles={{
              input: {
                fontFamily: 'monospace',
                fontSize: '0.9rem',
              },
            }}
          />
          
          <Transition mounted={!evaluation.isWithinLimits} transition="fade" duration={200}>
            {(styles) => (
              <Text style={styles} size="sm" color="red" mt="xs">
                ⚠️ Este prompt excede o limite de {CHATGPT_TOKEN_LIMIT} tokens do ChatGPT. 
                Considere reduzir o tamanho do texto ou dividir em múltiplos prompts.
              </Text>
            )}
          </Transition>
        </Card>
        </>
      )}
    </>
  );
}

// Função auxiliar para obter valores padrão baseados no tipo
function getDefaultValueForType(type: string): any {
  switch (type) {
    case 'switch': return false;
    case 'multiselect': return [];
    default: return '';
  }
}
