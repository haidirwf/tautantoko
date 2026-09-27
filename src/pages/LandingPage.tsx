import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { formatIDR } from '@/lib/utils'

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [claimSlug, setClaimSlug] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuthStore()

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = claimSlug.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'tokoku'
    if (isAuthenticated) {
      navigate('/dashboard')
      return
    }
    signup('penjual@tautan.site', clean)
    navigate('/dashboard')
  }

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx)
  }

  const faqItems = [
    {
      q: 'Apa perbedaan tautan.site dengan link bio biasa?',
      a: 'Link bio biasa hanya menampilkan tombol tautan pasif. tautan.site menggabungkan tautan profil dengan etalase belanja, sehingga calon pembeli bisa melihat katalog produk, memilih varian, dan mengisi alamat pengiriman langsung. Pesanan terformat otomatis ke WhatsApp Anda.',
    },
    {
      q: 'Apakah ada potongan komisi dari setiap penjualan?',
      a: 'Sama sekali tidak ada potongan komisi (0% platform fee). Semua pembayaran langsung masuk 100% ke rekening bank atau QRIS pribadi yang Anda sediakan.',
    },
    {
      q: 'Apakah pembeli wajib membuat akun atau menginstal aplikasi?',
      a: 'Tidak perlu. Pembeli membuka tautan di browser ponsel secara instan, memilih barang, dan langsung checkout ke WhatsApp dalam hitungan detik.',
    },
    {
      q: 'Bagaimana cara penjual menerima dan mengelola pesanan?',
      a: 'Saat pembeli checkout, Anda menerima pesan terformat rapi di WhatsApp. Secara bersamaan, rekapan pesanan otomatis tercatat di Dashboard toko Anda untuk memudahkan pengecekan status bayar dan input nomor resi ekspedisi.',
    },
    {
      q: 'Apakah saya bisa menggunakan nama tautan sendiri?',
      a: 'Bisa. Anda mendapatkan alamat ringkas tautan.site/namatokomu secara gratis saat mendaftar. Anda juga dapat mengubah informasi toko, foto produk, dan harga kapan saja.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col justify-between selection:bg-[#cc785c]/25 selection:text-[#141413] font-sans">
      {/* ==================================================================== */}
      {/* 1. HERO SECTION (Ultra-Clean, Confident, Minimalist) */}
      {/* ==================================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28 max-w-5xl mx-auto w-full text-center">
        {/* Confident Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#141413] leading-[1.08] max-w-4xl mx-auto"
        >
          Satu tautan untuk semua yang kamu <span className="text-[#cc785c]">jual dan bagikan.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-base sm:text-lg text-[#5c5850] max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Gantikan link bio pasif dengan etalase belanja modern. Pajang produk, terima pesanan terstruktur, dan sambungkan pembeli langsung ke WhatsApp tanpa potongan komisi.
        </motion.p>

        {/* Minimal Claim Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-md mx-auto w-full"
        >
          <form
            onSubmit={handleClaimSubmit}
            className="p-1.5 rounded-full border border-[#e6dfd8] bg-white shadow-xs flex items-center gap-2 focus-within:border-[#cc785c] focus-within:ring-2 focus-within:ring-[#cc785c]/20 transition-all hover:border-[#cc785c]/60"
          >
            <div className="flex items-center pl-4 pr-1 text-xs sm:text-sm text-[#8c867b] font-mono select-none font-semibold">
              tautan.site/
            </div>
            <input
              type="text"
              required
              placeholder="namatokomu"
              value={claimSlug}
              onChange={(e) => setClaimSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className="w-full text-xs sm:text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none font-medium bg-transparent"
            />
            <button
              type="submit"
              className="px-5 h-10 rounded-full bg-[#141413] hover:bg-black text-white text-xs sm:text-sm font-bold transition-all shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Klaim</span>
              <ArrowRight className="size-3.5 text-[#cc785c]" />
            </button>
          </form>

          {/* Clean Trust Indicators */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 mt-4 text-xs text-[#706c64] flex-wrap font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600" />
              0% Potongan Komisi
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600" />
              Buka Toko 30 Detik
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600" />
              Gratis Selamanya
            </span>
          </div>
        </motion.div>

        {/* Pure Minimalist Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-sm mx-auto p-6 rounded-3xl bg-white border border-[#e6dfd8] shadow-sm text-left"
        >
          {/* Creator Profile */}
          <div className="text-center pb-4 border-b border-[#f0ece5]">
            <div className="size-14 rounded-full bg-[#cc785c] text-white flex items-center justify-center font-bold text-base mx-auto mb-2.5 shadow-2xs">
              KS
            </div>
            <h3 className="font-extrabold text-sm text-[#141413]">Kedai Kopi Senja</h3>
            <span className="text-xs font-mono text-[#8c867b]">tautan.site/senja</span>
            <p className="text-xs text-[#5c5850] mt-1.5 leading-relaxed">
              Biji kopi pilihan Nusantara, diseduh segar setiap hari.
            </p>
          </div>

          {/* Simple Clean Product Items */}
          <div className="py-3.5 space-y-2.5">
            <div className="p-3 rounded-2xl bg-[#faf9f5] border border-[#e6dfd8] flex items-center justify-between gap-3">
              <img
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80"
                alt="Kopi Susu Aren"
                className="size-11 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-[#141413] block truncate">Kopi Susu Aren</span>
                <span className="text-xs font-mono text-[#cc785c] font-bold">{formatIDR(22000)}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-[#e6dfd8] text-[10px] font-bold text-[#141413]">
                Pesan
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf9f5] border border-[#e6dfd8] flex items-center justify-between gap-3">
              <img
                src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&auto=format&fit=crop&q=80"
                alt="Croissant"
                className="size-11 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-[#141413] block truncate">Butter Croissant</span>
                <span className="text-xs font-mono text-[#cc785c] font-bold">{formatIDR(18000)}</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-[#e6dfd8] text-[10px] font-bold text-[#141413]">
                Pesan
              </span>
            </div>
          </div>

          {/* Direct Checkout CTA Bar */}
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="w-full py-2.5 rounded-xl bg-[#141413] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Buka WhatsApp Toko</span>
            <ArrowRight className="size-3 text-[#cc785c]" />
          </button>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* 2. CORE VALUE PILLARS (Clean 3-Column Layout, No Heavy Bento) */}
      {/* ==================================================================== */}
      <section id="features" className="scroll-mt-20 border-t border-[#e6dfd8] bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141413]">
              Dibuat untuk pedagang mandiri.
            </h2>
            <p className="text-sm text-[#5c5850] mt-2.5">
              Tiga fondasi utama untuk transaksi media sosial yang cepat dan rapi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono font-bold text-[#cc785c] uppercase tracking-wider mb-2">
                01. Etalase Mandiri
              </span>
              <h3 className="font-sans text-lg font-bold text-[#141413] mb-2">
                Katalog Produk & Varian
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                Pajang seluruh lini produk dengan foto jernih dan pilihan varian (ukuran, rasa, atau warna). Pembeli memilih sendiri tanpa tanya harga berulang kali.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono font-bold text-[#cc785c] uppercase tracking-wider mb-2">
                02. Alur WhatsApp
              </span>
              <h3 className="font-sans text-lg font-bold text-[#141413] mb-2">
                Checkout Kilat Tanpa Login
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                Pembeli tidak perlu registrasi akun atau menginstal aplikasi. Format pesanan beserta alamat pengiriman langsung tersaji siap kirim di WhatsApp Anda.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono font-bold text-[#cc785c] uppercase tracking-wider mb-2">
                03. Keuntungan Penuh
              </span>
              <h3 className="font-sans text-lg font-bold text-[#141413] mb-2">
                0% Potongan Komisi
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                Seluruh hasil penjualan 100% menjadi hak Anda. Pembeli mentransfer langsung ke rekening bank atau QRIS pribadi yang Anda sediakan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. 3-STEP SEQUENCE (#how) */}
      {/* ==================================================================== */}
      <section id="how" className="scroll-mt-20 border-t border-[#e6dfd8] bg-[#faf9f5] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141413]">
              Mulai dalam 3 langkah mudah.
            </h2>
            <p className="text-sm text-[#5c5850] mt-2">
              Selesai dalam hitungan menit tanpa keahlian teknis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#e6dfd8] shadow-2xs text-left">
              <span className="font-mono text-2xl font-extrabold text-[#cc785c] block mb-2">1</span>
              <h3 className="font-sans text-base font-bold text-[#141413] mb-1.5">Klaim Tautan Toko</h3>
              <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                Tentukan nama tokomu dan amankan alamat unik tautan.site/namatokomu secara instan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e6dfd8] shadow-2xs text-left">
              <span className="font-mono text-2xl font-extrabold text-[#cc785c] block mb-2">2</span>
              <h3 className="font-sans text-base font-bold text-[#141413] mb-1.5">Upload Produk</h3>
              <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                Masukkan foto produk, harga, dan opsi varian. Sistem otomatis mengompres foto agar ringan dimuat.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e6dfd8] shadow-2xs text-left">
              <span className="font-mono text-2xl font-extrabold text-[#cc785c] block mb-2">3</span>
              <h3 className="font-sans text-base font-bold text-[#141413] mb-1.5">Sematkan di Bio</h3>
              <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                Pasang tautan di bio Instagram dan TikTok. Pesanan pembeli langsung masuk rapi ke WhatsApp Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. PERTANYAAN UMUM / FAQ (#faq) */}
      {/* ==================================================================== */}
      <section id="faq" className="scroll-mt-20 border-t border-[#e6dfd8] bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141413]">
              Pertanyaan Umum
            </h2>
            <p className="text-sm text-[#5c5850] mt-2">
              Jawaban ringkas seputar penggunaan tautan.site.
            </p>
          </div>

          <div className="divide-y divide-[#e6dfd8] border-y border-[#e6dfd8]">
            {faqItems.map((item, idx) => (
              <div key={idx} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer select-none"
                >
                  <span className="font-bold text-sm sm:text-base text-[#141413] group-hover:text-[#cc785c] transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 shrink-0 ${
                      activeFaq === idx ? 'rotate-180 text-[#cc785c]' : 'text-[#706c64]'
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm text-[#5c5850] pt-2.5 pb-1 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. PRE-FOOTER CONVERSION BANNER */}
      {/* ==================================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-4xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#141413] text-white flex flex-col items-center gap-6 shadow-md">
          <div className="max-w-md">
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Mulai buat etalase tokomu sekarang.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              Daftar gratis dalam 30 detik. Tanpa komisi. Langsung siap menerima pesanan di WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="px-7 py-3.5 rounded-full bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span>Buka Toko Gratis</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. MINIMALIST FOOTER */}
      {/* ==================================================================== */}
      <footer className="border-t border-[#e6dfd8] bg-white py-8 px-4 sm:px-6 text-[#5c5850] text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-sans text-base font-extrabold text-[#141413]">tautan.site</span>
            <span className="text-neutral-300">|</span>
            <span className="text-xs text-[#706c64]">Link in Bio Interaktif & Toko WhatsApp</span>
          </div>

          <div className="flex items-center gap-5 text-xs font-semibold">
            <a href="#features" className="hover:text-[#141413] transition-colors">Fitur</a>
            <a href="#how" className="hover:text-[#141413] transition-colors">Cara Kerja</a>
            <a href="#faq" className="hover:text-[#141413] transition-colors">FAQ</a>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="text-[#cc785c] hover:text-[#b8674d] transition-colors cursor-pointer"
            >
              Masuk Penjual
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#8c867b]">
          <span>© 2026 tautan.site. Didesain untuk pedagang mandiri Indonesia.</span>
          <span className="font-medium text-[#141413]">0% Potongan Komisi</span>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
