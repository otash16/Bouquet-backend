export interface IAxiosError {
  name: string;
  message: string;
  stack: {
    url?: string;
    method?: string;
    status?: number;
    data?: unknown;
  };
}

export interface PayloadTooLargeError extends Error {
  message: string;
  expected: number;
  length: number;
  limit: number;
  type: string;
}
