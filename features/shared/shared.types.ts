export const OperationMode = {
  CREATE: "create",
  UPDATE: "update",
} as const;

export type OperationMode = (typeof OperationMode)[keyof typeof OperationMode];
