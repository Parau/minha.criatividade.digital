import { Stack, Text, Title, Textarea, Accordion, Button } from '@mantine/core';
import { IconWand, IconClipboardCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { PromptRevTypo } from './prompts/RevisaoProvaTipografia';
import { calculateTokens, CHATGPT_TOKEN_LIMIT } from './ReviewTool';

export function RevisaoProva() {
  const [text, setText] = useState('');
  const [revTypoCopied, setRevTypoCopied] = useState(false);
  const placeholderText = "Cole aqui o texto que você deseja revisar...";

  const handleRevTypoCopy = async () => {
    try {
      const textToUse = text.trim() || placeholderText;
      const fullPrompt = PromptRevTypo.replace('{TEXT_TO_REVIEW}', textToUse);
      
      const { tokens, chars } = calculateTokens(fullPrompt);
      alert(`Caracteres: ${chars}\nTokens: ${tokens}/${CHATGPT_TOKEN_LIMIT}`);

      await navigator.clipboard.writeText(fullPrompt);
      setRevTypoCopied(true);
      setTimeout(() => setRevTypoCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy RevTypo:', err);
    }
  };

  return (
    <Stack>
      <Title order={2}>Revisão de Prova</Title>
      <Textarea
        placeholder={placeholderText}
        minRows={5}
        autosize
        style={{ width: '100%' }}
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
      />
      <Text>
        Escolha o tipo de revisão:
      </Text>
      <Accordion>
        <Accordion.Item value="tipografica">
          <Accordion.Control icon={"👀"}>Revisão Tipográfica</Accordion.Control>
          <Accordion.Panel>
            <Text>
              Esta revisão considera os seguintes aspectos:
            </Text>
            <Text component="ul" style={{ paddingLeft: '2rem' }}>
              <li>Grafia incorreta da palavra, typos, omissão de letras, inclusão de caracteres extras;</li>
              <li>Espaçamentos irregulares e quebras de linha indesejadas;</li>
              <li>Omissões ou repetições acidentais de palavras ou parágrafos;</li>
              <li>Erros de ordem e numeração: Erros em listas, como bullets, enumerações alfabéticas ou numeração incorreta.</li>
            </Text>
            <div style={{ position: 'relative' }}>
              <Button
                mt="md"
                leftSection={revTypoCopied ? <IconClipboardCheck size={14} /> : <IconWand size={14} />}
                variant="light"
                color={revTypoCopied ? 'green' : 'blue'}
                onClick={handleRevTypoCopy}
              >
                {revTypoCopied ? 'Prompt gerado e copiado!' : 'Gerar prompt para Revisão Tipográfica'}
              </Button>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="acidentes">
          <Accordion.Control icon={"🤕"}>Acidentes de percurso</Accordion.Control>
          <Accordion.Panel>
            <Text component="ul" style={{ paddingLeft: '2rem' }}>
              <li>Viúvas e órfãs</li>
              <li>Números de página</li>
              <li>Quebras de seção</li>
              <li>Legendas e notas de rodapé</li>
              <li>Cabeçalhos e rodapés</li>
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

    </Stack>
  );
}
