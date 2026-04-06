import { getCurrentLanguage } from "../store/languageStore";
import { translate, type TranslationKey } from "./i18n";

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

const STATUS_MESSAGES: Record<number, TranslationKey> = {
  400: "errors.badRequest",
  401: "errors.unauthorized",
  403: "errors.forbidden",
  404: "errors.notFound",
  409: "errors.roomFull",
  410: "errors.roomUnavailable",
  429: "errors.roomLimit",
};

export function getErrorMessage(error: unknown, fallback: TranslationKey = "errors.generic") {
  const language = getCurrentLanguage();

  if (error instanceof ApiError) {
    const key = STATUS_MESSAGES[error.status];
    return key ? translate(language, key) : error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return translate(language, fallback);
}
