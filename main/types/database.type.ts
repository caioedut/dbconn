export type ConnRef = {
  connected?: boolean;
  current: {
    destroy: () => Promise<void>;
    query: (raw: string) => Promise<any>;
  };
  database: string;
  host: string;
  id: string;
  password: string;
  port: number;
  type: 'mssql' | 'mysql' | 'pg';
  user: string;
};

export type Connect = {
  database?: string;
  host: string;
  id?: string;
  password?: string;
  port?: number;
  type: 'mssql' | 'mysql' | 'pg';
  user: string;
};
