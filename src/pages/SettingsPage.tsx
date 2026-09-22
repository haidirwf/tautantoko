import React, { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { api } from '@/lib/supabase'
import { Check, Store, Phone, Globe, FileText } from 'lucide-react'
import { toast } from '@/store/useToastStore'

export function SettingsPage() {
  const { user } = useAuthStore()
  const storeId = user?.storeId || 'store-batik-01'
  const [storeName, setStoreName] = useState(user?.name || 'Batik Nusantara')
  const [slug, setSlug] = useState(user?.storeSlug || 'batik-nusantara')
  const [whatsapp, setWhatsapp] = useState('081298765432')
  const [tagline, setTagline] = useState('Koleksi busana etnik modern berbahan katun primisima & pewarna alam.')
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await api.updateStore(storeId, {
        name: storeName.trim(),
        slug: slug.trim(),
        whatsapp_number: whatsapp.trim(),
        tagline: tagline.trim(),
      })
      // Update local state in store
      if (user) {
        useAuthStore.setState({
          user: {
            ...user,
            name: storeName.trim(),
            storeSlug: slug.trim(),
          },
        })
      }
      setSaved(true)
      toast.success('Pengaturan Disimpan', 'Profil dan konfigurasi toko berhasil diperbarui.')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to update store settings', err)
      toast.error('Gagal Menyimpan Pengaturan', 'Terjadi kesalahan saat menyimpan pengaturan toko.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Clean Header */}
        <div className="pb-4 border-b border-[#e8e2d9]">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
            Pengaturan Toko
          </h1>
          <p className="text-xs sm:text-sm text-[#706c64] mt-0.5">
            Kelola nama toko, nomor WhatsApp tujuan pesanan, dan tautan publik etalase Anda.
          </p>
        </div>

        {/* Clean Card Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5 p-6 sm:p-7 rounded-2xl border border-[#e8e2d9] bg-white shadow-2xs">
          <div>
            <label className="text-xs font-semibold text-[#141413] flex items-center gap-1.5 mb-1.5">
              <Store className="size-3.5 text-[#706c64]" />
              <span>Nama Toko</span>
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#e8e2d9] text-sm text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#141413] flex items-center gap-1.5 mb-1.5">
              <Globe className="size-3.5 text-[#706c64]" />
              <span>Tautan URL Toko</span>
            </label>
            <div className="flex items-center rounded-lg bg-white border border-[#e8e2d9] px-3 focus-within:border-[#cc785c] focus-within:ring-1 focus-within:ring-[#cc785c] shadow-2xs">
              <span className="text-xs text-[#8c867b] font-mono select-none">tautan.site/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full h-10 bg-transparent text-sm text-[#141413] focus:outline-none pl-0.5 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#141413] flex items-center gap-1.5 mb-1.5">
              <Phone className="size-3.5 text-[#706c64]" />
              <span>Nomor WhatsApp Penerima Pesanan</span>
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg bg-white border border-[#e8e2d9] text-sm text-[#141413] font-mono focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
            <span className="text-[11px] text-[#8c867b] mt-1.5 block">
              Format: 08... atau 628... Setiap pesanan pembeli otomatis dikirim ke nomor WhatsApp ini.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#141413] flex items-center gap-1.5 mb-1.5">
              <FileText className="size-3.5 text-[#706c64]" />
              <span>Deskripsi / Bio Toko</span>
            </label>
            <textarea
              rows={2}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-[#e8e2d9] text-sm text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[#e8e2d9] flex items-center justify-between">
            {saved ? (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <Check className="size-4" />
                <span>Pengaturan berhasil disimpan!</span>
              </span>
            ) : <span />}

            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

