// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  isAuth: boolean;
  isAuthLoading: boolean;
  setUser: (value: {
    id: number;
    name: string;
    email: string;
    role: string;
  }) => void;
  setIsAuth: (value: boolean) => void;
  setAuthLoading: (value: boolean) => void;
  checkAuth: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user_id: 0,
      user_name: "",
      user_email: "",
      user_role: "",
      isAuth: false,
      isAuthLoading: true,

      setUser: (value) =>
        set({
          user_id: value.id,
          user_name: value.name,
          user_email: value.email,
          user_role: value.role,
        }),

      setIsAuth: (value) => {
        set({ isAuth: value });
      },

      setAuthLoading: (value) => {
        set({ isAuthLoading: value });
      },

      checkAuth: () => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        set({ isAuth: !!token, isAuthLoading: false });
      },

      logout: () => {
        set({
          user_id: 0,
          user_name: "",
          user_email: "",
          user_role: "",
          isAuth: false,
        });
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
