//https://tabler.io/icons
import { Tabs, TabsProps } from '@mantine/core';
import { IconListTree, IconPencilStar, IconTextGrammar, IconTextSpellcheck, IconChecks } from '@tabler/icons-react';
import * as tokenizer from 'gpt-tokenizer';  // Correct import for the full API
import { RevisaoProva } from './RevisaoProva';
import { RevisaoFinal } from './RevisaoFinal';
import { RevisaoTexto } from './RevisaoTexto';

export interface ReviewToolProps extends Partial<TabsProps> {
  defaultTab?: string;
}

// Função utilitária para calcular tokens usando o tokenizer do GPT-4
export const calculateTokens = (text: string): { tokens: number; chars: number } => {
  try {
    // Use the correct API for GPT-4
    const tokens = tokenizer.encode(text);
    return {
      tokens: tokens.length,
      chars: text.length
    };
  } catch (error) {
    console.error('Erro ao calcular tokens:', error);
    return { tokens: 0, chars: 0 };
  }
};

// Constante com o limite de tokens do GPT-4
export const CHATGPT_TOKEN_LIMIT = 8192;

export function ReviewTool({ defaultTab = 'estrutural', ...props }: ReviewToolProps) {
  return (
    <Tabs defaultValue={defaultTab} {...props}>
      <Tabs.List>
        <Tabs.Tab value="estrutural" leftSection={<IconListTree size="1.2rem" />}>
          1. Edição Estrutural
        </Tabs.Tab>
        <Tabs.Tab value="estilo" leftSection={<IconPencilStar size="1.2rem" />}>
          2. Edição de Estilo
        </Tabs.Tab>
        <Tabs.Tab value="texto" leftSection={<IconTextGrammar size="1.2rem" />}>
          3. Revisão de Texto
        </Tabs.Tab>
        <Tabs.Tab value="final" leftSection={<IconTextSpellcheck size="1.2rem" />}>
          4. Revisão Final
        </Tabs.Tab>
        <Tabs.Tab value="prova" leftSection={<IconChecks size="1.2rem" />}>
          5. Revisão de Prova
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="estrutural" pt="xs">
        Conteúdo da aba de Edição Estrutural
      </Tabs.Panel>

      <Tabs.Panel value="estilo" pt="xs">
        Conteúdo da aba de Edição de Estilo
      </Tabs.Panel>

      <Tabs.Panel value="texto" pt="xs">
        <RevisaoTexto />
      </Tabs.Panel>

      <Tabs.Panel value="final" pt="xs">
        <RevisaoFinal />
      </Tabs.Panel>

      <Tabs.Panel value="prova" pt="xs">
        <RevisaoProva />
      </Tabs.Panel>
    </Tabs>
  );
}
