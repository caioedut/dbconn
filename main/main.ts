import { spawn } from 'child_process';
import { BrowserWindow, app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { existsSync, rmSync } from 'fs';
import path from 'path';

import api from './api';

const isProd = process.env.NODE_ENV !== 'development';

function handleSetTitle(event: any, title: string) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win !== null) {
    win.setTitle(title);
  }
}

// Loading Screen
let splash: BrowserWindow | null;
const createSplashScreen = () => {
  /// create a browser window
  splash = new BrowserWindow(
    Object.assign({
      /// remove the window frame, so it will become a frameless window
      frame: false,
      height: 100,
      width: 200,
    }),
  );
  splash.setResizable(false);
  splash.loadURL('file://' + __dirname + '/../splash/index.html');
  splash.on('closed', () => (splash = null));
  splash.webContents.on('did-finish-load', () => {
    if (splash) {
      splash.show();
    }
  });
};

if (isProd) {
  serve({ directory: 'out' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

const createWindow = () => {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      devTools: !isProd,
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      // contextIsolation: false,
    },
  });

  win.setMenuBarVisibility(false);

  win.webContents.session.on('will-download', (_, item) => {
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

  // Expose URL
  if (isProd) {
    win.loadURL('app://./home.html');
  } else {
    // const port = process.argv[2];
    win.loadURL('http://localhost:3000/');
  }

  win.webContents.openDevTools();

  win.webContents.on('did-finish-load', () => {
    /// then close the loading screen window and show the main window
    if (splash) {
      splash.close();
    }
    win.maximize();
    win.show();
  });
};

app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle);

  createSplashScreen();

  // createWindow();
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('api', api);
