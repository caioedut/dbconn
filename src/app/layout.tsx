'use client';

import ReactBulk, { Box } from '@react-bulk/web';

import Drawer from '@/components/Drawer';
import Sidebar from '@/components/Sidebar';
import { ConnectionProvider } from '@/contexts/ConnectionContext';
import { TabsProvider } from '@/contexts/TabsContext';
import { RobotoFont } from '@/fonts';
import useAppearance from '@/hooks/useAppearance';

import './globals.css';
import 'react-virtualized/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useAppearance();

  return (
    <html lang="en">
      <body>
        <ReactBulk theme={theme}>
          <ConnectionProvider>
            <TabsProvider>
              <Box noWrap row className={RobotoFont.className} h="100%">
                <Box bg="background.primary">
                  <Sidebar />
                </Box>
                <Box m={1} w={320}>
                  <Drawer />
                </Box>
                <Box flex m={1} ml={0}>
                  {children}
                </Box>
              </Box>
            </TabsProvider>
          </ConnectionProvider>
        </ReactBulk>
      </body>
    </html>
  );
}
