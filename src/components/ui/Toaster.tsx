import { AnimatePresence, motion } from 'motion/react'
import { Check, AlertCircle, Info, X } from 'lucide-react'
import { useToastStore, type ToastItem } from '@/store/useToastStore'

export function Toaster() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 sm:top-5 sm:right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] sm:w-88 pointer-events-none"
    >
      <AnimatePresence mode="sync">
        {toasts.map((item) => (
          <ToastCard key={item.id} toast={item} onDismiss={() => removeToast(item.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const isSuccess = toast.type === 'success'
  const isError = toast.type === 'error'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.92 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-[#e8e2d9] shadow-xl shadow-stone-900/5 flex items-start gap-3 relative overflow-hidden"
    >
      {/* Accent left indicator line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isSuccess ? 'bg-emerald-600' : isError ? 'bg-rose-600' : 'bg-[#cc785c]'
        }`}
      />

      {/* Icon */}
      <div
        className={`size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          isSuccess
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'
            : isError
            ? 'bg-rose-50 text-rose-600 border border-rose-200/80'
            : 'bg-[#fae7e0] text-[#cc785c] border border-[#e8e2d9]'
        }`}
      >
        {isSuccess ? (
          <Check className="size-4 stroke-[2.5]" />
        ) : isError ? (
          <AlertCircle className="size-4 stroke-[2]" />
        ) : (
          <Info className="size-4 stroke-[2]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="font-semibold text-xs sm:text-sm text-[#141413] leading-snug tracking-tight">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-xs text-[#706c64] mt-0.5 leading-relaxed break-words">
            {toast.message}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-lg text-[#8c867b] hover:text-[#141413] hover:bg-[#faf8f5] transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  )
}
