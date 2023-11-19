// @ts-nocheck

import { AnyObject } from '@react-bulk/core';

export default async function api(event, route, ...args: any[]) {
  const [type = 'GET', controller, method = 'index'] = route.split('/').filter(Boolean);

  const response: AnyObject = {
    ok: true,
  };

  try {
    response.data = await require(`./${controller}`)[`${type}_${method}`](...args);
  } catch (err) {
    response.ok = false;
    response.error = err;
  }

  return response;
}
