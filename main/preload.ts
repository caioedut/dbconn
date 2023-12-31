import { contextBridge, ipcRenderer } from 'electron';

function create(method: 'DELETE' | 'GET' | 'POST' | 'PUT') {
  return async (route: string, ...args: any[]) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await ipcRenderer.invoke('api', `${method}/${route}`, ...args);

          if (!res?.ok) {
            throw res.error;
          }

          resolve(res);
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  };
}

const api = {
  // delete: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `DELETE/${route}`, ...args),
  // get: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `GET/${route}`, ...args),
  // post: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `POST/${route}`, ...args),
  // put: (route: string, ...args: any[]) => ipcRenderer.invoke('api', `PUT/${route}`, ...args),
  delete: create('DELETE'),
  get: create('GET'),
  post: create('POST'),
  put: create('PUT'),
};

contextBridge.exposeInMainWorld('api', api);
