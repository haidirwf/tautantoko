import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured, clearAllDumpData } from '@/lib/supabase'

export interface User {
  id: string
  email: string
  name: string
  storeSlug: string
  storeId?: string
  whatsappNumber?: string
  tagline?: string
  isOnboarded?: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string, storeSlug?: string) => Promise<{ isOnboarded: boolean }>
  signup: (email: string, password?: string, storeSlug?: string, storeName?: string) => Promise<{ isOnboarded: boolean }>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  updateUserStore: (store: { id: string; name: string; slug: string; whatsappNumber?: string; tagline?: string }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      initialize: async () => {
        // If state has leftover dump user from mock testing, purge it immediately
        const currentUser = useAuthStore.getState().user
        if (currentUser?.id?.startsWith('usr-')) {
          clearAllDumpData()
          set({ user: null, isAuthenticated: false, isLoading: false })
        }

        if (!isSupabaseConfigured || !supabase) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        set({ isLoading: true })
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          if (error) {
            console.warn('Error fetching Supabase session', error)
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          if (session?.user) {
            const authUser = session.user
            // Fetch associated store from database
            const { data: store } = await supabase
              .from('stores')
              .select('id, name, slug, whatsapp_number, tagline, is_onboarded')
              .eq('user_id', authUser.id)
              .maybeSingle()

            const name = store?.name || authUser.user_metadata?.store_name || authUser.email?.split('@')[0] || 'Merchant'
            const storeSlug = store?.slug || authUser.user_metadata?.store_slug || ''
            const isOnboarded = Boolean(
              store?.is_onboarded ||
              (store?.slug && store?.whatsapp_number && store.whatsapp_number.length >= 8)
            )

            set({
              user: {
                id: authUser.id,
                email: authUser.email || '',
                name,
                storeSlug,
                storeId: store?.id,
                whatsappNumber: store?.whatsapp_number || '',
                tagline: store?.tagline || '',
                isOnboarded,
              },
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        } catch (err) {
          console.warn('Failed to initialize Supabase session', err)
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      login: async (email: string, password?: string, storeSlug = '') => {
        set({ isLoading: true })
        try {
          if (!isSupabaseConfigured || !supabase) {
            throw new Error(
              'Supabase belum terkonfigurasi. Silakan masukkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada file .env terlebih dahulu.'
            )
          }

          if (!password) {
            throw new Error('Kata sandi wajib diisi untuk masuk.')
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error

          if (data.user) {
            const { data: store } = await supabase
              .from('stores')
              .select('id, name, slug, whatsapp_number, tagline, is_onboarded')
              .eq('user_id', data.user.id)
              .maybeSingle()

            const name = store?.name || data.user.user_metadata?.store_name || email.split('@')[0] || 'Merchant'
            const resolvedSlug = store?.slug || storeSlug || data.user.user_metadata?.store_slug || ''
            const isOnboarded = Boolean(
              store?.is_onboarded ||
              (store?.slug && store?.whatsapp_number && store.whatsapp_number.length >= 8)
            )

            set({
              user: {
                id: data.user.id,
                email: data.user.email || email,
                name,
                storeSlug: resolvedSlug,
                storeId: store?.id,
                whatsappNumber: store?.whatsapp_number || '',
                tagline: store?.tagline || '',
                isOnboarded,
              },
              isAuthenticated: true,
              isLoading: false,
            })

            return { isOnboarded }
          }
          return { isOnboarded: false }
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      signup: async (email: string, password?: string, storeSlug = '', storeName = '') => {
        set({ isLoading: true })
        try {
          if (!isSupabaseConfigured || !supabase) {
            throw new Error(
              'Supabase belum terkonfigurasi. Silakan masukkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada file .env terlebih dahulu.'
            )
          }

          if (!password) {
            throw new Error('Kata sandi wajib diisi.')
          }

          const slugVal = storeSlug || email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '')
          const nameVal = storeName || email.split('@')[0]

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                store_name: nameVal,
                store_slug: slugVal,
              },
            },
          })
          if (error) throw error

          if (data.user) {
            let store = null
            try {
              const res = await supabase
                .from('stores')
                .select('id, name, slug, whatsapp_number, tagline, is_onboarded')
                .eq('user_id', data.user.id)
                .maybeSingle()
              store = res.data
            } catch (e) {
              console.warn('Store fetch error on signup', e)
            }

            set({
              user: {
                id: data.user.id,
                email: data.user.email || email,
                name: store?.name || nameVal,
                storeSlug: store?.slug || slugVal,
                storeId: store?.id,
                whatsappNumber: store?.whatsapp_number || '',
                tagline: store?.tagline || '',
                isOnboarded: false,
              },
              isAuthenticated: Boolean(data.session),
              isLoading: false,
            })

            return { isOnboarded: false }
          }
          return { isOnboarded: false }
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      loginWithGoogle: async () => {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error(
            'Supabase belum terkonfigurasi. Silakan masukkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY pada file .env terlebih dahulu.'
          )
        }

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
      },

      updateUserStore: (store) => {
        const currentUser = useAuthStore.getState().user
        if (currentUser) {
          useAuthStore.setState({
            user: {
              ...currentUser,
              name: store.name,
              storeSlug: store.slug,
              storeId: store.id,
              whatsappNumber: store.whatsappNumber,
              tagline: store.tagline,
              isOnboarded: true,
            },
          })
        }
      },

      logout: async () => {
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.auth.signOut()
          } catch (e) {
            console.warn('Supabase sign out warning', e)
          }
        }
        clearAllDumpData()
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
