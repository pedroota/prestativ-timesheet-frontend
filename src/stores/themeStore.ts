import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: true,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === true ? false : true,
        })),
    }),
    {
      name: "prestativ-theme",
    }
  )
);
