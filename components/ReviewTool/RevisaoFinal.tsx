import { Stack, Text, Title, Textarea, Accordion, Button, Switch } from '@mantine/core';
import { IconWand, IconClipboardCheck, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { PromptRevisaoFinalOrtografia } from './prompts/RevisaoFinalOrtografia';
import { calculateTokens, CHATGPT_TOKEN_LIMIT } from './ReviewTool';
import { Transition } from '@mantine/core';
import { DiffView } from './DiffView';

export function RevisaoFinal() {
  const [text, setText] = useState('');
  const [textCompare, setTextCompare] = useState('');
  const [revOrtografiaCopied, setRevOrtografiaCopied] = useState(false);
  const [revOrtografiaTokens, setRevOrtografiaTokens] = useState(0);
  const [preservarOriginal, setPreservarOriginal] = useState(true);
  const [showDiffView, setShowDiffView] = useState(false);
  const placeholderText = "Cole aqui o texto que você deseja revisar...";
  const placeholderTextCompare = "Cole aqui o texto revisado...";
  
  // Variáveis de controle para exibição das mensagens
  const [RevOrtografiaShowEmptyTextWarning, setRevOrtografiaShowEmptyTextWarning] = useState(false);
  const [RevOrtografiaShowTokensOk, setRevOrtografiaShowTokensOk] = useState(false);
  const [RevOrtografiaShowTokensExceeded, setRevOrtografiaShowTokensExceeded] = useState(false);

  // Add useEffect to handle transition animations
  useEffect(() => {
    // This ensures transitions work when the visibility states change
    return () => {};
  }, [RevOrtografiaShowEmptyTextWarning, RevOrtografiaShowTokensOk, RevOrtografiaShowTokensExceeded]);

  // Função para resetar as mensagens
  const resetMessages = () => {
    setRevOrtografiaShowEmptyTextWarning(false);
    setRevOrtografiaShowTokensOk(false);
    setRevOrtografiaShowTokensExceeded(false);
  };

  // Handler para alteração de texto com reset de mensagens
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.currentTarget.value);
    resetMessages(); // Reseta todas as mensagens quando o texto é alterado
  };

  // Handler para alteração de texto de comparação
    const handleTextCompareChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextCompare(event.currentTarget.value);
    };

  // Handler para quando o switch for alterado
  const handlePreservarOriginalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreservarOriginal(event.currentTarget.checked);
    resetMessages(); // Reseta todas as mensagens quando a opção for alterada
  };

  const handleRevOrtografiaCopy = async () => {
    try {
      const textToUse = text.trim() || placeholderText;
      // Usando a função corretamente com seus parâmetros
      const fullPrompt = PromptRevisaoFinalOrtografia(textToUse, preservarOriginal);
      
      const { tokens, chars } = calculateTokens(fullPrompt);
      setRevOrtografiaTokens(tokens);
      
      // Controle das mensagens com base nas condições
      setRevOrtografiaShowEmptyTextWarning(text.trim() === '');
      setRevOrtografiaShowTokensOk(tokens <= CHATGPT_TOKEN_LIMIT && text.trim() !== '');
      setRevOrtografiaShowTokensExceeded(tokens > CHATGPT_TOKEN_LIMIT);
  
      await navigator.clipboard.writeText(fullPrompt);
      setRevOrtografiaCopied(true);
      setTimeout(() => setRevOrtografiaCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy RevOrtografia:', err);
    }
  };

  // Handler para mostrar/esconder o DiffView
  const handleToggleDiffView = () => {
    setShowDiffView(!showDiffView);
  };

  return (
    <Stack>
      <Title order={2}>Revisão Final</Title>
      <Textarea
        placeholder={placeholderText}
        minRows={5}
        autosize
        style={{ width: '100%' }}
        value={text}
        onChange={handleTextChange}
      />
      <Text>
        Escolha o tipo de revisão:
      </Text>
      <Accordion>
        <Accordion.Item value="ortografica">
          <Accordion.Control icon={"👀"}>Revisão Ortográfica</Accordion.Control>
          <Accordion.Panel>
            <Text>
              Esta revisão considera os seguintes aspectos:
            </Text>
            <Text component="ul" style={{ paddingLeft: '2rem' }}>
              <li>Erros de digitação e ortografia que passaram despercebidos;</li>
              <li>Padrões de pontuação e espaçamento, garantindo uniformidade;</li>
              <li>Problemas de formatação, como fontes inconsistentes e quebras de linha indevidas;</li>
              <li>Pequenos deslizes introduzidos durante as revisões anteriores.</li>
            </Text>
            
            {/* Opção para preservar o original */}
            <Switch 
              checked={preservarOriginal}
              onChange={handlePreservarOriginalChange}
              label="Preservar ao máximo o texto original."
              mt="md"
              mb="md"
            />
            
            <div style={{ position: 'relative' }}>
              <Button
                mt="md"
                leftSection={revOrtografiaCopied ? <IconClipboardCheck size={14} /> : <IconWand size={14} />}
                variant="light"
                color={revOrtografiaCopied ? 'green' : 'blue'}
                onClick={handleRevOrtografiaCopy}
              >
                {revOrtografiaCopied ? 'Prompt gerado e copiado!' : 'Gerar prompt para Revisão Final'}
              </Button>
            </div>

            <div style={{ paddingLeft: '2rem', marginTop: '0.5rem' }}>
              <Transition
                mounted={RevOrtografiaShowEmptyTextWarning}
                transition="fade"
                duration={1000}
                timingFunction="ease"
              >
                {(styles) => (
                  <div style={styles}>
                    <Text size="xs" c="yellow.6">⚠️ Parece que você não colou o texto para revisar.</Text>
                  </div>
                )}
              </Transition>

              <Transition
                mounted={RevOrtografiaShowTokensOk}
                transition="fade"
                duration={1000}
                timingFunction="ease"
              >
                {(styles) => (
                  <div style={styles}>
                    <Text size="xs" c="green.6">✅ Tokens estimados {revOrtografiaTokens} [Limite do ChatGPT 4o: {CHATGPT_TOKEN_LIMIT}].</Text>
                  </div>
                )}
              </Transition>

              <Transition
                mounted={RevOrtografiaShowTokensExceeded}
                transition="fade"
                duration={1000}
                timingFunction="ease"
              >
                {(styles) => (
                  <div style={styles}>
                    <Text size="xs" c="red.6">
                      ⚠️ Tokens estimados {revOrtografiaTokens}. <b>Recomendação</b>: dividir a revisão em dois textos. [Limite do ChatGPT 4o: {CHATGPT_TOKEN_LIMIT}].
                    </Text>
                  </div>
                )}
              </Transition>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="comparador">
          <Accordion.Control icon={"🧐"}>Comparação de textos</Accordion.Control>
          <Accordion.Panel>
            <Text size="xs" style={{ paddingLeft: '2rem'}}>
              <Textarea
                placeholder={placeholderTextCompare}
                minRows={5}
                autosize
                style={{ width: '100%' }}
                value={textCompare}
                onChange={handleTextCompareChange}
              />
            </Text>
            <div style={{ position: 'relative' }}>
              <Button
                mt="md"
                leftSection={showDiffView ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                variant="light"
                color="blue"
                onClick={handleToggleDiffView}
                disabled={!text.trim() || !textCompare.trim()}
              >
                {showDiffView ? 'Ocultar comparação' : 'Mostrar comparação'}
              </Button>
              
              {showDiffView && (
                <div style={{ marginTop: '0px', height: '500px' }}>
                  <DiffView
                    originalText={text}
                    modifiedText={textCompare}
                    height={400}
                  />
                </div>
              )}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
