import { AnyObject } from '@react-bulk/core';
import * as yup from 'yup';

/**
 * @see src/configs/yup.ts
 */
export async function validate(data: AnyObject, shape: AnyObject) {
  const schema = yup.object().shape(shape);

  try {
    await schema.validate(data, { abortEarly: false });
  } catch (err: any) {
    return Object.fromEntries(err.inner.map((item: any) => [item.path, item.message]));
  }

  return null;
}
