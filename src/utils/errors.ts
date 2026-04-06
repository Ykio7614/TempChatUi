export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Check the entered values.",
  401: "Session expired. Please sign in again.",
  403: "You do not have access to this room.",
  404: "Room not found.",
  409: "Комната заполнена",
  410: "Комната больше недоступна",
  429: "Достигнут лимит комнат",
};

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) {
    return STATUS_MESSAGES[error.status] ?? error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
