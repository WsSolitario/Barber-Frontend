import { create } from "zustand";

type AuthState = {
  accessToken?: string;
  hydrated: boolean;
  setAccessToken: (accessToken: string) => void;
  setHydrated: () => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: undefined,
  hydrated: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  setHydrated: () => set({ hydrated: true }),
  clear: () => set({ accessToken: undefined }),
}));
