import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string
  storeSlug: string
  storeId?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string, storeSlug?: string) => Promise<void>
  signup: (email: string, password?: string, storeSlug?: string, storeName?: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      initialize: async () => {
        if (!isSupabaseConfigured || !supabase) return

        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const authUser = session.user
            // Fetch associated store
            const { data: store } = await supabase
              .from('stores')
              .select('id, name, slug')
              .eq('user_id', authUser.id)
              .single()

            const name = store?.name || authUser.user_metadata?.store_name || authUser.email?.split('@')[0] || 'Merchant'
            const storeSlug = store?.slug || authUser.user_metadata?.store_slug || 'batik-nusantara'

            set({
              user: {
                id: authUser.id,
                email: authUser.email || '',
                name,
                storeSlug,
                storeId: store?.id,
              },
              isAuthenticated: true,
            })
          }
        } catch (err) {
          console.warn('Failed to initialize Supabase session', err)
        }
      },

      login: async (email: string, password?: string, storeSlug = 'batik-nusantara') => {
        set({ isLoading: true })
        try {
          if (isSupabaseConfigured && supabase && password) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            })
            if (error) throw error

            if (data.user) {
              const { data: store } = await supabase
                .from('stores')
                .select('id, name, slug')
                .eq('user_id', data.user.id)
                .single()

              const name = store?.name || data.user.user_metadata?.store_name || email.split('@')[0] || 'Merchant'
              const resolvedSlug = store?.slug || storeSlug

              set({
                user: {
                  id: data.user.id,
                  email: data.user.email || email,
                  name,
                  storeSlug: resolvedSlug,
                  storeId: store?.id,
                },
                isAuthenticated: true,
                isLoading: false,
              })
              return
            }
          }

          // Fallback / Mock
          const name = email.split('@')[0] || 'Merchant'
          set({
            user: {
              id: 'usr-' + Date.now(),
              email,
              name: name.charAt(0).toUpperCase() + name.slice(1),
              storeSlug,
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      signup: async (email: string, password?: string, storeSlug = 'tokoku', storeName = 'Toko Baru') => {
        set({ isLoading: true })
        try {
          if (isSupabaseConfigured && supabase && password) {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  store_name: storeName,
                  store_slug: storeSlug,
                },
              },
            })
            if (error) throw error

            if (data.user) {
              // Wait briefly for trigger or fetch store
              const { data: store } = await supabase
                .from('stores')
                .select('id, name, slug')
                .eq('user_id', data.user.id)
                .single()

              set({
                user: {
                  id: data.user.id,
                  email: data.user.email || email,
                  name: store?.name || storeName,
                  storeSlug: store?.slug || storeSlug,
                  storeId: store?.id,
                },
                isAuthenticated: true,
                isLoading: false,
              })
              return
            }
          }

          // Fallback / Mock
          set({
            user: {
              id: 'usr-' + Date.now(),
              email,
              name: storeName,
              storeSlug: storeSlug || 'toko-saya',
            },
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      loginWithGoogle: async () => {
        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/dashboard`,
            },
          })
          if (error) throw error
          return
        }

        // Mock Google login
        const email = 'penjual.umkm@gmail.com'
        get().login(email, undefined, 'batik-nusantara')
      },

      logout: async () => {
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.auth.signOut()
          } catch (e) {
            console.warn('Supabase sign out warning', e)
          }
        }
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
    }),
    {
      name: 'tautan_auth_storage',
    }
  )
)

