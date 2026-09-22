import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
  duration: number
}

interface ToastState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id' | 'duration'> & { duration?: number }) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: ({ title, message, type = 'success', duration = 3500 }) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    const newToast: ToastItem = { id, title, message, type, duration }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  success: (title: string, message?: string, duration?: number) => {
    get().addToast({ title, message, type: 'success', duration })
  },

  error: (title: string, message?: string, duration?: number) => {
    get().addToast({ title, message, type: 'error', duration: duration || 4500 })
  },

  info: (title: string, message?: string, duration?: number) => {
    get().addToast({ title, message, type: 'info', duration })
  },
}))

// Standalone export for quick calls
export const toast = {
  success: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().success(title, message, duration),
  error: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().error(title, message, duration),
  info: (title: string, message?: string, duration?: number) =>
    useToastStore.getState().info(title, message, duration),
}
