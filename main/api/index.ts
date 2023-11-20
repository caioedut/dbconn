import { AnyObject } from '@react-bulk/core';

export default async function api(_: Electron.IpcMainInvokeEvent, route: string, ...args: any[]) {
  const [type = 'GET', controller, method = 'index'] = route.split('/').filter(Boolean);

  const response: AnyObject = {};

  try {
    response.data = await require(`./${controller}`)[`${type}_${method}`](...args);
    response.ok = true;
  } catch (err) {
    response.ok = false;
    response.error = err;
  }

  return response;
}
