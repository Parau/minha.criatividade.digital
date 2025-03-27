import { useEffect, useState } from 'react';
import { Accordion, Stack, Text, Textarea, Title } from '@mantine/core';
import { PromptBuilder } from './core/PromptBuilder';
import { TemplateType } from './core/promptService';


interface RevisaoTextoV2Props {
  templates: TemplateType[];
}

export function RevisaoTextoV2({ templates }: RevisaoTextoV2Props) {
  const placeholderText = "Cole aqui o texto que você deseja revisar...";
  const placeholderTextCompare = "Cole aqui o texto revisado...";

  const [textToReview, setTextToReview] = useState('');

    // Handler para alteração de texto com reset de mensagens
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextToReview(event.currentTarget.value);
      //resetMessages(); // Reseta todas as mensagens quando o texto é alterado
    };

  // Array com os IDs dos templates que queremos exibir
  const templateIds = [
    { id: "revisao-ortografica", icon: "👀", name: "Correção de erros gramaticais e ortográficos" },
    { id: "revisao-estilo",  icon: "💬", name: "Padronização do estilo e da voz narrativa" }
  ];

  return (
    <Stack spacing="lg">
      <Title order={2}>Revisão de Texto</Title>
      <Textarea
        placeholder={placeholderText}
        minRows={5}
        autosize
        style={{ width: '100%' }}
        value={textToReview}
        onChange={handleTextChange}
      />
      <Text>Escolha o tipo de revisão:</Text>

      {templates.length === 0 ? (
        <Text color="dimmed">Nenhum template disponível para esta categoria.</Text>
      ) : (
        <>
          <Accordion>
            {templateIds.map(({ id, icon, name }) => {
              const template = templates.find((t) => t.id === id);
              return template ? (
                <Accordion.Item value={id}>
                  <div
                    style={{
                      backgroundColor: template.bkColor, // Light blue background
                      padding: '0px', // Optional: adds some spacing inside
                      borderRadius: '8px', // Optional: rounded corners
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)', // Optional: subtle shadow
                    }}>
                    <Accordion.Control icon={template.icon}>
                      <b>{template.name}</b>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <PromptBuilder key={id} template={template} textToReview={textToReview} />
                    </Accordion.Panel>
                  </div>
                </Accordion.Item>
              ) : (
                <Text key={id} color="dimmed">
                  Template para {name} não encontrado.
                </Text>
              );
            })}
          </Accordion>
        </>
      )}
    </Stack>
  );
}