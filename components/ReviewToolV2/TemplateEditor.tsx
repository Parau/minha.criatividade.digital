import React, { useState } from 'react';
import { Card, Tabs, Button, Textarea, Text, Stack, Group, Badge, Alert } from '@mantine/core';
import { IconDeviceFloppy, IconCode, IconEye, IconFileDescription } from '@tabler/icons-react';
import { parseTemplateFile } from './core/promptTemplateLoader';
import { PromptBuilder } from './core/PromptBuilder';
import { PromptTemplate } from './core/promptTypes';

interface TemplateEditorProps {
  initialTemplate?: string;
  onSave?: (templateContent: string) => void;
}

export function TemplateEditor({ initialTemplate = '', onSave }: TemplateEditorProps) {
  const [templateContent, setTemplateContent] = useState(initialTemplate);
  const [activeTab, setActiveTab] = useState<string | null>('edit');
  const [parsedTemplate, setParsedTemplate] = useState<PromptTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = () => {
    try {
      const template = parseTemplateFile(templateContent);
      setParsedTemplate(template);
      setError(null);
      setActiveTab('preview');
    } catch (err) {
      setError(`Erro ao analisar template: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      setParsedTemplate(null);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(templateContent);
    }
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Stack spacing="md">
        <Group position="apart">
          <Text size="xl" weight={700}>Editor de Template</Text>
          <Group spacing="xs">
            <Button 
              variant="light" 
              leftSection={<IconEye size={16} />}
              onClick={handlePreview}
            >
              Visualizar
            </Button>
            {onSave && (
              <Button 
                variant="filled" 
                color="blue" 
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={handleSave}
              >
                Salvar
              </Button>
            )}
          </Group>
        </Group>

        {error && (
          <Alert title="Erro" color="red">
            {error}
          </Alert>
        )}

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="edit" leftSection={<IconCode size={14} />}>
              Editar
            </Tabs.Tab>
            <Tabs.Tab 
              value="preview" 
              leftSection={<IconEye size={14} />}
              disabled={!parsedTemplate}
            >
              Visualizar
            </Tabs.Tab>
            <Tabs.Tab 
              value="help" 
              leftSection={<IconFileDescription size={14} />}
            >
              Ajuda
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="edit" pt="xs">
            <Textarea
              placeholder="Cole ou escreva o template aqui..."
              minRows={20}
              autosize
              value={templateContent}
              onChange={(e) => setTemplateContent(e.currentTarget.value)}
              styles={{
                input: {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre',
                }
              }}
            />
          </Tabs.Panel>

          <Tabs.Panel value="preview" pt="xs">
            {parsedTemplate && (
              <Stack spacing="md">
                <Group spacing="xs">
                  <Badge>{parsedTemplate.id}</Badge>
                  <Badge color="blue">{parsedTemplate.category}</Badge>
                </Group>
                <PromptBuilder template={parsedTemplate} />
              </Stack>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="help" pt="xs">
            <Stack spacing="md">
              <Text weight={700}>Estrutura de um Template</Text>
              <Text>
                Um arquivo de template consiste em duas partes:
              </Text>
              <Text>
                1. <strong>Frontmatter:</strong> Metadados YAML entre delimitadores <code>---</code>
              </Text>
              <Text>
                2. <strong>Conteúdo:</strong> O template Handlebars
              </Text>
              
              <Text weight={700}>Exemplo:</Text>
              <Textarea
                readOnly
                minRows={15}
                value={`---
id: exemplo-template
name: Exemplo de Template
description: Descrição do template
category: revisao-texto
icon: IconTextSpellcheck
inputs:
  - id: texto
    type: textarea
    label: Texto para revisão
    required: true
    validation:
      minLength: 10
  - id: alguma_condicao
    type: switch
    label: Habilitar opção
    defaultValue: false
---
Template usando sintaxe Handlebars:

{{#if alguma_condicao}}
  Texto condicional
{{/if}}

<texto>
{{texto}}
</texto>`}
                styles={{
                  input: {
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    whiteSpace: 'pre',
                  }
                }}
              />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Card>
  );
}
