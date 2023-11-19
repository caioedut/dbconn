// Main File for Electron

import { BrowserWindow, app, ipcMain } from 'electron';

const path = require('path');
const serve = require('electron-serve');

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
  console.log(__dirname);
  splash.loadURL('file://' + __dirname + '/../splash/index.html');
  splash.on('closed', () => (splash = null));
  splash.webContents.on('did-finish-load', () => {
    if (splash) {
      splash.show();
    }
  });
};

// run renderer
const isProd = process.env.NODE_ENV !== 'development';
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

ipcMain.handle('api', require('./api/index').default);
