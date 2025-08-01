// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  isAuth: boolean;
  setUser: (value: {
    id: number;
    name: string;
    email: string;
    role: string;
  }) => void;
  setIsAuth: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => {
      return {
        user_id: 0,
        user_name: "",
        user_email: "",
        user_role: "",
        isAuth: false,
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
        logout: () => {
          set({
            user_id: 0,
            user_name: "",
          });
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/"; // adjust path as needed
        },
      };
    },
    {
      name: "auth-storage",
      // partialize: (state) => ({
      //   user_id: state.user_id,
      //   user_name: state.user_name,
      //   setIsAuth: false,
      // }),
      // onRehydrateStorage: () => (state) => {
      //   state?.setIsAuth(true);
      // },
    }
  )
);
