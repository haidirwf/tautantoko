import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  storeSlug: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, storeSlug?: string) => void
  signup: (email: string, storeSlug: string, storeName?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, storeSlug = 'batik-nusantara') => {
        const name = email.split('@')[0] || 'Merchant'
        set({
          user: {
            id: 'usr-' + Date.now(),
            email,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            storeSlug,
          },
          isAuthenticated: true,
        })
      },

      signup: (email: string, storeSlug: string, storeName = 'Toko Baru') => {
        set({
          user: {
            id: 'usr-' + Date.now(),
            email,
            name: storeName,
            storeSlug: storeSlug || 'toko-saya',
          },
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'tautan_auth_storage',
    }
  )
)
