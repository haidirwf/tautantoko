import React, { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { UploadCloud, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'

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
    label: 'Kemeja Batik',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-dress',
    label: 'Dress Tenun',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-tas',
    label: 'Totebag',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sample-kuliner',
    label: 'Kopi & Kuliner',
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
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileProcess = (file: File) => {
    setFileError(null)

    if (!file.type.startsWith('image/')) {
      setFileError('Format file harus berupa gambar (JPG, PNG, WEBP, atau GIF)')
      return
    }

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
    e.target.value = ''
  }

  const handleRemoveImage = () => {
    onChange('')
    setFileError(null)
  }

  const hasImage = Boolean(value && value.trim().length > 0)

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#141413] flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-[#cc785c]">*</span>}
        </label>
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
          className="relative rounded-xl border border-[#e8e2d9] bg-[#faf8f5] p-2 overflow-hidden shadow-2xs group"
        >
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#e8e2d9]/40 border border-[#e8e2d9]">
            <img
              src={value}
              alt="Preview Foto Produk"
              className="size-full object-cover"
              onError={() => setFileError('Foto tidak dapat dimuat.')}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-white/95 hover:bg-white text-xs font-semibold text-[#141413] flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <RefreshCw className="size-3 text-[#cc785c]" />
                <span>Ganti</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-2.5 py-1.5 rounded-lg bg-red-600/95 hover:bg-red-600 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Trash2 className="size-3" />
                <span>Hapus</span>
              </button>
            </div>

            <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
              <CheckCircle2 className="size-2.5 text-emerald-400" />
              <span>Foto siap</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 pt-1.5 text-xs text-[#706c64]">
            <span className="truncate max-w-[160px] text-[10px] font-mono">
              {value.startsWith('data:') ? 'Foto dari perangkat' : 'Foto produk terpilih'}
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
        /* Case 2: No image -> Show Compact Dropzone & Mini Preset Thumbs */
        <div className="flex flex-col gap-2">
          {/* Direct File Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed transition-all p-3.5 text-center flex flex-col items-center justify-center gap-1 ${
              isDragging
                ? 'border-[#cc785c] bg-[#cc785c]/5 scale-[1.01]'
                : 'border-[#e8e2d9] hover:border-[#cc785c]/60 bg-white hover:bg-[#faf8f5]/60 shadow-2xs'
            }`}
          >
            <div className="size-8 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] shadow-2xs">
              <UploadCloud className="size-4" />
            </div>

            <p className="text-xs font-semibold text-[#141413] leading-tight">
              Pilih foto dari komputer / HP
            </p>
            <p className="text-[10px] text-[#706c64]">
              Klik untuk jelajah file atau seret foto ke kotak ini
            </p>
            <span className="text-[9px] font-mono text-[#8c867b]">
              JPG, PNG, WEBP, GIF (Maks. 5MB)
            </span>
          </div>

          {/* Mini Preset Thumbs */}
          <div className="flex items-center justify-between px-0.5 pt-0.5">
            <span className="text-[10px] text-[#8c867b] font-medium">Contoh foto:</span>
            <div className="flex items-center gap-1.5">
              {PRESET_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onChange(sample.url)}
                  className="size-7 rounded-md overflow-hidden border border-[#e8e2d9] hover:border-[#cc785c] hover:scale-110 transition-all cursor-pointer shadow-2xs"
                  title={`Pilih contoh ${sample.label}`}
                >
                  <img src={sample.url} alt={sample.label} className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {(fileError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{fileError || error}</span>
        </div>
      )}
    </div>
  )
}
