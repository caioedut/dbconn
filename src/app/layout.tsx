'use client';

import ReactBulk, { Box, Scrollable } from '@react-bulk/web';

import Drawer from '@/components/Drawer';
import Sidebar from '@/components/Sidebar';
import { ConnectionProvider } from '@/contexts/ConnectionContext';
import { TabsProvider } from '@/contexts/TabsContext';
import { RobotoFont } from '@/fonts';

import dark from '../../main/themes/dark';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactBulk theme={dark}>
          <ConnectionProvider>
            <TabsProvider>
              <Box noWrap row className={RobotoFont.className} h="100%">
                <Box bg="background.secondary">
                  <Sidebar />
                </Box>
                <Box bg="background.primary" w={320}>
                  <Drawer />
                </Box>
                <Scrollable flex bg="background.secondary">
                  {children}
                </Scrollable>
              </Box>
            </TabsProvider>
          </ConnectionProvider>
        </ReactBulk>
      </body>
    </html>
  );
}
