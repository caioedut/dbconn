import { spawn } from 'child_process';
import { BrowserWindow, app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { existsSync, rmSync } from 'fs';
import path from 'path';

import api from './api';

const isProd = process.env.NODE_ENV !== 'development';

if (isProd) {
  serve({ directory: 'out' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

app.whenReady().then(() => {
  const splash = new BrowserWindow({
    frame: false,
    height: 180,
    transparent: true,
    width: 240,
  });

  splash.setMenu(null);
  splash.setResizable(false);
  splash.loadURL('file://' + __dirname + '/../splash/index.html');

  const main = new BrowserWindow({
    show: false,
    webPreferences: {
      backgroundThrottling: false,
      devTools: !isProd,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  main.setMenu(null);
  main.loadURL(isProd ? 'app://./home.html' : `http://localhost:3000/`);

  if (!isProd) {
    main.webContents.openDevTools();
  }

  main.webContents.session.on('will-download', (_, item) => {
    // Set the save path, making Electron not to prompt a save dialog.
    const filePath = `${app.getPath('temp')}\\${item.getFilename()}`;
    if (existsSync(filePath)) rmSync(filePath);

    item.setSavePath(filePath);

    item.on('updated', (_, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`);
        }
      }
    });

    item.once('done', (_, state) => {
      if (state === 'completed') {
        console.log('Download successfully');

        // Open Setup
        spawn('cmd.exe', ['/c', filePath]);
      } else {
        console.log(`Download failed: ${state}`);
      }
    });
  });

  main.webContents.on('did-finish-load', () => {
    if (!splash.isDestroyed()) {
      splash.destroy();
    }

    main.maximize();
    main.show();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('api', api);
