'use client';

import ReactBulk, { Box } from '@react-bulk/web';

import CheckUpdate from '@/components/CheckUpdate';
import Drawer from '@/components/Drawer';
import Sidebar from '@/components/Sidebar';
import { ConnectionProvider } from '@/contexts/ConnectionContext';
import { TabsProvider } from '@/contexts/TabsContext';
import { RobotoFont } from '@/fonts';
import useAppearance from '@/hooks/useAppearance';

import './globals.css';

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
                <Box flex m={1} ml={0} overflow="hidden">
                  {children}
                </Box>
              </Box>
            </TabsProvider>
          </ConnectionProvider>
          <CheckUpdate />
        </ReactBulk>
      </body>
    </html>
  );
}
