// Conquistas.tsx
import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group, Badge, Alert, Tooltip, Container, Box } from '@mantine/core';
import { useAuthContext } from '../context/AuthContext';
import { httpsCallable } from "firebase/functions";
import { functions } from '../firebase';
import { IconAlertCircle, IconTrophy, IconRefresh, IconCertificate } from '@tabler/icons-react';
import { useRouter } from 'next/router';

// Tipos para as conquistas
interface Conquista {
  id: string;
  IDs: string[];
}

interface ConquistasResponse {
  conquistas: Conquista[];
}

interface FetchOptions {
  forceRefresh?: boolean;
}

interface FirebaseFunctionError {
  code?: string;
  message: string;
  details?: unknown;
}

const BASE_CACHE_KEY = 'conquistas';

const Conquistas = () => {
  const { firebaseUser } = useAuthContext();
  const [conquistas, setConquistas] = useState<Conquista[] | null>(null);
  const [loading, setLoading] = useState(false);
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
    if (!firebaseUser) return;
    
    // Verifica cache se não for forceRefresh
    if (!options.forceRefresh) {
      const cachedData = getCachedData();
      if (cachedData) {
        setConquistas(cachedData);
        console.log('Usando cache de conquistas');
        return;
      }
    } else {
      console.log('Acessando o servidor para as conquistas');
    }
    
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
      console.error('Erro ao buscar conquistas:', error);
      if ('details' in error) {
        console.error('Error details:', error.details);
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

  const renderConquistas = () => {
    if (loading) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} color="blue">
          Carregando suas conquistas...
        </Alert>
      );
    }

    if (!conquistas) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} color="blue">
          Aguarde, carregando...
        </Alert>
      );
    }

    if (conquistas.length === 0) {
      return (
        <Alert icon={<IconAlertCircle size={16} />} color="yellow">
          Você ainda não possui conquistas
        </Alert>
      );
    }

    return conquistas.map((conquista) => (
      <Card key={conquista.id} shadow="sm" p="md" mb="sm">
        <Group position="apart">
          <Text weight={500} size="lg">
            {getIconForType(conquista.id)}
            {conquista.id}
          </Text>
        </Group>
        <Group spacing={8} mt="md">
          {conquista.IDs.map((id) => (
            <Badge key={id} variant="filled" size="lg">
              {id}
            </Badge>
          ))}
        </Group>
      </Card>
    ));
  };

  return (
    <Container size="md" px="xs">
      <Card shadow="sm" p="lg">
        <Group position="apart" mb="md">
          <Text weight={500} size="xl">Conquistas</Text>
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
