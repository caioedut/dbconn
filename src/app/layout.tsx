'use client';

import ReactBulk, { Box, Scrollable } from '@react-bulk/web';
import { Roboto } from 'next/font/google';

import Drawer from '@/components/Drawer';
import Sidebar from '@/components/Sidebar';
import { ConnectionProvider } from '@/contexts/ConnectionContext';

import dark from '../../main/themes/dark';

import './globals.css';

const font = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactBulk theme={dark}>
          <ConnectionProvider>
            <Box noWrap row className={font.className} h="100%">
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
          </ConnectionProvider>
        </ReactBulk>
      </body>
    </html>
  );
}
