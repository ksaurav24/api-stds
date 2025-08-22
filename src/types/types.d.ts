declare namespace Express {
  export interface Response {
    success(data: any, meta?: any): void;
    error(code: string, message?: string, details?: any, meta?: any): void;
  }
}
