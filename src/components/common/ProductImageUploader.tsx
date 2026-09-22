import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UploadCloud, Trash2, RefreshCw, Link as LinkIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

export interface ProductImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  required?: boolean
  error?: string
}

const PRESET_SAMPLES = [
  {
    id: 'sample-kemeja',
    label: 'Kemeja',
    tag: 'Batik Pria',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-dress',
    label: 'Dress',
    tag: 'Tenun Etnik',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-tas',
    label: 'Totebag',
    tag: 'Aksesoris',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-kuliner',
    label: 'Kopi',
    tag: 'F&B / Kuliner',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
]

export function ProductImageUploader({
  value,
  onChange,
  label = 'Foto Produk',
  required = false,
  error,
}: ProductImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileProcess = (file: File) => {
    setFileError(null)

    // Validate type
    if (!file.type.startsWith('image/')) {
      setFileError('Format file harus berupa gambar (JPG, PNG, WEBP, atau GIF)')
      return
    }

    // Validate size (max 5MB)
    const MAX_SIZE_MB = 5
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`Ukuran foto maksimal ${MAX_SIZE_MB}MB. File Anda: ${(file.size / (1024 * 1024)).toFixed(1)}MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        onChange(result)
      }
    }
    reader.onerror = () => {
      setFileError('Gagal membaca file foto. Silakan coba file lain.')
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileProcess(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileProcess(files[0])
    }
    // reset input so same file can be selected again if needed
    e.target.value = ''
  }

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim())
      setShowUrlInput(false)
      setUrlDraft('')
      setFileError(null)
    }
  }

  const handleRemoveImage = () => {
    onChange('')
    setFileError(null)
  }

  const hasImage = Boolean(value && value.trim().length > 0)

  return (
    <div className="flex flex-col gap-2">
      {/* Label and Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#141413] flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-[#cc785c]">*</span>}
        </label>
        {!hasImage && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#cc785c] hover:underline flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <LinkIcon className="size-3" />
            <span>{showUrlInput ? 'Tutup Input Link' : 'Gunakan Link URL'}</span>
          </button>
        )}
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Case 1: Image exists -> Show Live Preview Card */}
      {hasImage ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl border border-[#e8e2d9] bg-[#faf8f5] p-2.5 overflow-hidden shadow-2xs group"
        >
          <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-xl overflow-hidden bg-[#e8e2d9]/40 border border-[#e8e2d9]">
            <img
              src={value}
              alt="Preview Foto Produk"
              className="size-full object-cover"
              onError={() => setFileError('Foto tidak dapat dimuat dari tautan yang diberikan.')}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-xs font-semibold text-[#141413] flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <RefreshCw className="size-3.5 text-[#cc785c]" />
                <span>Ganti Foto</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Hapus</span>
              </button>
            </div>

            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-400" />
              <span>Foto siap dipasang</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1.5 pt-2 text-xs text-[#706c64]">
            <span className="truncate max-w-[200px] text-[11px] font-mono">
              {value.startsWith('data:') ? 'Foto dari perangkat Anda' : value}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-[#141413] hover:text-[#cc785c] transition-colors cursor-pointer"
              >
                Ganti
              </button>
              <span className="text-[#e8e2d9]">|</span>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Case 2: No image -> Show Dropzone & Preset Options */
        <div className="flex flex-col gap-2.5">
          {/* Direct File Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-5 text-center flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-[#cc785c] bg-[#cc785c]/5 scale-[1.01]'
                : 'border-[#e8e2d9] hover:border-[#cc785c]/60 bg-white hover:bg-[#faf8f5]/60 shadow-2xs'
            }`}
          >
            <div className="size-11 rounded-2xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] shadow-2xs group-hover:scale-105 transition-transform">
              <UploadCloud className="size-5.5" />
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#141413]">
                Pilih foto dari komputer / HP Anda
              </p>
              <p className="text-[11px] text-[#706c64] mt-0.5">
                Klik untuk menjelajah file atau seret foto ke kotak ini
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-[#faf8f5] border border-[#e8e2d9] text-[#706c64]">
              <span>JPG, PNG, WEBP, GIF</span>
              <span className="text-[#a09a8f]">•</span>
              <span>Maks. 5MB</span>
            </span>
          </div>

          {/* Optional URL input toggle */}
          <AnimatePresence>
            {showUrlInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex flex-col gap-2">
                  <label className="text-[11px] font-medium text-[#706c64]">
                    Tempel tautan (URL) gambar online:
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleApplyUrl()
                        }
                      }}
                      className="flex-1 h-9 px-3 rounded-lg bg-white border border-[#e8e2d9] text-xs text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      disabled={!urlDraft.trim()}
                      className="h-9 px-3 rounded-lg bg-[#cc785c] text-white text-xs font-semibold hover:bg-[#a9583e] disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      Pasang
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Presets: 1-Click Aesthetic Sample Photos */}
          <div className="rounded-xl border border-[#e8e2d9]/70 bg-[#faf8f5]/60 p-2.5">
            <div className="flex items-center gap-1.5 mb-2 text-[11px] text-[#706c64] font-medium">
              <Sparkles className="size-3 text-[#cc785c]" />
              <span>Belum ada foto? Pilih contoh foto siap pakai ini:</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PRESET_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onChange(sample.url)}
                  className="group flex flex-col items-center text-left rounded-lg overflow-hidden border border-[#e8e2d9] bg-white hover:border-[#cc785c] hover:shadow-2xs transition-all p-1 cursor-pointer"
                  title={`Gunakan foto contoh ${sample.label}`}
                >
                  <div className="aspect-square w-full rounded-md overflow-hidden bg-[#faf8f5] mb-1">
                    <img
                      src={sample.url}
                      alt={sample.label}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#141413] group-hover:text-[#cc785c] leading-tight truncate w-full text-center">
                    {sample.label}
                  </span>
                  <span className="text-[9px] text-[#8c867b] leading-tight truncate w-full text-center">
                    {sample.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error displays */}
      {(fileError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{fileError || error}</span>
        </div>
      )}
    </div>
  )
}
