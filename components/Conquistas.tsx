// Conquistas.tsx
import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group, Badge, Alert, Tooltip, Container, Box, Menu } from '@mantine/core';
import { useAuthContext } from '../context/AuthContext';
import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase';
import { IconAlertCircle, IconTrophy, IconRefresh, IconCertificate, IconEye, IconDownload, IconBrandLinkedin } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';

// Tipos para as conquistas
interface Conquista {
  id: string;
  IDs: string[];
}

interface ConquistaItem {
  nome: string;
  url: string;
}

const urlBadges: Record<string, ConquistaItem> = {
  ChatGPTCurioso: {
    nome: "ChatGPT Curioso",
    url: "https://criatividade.digital/conquistas/docs/assets/ChatGPT/badge/Curioso/"
  },
  ChatGPTIniciante: {
    nome: "ChatGPT Iniciante",
    url: "https://criatividade.digital/conquistas/docs/assets/ChatGPT/badge/Iniciante/"
  },
  ChatGPTExplorador: {
    nome: "ChatGPT Explorador",
    url: "https://criatividade.digital/conquistas/docs/assets/ChatGPT/badge/Explorador/"
  }
} as const;

const urlCertificados: Record<string, ConquistaItem> = {
  ChatGPTExplorador: {
    nome: "Curso ChatGPT - Módulo:Explorador",
    url: "https://criatividade.digital/conquistas/docs/assets/ChatGPT/certificado/Explorador/"
  }
} as const;

interface ConquistasResponse {
  conquistas: Conquista[];
}

interface FetchOptions {
  forceRefresh?: boolean;
}

interface FirebaseFunctionError {
  code: 'unauthenticated' | 'not-found' | 'internal' | 'functions/not-found';
  message: string;
  details?: unknown;
  httpErrorCode?: {
    status: number;
    canonicalName: string;
  };
}

const BASE_CACHE_KEY = 'conquistas';

const Conquistas = () => {
  const { firebaseUser } = useAuthContext();
  const [conquistas, setConquistas] = useState<Conquista[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  const getCacheKey = () => {
    if (!firebaseUser) return null;
    return `${BASE_CACHE_KEY}_${firebaseUser.uid}`;
  };

  const getCachedData = (): Conquista[] | null => {
    const cacheKey = getCacheKey();
    if (!cacheKey) return null;
    
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  };

  const setCacheData = (data: Conquista[]) => {
    const cacheKey = getCacheKey();
    if (!cacheKey) return;
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
  };

  const fetchConquistas = async (options: FetchOptions = {}) => {
    console.log('Iniciando busca das conquistas...');
    setHasError(false); // Reset error state
    if (!firebaseUser) return;
    
    // Verifica cache se não for forceRefresh
    if (!options.forceRefresh) {
      console.log('Identificado opção de leitura da cache.');
      const cachedData = getCachedData();
      if (cachedData) {
        setConquistas(cachedData);
        console.log('Lendo da cache browser.');
        return;
      }
      else {
        console.log('Não existem dados na cache');
      }
    }
    console.log('Acessando o servidor para as conquistas');
    
    setLoading(true);
    try {
      await firebaseUser.getIdToken(true);
      const getUserConquistas = httpsCallable<any, ConquistasResponse>(functions, 'getUserConquistas');
      const result = await getUserConquistas();
      
      // Armazena no cache e atualiza estado
      setCacheData(result.data.conquistas);
      setConquistas(result.data.conquistas);
    } catch (err) {
      const error = err as FirebaseFunctionError;
      console.error('Erro ao buscar conquistas (error.code):', error.code);

      // Para outros erros
      switch (error.code) {
        case 'unauthenticated':
          router.push('/login');
          break;
        case 'functions/not-found':
          console.log('Definindo que não tem conquistas');
          setHasError(false);
          setConquistas([]);
          break;
        case 'internal':
        default:
          setHasError(true);
          setConquistas([]); // Mantém null em vez de array vazio
          showNotification({
            title: 'Falha ao carregar conquistas',
            message: 'Desculpe! Ocorreu uma falha durante a consulta das suas conquistas. Tente novamente mais tarde.',
            color: 'red',
            icon: <IconAlertCircle size={16} />
          });
      }
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticação e redirecionar imediatamente
  useEffect(() => {
    if (!firebaseUser) {
      router.push('/login');
      return;
    }
    fetchConquistas(); // Usa cache por padrão
  }, [firebaseUser, router]);

  // Não renderizar nada se não houver usuário
  if (!firebaseUser) {
    return null;
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Certificados':
        return <IconCertificate size={20} style={{ display: 'inline', marginRight: '8px' }} />;
      default:
        return <IconTrophy size={20} style={{ display: 'inline', marginRight: '8px' }} />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Certificados':
        return { variant: 'outline', color: 'blue' };
      case 'Badges':
        return { variant: 'outline', color: 'orange' };
      default:
        return { variant: 'filled', color: 'gray' };
    }
  };

  const getUrlForItem = (id: string, type: string): string | undefined => {
    if (type === 'Badges') {
      return urlBadges[id as keyof typeof urlBadges]?.url;
    }
    if (type === 'Certificados') {
      return urlCertificados[id as keyof typeof urlCertificados]?.url;
    }
    return undefined;
  };

  const getNomeForItem = (id: string, type: string): string => {
    if (type === 'Badges') {
      return urlBadges[id as keyof typeof urlBadges]?.nome || id;
    }
    if (type === 'Certificados') {
      return urlCertificados[id as keyof typeof urlCertificados]?.nome || id;
    }
    return id;
  };

  const handleVisualize = (id: string, type: string) => {
    const baseUrl = getUrlForItem(id, type);
    console.log(`Visualizando ${type} - ${id}`);
    if (baseUrl) {
      window.open(`${baseUrl}${firebaseUser?.uid || ''}.pdf`, '_blank');
    }
  };

  const handleDownload = async (id: string, type: string) => {
    try {
      const baseUrl = getUrlForItem(id, type);
      if (!baseUrl) {
        console.error('URL não encontrada para:', id, type);
        return;
      }

      // URL completa ainda precisa do uid para buscar o arquivo correto
      const fileUrl = `${baseUrl}${firebaseUser?.uid || ''}.pdf`;
      // Nome do arquivo usa apenas o id para melhor experiência do usuário
      const fileName = `${id}.pdf`;

      console.log('Iniciando download:', fileUrl);
      
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Falha ao baixar arquivo');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Limpeza
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification({
        title: 'Download iniciado',
        message: 'Seu arquivo está sendo baixado',
        color: 'green'
      });
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      showNotification({
        title: 'Erro no download',
        message: 'Não foi possível baixar o arquivo',
        color: 'red'
      });
    }
  };

  const handleShareLinkedIn = (id: string, type: string) => {
    console.log(`Compartilhando no LinkedIn ${type} - ${id}`);
    // TODO: Implementar compartilhamento
  };

  const renderBadgeWithMenu = (id: string, type: string) => (
    <Menu 
      key={`menu-${id}`}
      shadow="md" 
      width={200} 
      position="bottom-start"
    >
      <Menu.Target>
        <Badge 
          size="lg"
          style={{ cursor: 'pointer' }}
          {...getBadgeStyle(type)}
        >
          {getNomeForItem(id, type)}
        </Badge>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item 
          leftSection={<IconEye size={14} />}
          onClick={() => handleVisualize(id, type)}
        >
          Visualizar
        </Menu.Item>
        <Menu.Item 
          leftSection={<IconDownload size={14} />}
          onClick={() => handleDownload(id, type)}
        >
          Baixar
        </Menu.Item>
        <Menu.Item 
          leftSection={<IconBrandLinkedin size={14} />}
          onClick={() => handleShareLinkedIn(id, type)}
        >
          LinkedIn
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  const renderConquistas = () => {
    if (loading) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} color="blue">
          Carregando suas conquistas...
        </Alert>
      );
    }

    if (hasError) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} color="red">
          Erro ao carregar conquistas. Tente novamente mais tarde.
        </Alert>
      );
    }

    // Array vazio significa sem conquistas ou erro
    if (Array.isArray(conquistas) && conquistas.length === 0) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} color="yellow">
          Nenhuma conquista registrada ainda. Que tal começar a colecioná-las?
        </Alert>
      );
    }

    // Null significa que ainda não carregou
    if (!conquistas) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} color="blue">
          Aguarde, carregando...
        </Alert>
      );
    }

    return conquistas.map((conquista) => {
      // Se não houver IDs ou array vazio, pula este tipo de conquista
      if (!conquista.IDs || conquista.IDs.length === 0) {
        return null;
      }

      return (
        <Card key={conquista.id} shadow="sm" p="md" mb="sm">
          <Group justify="space-between">
            <Text fw={500} size="lg">
              {getIconForType(conquista.id)}
              {conquista.id}
            </Text>
          </Group>
          <Group gap="sm" mt="md">
            {conquista.IDs.map((id) => renderBadgeWithMenu(id, conquista.id))}
          </Group>
        </Card>
      );
    }).filter(Boolean); // Remove null items from render
  };

  return (
    <Container size="md" px="xs">
      <Card shadow="sm" p="lg">
        <Group justify="space-between" mb="md">
          <Text fw={500} size="xl">Conquistas</Text>
          {firebaseUser && (
            <Tooltip label="Atualizar conquistas" withArrow position="left">
              <Button 
                onClick={() => fetchConquistas({ forceRefresh: true })} 
                loading={loading}
                variant="subtle"
                size="sm"
                px={8}
              >
                <IconRefresh size={20} />
              </Button>
            </Tooltip>
          )}
        </Group>
        {renderConquistas()}
      </Card>

    </Container>
  );
};

export default Conquistas;
