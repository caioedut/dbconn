import { ConnRef } from '../../types/database.type';

const connections: {
  [key: string]: ConnRef<any>;
} = {};

export default connections;
