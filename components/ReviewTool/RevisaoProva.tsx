import { Stack, Text, Title, Textarea, Accordion, Button } from '@mantine/core';
import { IconWand, IconClipboardCheck } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { PromptRevTypo } from './prompts/RevisaoProvaTipografia';
import { calculateTokens, CHATGPT_TOKEN_LIMIT } from './ReviewTool';
import { Transition } from '@mantine/core';

export function RevisaoProva() {
  const [text, setText] = useState('');
  const [revTypoCopied, setRevTypoCopied] = useState(false);
  const [revTypoTokens, setrevTypoTokens] = useState(0);
  const placeholderText = "Cole aqui o texto que você deseja revisar...";
  
  // Variáveis de controle para exibição das mensagens
  const [RevTypoShowEmptyTextWarning, setRevTypoShowEmptyTextWarning] = useState(false);
  const [RevTypoShowTokensOk, setRevTypoShowTokensOk] = useState(false);
  const [RevTypoShowTokensExceeded, setRevTypoShowTokensExceeded] = useState(false);

  // Add useEffect to handle transition animations
  useEffect(() => {
    // This ensures transitions work when the visibility states change
    return () => {};
  }, [RevTypoShowEmptyTextWarning, RevTypoShowTokensOk, RevTypoShowTokensExceeded]);

  // Função para resetar as mensagens
  const resetMessages = () => {
    setRevTypoShowEmptyTextWarning(false);
    setRevTypoShowTokensOk(false);
    setRevTypoShowTokensExceeded(false);
  };

  // Handler para alteração de texto com reset de mensagens
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.currentTarget.value);
    resetMessages(); // Reseta todas as mensagens quando o texto é alterado
  };

  const handleRevTypoCopy = async () => {
    try {
      const textToUse = text.trim() || placeholderText;
      const fullPrompt = PromptRevTypo.replace('{TEXT_TO_REVIEW}', textToUse);
      
      const { tokens, chars } = calculateTokens(fullPrompt);
      setrevTypoTokens(tokens);
      
      // Controle das mensagens com base nas condições
      setRevTypoShowEmptyTextWarning(text.trim() === '');
      setRevTypoShowTokensOk(tokens <= CHATGPT_TOKEN_LIMIT && text.trim() !== '');
      setRevTypoShowTokensExceeded(tokens > CHATGPT_TOKEN_LIMIT);
  
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
        onChange={handleTextChange} // Alterado para usar o novo handler
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

            <div style={{ paddingLeft: '2rem', marginTop: '0.5rem' }}>
              <Transition
                mounted={RevTypoShowEmptyTextWarning}
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
                mounted={RevTypoShowTokensOk}
                transition="fade"
                duration={1000}
                timingFunction="ease"
              >
                {(styles) => (
                  <div style={styles}>
                    <Text size="xs" c="green.6">✅ Tokens estimados {revTypoTokens} [Limite do ChatGPT 4o: {CHATGPT_TOKEN_LIMIT}].</Text>
                  </div>
                )}
              </Transition>

              <Transition
                mounted={RevTypoShowTokensExceeded}
                transition="fade"
                duration={1000}
                timingFunction="ease"
              >
                {(styles) => (
                  <div style={styles}>
                    <Text size="xs" c="red.6">
                      ⚠️ Tokens estimados {revTypoTokens}. <b>Recomendação</b>: dividir a revisão em dois textos. [Limite do ChatGPT 4o: {CHATGPT_TOKEN_LIMIT}].
                    </Text>
                  </div>
                )}
              </Transition>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="acidentes">
          <Accordion.Control icon={"🤕"}>Acidentes de percurso</Accordion.Control>
          <Accordion.Panel>
            <Text size="xs" c="red.6" style={{ paddingLeft: '2rem'}}>
              ⚠️ ESTE RECURSO DE REVISÃO AINDA NÃO ESTÁ DISPONÍVEL.
            </Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
