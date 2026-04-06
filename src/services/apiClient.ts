import type { AuthResponse, AuthTokens } from "../types/api";
import { ApiError } from "../utils/errors";
import { clearStoredTokens, getStoredTokens, setStoredTokens } from "../utils/storage";

type RequestOptions = RequestInit & {
  auth?: boolean;
  skipRefresh?: boolean;
};

type ApiClientConfig = {
  onAuthFailure?: () => void;
  onTokensUpdated?: (tokens: AuthTokens) => void;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? "");

  // In local development we prefer the Vite proxy to avoid CORS/preflight issues.
  if (import.meta.env.DEV) {
    return configuredBaseUrl.startsWith("/") ? configuredBaseUrl : "";
  }

  return configuredBaseUrl;
}

class ApiClient {
  private readonly baseUrl = resolveApiBaseUrl();
  private refreshPromise: Promise<boolean> | null = null;
  private config: ApiClientConfig = {};

  configure(config: ApiClientConfig) {
    this.config = { ...this.config, ...config };
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { auth = true, skipRefresh = false, headers, body, ...rest } = options;
    const requestHeaders = new Headers(headers);

    if (body !== undefined && !(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    if (auth) {
      const tokens = getStoredTokens();
      if (tokens?.accessToken) {
        requestHeaders.set("Authorization", `Bearer ${tokens.accessToken}`);
      }
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...rest,
      body,
      headers: requestHeaders,
    });

    if (response.status === 401 && auth && !skipRefresh) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        return this.request<T>(path, { ...options, skipRefresh: true });
      }
    }

    if (!response.ok) {
      throw await this.toError(response);
    }

    return parseResponse<T>(response);
  }

  private async tryRefresh() {
    const currentTokens = getStoredTokens();
    if (!currentTokens?.refreshToken) {
      this.handleAuthFailure();
      return false;
    }

    if (!this.refreshPromise) {
      this.refreshPromise = this.refreshTokens(currentTokens.refreshToken)
        .then((tokens) => {
          setStoredTokens(tokens);
          this.config.onTokensUpdated?.(tokens);
          return true;
        })
        .catch(() => {
          this.handleAuthFailure();
          return false;
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }

    return this.refreshPromise;
  }

  private async refreshTokens(refreshToken: string) {
    const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw await this.toError(response);
    }

    const data = await parseResponse<AuthResponse>(response);
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }

  private handleAuthFailure() {
    clearStoredTokens();
    this.config.onAuthFailure?.();
  }

  private async toError(response: Response) {
    const data = await parseResponse<unknown>(response);
    const message = typeof data === "string" && data.trim() ? data : `Request failed with status ${response.status}`;
    return new ApiError(message, response.status, data);
  }
}

export const apiClient = new ApiClient();
