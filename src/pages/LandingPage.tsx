import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  Check,
  ShoppingBag,
  MessageCircle,
  ChevronDown,
  Layers,
  SendHorizontal,
  ArrowRight,
  Wifi,
  Battery,
  Sparkles,
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { formatIDR } from '@/lib/utils'

interface DemoProduct {
  id: string
  name: string
  category: 'beverage' | 'food' | 'fashion'
  price: number
  variantOptions: string[]
  image: string
  description: string
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'kopi-senja',
    name: 'Kopi Susu Aren 250ml',
    category: 'beverage',
    price: 22000,
    variantOptions: ['Dingin', 'Hangat'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
    description: 'Espresso ganda, susu segar, dan gula aren organik',
  },
  {
    id: 'croissant',
    name: 'Artisan Butter Croissant',
    category: 'food',
    price: 18000,
    variantOptions: ['Original', 'Cokelat'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80',
    description: 'Renyah berlapis mentega Prancis dengan aroma harum',
  },
  {
    id: 'totebag',
    name: 'Totebag Kanvas Etnik',
    category: 'fashion',
    price: 85000,
    variantOptions: ['Natural Cream', 'Midnight Black'],
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
    description: 'Kanvas tebal premium dengan aksen tenun ikat',
  },
]

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [claimSlug, setClaimSlug] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'beverage' | 'food' | 'fashion'>('all')

  // Interactive Live Phone Simulation State
  const [selectedDemoProduct, setSelectedDemoProduct] = useState<DemoProduct>(DEMO_PRODUCTS[0])
  const [selectedVariant, setSelectedVariant] = useState<string>(DEMO_PRODUCTS[0].variantOptions[0])

  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuthStore()

  const handleSelectProduct = (product: DemoProduct) => {
    setSelectedDemoProduct(product)
    setSelectedVariant(product.variantOptions[0])
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

  const filteredCatalog = DEMO_PRODUCTS.filter(
    (p) => catalogFilter === 'all' || p.category === catalogFilter
  )

  const faqItems = [
    {
      q: 'Bagaimana tautan.site meningkatkan konversi jualan saya?',
      a: 'tautan.site menggabungkan tautan profil media sosial (link bio) dengan etalase produk interaktif. Calon pembeli dapat melihat foto produk, memilih varian secara mandiri, dan mengisi alamat pengiriman dalam satu halaman cepat. Ketika tombol checkout ditekan, seluruh rincian pesanan langsung tersusun rapi ke pesan WhatsApp Anda tanpa pembeli perlu mengetik manual.',
    },
    {
      q: 'Apakah ada potongan komisi dari setiap transaksi penjualan?',
      a: 'Sama sekali tidak ada potongan komisi (0% platform fee). Pembeli membayar langsung ke rekening bank atau QRIS pribadi yang Anda cantumkan.',
    },
    {
      q: 'Apakah pembeli perlu mengunduh aplikasi atau membuat akun?',
      a: 'Tidak perlu. Etalase terbuka secara instan di browser ponsel pembeli dalam hitungan detik dengan beban data yang sangat ringan.',
    },
    {
      q: 'Bagaimana cara penjual mengelola pesanan yang masuk?',
      a: 'Setiap pesanan otomatis tercatat di Dashboard toko Anda. Di sana, Anda dapat memantau status pesanan, memperbarui ongkos kirim, dan memasukkan nomor resi ekspedisi.',
    },
    {
      q: 'Apakah saya bisa mengganti foto dan varian produk sewaktu-waktu?',
      a: 'Tentu. Anda dapat menambah produk baru, mengunggah foto berformat WebP secara otomatis, mengubah harga dasar, dan mengatur opsi varian kapan saja.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#141413] flex flex-col justify-between selection:bg-[#cc785c]/20 selection:text-[#141413] overflow-x-hidden font-sans">
      {/* ==================================================================== */}
      {/* 1. HERO SECTION: INTERACTIVE DUAL SIMULATION */}
      {/* ==================================================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Headlines, Trust Value, & Domain Claim Input (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Elegant Tagline Pill (No dot pill) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8e2d9] shadow-2xs text-xs font-semibold text-[#8c4e38] mb-5"
            >
              <Sparkles className="size-3.5 text-[#cc785c]" />
              <span>Etalase Mikro & Checkout WhatsApp untuk Penjual Medsos</span>
            </motion.div>

            {/* Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.12]"
            >
              Ubah Pengunjung Media Sosial <br className="hidden sm:inline" />
              Menjadi <span className="text-[#cc785c]">Pembeli Pasti.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-base sm:text-lg text-[#5c5850] max-w-xl leading-relaxed font-normal"
            >
              Tampilkan katalog produk, kelola varian, dan terima pesanan terstruktur langsung ke WhatsApp tanpa potongan komisi sepeserpun.
            </motion.p>

            {/* Live Domain Claim Engine */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 w-full max-w-md"
            >
              <form
                onSubmit={handleClaimSubmit}
                className="p-1.5 rounded-2xl sm:rounded-full border border-[#e8e2d9] bg-white shadow-xs flex flex-col sm:flex-row items-center gap-2 focus-within:border-[#cc785c] focus-within:ring-2 focus-within:ring-[#cc785c]/20 transition-all hover:border-[#cc785c]/60"
              >
                <div className="flex items-center w-full sm:w-auto flex-1 pl-3.5 pr-2 py-1">
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
                  className="w-full sm:w-auto px-5 h-10 rounded-xl sm:rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold transition-all shrink-0 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Klaim Toko</span>
                  <ArrowRight className="size-3.5 text-[#cc785c]" />
                </motion.button>
              </form>

              {/* Trust Indicators */}
              <div className="flex items-center gap-3 sm:gap-4 mt-3.5 text-xs text-[#706c64] flex-wrap font-medium">
                <span className="flex items-center gap-1">
                  <Check className="size-3.5 text-emerald-600" />
                  0% Potongan Komisi
                </span>
                <span className="text-neutral-300">•</span>
                <span className="flex items-center gap-1">
                  <Check className="size-3.5 text-emerald-600" />
                  Siap dalam 30 Detik
                </span>
                <span className="text-neutral-300">•</span>
                <span className="flex items-center gap-1">
                  <Check className="size-3.5 text-emerald-600" />
                  Tanpa Kartu Kredit
                </span>
              </div>
            </motion.div>

            {/* Quick Demo Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex items-center gap-3"
            >
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-3 rounded-full bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>Buka Toko Gratis Sekarang</span>
                <ArrowRight className="size-4" />
              </button>
              <Link
                to="/batik-nusantara"
                className="px-5 py-3 rounded-full bg-white hover:bg-[#f5f1eb] border border-[#e8e2d9] text-[#141413] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Buka Demo Toko
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Interactive Smartphone + Dynamic WhatsApp Order Simulation (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[320px] sm:max-w-[340px]">
              {/* Smartphone Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-[40px] border-[6px] border-[#181715] bg-white shadow-xl overflow-hidden relative"
              >
                {/* Status Bar */}
                <div className="pt-2 pb-1.5 bg-white flex items-center justify-between px-5 text-[10px] text-[#141413] font-medium select-none border-b border-neutral-100">
                  <span>09:41</span>
                  <div className="w-16 h-3.5 bg-[#181715] rounded-full" />
                  <div className="flex items-center gap-1 text-[#141413]">
                    <Wifi className="size-3" />
                    <Battery className="size-3" />
                  </div>
                </div>

                {/* Smartphone Content: Buyer View */}
                <div className="p-3.5 flex flex-col gap-3 bg-[#faf9f6]">
                  {/* Store Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#e8e2d9]">
                    <div>
                      <div className="text-xs font-extrabold text-[#141413]">Kedai Senja</div>
                      <div className="text-[10px] font-mono text-[#8c867b]">tautan.site/senja</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-[#faf0ea] text-[#cc785c] text-[10px] font-bold">
                      Katalog Aktif
                    </span>
                  </div>

                  {/* Product Cards in Mobile View */}
                  <div className="flex flex-col gap-2">
                    {DEMO_PRODUCTS.slice(0, 2).map((item) => {
                      const isSelected = selectedDemoProduct.id === item.id
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectProduct(item)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-white border-[#cc785c] ring-1 ring-[#cc785c]/30 shadow-2xs'
                              : 'bg-white/80 border-[#e8e2d9] hover:border-[#cc785c]/50'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-xs text-[#141413] block truncate">
                              {item.name}
                            </span>
                            <span className="font-mono text-xs font-extrabold text-[#cc785c] block">
                              {formatIDR(item.price)}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#cc785c] text-white'
                                : 'bg-[#faf9f6] text-[#706c64] border border-[#e8e2d9]'
                            }`}
                          >
                            {isSelected ? 'Dipilih' : '+ Pilih'}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Interactive Variant Picker Box */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#e8e2d9] text-left">
                    <span className="text-[10px] text-[#706c64] font-semibold block mb-1.5">
                      Pilih Varian untuk {selectedDemoProduct.name}:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {selectedDemoProduct.variantOptions.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                            selectedVariant === v
                              ? 'bg-[#141413] text-white shadow-2xs'
                              : 'bg-[#faf9f6] text-[#706c64] border border-[#e8e2d9] hover:text-[#141413]'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Mobile Checkout Action Bar */}
                  <div className="p-2.5 rounded-xl bg-[#141413] text-white flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-[9px] text-white/60 block leading-none">Total Pesanan</span>
                      <span className="font-mono text-xs font-bold text-white block mt-0.5">
                        {formatIDR(selectedDemoProduct.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#cc785c] hover:bg-[#b8674d] text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Checkout WA</span>
                      <ArrowRight className="size-2.5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Dynamic Responsive WhatsApp Message Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[290px] sm:max-w-[310px] absolute -bottom-6 -left-4 sm:-left-8 p-3.5 rounded-2xl bg-[#d9fdd3] border border-[#b4e6ad] text-[#111b21] shadow-xl text-left z-20"
              >
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#b4e6ad]/60">
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="size-3.5 text-[#25D366]" />
                    <span className="text-[10px] font-bold text-[#128C7E]">Format Order di WhatsApp Penjual</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#667781]">Otomatis</span>
                </div>

                <p className="text-[11px] text-[#111b21] leading-relaxed font-sans">
                  Halo <strong>Kedai Senja</strong>, saya mau pesan:
                  <br />• 1x {selectedDemoProduct.name} ({selectedVariant})
                  <br />• Total: <strong>{formatIDR(selectedDemoProduct.price)}</strong>
                  <br /><span className="text-[10px] text-[#4a5568]">📍 Kirim: Jl. Senopati No. 12, Jakarta</span>
                </p>

                <div className="flex items-center justify-between text-[9px] text-[#667781] mt-1 pt-1 border-t border-[#b4e6ad]/40 font-mono">
                  <span>Siap proses transaksi</span>
                  <span className="text-[#53bdeb] font-bold">✓✓ Terkirim</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. VALUE COMPARISON: MANUAL CHAT VS TAUTAN.SITE */}
      {/* ==================================================================== */}
      <section id="advantages" className="border-t border-[#e8e2d9] bg-[#f5f2eb]/60 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
              Efisiensi Transaksi
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141413] mt-2">
              Tinggalkan Format Chat Manual yang Melelahkan.
            </h2>
            <p className="text-sm text-[#5c5850] mt-3 leading-relaxed">
              Bandingkan repotnya melayani pertanyaan berulang vs kecepatan checkout terstruktur bersama tautan.site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Cara Manual Lama */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#e8e2d9] shadow-2xs flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold inline-block">
                  Sebelumnya: Chat Manual
                </span>
                <h3 className="font-sans text-xl font-bold text-[#141413] mt-4 mb-3">
                  Waktu habis membalas tanya harga & rekap format
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-[#5c5850]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Pertanyaan harga, stok, dan pilihan varian dijawab berulang-ulang setiap hari.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Format nama dan alamat sering tidak lengkap sehingga menghambat ekspedisi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>Calon pembeli kabur karena lama menunggu balasan saat toko sedang ramai.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-[#e8e2d9]/60 text-xs font-mono text-[#8c867b]">
                Konversi rendah karena proses transaksi berbelit.
              </div>
            </div>

            {/* Dengan tautan.site */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#141413] text-white border border-neutral-800 shadow-lg flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#cc785c]/20 text-[#cc785c] text-xs font-bold inline-block">
                  Dengan tautan.site
                </span>
                <h3 className="font-sans text-xl font-bold text-white mt-4 mb-3">
                  Etalase 1 tautan, pesanan tersusun rapi otomatis
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#cc785c] font-bold">✓</span>
                    <span>Katalog bersih dengan foto jernih, harga jelas, dan varian yang dipilih sendiri oleh pembeli.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#cc785c] font-bold">✓</span>
                    <span>Alamat dan nomor HP pembeli langsung terinput sebelum checkout ditekan.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#cc785c] font-bold">✓</span>
                    <span>Rincian pesanan langsung tersaji di WhatsApp penjual, siap kirim dan terima transfer.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800 text-xs font-mono text-[#cc785c] font-medium flex items-center justify-between">
                <span>0% Biaya Potongan Komisi</span>
                <span>Checkout 10 Detik</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. INTERACTIVE PRODUCT CATALOG DEMO (#catalog) */}
      {/* ==================================================================== */}
      <section id="catalog" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
              Katalog Toko
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141413] mt-1.5">
              Etalase Bersih, Belanja Cepat.
            </h2>
            <p className="text-sm text-[#5c5850] mt-1">
              Inilah tampilan yang dinikmati pembeli Anda di smartphone mereka.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#e8e2d9] shadow-2xs self-start sm:self-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Menu' },
              { id: 'beverage', label: 'Minuman' },
              { id: 'food', label: 'Makanan' },
              { id: 'fashion', label: 'Fashion' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCatalogFilter(tab.id as 'all' | 'beverage' | 'food' | 'fashion')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  catalogFilter === tab.id
                    ? 'bg-[#141413] text-white shadow-2xs'
                    : 'text-[#706c64] hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {filteredCatalog.map((item) => {
            const isSelected = selectedDemoProduct.id === item.id
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                onClick={() => handleSelectProduct(item)}
                className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#cc785c] ring-2 ring-[#cc785c]/20 shadow-md'
                    : 'border-[#e8e2d9] hover:border-[#cc785c]/40 shadow-2xs'
                }`}
              >
                <div>
                  <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-[#faf9f6] mb-3.5 border border-[#e8e2d9]/60">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-sans text-base font-bold text-[#141413]">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#706c64] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e8e2d9]/60 flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold text-[#141413]">
                    {formatIDR(item.price)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#cc785c] text-white'
                        : 'bg-[#faf9f6] text-[#141413] border border-[#e8e2d9]'
                    }`}
                  >
                    {isSelected ? 'Terpilih' : '+ Coba Beli'}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Live Simulation Feedback Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-[#141413] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <span className="text-white/60">Simulasi:</span>
            <span className="font-bold text-white">
              {selectedDemoProduct.name} ({selectedVariant}) • {formatIDR(selectedDemoProduct.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Buka Tokomu Gratis Sekarang</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. FITUR UTAMA & KEUNGGULAN (#features) */}
      {/* ==================================================================== */}
      <section id="features" className="border-t border-[#e8e2d9] bg-[#f5f2eb]/40 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
              Fitur Lengkap
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141413] mt-2">
              Didesain Khusus untuk Perdagangan Medsos Indonesia.
            </h2>
            <p className="text-sm text-[#5c5850] mt-2">
              Semua kemudahan transaksi toko online modern tanpa kerumitan administrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="size-11 rounded-xl bg-[#faf0ea] border border-[#f0ded3] flex items-center justify-center text-[#cc785c] mb-5">
                  <Layers className="size-5" />
                </div>
                <h3 className="font-sans text-lg font-bold text-[#141413]">
                  All-in-One Link Bio
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5850] mt-2.5 leading-relaxed">
                  Satukan profil Instagram, TikTok, alamat Google Maps, dan etalase belanja dalam 1 tautan ringkas yang mudah disematkan di bio.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#e8e2d9]/60 text-xs font-semibold text-[#cc785c]">
                ✦ Gantikan bio-link pasif
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="size-11 rounded-xl bg-[#faf0ea] border border-[#f0ded3] flex items-center justify-center text-[#cc785c] mb-5">
                  <ShoppingBag className="size-5" />
                </div>
                <h3 className="font-sans text-lg font-bold text-[#141413]">
                  Katalog & Multi Varian
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5850] mt-2.5 leading-relaxed">
                  Upload foto produk dengan kompresi WebP otomatis. Atur opsi varian ukuran, rasa, atau warna dengan kalkulasi harga seketika.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#e8e2d9]/60 text-xs font-semibold text-[#cc785c]">
                ✦ Ringan & hemat kuota pembeli
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="size-11 rounded-xl bg-[#faf0ea] border border-[#f0ded3] flex items-center justify-center text-[#cc785c] mb-5">
                  <SendHorizontal className="size-5" />
                </div>
                <h3 className="font-sans text-lg font-bold text-[#141413]">
                  Checkout Cepat ke WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5850] mt-2.5 leading-relaxed">
                  Tanpa perlu login yang merepotkan pembeli. Nama, produk pilihan, dan alamat pengiriman langsung terkirim rapi ke WhatsApp Anda.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#e8e2d9]/60 text-xs font-semibold text-[#cc785c]">
                ✦ Format pesan siap kirim
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. ROADMAP: 3 LANGKAH RINGKAS (#how) */}
      {/* ==================================================================== */}
      <section id="how" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-5xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
            Alur Kerja
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141413] mt-2">
            Mulai Berjualan dalam Tiga Langkah Ringkas.
          </h2>
          <p className="text-sm text-[#5c5850] mt-2">
            Siap pakai tanpa memerlukan keahlian teknis coding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Klaim Tautan Toko',
              desc: 'Daftarkan nama tokomu dalam 30 detik. Dapatkan alamat web ringkas tautan.site/namatokomu.',
            },
            {
              step: '02',
              title: 'Upload Produk & Varian',
              desc: 'Pajang foto barang terbaikmu, tentukan harga, dan atur pilihan varian dengan mudah.',
            },
            {
              step: '03',
              title: 'Pasang di Bio & Terima Order',
              desc: 'Sematkan di profil Instagram & TikTok. Terima rekapan pesanan rapi di WhatsApp Anda.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-3xl font-extrabold text-[#cc785c]">
                  {item.step}
                </span>
                <h3 className="font-sans text-lg font-bold text-[#141413] mt-3">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5c5850] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. PERTANYAAN UMUM (#faq) */}
      {/* ==================================================================== */}
      <section id="faq" className="border-t border-[#e8e2d9] bg-[#f5f2eb]/50 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-bold">
              FAQ
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141413] mt-2">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="divide-y divide-[#e8e2d9] border-y border-[#e8e2d9] bg-white rounded-2xl shadow-2xs px-5 sm:px-8">
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
      {/* 7. PRE-FOOTER CONVERSION CARD */}
      {/* ==================================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#141413] text-white border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-lg">
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Mulai buat etalase tokomu hari ini.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              Daftar gratis dalam 30 detik. 0% potongan komisi transaksi. Langsung terhubung ke WhatsApp bisnis Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="px-6 py-3.5 rounded-full bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <span>Buka Toko Gratis</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 8. FOOTER */}
      {/* ==================================================================== */}
      <footer className="border-t border-[#e8e2d9] bg-white py-8 px-4 sm:px-6 text-[#5c5850] text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-sans text-base font-extrabold text-[#141413]">tautan.site</span>
            <span className="text-neutral-300">|</span>
            <span className="text-xs text-[#706c64]">Platform Etalase Mikro & Checkout WhatsApp</span>
          </div>
          <div className="flex items-center gap-5 text-xs font-semibold">
            <a href="#advantages" className="hover:text-[#141413] transition-colors">Keunggulan</a>
            <a href="#catalog" className="hover:text-[#141413] transition-colors">Katalog</a>
            <a href="#how" className="hover:text-[#141413] transition-colors">Alur</a>
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
          <span>© 2026 tautan.site. Didesain untuk pedagang mandiri & UMKM Indonesia.</span>
          <span className="font-medium text-[#141413]">0% Biaya Platform</span>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
