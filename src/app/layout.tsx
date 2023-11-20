'use client';

import ReactBulk, { Box } from '@react-bulk/web';

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