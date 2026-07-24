import axios from "axios";

import { environment } from "@/config/environment";
import { useAuthStore } from "@/stores/auth-store";

export const httpClient = axios.create({
  baseURL: environment.apiBaseUrl,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

let refreshRequest: Promise<string> | undefined;

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isAuthRequest = request?.url?.includes("/api/auth/");
    if (error.response?.status !== 401 || request?._retriedAfterRefresh || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retriedAfterRefresh = true;
    refreshRequest ??= httpClient.post<{ accessToken: string }>("/api/auth/refresh").then(({ data }) => data.accessToken).finally(() => { refreshRequest = undefined; });

    try {
      const accessToken = await refreshRequest;
      useAuthStore.getState().setAccessToken(accessToken);
      request.headers = { ...request.headers, Authorization: `Bearer ${accessToken}` };
      return httpClient(request);
    } catch {
      useAuthStore.getState().clear();
      return Promise.reject(error);
    }
  },
);
