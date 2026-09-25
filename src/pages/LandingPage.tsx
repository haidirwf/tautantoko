import { useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  ShoppingBag,
  Search,
  Zap,
  MessageCircle,
  Percent,
  Smartphone,
  Coffee,
  Package,
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
  const [heroVariant, setHeroVariant] = useState<'dingin' | 'hangat'>('dingin')

  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleOpenAuth = (mode: 'signup' | 'login') => {
    if (isAuthenticated) {
      navigate('/dashboard')
      return
    }
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  return (
    <div className="min-h-screen bg-white text-[#141413] selection:bg-[#cc785c] selection:text-white">
      {/* ==================================================================== */}
      {/* SECTION 1: HERO BANNER (Terracotta #cc785c matching UIref.webp layout) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="bg-[#cc785c] text-white rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Headline, Copy & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Ubah Pengunjung Media Sosial <br />
                Menjadi Pembeli Pasti.
              </h1>

              <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-white/90 max-w-lg leading-relaxed font-normal">
                Kelola etalase produk, terima pesanan terstruktur, dan sambungkan pembeli langsung ke WhatsApp tanpa potongan komisi.
              </p>

              {/* CTA & Playful Doodle Arrow */}
              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-7 py-4 rounded-full bg-[#141413] hover:bg-black text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer group"
                >
                  <ShoppingBag className="size-4 text-[#cc785c]" />
                  <span>Buka Toko Gratis</span>
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('advantages')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
                    className="w-full h-full text-white/80"
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
              <div className="absolute right-0 sm:right-2 top-0 sm:top-2 w-[220px] sm:w-[260px] bg-[#141413] text-white rounded-[28px] sm:rounded-[36px] p-4 sm:p-5 shadow-2xl border border-white/10 z-10 transform translate-x-2 sm:translate-x-4 -rotate-1 select-none">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-mono text-white/50 block">Pesanan Masuk</span>
                    <span className="text-xs font-mono font-bold text-white">#ORD-1042</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#cc785c]">+Rp 74.000</span>
                </div>

                {/* Mini Activity Chart */}
                <div className="mt-3 bg-white/5 rounded-xl p-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/60 mb-2">
                    <span>Omzet Hari Ini</span>
                    <span className="text-[#cc785c] font-bold">+28.4%</span>
                  </div>
                  <div className="h-10 flex items-end gap-1.5 justify-between px-1">
                    {[35, 55, 40, 75, 60, 95, 80, 100].map((h, i) => (
                      <div
                        key={i}
                        className={`w-full rounded-t-sm ${
                          i === 7 ? 'bg-[#cc785c]' : 'bg-white/20'
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
                    <span className="font-mono text-[#cc785c]">Rp 0 (0%)</span>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenAuth('signup')}
                    className="flex-1 py-1.5 rounded-lg bg-[#cc785c] text-white text-center font-bold text-[11px] cursor-pointer"
                  >
                    Buka WhatsApp
                  </button>
                </div>
              </div>

              {/* Front Mockup: White Phone (Clean Storefront & Catalog) */}
              <div className="relative w-[230px] sm:w-[270px] bg-white text-[#141413] rounded-[28px] sm:rounded-[36px] p-4 sm:p-5 shadow-2xl border border-neutral-100 z-20 transform -translate-x-6 sm:-translate-x-12 translate-y-6 sm:translate-y-8 select-none">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#141413]">Kedai Kopi Senja</h3>
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
                <div className="mt-3 p-2.5 rounded-xl bg-[#141413] text-white">
                  <div className="text-[10px] font-mono text-[#cc785c]">Promo Spesial</div>
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
                            ? 'bg-[#141413] text-white'
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
                            ? 'bg-[#141413] text-white'
                            : 'bg-white text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        Hangat
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAuth('signup')}
                      className="px-2.5 py-1 rounded-lg bg-[#cc785c] text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#b8674d] transition-colors cursor-pointer"
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
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#141413] tracking-tight leading-[1.12]">
            Kelola Penjualan <br />
            Medsos Makin Mudah
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6c6a64]">
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
              <h3 className="text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
                Katalog & Varian Tanpa Batas
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#6c6a64] max-w-md leading-relaxed">
                Pajang seluruh lini produkmu dengan foto jernih, pilihan varian (panas/dingin, ukuran, topping), dan status stok real-time.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#141413] hover:text-[#cc785c] transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>Pelajari Lebih Lanjut</span>
                <ArrowRight className="size-4" />
              </button>

              {/* Decorative Geometric Blob Graphic (Terracotta + Black Pill matching UIref.webp) */}
              <div className="relative w-28 h-28 pointer-events-none select-none">
                <div className="absolute right-0 bottom-0 w-24 h-24 rounded-tl-full rounded-br-2xl bg-[#cc785c] transform rotate-12 transition-transform group-hover:scale-105" />
                <div className="absolute right-10 bottom-0 w-10 h-16 rounded-full bg-[#141413] transform -rotate-12 transition-transform group-hover:-translate-y-1" />
                <svg
                  viewBox="0 0 60 60"
                  fill="none"
                  className="absolute right-4 bottom-4 w-12 h-12 text-white"
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
              <h3 className="text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
                Rekap & Analisis Otomatis
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#6c6a64] max-w-md leading-relaxed">
                Pantau pesanan yang masuk, total omzet harian, dan produk paling laris secara transparan tanpa rumus spreadsheet manual.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenAuth('signup')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#141413] hover:text-[#cc785c] transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
              >
                <span>Pelajari Lebih Lanjut</span>
                <ArrowRight className="size-4" />
              </button>

              {/* Decorative Segmented Circle Ring Graphic (Terracotta, Coral, Black + Trend Line matching UIref.webp) */}
              <div className="relative w-28 h-28 pointer-events-none select-none flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-45">
                  {/* Segment 1: Terracotta */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#cc785c"
                    strokeWidth="10"
                    strokeDasharray="90 250"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Amber Coral */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e8a55a"
                    strokeWidth="10"
                    strokeDasharray="60 250"
                    strokeDashoffset="-95"
                  />
                  {/* Segment 3: Deep Ink */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#141413"
                    strokeWidth="10"
                    strokeDasharray="50 250"
                    strokeDashoffset="-160"
                  />
                </svg>

                {/* Trend Arrow Line */}
                <svg
                  viewBox="0 0 60 40"
                  fill="none"
                  className="absolute inset-0 m-auto w-12 h-10 text-[#141413]"
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
      {/* SECTION 3: "Advantages" (Split Layout 2x2 Cards matching UIref.webp) */}
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
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#141413] tracking-tight">
              Keunggulan
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#6c6a64] leading-relaxed">
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
                <div className="size-10 rounded-full bg-[#cc785c] flex items-center justify-center text-white mb-4 shadow-2xs">
                  <Zap className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#141413]">
                  Mulai dalam 60 Detik
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                  Tanpa perlu coding atau setup rumit. Cukup masuk dengan Google dan toko online langsung aktif siap dibagikan.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#141413] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
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
                <div className="size-10 rounded-full bg-[#cc785c] flex items-center justify-center text-white mb-4 shadow-2xs">
                  <MessageCircle className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#141413]">
                  Dukungan 24/7 WhatsApp
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                  Tim kami siap menjawab pertanyaan setup toko, integrasi menu, dan optimasi etalase jualanmu setiap saat.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#141413] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
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
                <div className="size-10 rounded-full bg-[#cc785c] flex items-center justify-center text-white mb-4 shadow-2xs">
                  <Percent className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#141413]">
                  0% Biaya Komisi
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                  Tanpa potongan komisi penjualan atau biaya per transaksi tersembunyi. Keuntungan toko 100% utuh untukmu.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#141413] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
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
                <div className="size-10 rounded-full bg-[#cc785c] flex items-center justify-center text-white mb-4 shadow-2xs">
                  <Smartphone className="size-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#141413]">
                  Akses Kilat Tanpa Unduh
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#6c6a64] leading-relaxed">
                  Pembeli membuka link di bio medsos langsung di browser ponsel tanpa harus mengunduh aplikasi tambahan.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-[#141413] border border-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
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
      <section id="partners" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center border-t border-neutral-100">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#141413] tracking-tight">
          Mitra & Integrasi
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6c6a64] max-w-lg mx-auto">
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
              className="size-14 sm:size-16 rounded-full bg-[#F5F6F8] border border-neutral-200/80 flex items-center justify-center p-2 shadow-2xs hover:border-[#cc785c] hover:scale-105 transition-all cursor-pointer"
              title={partner.name}
            >
              <span className="font-mono text-[10px] sm:text-xs font-bold text-[#141413] text-center leading-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 5: Dark Highlight Banner ("Keep Your Finger on the Investment Pulse") */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-20">
        <div className="bg-[#141413] text-white rounded-[32px] sm:rounded-[44px] p-6 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
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
                Pantau Penjualan & <br />
                Arus Kas Real-Time
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
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-[#141413] text-sm font-bold flex items-center gap-2.5 transition-all shadow-md cursor-pointer"
                >
                  <ShoppingBag className="size-4 text-[#cc785c]" />
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
              <div className="w-full max-w-[300px] bg-white text-[#141413] rounded-[32px] p-5 shadow-2xl border border-neutral-200">
                <div className="text-center pb-3 border-b border-neutral-100">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    TOTAL PENJUALAN
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-[#141413] mt-0.5">
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
      {/* SECTION 6: "Trade in Real Time" (Split Section matching UIref.webp) */}
      {/* ==================================================================== */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-t border-neutral-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Dark Preview Card with Chart (Exact UIref composition) */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            {/* Background Accent Rounded Shape */}
            <div className="w-[85%] h-52 bg-[#cc785c] rounded-[28px] absolute -top-3 -left-3 transform -rotate-2 opacity-90" />

            {/* Dark Chart Card */}
            <div className="w-full max-w-md bg-[#141413] text-white rounded-[28px] p-6 shadow-2xl relative z-10 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono text-neutral-400 block">Transaksi Masuk Real-Time</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">+38 Pesanan <span className="text-emerald-400 text-xs font-semibold">Hari Ini</span></div>
                </div>
                <span className="text-[11px] font-mono text-[#cc785c] font-bold">OTOMATIS</span>
              </div>

              {/* Sparkline Wave Graph */}
              <div className="mt-4 h-24 w-full flex items-center justify-center">
                <svg viewBox="0 0 300 80" fill="none" className="w-full h-full text-white/90">
                  <path
                    d="M 5 50 L 35 30 L 65 60 L 95 20 L 130 55 L 160 35 L 190 70 L 225 15 L 260 40 L 295 10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 5 50 L 35 30 L 65 60 L 95 20 L 130 55 L 160 35 L 190 70 L 225 15 L 260 40 L 295 10 L 295 80 L 5 80 Z"
                    fill="url(#chart-grad)"
                    opacity="0.15"
                  />
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cc785c" />
                      <stop offset="100%" stopColor="#141413" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400 font-mono pt-3 border-t border-white/10">
                <span>Format Rapi</span>
                <span className="text-emerald-400 font-bold">Langsung ke WhatsApp</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Copy & Details */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#141413] tracking-tight leading-[1.12]">
              Transaksi Kilat Real-Time
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#6c6a64] leading-relaxed">
              Tanpa tunggu konfirmasi manual. Pesanan pembeli langsung terekam dan terformat rapi ke WhatsApp toko Anda setiap detik tanpa jeda. Semua rincian item, varian, dan total harga langsung siap kirim.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 7: KATALOG PRODUK (Replacing "100,000+ Stonks in Your App") */}
      {/* ==================================================================== */}
      <section id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 border-t border-neutral-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading & Description about Catalog */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#141413] tracking-tight leading-[1.12]">
              Katalog Produk <br />
              di Medsosmu
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#6c6a64] leading-relaxed max-w-md">
              Pajang ratusan produk dengan foto jernih, pilihan varian temperatur/rasa, dan stok otomatis. Pembeli menjelajahi etalase tokomu secepat kilat langsung dari tautan bio Instagram atau TikTok.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {['Kopi & Minuman', 'Pastry & Roti', 'Fashion & Aksesori', 'Produk Digital'].map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-[#F5F6F8] border border-neutral-200 text-xs font-semibold text-[#141413]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Giant Terracotta Circle Backdrop + Floating Catalog Product Cards */}
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[420px]"
          >
            {/* Giant Terracotta Circle Backdrop matching UIref.webp composition */}
            <div className="size-72 sm:size-96 rounded-full bg-[#cc785c] absolute right-0 sm:right-6 pointer-events-none opacity-90 shadow-lg" />

            {/* Overlapping Floating Product Cards */}
            <div className="relative z-10 w-full max-w-sm space-y-3.5">
              {/* Product Card 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-xl border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#141413] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Coffee className="size-4 text-[#cc785c]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#141413]">Kopi Susu Aren</div>
                    <div className="text-[10px] font-mono text-neutral-400">Espresso & aren alami</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-mono font-bold text-[#141413]">Rp 22.000</div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">+18.2% terlaris</span>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-xl border border-neutral-100 flex items-center justify-between transform translate-x-2 sm:translate-x-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#141413] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <Package className="size-4 text-[#cc785c]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#141413]">Artisan Croissant</div>
                    <div className="text-[10px] font-mono text-neutral-400">Renyah berlapis mentega</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-mono font-bold text-[#141413]">Rp 18.000</div>
                  <span className="text-[10px] font-mono text-neutral-500 font-bold">Stok Tersedia</span>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white shadow-xl border border-neutral-100 flex items-center justify-between transform -translate-x-1 sm:-translate-x-2">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#141413] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <ShoppingBag className="size-4 text-[#cc785c]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#141413]">Cold Brew Bottle</div>
                    <div className="text-[10px] font-mono text-neutral-400">Seduh dingin 16 jam</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-mono font-bold text-[#141413]">Rp 28.000</div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Rating 4.9 ★</span>
                </div>
              </div>

              {/* Curved Doodle Loop SVG */}
              <div className="absolute -left-6 -bottom-6 w-20 h-20 pointer-events-none text-[#141413]">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <path
                    d="M 20 80 Q 50 10, 80 50 T 20 80"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                </svg>
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
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#141413] tracking-tight leading-[1.1]">
            Buka Tokomu Gratis <br />
            dan Mulai Sekarang
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-[#6c6a64] max-w-lg mx-auto">
            Buka toko online gratis sekarang dan mulai terima pesanan otomatis ke WhatsApp dalam 1 menit.
          </p>

          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleOpenAuth('signup')}
              className="px-8 py-4 rounded-full bg-[#141413] hover:bg-black text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag className="size-4 text-[#cc785c]" />
              <span>Buka Toko Gratis</span>
              <ArrowRight className="size-4" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ==================================================================== */}
      {/* SECTION 9: FOOTER (Pitch Black, matching UIref.webp footer) */}
      {/* ==================================================================== */}
      <footer className="w-full bg-[#141413] text-white pt-14 pb-10 px-6 sm:px-12 lg:px-20 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand Logo & Tagline */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-2">
              <div className="size-3.5 rounded-full bg-[#cc785c]" />
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
              Fitur & Layanan
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Etalase Produk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Checkout WhatsApp
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dashboard Kasir
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Skema Komisi (0%)
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Perusahaan
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

          {/* Kolom Berlangganan Tips Bisnis */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider mb-3">
              Langganan Tips Bisnis
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Dapatkan pembaruan fitur dan tips jualan medsos langsung ke email Anda.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Ketik email Anda..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#cc785c]"
              />
              <button
                type="submit"
                className="size-9 rounded-xl bg-[#cc785c] hover:bg-[#b8674d] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Langganan"
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
      />
    </div>
  )
}
