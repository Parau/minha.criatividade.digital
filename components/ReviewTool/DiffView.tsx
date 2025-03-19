import React, { useEffect, useState } from 'react';
import { Card, Paper, Text, useMantineTheme, Stack, Button, useMantineColorScheme, MantineStyleProp } from '@mantine/core';
import { DiffEditor } from '@monaco-editor/react';
import { IconMaximize, IconMinimize } from '@tabler/icons-react';

interface DiffViewProps {
  originalText: string;
  modifiedText: string;
  originalTitle?: string;
  modifiedTitle?: string;
  height?: string | number;
}

export function DiffView({
  originalText,
  modifiedText,
  originalTitle = 'Original',
  modifiedTitle = 'Modificado',
  height = 400
}: DiffViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme(); // Use the dedicated hook for color scheme

  // Garantir que o componente só seja renderizado no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Estilo para modo de tela cheia
  const fullscreenStyle = isFullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: '20px',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.white
      }
    : {
        position: 'relative', // Garantir posicionamento adequado quando não está em fullscreen
        width: '100%',
        height: height, // Aplicar a altura fornecida por props
        overflow: 'hidden' // Evitar vazamento de conteúdo
      };

  if (!isClient) {
    return <Text>Carregando o comparador de textos...</Text>;
  }

  return (
    <Paper
      style ={{
        ...fullscreenStyle,
        display: 'flex',
        flexDirection: 'column',
      } as MantineStyleProp} //TIVE QUE FORÇAR O TIPO DE MANTINESTYLEPROP PORQUE ESTAVA FUNCIONANDO NO BROWSER MAS DANDO ERRO NO BUILD (o que gera erro no deploy do github pages)
    >
      <Stack style={{ height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            variant="subtle"
            onClick={handleToggleFullscreen}
            leftSection={isFullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
            size="sm"
          >
            {isFullscreen ? 'Minimizar' : 'Maximizar'}
          </Button>
        </div>
        
        <Card style={{ 
          flex: 1, 
          padding: 0,
          height: isFullscreen ? 'calc(100vh - 120px)' : `${Number(height) - 70}px`, // Ajustando para considerar o header
          overflow: 'hidden' // Garantir que não haja overflow do conteúdo
        }}>
          <DiffEditor
            height="100%"
            width="100%"
            language="plaintext"
            original={originalText}
            modified={modifiedText}
            theme={colorScheme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              renderSideBySide: true,
              readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              renderOverviewRuler: false,
              folding: false,
              lineNumbers: 'on',
              originalEditable: false,
              diffWordWrap: 'on',
              wordWrap: 'on',
              useInlineViewWhenSpaceIsLimited: false
            }}
          />
        </Card>
      </Stack>
    </Paper>
  );
}
