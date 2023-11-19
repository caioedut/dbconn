import { contextBridge, ipcRenderer } from 'electron';

export const electronAPI = {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
};

const api = {
  delete: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `DELETE/${route}`, ...args),
  get: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `GET/${route}`, ...args),
  post: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `POST/${route}`, ...args),
  put: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `PUT/${route}`, ...args),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
contextBridge.exposeInMainWorld('api', api);
