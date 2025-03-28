import { useState, useEffect } from 'react';
import { Tabs, TabsProps, Stack, Title, Text, Loader, Center } from '@mantine/core';
import { IconListTree, IconPencilStar, IconTextGrammar, IconTextSpellcheck, IconChecks } from '@tabler/icons-react';
import { PromptBuilder } from './core/PromptBuilder';
import { templateRegistry } from './core/promptService';

import { RevisaoTextoV2 } from './RevisaoTextoV2';
import { RevisaoProvaV2 } from './RevisaoProvaV2';

export interface ReviewToolV2Props extends Partial<TabsProps> {
  defaultTab?: string;
}

export function ReviewToolV2({ defaultTab = 'texto', ...props }: ReviewToolV2Props) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  const [textTemplates, setTextTemplates] = useState([]);
  const [finalTemplates, setFinalTemplates] = useState([]);
  const [proofTemplates, setProofTemplates] = useState([]);
  
  // Inicializar templates ao montar o componente
  useEffect(() => {
    const initializeTemplates = async () => {
      try {
        await templateRegistry.initialize();
        
        // Fetch templates after initialization is complete
        const [textTemplates, finalTemplates, proofTemplates] = await Promise.all([
          templateRegistry.getByCategory('revisao-texto'),
          templateRegistry.getByCategory('revisao-final'),
          templateRegistry.getByCategory('revisao-prova')
        ]);
        setTextTemplates(textTemplates);
        setFinalTemplates(finalTemplates);
        setProofTemplates(proofTemplates);
        
      } catch (error) {
        console.error('Failed to initialize templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeTemplates();
  }, []);
  
  if (loading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    );
  }
  
  return (
    <Tabs value={activeTab} onChange={setActiveTab} {...props}>
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
        <Title order={2}>Edição Estrutural</Title>
        <Text color="dimmed" mb="md">
          Funcionalidade em desenvolvimento...
        </Text>
      </Tabs.Panel>

      <Tabs.Panel value="estilo" pt="xs">
        <Title order={2}>Edição de Estilo</Title>
        <Text color="dimmed" mb="md">
          Funcionalidade em desenvolvimento...
        </Text>
      </Tabs.Panel>

      <Tabs.Panel value="texto" pt="xs">
        <RevisaoTextoV2 templates={textTemplates} />

      </Tabs.Panel>

      <Tabs.Panel value="final" pt="xs">
        <Stack spacing="lg">
          <Title order={2}>Revisão Final</Title>
          {finalTemplates.length > 0 ? (
            finalTemplates.map(template => (
              <PromptBuilder key={template.id} template={template} />
            ))
          ) : (
            <Text color="dimmed">Nenhum template disponível para esta categoria.</Text>
          )}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="prova" pt="xs">
        <RevisaoProvaV2 templates={proofTemplates} />
      </Tabs.Panel>
    </Tabs>
  );
}
