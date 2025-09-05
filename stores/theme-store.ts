import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Temamızın alabileceği değerler
type Theme = 'light' | 'dark' | 'system';

// Store'un state ve action'ları için tip tanımı
type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Zustand store'unu oluşturuyoruz
export const useThemeStore = create<ThemeState>()(
  // persist middleware'i ile state'i localStorage'a kaydediyoruz
  persist(
    (set) => ({
      // Başlangıç değeri 'system' olsun
      theme: 'system',
      // State'i güncelleyecek olan action
      setTheme: (theme) => set({ theme }),
    }),
    {
      // localStorage'da verinin saklanacağı anahtar
      name: 'codecrew-theme-storage',
      // Hangi storage'ı kullanacağını belirtiyoruz
      storage: createJSONStorage(() => localStorage),
    }
  )
);