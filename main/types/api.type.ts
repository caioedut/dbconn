export type Response =
  | {
      data: any;
      ok: true;
    }
  | {
      error: Error;
      ok: false;
    };
