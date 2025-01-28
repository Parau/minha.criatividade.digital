import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu';
import { useAuthContext } from '../context/AuthContext';
import { Text, Box } from '@mantine/core';
import Conquistas from '../components/Conquistas';

export default function HomePage() {
  const { user } = useAuthContext();

  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderMegaMenu />
      <Box component="main" style={{ flex: 1 }}>
        <Conquistas />
      </Box>
    </Box>
  );
}
