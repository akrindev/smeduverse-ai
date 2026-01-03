import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const MCP_STORAGE_KEY = "smeduverse_mcp_token";

export interface UseMcpKeyOptions {
  endpoint?: string;
  initialToken?: string;
  autoFetch?: boolean;
}

export interface UseMcpKeyResult {
  token: string | null;
  loading: boolean;
  error: Error | null;
  fetchToken: () => Promise<string | null>;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// Get token from localStorage
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(MCP_STORAGE_KEY);
  } catch {
    return null;
  }
}

// Save token to localStorage
export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(MCP_STORAGE_KEY, token);
  } catch {
    // Ignore storage errors
  }
}

// Clear token from localStorage
export function clearStoredToken(): void {
  try {
    localStorage.removeItem(MCP_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

// Fetch MCP key from endpoint using axios with credentials
export async function fetchMcpKey(endpoint: string): Promise<string> {
  const response = await axios.get<{ token: string }>(endpoint, {
    withCredentials: true,
  });

  if (response.data?.token) {
    setStoredToken(response.data.token);
    return response.data.token;
  }

  throw new Error("No token in response");
}

/**
 * React hook for managing MCP key
 * - Fetches token from endpoint with credentials (cookies)
 * - Persists token to localStorage for reload persistence
 * - Auto-fetches on mount if autoFetch is true
 */
export function useMcpKey(options: UseMcpKeyOptions = {}): UseMcpKeyResult {
  const {
    endpoint = "http://localhost:2222/mcp/key",
    initialToken,
    autoFetch = true,
  } = options;

  const [token, setTokenState] = useState<string | null>(() => {
    // Priority: initialToken > stored token
    return initialToken || getStoredToken();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchToken = useCallback(async (): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const newToken = await fetchMcpKey(endpoint);
      setTokenState(newToken);
      return newToken;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("useMcpKey: Failed to fetch MCP key", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const setToken = useCallback((newToken: string) => {
    setStoredToken(newToken);
    setTokenState(newToken);
  }, []);

  const clearToken = useCallback(() => {
    clearStoredToken();
    setTokenState(null);
  }, []);

  // Auto-fetch on mount if no token and autoFetch is enabled
  useEffect(() => {
    if (autoFetch && !token && endpoint) {
      fetchToken();
    }
  }, [autoFetch, token, endpoint, fetchToken]);

  return {
    token,
    loading,
    error,
    fetchToken,
    setToken,
    clearToken,
  };
}

export default useMcpKey;
