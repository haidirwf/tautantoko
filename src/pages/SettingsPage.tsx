import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { Check } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuthStore()
  const [storeName, setStoreName] = useState(user?.name || 'Batik Nusantara')
  const [slug, setSlug] = useState(user?.storeSlug || 'batik-nusantara')
  const [whatsapp, setWhatsapp] = useState('081298765432')
  const [tagline, setTagline] = useState('Koleksi busana etnik modern berbahan katun primisima & pewarna alam.')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="pb-6 border-b border-[#e8e2d9]">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc785c] font-semibold">
            Konfigurasi
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] tracking-tight mt-1">
            Pengaturan Toko
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Ubah nama toko, nomor WhatsApp penerima order, dan tautan bio tokomu.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5 p-6 rounded-xl border border-[#e8e2d9] bg-white">
          <div>
            <label className="text-xs font-medium text-ink block mb-1">Nama Toko</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] text-sm text-ink focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink block mb-1">Tautan URL Toko</label>
            <div className="flex items-center rounded-lg bg-[#faf8f5] border border-[#e8e2d9] px-3 focus-within:border-[#cc785c]">
              <span className="text-xs text-muted font-mono select-none">tautan.site/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full h-10 bg-transparent text-sm text-ink focus:outline-none pl-0.5 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-ink block mb-1">Nomor WhatsApp Penerima Order</label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] text-sm text-ink font-mono focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]"
            />
            <span className="text-[11px] text-muted mt-1 block">
              Format: 08... atau 628... Setiap pesanan checkout pembeli akan diteruskan ke nomor ini.
            </span>
          </div>

          <div>
            <label className="text-xs font-medium text-ink block mb-1">Deskripsi / Bio Toko</label>
            <textarea
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#faf8f5] border border-[#e8e2d9] text-sm text-ink focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#e8e2d9] flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-status-success font-medium flex items-center gap-1.5">
                <Check className="size-4" />
                <span>Pengaturan berhasil disimpan!</span>
              </span>
            ) : <span />}

            <Button type="submit">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
