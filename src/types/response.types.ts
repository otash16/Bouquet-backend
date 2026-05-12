export interface IErrorResponseData {
  code: string;
  message: string;
  data?: object | null;
}

export interface IErrorResponse {
  success: boolean;
  error: IErrorResponseData;
}

export interface ISuccessResponse {
  success: boolean;
  data: unknown;
}

export type RequestTypes = 'body' | 'query' | 'params';

declare module 'express-serve-static-core' {
  interface Response {
    error: (status: number, error: IErrorResponseData) => void;
    success: (status: number, data: unknown) => void;
  }

  interface Request {
    user?: {
      id: string;
      tgId?: string;
      language?: string;
    };
    admin?: {
      sessionId: string;
      adminId: string;
      adminName: string;
      role: number;
      shopId: string | null;
    };
    validated: {
      body: Record<string, unknown>;
      params: Record<string, unknown>;
      query: Record<string, unknown>;
    };
    response: ISuccessResponse | IErrorResponse;
  }
}
