export type Result = {
  success: boolean;
  errorMessage?: string;
};

export type DataResult<T> = Result & {
  data?: T;
};
