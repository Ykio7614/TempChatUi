import type { AuthTokens } from "../types/api";
import type { Language } from "../types/i18n";

const ACCESS_TOKEN_KEY = "tempchat.accessToken";
const REFRESH_TOKEN_KEY = "tempchat.refreshToken";
const CURRENT_ROOM_KEY = "tempchat.currentRoomId";
const LANGUAGE_KEY = "tempchat.language";

function hasWindow() {
  return typeof window !== "undefined";
}

export function getStoredTokens(): AuthTokens | null {
  if (!hasWindow()) {
    return null;
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export function setStoredTokens(tokens: AuthTokens) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearStoredTokens() {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredCurrentRoomId() {
  if (!hasWindow()) {
    return null;
  }

  return window.localStorage.getItem(CURRENT_ROOM_KEY);
}

export function setStoredCurrentRoomId(roomId: string) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(CURRENT_ROOM_KEY, roomId);
}

export function clearStoredCurrentRoomId() {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(CURRENT_ROOM_KEY);
}

export function getStoredLanguage(): Language | null {
  if (!hasWindow()) {
    return null;
  }

  const value = window.localStorage.getItem(LANGUAGE_KEY);
  return value === "ru" || value === "en" ? value : null;
}

export function setStoredLanguage(language: Language) {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(LANGUAGE_KEY, language);
}
