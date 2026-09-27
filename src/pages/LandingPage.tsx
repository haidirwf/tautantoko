import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  Check,
  MessageCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { formatIDR } from '@/lib/utils'

interface DemoProduct {
  id: string
  name: string
  price: number
  variants: string[]
  image: string
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'kopi-aren',
    name: 'Kopi Susu Aren 250ml',
    price: 22000,
    variants: ['Dingin', 'Hangat'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'croissant',
    name: 'Artisan Butter Croissant',
    price: 18000,
    variants: ['Original', 'Cokelat'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80',
  },
]

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [claimSlug, setClaimSlug] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  // Clean interactive selection for the live preview cards
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct>(DEMO_PRODUCTS[0])
  const [selectedVariant, setSelectedVariant] = useState<string>(DEMO_PRODUCTS[0].variants[0])

  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuthStore()

  const handleSelectProduct = (product: DemoProduct) => {
    setSelectedProduct(product)
    setSelectedVariant(product.variants[0])
  }

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
      q: 'Apa perbedaan tautan.site dengan link bio biasa seperti Linktree?',
      a: 'Link bio biasa hanya menampilkan daftar tautan pasif. tautan.site menggabungkan tautan profil dengan etalase produk interaktif yang memungkinkan calon pembeli memilih produk, menentukan varian, dan mengisi alamat pengiriman langsung. Checkout terformat rapi dan langsung masuk ke WhatsApp penjual.',
    },
    {
      q: 'Apakah ada potongan komisi dari setiap penjualan?',
      a: 'Sama sekali tidak ada potongan komisi (0% platform fee). Semua pembayaran langsung masuk 100% ke rekening bank atau QRIS pribadi yang Anda sediakan.',
    },
    {
      q: 'Apakah pembeli wajib membuat akun atau menginstal aplikasi?',
      a: 'Tidak perlu. Pembeli membuka link di browser HP mereka secara instan, memilih barang, dan langsung checkout ke WhatsApp dalam hitungan detik.',
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
    <div className="min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col justify-between selection:bg-[#cc785c]/25 selection:text-[#141413] overflow-x-hidden font-sans">
      {/* ==================================================================== */}
      {/* 1. HERO SECTION (Clean, Minimalist Linktree & Inkto Vibe) */}
      {/* ==================================================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Direct Confident Typography & Claim Input (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Confident Headline (No pill badge above headline) */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#141413] leading-[1.08]"
            >
              Satu tautan untuk semua yang kamu <span className="text-[#cc785c]">jual dan bagikan.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-[#5c5850] max-w-xl leading-relaxed font-normal"
            >
              Gantikan link bio pasif dengan etalase belanja modern. Pajang produk, terima pesanan terstruktur, dan sambungkan pembeli langsung ke WhatsApp tanpa potongan komisi.
            </motion.p>

            {/* Linktree-Style Claim Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 w-full max-w-lg"
            >
              <form
                onSubmit={handleClaimSubmit}
                className="p-1.5 rounded-2xl sm:rounded-full border border-[#e6dfd8] bg-white shadow-xs flex flex-col sm:flex-row items-center gap-2 focus-within:border-[#cc785c] focus-within:ring-2 focus-within:ring-[#cc785c]/20 transition-all hover:border-[#cc785c]/60"
              >
                <div className="flex items-center w-full sm:w-auto flex-1 pl-4 pr-2 py-1">
                  <span className="text-xs sm:text-sm text-[#8c867b] font-mono select-none font-semibold">
                    tautan.site/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="namatokomu"
                    value={claimSlug}
                    onChange={(e) => setClaimSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full pl-1 text-xs sm:text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none font-medium bg-transparent"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full sm:w-auto px-6 h-11 rounded-xl sm:rounded-full bg-[#141413] hover:bg-black text-white text-xs sm:text-sm font-bold transition-all shrink-0 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Klaim Tautan</span>
                  <ArrowRight className="size-4 text-[#cc785c]" />
                </motion.button>
              </form>

              {/* Clean Benefit Items */}
              <div className="flex items-center gap-3 sm:gap-4 mt-3.5 text-xs text-[#706c64] flex-wrap font-medium">
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
          </div>

          {/* Right Column: Clean Editorial Storefront Card & WhatsApp Preview (5 cols, No Faux-Phone Mockup) */}
          <div className="lg:col-span-5 flex flex-col gap-4 w-full max-w-md mx-auto">
            {/* Clean Storefront Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-3xl bg-white border border-[#e6dfd8] shadow-sm flex flex-col gap-4 text-left"
            >
              {/* Profile Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#f0ece5]">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-[#cc785c] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                    KS
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#141413]">Kedai Kopi Senja</h3>
                    <span className="text-xs font-mono text-[#8c867b]">tautan.site/senja</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#faf9f5] border border-[#e6dfd8] text-[10px] font-semibold text-[#706c64]">
                  Etalase Belanja
                </span>
              </div>

              {/* Product Rows */}
              <div className="flex flex-col gap-2.5">
                {DEMO_PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#faf9f5] border-[#cc785c] ring-1 ring-[#cc785c]/30 shadow-2xs'
                          : 'bg-white border-[#e6dfd8] hover:border-[#cc785c]/40'
                      }`}
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="size-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-[#141413] block truncate">
                          {prod.name}
                        </span>
                        <span className="font-mono text-xs font-extrabold text-[#cc785c] block">
                          {formatIDR(prod.price)}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#cc785c] text-white'
                            : 'bg-white text-[#706c64] border border-[#e6dfd8]'
                        }`}
                      >
                        {isSelected ? 'Dipilih' : '+ Pilih'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Variant Chips */}
              <div className="p-3 rounded-2xl bg-[#faf9f5] border border-[#e6dfd8] flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#706c64]">Varian {selectedProduct.name}:</span>
                <div className="flex items-center gap-1.5">
                  {selectedProduct.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedVariant === v
                          ? 'bg-[#141413] text-white shadow-2xs'
                          : 'bg-white text-[#706c64] border border-[#e6dfd8] hover:text-[#141413]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Simulation Bar */}
              <div className="p-3 rounded-2xl bg-[#141413] text-white flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-white/60 block leading-none">Simulasi Pesanan</span>
                  <span className="font-mono text-xs font-bold text-white block mt-0.5">
                    {formatIDR(selectedProduct.price)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Pesan via WhatsApp</span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </motion.div>

            {/* Clean WhatsApp Format Message Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 rounded-2xl bg-[#d9fdd3] border border-[#b4e6ad] text-[#111b21] shadow-md text-left"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#b4e6ad]/60">
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-[#25D366]" />
                  <span className="text-xs font-bold text-[#128C7E]">Format Order di WhatsApp Penjual</span>
                </div>
                <span className="text-[10px] font-mono text-[#667781]">Otomatis</span>
              </div>

              <p className="text-xs text-[#111b21] leading-relaxed font-sans">
                Halo <strong>Kedai Kopi Senja</strong>, saya mau pesan:
                <br />• 1x {selectedProduct.name} ({selectedVariant})
                <br />• Total: <strong>{formatIDR(selectedProduct.price)}</strong>
                <br /><span className="text-[11px] text-[#4a5568]">📍 Kirim: Jl. Senopati No. 12, Jakarta</span>
              </p>

              <div className="flex items-center justify-between text-[10px] text-[#667781] mt-2 pt-2 border-t border-[#b4e6ad]/40 font-mono">
                <span>Siap diproses penjual</span>
                <span className="text-[#53bdeb] font-bold">✓✓ Terkirim</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. BENTO GRID FEATURES (Inspired by Linktree & Modern Clean UI) */}
      {/* ==================================================================== */}
      <section id="features" className="border-t border-[#e6dfd8] bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
              Fitur Lengkap
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141413] mt-2 leading-tight">
              Semua yang kamu butuhkan untuk berjualan di media sosial.
            </h2>
            <p className="text-sm sm:text-base text-[#5c5850] mt-3">
              Dirancang dengan prinsip kesederhanaan: tanpa biaya tersembunyi, tanpa instalasi rumit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Bento Card 1: Etalase & Varian (Large - 8 cols) */}
            <div className="md:col-span-8 p-8 sm:p-10 rounded-3xl bg-[#faf9f5] border border-[#e6dfd8] flex flex-col justify-between shadow-2xs group hover:border-[#cc785c]/40 transition-colors">
              <div>
                <span className="text-xs font-bold text-[#cc785c] uppercase tracking-wider font-mono">
                  Katalog Interaktif
                </span>
                <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#141413] mt-2 mb-3">
                  Pajang Produk dengan Foto Jernih & Varian Lengkap
                </h3>
                <p className="text-sm text-[#5c5850] leading-relaxed max-w-xl">
                  Unggah foto produk yang otomatis dioptimalkan ke format WebP ringan. Tambahkan pilihan ukuran, rasa, atau warna dengan perhitungan harga otomatis yang transparan bagi pembeli.
                </p>
              </div>

              {/* Visual Demo Card Row */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-white border border-[#e6dfd8] flex items-center gap-3 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80"
                    alt="Kopi"
                    className="size-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#141413] block">Kopi Susu Aren</span>
                    <span className="text-xs font-mono font-bold text-[#cc785c]">Rp 22.000</span>
                    <span className="text-[10px] text-[#8c867b] block">Varian: Dingin / Hangat</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#e6dfd8] flex items-center gap-3 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&auto=format&fit=crop&q=80"
                    alt="Pastry"
                    className="size-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#141413] block">Artisan Croissant</span>
                    <span className="text-xs font-mono font-bold text-[#cc785c]">Rp 18.000</span>
                    <span className="text-[10px] text-[#8c867b] block">Varian: Original / Cokelat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: 0% Komisi (4 cols) */}
            <div className="md:col-span-4 p-8 sm:p-10 rounded-3xl bg-[#141413] text-white border border-neutral-800 flex flex-col justify-between shadow-md">
              <div>
                <span className="text-xs font-mono font-bold text-[#cc785c] uppercase tracking-wider">
                  Tanpa Potongan
                </span>
                <div className="font-sans text-5xl sm:text-6xl font-extrabold text-white mt-3 mb-2 tracking-tight">
                  0%
                </div>
                <h3 className="font-sans text-xl font-bold text-white mb-2">
                  Bebas Biaya Platform
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Uang penjualan langsung ditransfer ke rekening bank atau QRIS Anda. Tidak ada potongan komisi per transaksi sepeserpun.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800 text-xs font-mono text-[#cc785c] font-semibold">
                100% Keuntungan Milik Anda
              </div>
            </div>

            {/* Bento Card 3: Checkout WhatsApp (6 cols) */}
            <div className="md:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#faf9f5] border border-[#e6dfd8] flex flex-col justify-between shadow-2xs hover:border-[#cc785c]/40 transition-colors">
              <div>
                <span className="text-xs font-bold text-[#cc785c] uppercase tracking-wider font-mono">
                  Alur Kilat
                </span>
                <h3 className="font-sans text-2xl font-extrabold text-[#141413] mt-2 mb-3">
                  Checkout Langsung ke WhatsApp
                </h3>
                <p className="text-sm text-[#5c5850] leading-relaxed">
                  Pembeli tidak perlu mendaftar akun atau mengingat kata sandi. Cukup pilih produk, isi alamat, dan rincian pesanan langsung tersusun rapi di WhatsApp.
                </p>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-white border border-[#e6dfd8] text-xs font-mono text-[#5c5850]">
                "Halo Kak, saya mau pesan 1x Kopi Susu Aren..."
              </div>
            </div>

            {/* Bento Card 4: All-in-One Link Bio (6 cols) */}
            <div className="md:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#faf9f5] border border-[#e6dfd8] flex flex-col justify-between shadow-2xs hover:border-[#cc785c]/40 transition-colors">
              <div>
                <span className="text-xs font-bold text-[#cc785c] uppercase tracking-wider font-mono">
                  Satu Alamat Web
                </span>
                <h3 className="font-sans text-2xl font-extrabold text-[#141413] mt-2 mb-3">
                  Satukan Semua Tautan Bisnismu
                </h3>
                <p className="text-sm text-[#5c5850] leading-relaxed">
                  Sematkan tautan Instagram, TikTok, alamat Google Maps toko fisik, hingga marketplace dalam satu profil elegan yang mudah diingat pembeli.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#8c867b]">
                <span>tautan.site/namatokomu</span>
                <span className="text-[#cc785c] font-bold">Siap Disematkan di Bio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. 3-STEP WORKFLOW (Frictionless Onboarding) */}
      {/* ==================================================================== */}
      <section id="how" className="border-t border-[#e6dfd8] bg-[#faf9f5] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
              Cara Kerja
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141413] mt-2">
              Mulai berjualan dalam 3 langkah ringkas.
            </h2>
            <p className="text-sm text-[#5c5850] mt-2">
              Tanpa perlu keahlian teknis coding atau setup server yang membingungkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Klaim Tautan Tokomu',
                desc: 'Tentukan nama tokomu dan dapatkan link unik tautan.site/namamu dalam waktu kurang dari 30 detik.',
              },
              {
                num: '02',
                title: 'Pajang Produk & Varian',
                desc: 'Upload foto produk favorit, tentukan harga, dan atur pilihan varian agar pembeli bisa memilih mandiri.',
              },
              {
                num: '03',
                title: 'Pasang di Bio Medsos',
                desc: 'Sematkan tautan di bio Instagram & TikTok. Duduk santai dan terima notifikasi pesanan rapi di WhatsApp.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="p-7 rounded-3xl bg-white border border-[#e6dfd8] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-4xl font-extrabold text-[#cc785c]">
                    {step.num}
                  </span>
                  <h3 className="font-sans text-lg font-bold text-[#141413] mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. PERTANYAAN UMUM / FAQ (#faq) */}
      {/* ==================================================================== */}
      <section id="faq" className="border-t border-[#e6dfd8] bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
              FAQ
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141413] mt-2">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-sm text-[#5c5850] mt-2">
              Informasi lengkap seputar cara kerja, privasi transaksi, dan pengaturan toko.
            </p>
          </div>

          <div className="divide-y divide-[#e6dfd8] border-y border-[#e6dfd8]">
            {faqItems.map((item, idx) => (
              <div key={idx} className="py-5">
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
                      <p className="text-xs sm:text-sm text-[#5c5850] pt-3 leading-relaxed pr-6">
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
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-6xl mx-auto w-full">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#141413] text-white border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Mulai buat etalase tokomu hari ini.
            </h2>
            <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
              Daftar gratis dalam 30 detik. 0% komisi platform. Ubah pengunjung profil media sosialmu menjadi pembeli pasti.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="px-7 py-4 rounded-full bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Buka Toko Gratis Sekarang</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. MINIMALIST FOOTER */}
      {/* ==================================================================== */}
      <footer className="border-t border-[#e6dfd8] bg-white py-8 px-4 sm:px-6 text-[#5c5850] text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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

        <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#8c867b]">
          <span>© 2026 tautan.site. Didedikasikan untuk pelaku usaha mandiri & kreator Indonesia.</span>
          <span className="font-medium text-[#141413]">0% Potongan Komisi</span>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
