import { Box, Card, Container, Text } from '@mantine/core';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu';
import { ReviewToolV2 } from '../../components/ReviewToolV2/ReviewToolV2';


export default function RevisarPage() {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderMegaMenu />
      <Box component="main" style={{ flex: 1 }}>
        <Container size="md" px="xs">
          <Card shadow="sm" p="lg">
            <ReviewToolV2 />
          </Card>
        </Container>
      </Box>
    </Box>
  );
}