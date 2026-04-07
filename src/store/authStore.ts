import { create } from "zustand";
import { authService } from "../services/authService";
import { apiClient } from "../services/apiClient";
import type { AuthStatus, AuthTokens, CurrentUser } from "../types/api";
import { clearStoredTokens, getStoredTokens, setStoredTokens } from "../utils/storage";
import { useChatStore } from "./chatStore";
import { getCurrentLanguage } from "./languageStore";
import { useRoomsStore } from "./roomsStore";
import { registerStoreResetter } from "./storeReset";
import { useUiStore } from "./uiStore";
import { translate } from "../utils/i18n";

type AuthState = {
  status: AuthStatus;
  currentUser: CurrentUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  initialize: () => Promise<void>;
  signInGuest: (nickname: string) => Promise<void>;
  clearSession: () => void;
  syncTokens: (tokens: AuthTokens) => void;
  reset: () => void;
};

const storedTokens = getStoredTokens();

const initialState = {
  status: (storedTokens ? "checking" : "anonymous") as AuthStatus,
  currentUser: null as CurrentUser | null,
  accessToken: storedTokens?.accessToken ?? null,
  refreshToken: storedTokens?.refreshToken ?? null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,
  async initialize() {
    const existingTokens = getStoredTokens();
    if (!existingTokens) {
      set({
        status: "anonymous",
        currentUser: null,
        accessToken: null,
        refreshToken: null,
      });
      return;
    }

    set({
      status: "checking",
      accessToken: existingTokens.accessToken,
      refreshToken: existingTokens.refreshToken,
    });

    try {
      const session = await authService.restoreSession();
      if (!session) {
        get().clearSession();
        return;
      }

      setStoredTokens(session.tokens);
      set({
        status: "authenticated",
        currentUser: session.user,
        accessToken: session.tokens.accessToken,
        refreshToken: session.tokens.refreshToken,
      });
    } catch {
      get().clearSession();
    }
  },
  async signInGuest(nickname) {
    set({ status: "checking" });
    const session = await authService.registerGuest(nickname.trim());
    setStoredTokens(session.tokens);
    set({
      status: "authenticated",
      currentUser: session.user,
      accessToken: session.tokens.accessToken,
      refreshToken: session.tokens.refreshToken,
    });
  },
  clearSession() {
    clearStoredTokens();
    useRoomsStore.getState().reset();
    useChatStore.getState().reset();
    set({
      status: "anonymous",
      currentUser: null,
      accessToken: null,
      refreshToken: null,
    });
  },
  syncTokens(tokens) {
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  },
  reset() {
    set({
      ...initialState,
      status: "anonymous",
      currentUser: null,
      accessToken: null,
      refreshToken: null,
    });
  },
}));

apiClient.configure({
  onTokensUpdated(tokens) {
    useAuthStore.getState().syncTokens(tokens);
  },
  onAuthFailure() {
    useUiStore.getState().pushToast(translate(getCurrentLanguage(), "errors.unauthorized"));
    useAuthStore.getState().clearSession();
  },
});

registerStoreResetter(() => {
  useAuthStore.getState().reset();
});
