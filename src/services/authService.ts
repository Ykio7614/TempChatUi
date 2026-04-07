import { apiClient } from "./apiClient";
import type { AuthResponse, AuthTokens, CurrentUser } from "../types/api";
import { getStoredTokens } from "../utils/storage";

export const authService = {
  async registerGuest(nickname: string) {
    const auth = await apiClient.request<AuthResponse>("/api/guest", {
      method: "POST",
      auth: false,
      skipRefresh: true,
      body: JSON.stringify({ nickname }),
    });

    const tokens: AuthTokens = {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
    };

    const user = await apiClient.request<CurrentUser>("/api/me", {
      auth: false,
      skipRefresh: true,
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    return { tokens, user };
  },

  async restoreSession() {
    const tokens = getStoredTokens();
    if (!tokens) {
      return null;
    }

    const user = await apiClient.request<CurrentUser>("/api/me");
    const latestTokens = getStoredTokens() ?? tokens;

    return {
      tokens: latestTokens,
      user,
    };
  },
};
