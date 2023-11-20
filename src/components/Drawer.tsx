import { Box } from '@react-bulk/web';
import { useSelectedLayoutSegment } from 'next/navigation';

import ConnectionsDrawer from '@/components/drawer/ConnectionsDrawer';
import SettingsDrawer from '@/components/drawer/SettingsDrawer';

export default function Drawer() {
  const segment = useSelectedLayoutSegment() ?? 'connections';

  return (
    <Box flex h="100%">
      {segment === 'connections' && <ConnectionsDrawer />}
      {segment === 'settings' && <SettingsDrawer />}
    </Box>
  );
}
