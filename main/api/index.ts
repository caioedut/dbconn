import { Response } from '../types/api.type';

export default async function api(_: Electron.IpcMainInvokeEvent, route: string, ...args: any[]) {
  const [type = 'GET', controller, method = 'index'] = route.split('/').filter(Boolean);

  // @ts-expect-error
  const response: Response = {};

  try {
    // @ts-expect-error
    response.data = await require(`./${controller}`)[`${type}_${method}`](...args);
    response.ok = true;
  } catch (err) {
    response.ok = false;
    // @ts-expect-error
    response.error = err;
  }

  return response;
}
