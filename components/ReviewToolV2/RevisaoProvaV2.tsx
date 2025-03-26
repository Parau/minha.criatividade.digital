import { Stack, Title, Text } from '@mantine/core';
import { PromptBuilder } from './core/PromptBuilder';
import { TemplateType } from './core/promptService';

interface RevisaoProvaV2Props {
  templates: TemplateType[];
}

export function RevisaoProvaV2({ templates }: RevisaoProvaV2Props) {
  return (
    <Stack spacing="lg">
      <Title order={2}>Revisão de Prova</Title>
      {templates.length > 0 ? (
        templates.map(template => (
          <PromptBuilder key={template.id} template={template} />
        ))
      ) : (
        <Text color="dimmed">Nenhum template disponível para esta categoria.</Text>
      )}
    </Stack>
  );
}
