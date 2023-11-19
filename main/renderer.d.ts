import { electronAPI, api } from './preload';

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
    api: typeof api;
  }
}

export {};
