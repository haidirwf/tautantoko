import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Search,
  Zap,
  MessageCircle,
  Percent,
  Smartphone,
  ShoppingBag,
  Coffee,
  Package,
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
  const [claimSlug, setClaimSlug] = useState('')
  const [heroVariant, setHeroVariant] = useState<'dingin' | 'hangat'>('dingin')
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'minuman' | 'pastry'>('all')
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(1)

  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleOpenAuth = (mode: 'signup' | 'login', slug = '') => {
    if (isAuthenticated) {
      navigate('/dashboard')
      return
    }
    setAuthMode(mode)
    if (slug) {
      setClaimSlug(slug)
    }
    setIsAuthOpen(true)
  }

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = claimSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (!clean) return
    handleOpenAuth('signup', clean)
  }

  const catalogDemoProducts = [
    {
      id: 1,
      name: 'Kopi Susu Aren',
      category: 'minuman',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      desc: 'Espresso ganda, susu segar, gula aren alami',
    },
    {
      id: 2,
      name: 'Cold Brew Bottle',
      category: 'minuman',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      desc: 'Seduh dingin 16 jam, aroma manis floral',
    },
    {
      id: 3,
      name: 'Artisan Croissant',
      category: 'pastry',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      desc: 'Renyah di luar, lembut berlapis mentega',
    },
  ]

  const filteredCatalogProducts = catalogDemoProducts.filter(
    (p) => catalogFilter === 'all' || p.category === catalogFilter
  )

  const selectedCatalogItem = catalogDemoProducts.find((p) => p.id === selectedCatalogId)

  return (
    <div className="min-h-screen bg-white text-[#111111] selection:bg-[#D2F801] selection:text-black">
      {/* ==================================================================== */}
      {/* SECTION 1: HERO BANNER (Electric Lime, widened container) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="bg-[#D2F801] text-[#111111] rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Headline, Copy & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.08]">
                Invest for <span className="inline-block relative">✦</span> <br />
                the Future
              </h1>

              <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-[#111111]/85 max-w-lg leading-relaxed font-normal">
                Tampilkan etalase produk, kelola pesanan terstruktur, dan terima checkout langsung ke WhatsApp pembeli tanpa potongan komisi.
              </p>

              {/* CTA & Playful Doodle Arrow */}
              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-7 py-4 rounded-full bg-[#111111] hover:bg-black text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer group"
                >
                  <ShoppingBag className="size-4 text-[#D2F801]" />
                  <span>Buka Toko Gratis</span>
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('advantages')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#111111]/80 hover:text-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Pelajari Selengkapnya</span>
                  <span className="text-xs">↓</span>
                </button>

                {/* Hand-drawn organic doodle arrow pointing to mockups (desktop only) */}
                <div className="hidden lg:block absolute left-[260px] -bottom-10 pointer-events-none w-36 h-24">
                  <svg
                    viewBox="0 0 140 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-[#111111]"
                  >
                    <path
                      d="M 10 50 C 40 85, 90 80, 125 35"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 112 32 L 126 34 L 128 48"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Overlapping Mobile Mockups (Front Light + Back Dark) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative flex items-center justify-center lg:justify-end min-h-[420px] sm:min-h-[480px] w-full"
            >
              {/* Back Mockup: Dark Phone (Receipt / Incoming WhatsApp Order) */}
              <div className="absolute right-0 sm:right-2 top-0 sm:top-2 w-[220px] sm:w-[260px] bg-[#111111] text-white rounded-[28px] sm:rounded-[36px] p-4 sm:p-5 shadow-2xl border border-white/10 z-10 transform translate-x-2 sm:translate-x-4 -rotate-1 select-none">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-mono text-white/50 block">Pesanan Masuk</span>
                    <span className="text-xs font-mono font-bold text-white">#ORD-1042</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#D2F801]">+Rp 74.000</span>
                </div>

                {/* Mini Candlestick / Activity Chart */}
                <div className="mt-3 bg-white/5 rounded-xl p-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-2">
                    <span>Omzet Hari Ini</span>
                    <span className="text-[#D2F801] font-bold">+28.4%</span>
                  </div>
                  <div className="h-10 flex items-end gap-1.5 justify-between px-1">
                    {[35, 55, 40, 75, 60, 95, 80, 100].map((h, i) => (
                      <div
                        key={i}
                        className={`w-full rounded-t-sm ${
                          i === 7 ? 'bg-[#D2F801]' : 'bg-white/20'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-white/80">
                    <span>2x Kopi Susu Aren</span>
                    <span className="font-mono">44.000</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>1x Artisan Croissant</span>
                    <span className="font-mono">18.000</span>
                  </div>
                  <div className="flex justify-between text-white/50 pt-1 border-t border-white/10">
                    <span>Biaya Layanan</span>
                    <span className="font-mono text-[#D2F801]">Rp 0 (0%)</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAuth('signup')}
                    className="flex-1 py-1.5 rounded-lg bg-[#D2F801] text-black text-center font-bold text-[11px] cursor-pointer"
                  >
                    Buka WhatsApp
                  </button>
                </div>
              </div>

              {/* Front Mockup: White Phone (Clean Storefront & Catalog) */}
              <div className="relative w-[230px] sm:w-[270px] bg-white text-[#111111] rounded-[28px] sm:rounded-[36px] p-4 sm:p-5 shadow-2xl border border-neutral-100 z-20 transform -translate-x-6 sm:-translate-x-12 translate-y-6 sm:translate-y-8 select-none">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111111]">Kedai Kopi Senja</h3>
                    <p className="text-[10px] font-mono text-neutral-500">tautan.site/senja</p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                    Katalog
                  </span>
                </div>

                {/* Search Bar */}
                <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-400">
                  <Search className="size-3 text-neutral-400" />
                  <span className="text-[11px]">Cari menu favorit...</span>
                </div>

                {/* Banner Promo */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#111111] text-white">
                  <div className="text-[10px] font-mono text-[#D2F801]">Promo Spesial</div>
                  <div className="text-xs font-bold mt-0.5">Kopi Susu + Croissant</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-mono font-bold text-white">Rp 36.000</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white">Hemat 20%</span>
                  </div>
                </div>

                {/* Product Item with Variant Toggle */}
                <div className="mt-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">Kopi Susu Aren</div>
                      <div className="text-[10px] text-neutral-500">Espresso & aren alami</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-900">22k</span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setHeroVariant('dingin')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          heroVariant === 'dingin'
                            ? 'bg-black text-white'
                            : 'bg-white text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        Dingin
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroVariant('hangat')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                          heroVariant === 'hangat'
                            ? 'bg-black text-white'
                            : 'bg-white text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        Hangat
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAuth('signup')}
                      className="px-2.5 py-1 rounded-lg bg-[#D2F801] text-black text-[10px] font-bold flex items-center gap-1 hover:bg-[#bde300] transition-colors cursor-pointer"
                    >
                      <span>+ Pesan</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 2: "Get the Most Out of Your Investments" (Feature Cards) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.12]">
            Get the Most Out <br />
            of Your Medsos Store
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600">
            Kombinasi etalase modern dan checkout otomatis WhatsApp untuk konversi penjualan maksimal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Unlimited Portfolio Accounts -> Katalog & Varian Tanpa Batas */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-12 rounded-[32px] bg-[#F5F6F8] border border-[#E9EBEF] flex flex-col justify-between min-h-[320px] sm:min-h-[380px] relative overflow-hidden group"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Katalog & Varian Tanpa Batas
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed">
                Pajang seluruh lini produkmu dengan foto jernih, pilihan varian (panas/dingin, ukuran, topping), dan status stok real-time.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-neutral-700 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>Pelajari Lebih Lanjut</span>
                <ArrowRight className="size-4" />
              </button>

              {/* Decorative Geometric Blob Graphic (Lime + Black Pill matching UIref.webp) */}
              <div className="relative w-28 h-28 pointer-events-none select-none">
                <div className="absolute right-0 bottom-0 w-24 h-24 rounded-tl-full rounded-br-2xl bg-[#D2F801] transform rotate-12 transition-transform group-hover:scale-105" />
                <div className="absolute right-10 bottom-0 w-10 h-16 rounded-full bg-[#111111] transform -rotate-12 transition-transform group-hover:-translate-y-1" />
                <svg
                  viewBox="0 0 60 60"
                  fill="none"
                  className="absolute right-4 bottom-4 w-12 h-12 text-[#111111]"
                >
                  <path
                    d="M 10 30 C 25 10, 45 45, 20 50 C 5 52, 10 20, 40 25"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Full Analytics in Your App -> Checkout WhatsApp & Analisis */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-12 rounded-[32px] bg-[#F5F6F8] border border-[#E9EBEF] flex flex-col justify-between min-h-[320px] sm:min-h-[380px] relative overflow-hidden group"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Rekap & Analisis Otomatis
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed">
                Pantau pesanan yang masuk, total omzet harian, dan produk paling laris secara transparan tanpa rumus spreadsheet manual.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-neutral-700 transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>Pelajari Lebih Lanjut</span>
                <ArrowRight className="size-4" />
              </button>

              {/* Decorative Segmented Circle Ring Graphic (Lime, Coral, Black + Trend Line matching UIref.webp) */}
              <div className="relative w-28 h-28 pointer-events-none select-none flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-45">
                  {/* Segment 1: Lime */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#D2F801"
                    strokeWidth="10"
                    strokeDasharray="90 250"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Coral */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#FF6B50"
                    strokeWidth="10"
                    strokeDasharray="60 250"
                    strokeDashoffset="-95"
                  />
                  {/* Segment 3: Black */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#111111"
                    strokeWidth="10"
                    strokeDasharray="50 250"
                    strokeDashoffset="-160"
                  />
                </svg>

                {/* Trend Arrow Line */}
                <svg
                  viewBox="0 0 60 40"
                  fill="none"
                  className="absolute inset-0 m-auto w-12 h-10 text-[#111111]"
                >
                  <path
                    d="M 8 32 L 20 22 L 32 26 L 48 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 38 10 L 48 10 L 48 20"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 3: "Advantages" (Split Layout 2x2 Cards with Lime Icons) */}
      {/* ==================================================================== */}
      <section id="advantages" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-neutral-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Heading */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
              Advantages
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
              Kami mendengarkan kebutuhan ribuan penjual media sosial untuk menciptakan sistem etalase dan transaksi paling efisien.
            </p>
          </motion.div>

          {/* Right Column: 2x2 Grid of Advantage Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Card 1 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-2xl bg-[#F5F6F8] border border-[#E9EBEF] flex flex-col justify-between"
            >
              <div>
                <div className="size-10 rounded-full bg-[#D2F801] flex items-center justify-center text-black mb-4 shadow-2xs">
                  <Zap className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                  Mulai dalam 60 Detik
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Tanpa perlu coding atau setup rumit. Cukup masuk dengan Google dan toko online langsung aktif siap dibagikan.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#111111] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Buka Toko
                </button>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-2xl bg-[#F5F6F8] border border-[#E9EBEF] flex flex-col justify-between"
            >
              <div>
                <div className="size-10 rounded-full bg-[#D2F801] flex items-center justify-center text-black mb-4 shadow-2xs">
                  <MessageCircle className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                  Dukungan 24/7 WhatsApp
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Tim kami siap menjawab pertanyaan setup toko, integrasi menu, dan optimasi etalase jualanmu setiap saat.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#111111] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tanya Tim
                </button>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-2xl bg-[#F5F6F8] border border-[#E9EBEF] flex flex-col justify-between"
            >
              <div>
                <div className="size-10 rounded-full bg-[#D2F801] flex items-center justify-center text-black mb-4 shadow-2xs">
                  <Percent className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                  0% Biaya Komisi
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Tanpa potongan komisi penjualan atau biaya per transaksi tersembunyi. Keuntungan toko 100% utuh untukmu.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#111111] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cek Skema
                </button>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8 rounded-2xl bg-[#F5F6F8] border border-[#E9EBEF] flex flex-col justify-between"
            >
              <div>
                <div className="size-10 rounded-full bg-[#D2F801] flex items-center justify-center text-black mb-4 shadow-2xs">
                  <Smartphone className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111111]">
                  Akses Kilat Tanpa Unduh
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Pembeli membuka link di bio medsos langsung di browser ponsel tanpa harus mengunduh aplikasi tambahan.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#111111] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Mulai Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 4: "Our Partners" (Monochrome Partner Logos) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center border-t border-neutral-100">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Our Partners
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
          Mendukung ekosistem pembayaran digital dan kurir logistik terpercaya di seluruh Indonesia
        </p>

        {/* Partners Badges Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {[
            { name: 'WhatsApp', badge: 'WA Business' },
            { name: 'QRIS', badge: 'QRIS Standar' },
            { name: 'BCA', badge: 'Bank BCA' },
            { name: 'Mandiri', badge: 'Bank Mandiri' },
            { name: 'BRI', badge: 'Bank BRI' },
            { name: 'GoPay', badge: 'GoPay / OVO' },
            { name: 'JNE', badge: 'JNE Express' },
            { name: 'SiCepat', badge: 'SiCepat' },
          ].map((partner, idx) => (
            <div
              key={idx}
              className="size-14 sm:size-16 rounded-full bg-neutral-50 border border-neutral-200/80 flex items-center justify-center p-2 shadow-2xs hover:border-[#D2F801] hover:scale-105 transition-all cursor-pointer"
              title={partner.name}
            >
              <span className="font-mono text-[10px] sm:text-xs font-bold text-neutral-800 text-center leading-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: Dark Highlight Banner ("Keep Your Finger on the Investment Pulse") */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-10 sm:my-20">
        <div className="bg-[#0E0E0E] text-white rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Playful White Wavy SVG Line Accent */}
              <div className="w-24 h-6 text-white/40 mb-3">
                <svg viewBox="0 0 100 24" fill="none" className="w-full h-full">
                  <path
                    d="M 0 12 Q 25 0, 50 12 T 100 12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
                Keep Your Finger on the <br />
                Medsos Store Pulse
              </h2>

              <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-lg leading-relaxed">
                Pantau omzet harian, riwayat checkout WhatsApp, dan data pembeli setia dalam satu dashboard yang bersih tanpa distraksi.
              </p>

              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-black text-sm font-bold flex items-center gap-2.5 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="size-4 text-black" />
                  <span>Buka Dashboard Toko</span>
                  <ArrowRight className="size-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column: Overlapping Mobile Mockup */}
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex items-center justify-center"
            >
              <div className="w-full max-w-[300px] bg-white text-black rounded-[32px] p-5 shadow-2xl border border-neutral-200">
                <div className="text-center pb-3 border-b border-neutral-100">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    TOTAL PENJUALAN
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-neutral-900 mt-0.5">
                    Rp 16.988.310
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                    +23.8% minggu ini
                  </span>
                </div>

                {/* Dashboard Action Chips */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-700">
                    Statistik
                  </span>
                  <span className="px-3 py-1 rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-700">
                    Kelola Stok
                  </span>
                </div>

                {/* Order List Breakdown */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div>
                      <div className="font-bold text-neutral-900">Kedai Kopi Senja</div>
                      <div className="text-[10px] text-neutral-400">2 item • WhatsApp</div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">Rp 44.000</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div>
                      <div className="font-bold text-neutral-900">Roti Artisan Sourdough</div>
                      <div className="text-[10px] text-neutral-400">1 item • WhatsApp</div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">Rp 35.000</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div>
                      <div className="font-bold text-neutral-900">Cold Brew Vanilla</div>
                      <div className="text-[10px] text-neutral-400">1 item • WhatsApp</div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">Rp 28.000</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 6: "Trade in Real Time" (Interactive Etalase - Single-screen on mobile) */}
      {/* ==================================================================== */}
      <section
        id="etalase"
        className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-20 min-h-[calc(100svh-64px)] lg:min-h-0 flex flex-col justify-center"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight">
              Trade in Real Time
            </h2>
            <p className="mt-1.5 text-xs sm:text-base text-neutral-600 max-w-xl">
              Etalase interaktif yang dilihat pelanggan. Pembeli memilih varian, lalu data terformat rapi siap kirim ke WhatsApp.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 self-start sm:self-auto">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'minuman', label: 'Minuman' },
              { id: 'pastry', label: 'Pastry' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCatalogFilter(tab.id as 'all' | 'minuman' | 'pastry')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  catalogFilter === tab.id
                    ? 'bg-black text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Row (Mobile Horizontal Snap, Desktop 3-column Grid) */}
        <div className="flex sm:grid sm:grid-cols-3 gap-3 sm:gap-6 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 snap-x snap-mandatory no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
          {filteredCatalogProducts.map((item) => {
            const isSelected = selectedCatalogId === item.id
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => setSelectedCatalogId(isSelected ? null : item.id)}
                className={`w-[68vw] min-w-[220px] max-w-[260px] sm:w-auto shrink-0 snap-center sm:snap-align-none p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#F5F6F8] border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-black ring-2 ring-black/10 shadow-md bg-white'
                    : 'border-[#E9EBEF] hover:border-neutral-300'
                }`}
              >
                <div>
                  <div className="aspect-[16/10] sm:aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-200 mb-2.5 sm:mb-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-black transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 line-clamp-1 sm:line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-200/80 flex items-center justify-between">
                  <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <span
                    className={`px-2.5 sm:px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#D2F801] text-black shadow-2xs'
                        : 'bg-white text-neutral-700 border border-neutral-200 group-hover:bg-black group-hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Dipilih' : '+ Tambah'}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Live Simulation Checkout Bar */}
        <div className="mt-4 sm:mt-6 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#111111] text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-neutral-400 shrink-0">Simulasi:</span>
            <span className="font-medium text-white truncate">
              {selectedCatalogItem
                ? `1 pesanan (${selectedCatalogItem.name} • Rp ${selectedCatalogItem.price.toLocaleString('id-ID')})`
                : 'Pilih produk di atas untuk simulasi checkout'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleOpenAuth('signup')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg sm:rounded-xl bg-[#D2F801] hover:bg-[#bde300] text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span>Buka Toko Sekarang</span>
            <ArrowRight className="size-3.5" />
          </motion.button>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: "100,000+ Stonks in Your App" (Large Lime Graphic) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 border-t border-neutral-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight leading-[1.12]">
              10,000+ Pesanan <br />
              Terkirim ke WhatsApp
            </h2>

            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-md">
              UMKM dan kreator di seluruh Indonesia mengandalkan tautan.site untuk menyulap bio media sosial menjadi kanal penjualan berdaya konversi tinggi.
            </p>
          </motion.div>

          {/* Right Column: Giant Lime Circle + Floating Stock/Product Cards */}
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center min-h-[340px]"
          >
            {/* Giant Lime Circle Backdrop */}
            <div className="size-72 sm:size-96 rounded-full bg-[#D2F801] absolute right-0 sm:right-6 pointer-events-none" />

            {/* Overlapping Floating Cards */}
            <div className="relative z-10 w-full max-w-sm space-y-3">
              {/* Card 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-xl border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    <Coffee className="size-4 text-[#D2F801]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900">Kedai Kopi Senja</div>
                    <div className="text-[10px] font-mono text-neutral-400">320 pesanan terkirim</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-mono font-bold text-neutral-900">Rp 1.882.000</div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">+18.2%</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-xl border border-neutral-100 flex items-center justify-between transform translate-x-2 sm:translate-x-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    <Package className="size-4 text-[#D2F801]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900">Artisan Bakery</div>
                    <div className="text-[10px] font-mono text-neutral-400">140 pesanan terkirim</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-mono font-bold text-neutral-900">Rp 1.402.710</div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">+12.4%</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-xl border border-neutral-100 flex items-center justify-between transform -translate-x-1 sm:-translate-x-2">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    <ShoppingBag className="size-4 text-[#D2F801]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900">Daily Apparel</div>
                    <div className="text-[10px] font-mono text-neutral-400">89 pesanan terkirim</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-mono font-bold text-neutral-900">Rp 669.120</div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">+11.7%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 8: "Get the App for Free and Start Now" (Clean CTA) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111111] tracking-tight leading-[1.1]">
            Get the App for Free <br />
            and Start Now
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-neutral-600 max-w-lg mx-auto">
            Klaim nama tokomu sekarang dan mulai pasang etalase penjualan WhatsApp dalam 1 menit.
          </p>

          {/* Minimal Claim Domain Input Bar */}
          <form
            onSubmit={handleClaimSubmit}
            className="mt-6 sm:mt-8 max-w-md mx-auto bg-[#F5F6F8] p-1.5 rounded-full border border-neutral-300/80 shadow-xs flex items-center gap-2"
          >
            <div className="flex items-center flex-1 pl-4 pr-1">
              <span className="font-mono text-xs sm:text-sm font-semibold text-neutral-400 select-none">
                tautan.site/
              </span>
              <input
                type="text"
                required
                placeholder="nama-tokomu"
                value={claimSlug}
                onChange={(e) =>
                  setClaimSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                }
                className="w-full pl-1 pr-2 py-1.5 bg-transparent text-xs sm:text-sm font-mono font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Klaim</span>
              <ArrowRight className="size-3.5 text-[#D2F801]" />
            </button>
          </form>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 9: FOOTER (Pitch Black, matching UIref.webp footer) */}
      {/* ==================================================================== */}
      <footer className="w-full bg-[#0B0B0B] text-white pt-14 pb-10 px-6 sm:px-12 lg:px-20 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand Logo & Tagline */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-2">
              <div className="size-3.5 rounded-full bg-[#D2F801]" />
              <span className="font-sans text-xl font-bold tracking-tight text-white">
                tautan<span className="text-neutral-400 text-sm font-medium">.site</span>
              </span>
            </div>
            <p className="mt-3 text-xs text-neutral-400 max-w-xs leading-relaxed">
              Platform etalase digital dan checkout WhatsApp otomatis bagi penjual media sosial di Indonesia.
            </p>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors"
                >
                  Etalase Produk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors"
                >
                  Checkout WhatsApp
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors"
                >
                  Dashboard Kasir
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors"
                >
                  Skema Komisi (0%)
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Tentang Kami</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Cerita Penjual</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Syarat & Ketentuan</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Kebijakan Privasi</span>
              </li>
            </ul>
          </div>

          {/* Subscribe to News Column */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Subscribe to News
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Dapatkan pembaruan fitur dan tips jualan medsos langsung ke email Anda.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Your e-mail"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D2F801]"
              />
              <button
                type="submit"
                className="size-9 rounded-xl bg-[#D2F801] hover:bg-[#bde300] text-black flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Subscribe"
              >
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <span>© {new Date().getFullYear()} tautan.site. Seluruh Hak Cipta Dilindungi.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">TikTok</span>
            <span className="hover:text-white cursor-pointer transition-colors">WhatsApp</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        initialSlug={claimSlug}
      />
    </div>
  )
}
