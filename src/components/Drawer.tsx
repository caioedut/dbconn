import { Box } from '@react-bulk/web';
import { useSelectedLayoutSegment } from 'next/navigation';

import ConnectionsDrawer from '@/components/drawer/ConnectionsDrawer';

export default function Drawer() {
  const segment = useSelectedLayoutSegment() ?? 'connections';

  return (
    <Box flex h="100%" px={1}>
      {segment === 'connections' && <ConnectionsDrawer />}
    </Box>
  );
}
