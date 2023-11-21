import { app } from 'electron';

export async function GET_index() {
  return {
    version: app.getVersion(),
  };
}
