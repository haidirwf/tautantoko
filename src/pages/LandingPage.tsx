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
  Coffee,
  Shirt,
  Gift,
  Laptop,
  ArrowRight,
  Wifi,
  Battery,
  ExternalLink,
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { formatIDR } from '@/lib/utils'

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [claimSlug, setClaimSlug] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const navigate = useNavigate()
  const { signup } = useAuthStore()

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = claimSlug.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'toko-saya'
    signup('penjual@tautan.site', clean)
    navigate('/dashboard')
  }

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx)
  }

  const faqItems = [
    {
      q: 'Bagaimana tautan.site membantu proses jualan saya?',
      a: 'tautan.site menggabungkan tautan profil media sosial (link-in-bio) dengan katalog produk interaktif. Calon pembeli dapat melihat foto, memilih varian (ukuran/warna), dan mengisi alamat pengiriman dalam satu layar. Ketika checkout ditekan, seluruh rincian langsung tersusun rapi ke pesan WhatsApp Anda.',
    },
    {
      q: 'Apakah ada potongan komisi dari setiap transaksi penjualan?',
      a: 'Sama sekali tidak ada potongan komisi (0%). Pembeli membayar langsung ke rekening bank atau QRIS pribadi Anda setelah berinteraksi di WhatsApp.',
    },
    {
      q: 'Apakah pembeli perlu mengunduh aplikasi atau membuat akun?',
      a: 'Tidak perlu. Etalase terbuka instan di browser ponsel pembeli dalam hitungan detik dengan beban data yang sangat ringan.',
    },
    {
      q: 'Bagaimana cara penjual mengelola pesanan yang masuk?',
      a: 'Setiap pesanan otomatis tercatat di Dashboard privat Anda. Di sana, Anda dapat menandai pesanan yang sudah lunas, memperbarui ongkos kirim, dan memasukkan nomor resi ekspedisi.',
    },
    {
      q: 'Apakah saya bisa mengubah produk dan harga sewaktu-waktu?',
      a: 'Tentu. Anda dapat menambah produk baru, mengganti foto, mengubah harga dasar, dan mengatur opsi varian kapan saja melalui panel katalog.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col justify-between selection:bg-[#cc785c]/20 selection:text-[#141413] overflow-x-hidden">
      {/* 1. HERO SECTION (2-COLUMN: TEXT ON LEFT, PHONE ON RIGHT) */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 max-w-6xl lg:max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text, CTAs, Claim Bar (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.1]"
            >
              Ubah Pengunjung Media Sosial <br className="hidden sm:inline" />
              Menjadi <span className="italic font-bold text-[#cc785c]">Pembeli Pasti.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 text-base sm:text-lg text-[#5c5850] max-w-xl leading-relaxed"
            >
              Tampilkan seluruh produk dan tautan bisnismu dalam satu link elegan. Pembeli memilih varian, mengisi alamat, dan pesanan terkirim rapi ke WhatsApp Anda tanpa potongan biaya transaksi.
            </motion.p>

            {/* Quick Slug Claim Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 w-full max-w-md"
            >
              <form
                onSubmit={handleClaimSubmit}
                className="p-1.5 rounded-full border border-[#e8e2d9] bg-white shadow-2xs flex items-center gap-2 focus-within:border-[#cc785c] focus-within:ring-2 focus-within:ring-[#cc785c]/20 transition-all hover:border-[#cc785c]/60"
              >
                <div className="flex items-center pl-4 text-xs sm:text-sm text-[#706c64] font-mono select-none">
                  tautan.site/
                </div>
                <input
                  type="text"
                  required
                  placeholder="namatokomu"
                  value={claimSlug}
                  onChange={(e) => setClaimSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full h-9 bg-transparent text-xs sm:text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none font-medium"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 sm:px-6 h-9 rounded-full bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs font-semibold whitespace-nowrap transition-colors shrink-0 shadow-2xs cursor-pointer"
                >
                  Klaim Tautan
                </motion.button>
              </form>
              <div className="flex items-center gap-3 sm:gap-4 mt-3 text-[11px] text-[#706c64] flex-wrap">
                <span className="flex items-center gap-1">
                  <Check className="size-3 text-[#137333]" />
                  0% Potongan Komisi
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Check className="size-3 text-[#137333]" />
                  Siap dalam 30 Detik
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Check className="size-3 text-[#137333]" />
                  Tanpa Kartu Kredit
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="group inline-flex items-center gap-3 rounded-full bg-[#141413] px-6 py-3.5 text-sm font-medium text-[#faf8f5] hover:bg-[#252523] transition-all shadow-xs cursor-pointer"
              >
                <span>Buka Toko Gratis</span>
                <span className="grid size-6 place-items-center rounded-full bg-[#cc785c] text-white font-semibold text-xs group-hover:scale-110 transition-transform">
                  ↗
                </span>
              </motion.button>

              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/batik-nusantara"
                  className="rounded-full border border-[#e8e2d9] bg-white hover:bg-[#faf8f5] px-6 py-3.5 text-sm font-medium text-[#141413] transition-all inline-block shadow-2xs"
                >
                  Jelajahi Demo Etalase
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Smartphone Storefront & Floating WhatsApp Bubble (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[310px] sm:max-w-[330px]">
              {/* Smartphone Frame (iPhone aesthetic) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-[44px] border-[7px] border-[#181715] bg-[#faf8f5] shadow-2xl overflow-hidden relative"
              >
                {/* Dynamic Island / Notch & Status Bar */}
                <div className="pt-2 pb-1 bg-[#faf8f5] flex items-center justify-between px-6 text-[10px] text-[#141413] font-medium select-none">
                  <span>9:41</span>
                  <div className="w-20 h-4 bg-[#181715] rounded-full flex items-center justify-end px-1.5">
                    <span className="size-1.5 rounded-full bg-[#252523]" />
                  </div>
                  <div className="flex items-center gap-1 text-[#141413]">
                    <Wifi className="size-3" />
                    <Battery className="size-3" />
                  </div>
                </div>

                {/* Screen Content: Authentic Buyer View */}
                <div className="p-4 flex flex-col gap-3">
                  {/* Store Avatar & Info */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d9]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-[#fae7e0] border border-[#f2cfc2] flex items-center justify-center font-sans text-sm font-bold text-[#cc785c]">
                        BN
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-xs text-[#141413]">Batik Nusantara</span>
                          <span className="size-1.5 rounded-full bg-[#137333]" />
                        </div>
                        <p className="text-[10px] text-[#706c64] line-clamp-1">Koleksi busana etnik katun primisima</p>
                      </div>
                    </div>
                    <Link
                      to="/batik-nusantara"
                      className="p-1 rounded-full text-[#cc785c] hover:bg-[#faf8f5] transition-colors"
                      title="Buka Toko"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>

                  {/* 2 Clean Product Cards */}
                  <div className="flex flex-col gap-2.5">
                    <div className="p-2 rounded-xl bg-white border border-[#e8e2d9] flex items-center gap-2.5 shadow-2xs">
                      <img
                        src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&auto=format&fit=crop&q=80"
                        alt="Kemeja Batik"
                        className="size-14 rounded-lg object-cover border border-[#e8e2d9] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-xs text-[#141413] block truncate">
                          Kemeja Batik Parang
                        </span>
                        <span className="font-sans font-bold text-xs text-[#141413] block mt-0.5">
                          {formatIDR(245000)}
                        </span>
                        <span className="text-[9px] text-[#706c64] font-mono">Pilihan: S, M, L, XL</span>
                      </div>
                      <Link
                        to="/batik-nusantara"
                        className="px-2.5 py-1 rounded-md bg-[#cc785c] text-white text-[11px] font-medium shrink-0 shadow-2xs hover:bg-[#a9583e] transition-colors"
                      >
                        + Beli
                      </Link>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-[#e8e2d9] flex items-center gap-2.5 shadow-2xs">
                      <img
                        src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&auto=format&fit=crop&q=80"
                        alt="Dress Tenun"
                        className="size-14 rounded-lg object-cover border border-[#e8e2d9] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-xs text-[#141413] block truncate">
                          Dress Tenun Ikat Jepara
                        </span>
                        <span className="font-sans font-bold text-xs text-[#141413] block mt-0.5">
                          {formatIDR(320000)}
                        </span>
                        <span className="text-[9px] text-[#706c64] font-mono">Pilihan: All Size</span>
                      </div>
                      <Link
                        to="/batik-nusantara"
                        className="px-2.5 py-1 rounded-md bg-[#cc785c] text-white text-[11px] font-medium shrink-0 shadow-2xs hover:bg-[#a9583e] transition-colors"
                      >
                        + Beli
                      </Link>
                    </div>
                  </div>

                  {/* Bottom Bar inside Smartphone */}
                  <div className="p-2.5 rounded-xl bg-[#141413] text-[#faf8f5] flex items-center justify-between mt-1 shadow-xs">
                    <div className="text-left pl-1">
                      <span className="text-[10px] text-[#faf8f5]/70 block leading-none">Keranjang Siap</span>
                      <span className="font-sans text-xs font-bold text-[#faf8f5] mt-0.5 block">1 Barang • {formatIDR(245000)}</span>
                    </div>
                    <Link
                      to="/batik-nusantara"
                      className="px-3 py-1.5 rounded-lg bg-[#cc785c] text-white text-[10px] font-semibold flex items-center gap-1 hover:bg-[#a9583e] transition-colors"
                    >
                      <span>Checkout WA</span>
                      <ArrowRight className="size-2.5" />
                    </Link>
                  </div>

                  {/* Home Indicator */}
                  <div className="w-24 h-1 bg-[#181715]/30 rounded-full mx-auto mt-2" />
                </div>
              </motion.div>

              {/* Authentic WhatsApp Message Bubble */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.5, type: 'spring', bounce: 0.2 }}
                className="w-full max-w-[280px] sm:max-w-[300px] absolute -bottom-6 -left-6 sm:-left-10 p-3.5 rounded-2xl rounded-tr-xs bg-[#d9fdd3] border border-[#b4e6ad] text-[#111b21] shadow-xl text-left z-20"
              >
                <div className="flex items-center gap-2 mb-1.5 pb-1 border-b border-[#b4e6ad]/60">
                  <MessageCircle className="size-4 text-[#25D366]" />
                  <span className="text-[11px] font-semibold text-[#128C7E]">Format Order Otomatis di WhatsApp</span>
                </div>
                <p className="text-[11px] text-[#111b21] leading-relaxed font-sans">
                  Halo <strong>Batik Nusantara</strong>, saya mau pesan:
                  <br />• 1x Kemeja Batik Parang (Ukuran: L)
                  <br />• Total: <strong>Rp 245.000</strong>
                  <br /><span className="text-[10px] text-[#4a5568]">📍 Kirim ke: Budi Santoso, Jakarta Selatan</span>
                </p>
                <div className="flex items-center justify-end gap-1 text-[9px] text-[#667781] mt-1 font-mono">
                  <span>10:42</span>
                  <span className="text-[#53bdeb] font-bold">✓✓</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED PARTNER TICKER */}
      <section className="border-y border-[#e8e2d9] bg-[#efe9de]/50 py-3.5 overflow-hidden">
        <div className="flex items-center max-w-5xl mx-auto px-4">
          <span className="shrink-0 text-[11px] font-mono tracking-widest text-[#706c64] font-semibold uppercase mr-6">
            Cocok Untuk:
          </span>
          <div className="overflow-hidden flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee flex items-center gap-10 text-xs font-sans font-semibold tracking-wide text-[#141413]">
              <span>Kopi & Kuliner</span>
              <span className="text-[#cc785c]">•</span>
              <span>Batik & Fashion</span>
              <span className="text-[#cc785c]">•</span>
              <span>Hijab & Gamis</span>
              <span className="text-[#cc785c]">•</span>
              <span>Kerajinan & Kriya</span>
              <span className="text-[#cc785c]">•</span>
              <span>Hampers & Reseller</span>
              <span className="text-[#cc785c]">•</span>
              <span>Studio & Jasa Kreator</span>
              <span className="text-[#cc785c]">•</span>
              {/* Duplicate set for seamless continuous marquee */}
              <span>Kopi & Kuliner</span>
              <span className="text-[#cc785c]">•</span>
              <span>Batik & Fashion</span>
              <span className="text-[#cc785c]">•</span>
              <span>Hijab & Gamis</span>
              <span className="text-[#cc785c]">•</span>
              <span>Kerajinan & Kriya</span>
              <span className="text-[#cc785c]">•</span>
              <span>Hampers & Reseller</span>
              <span className="text-[#cc785c]">•</span>
              <span>Studio & Jasa Kreator</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION FITUR (#features) */}
      <section id="features" className="px-4 sm:px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
            01 — Fitur Utama
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-[#141413] mt-2">
            Segala yang kamu butuhkan untuk jualan online, <em className="italic text-[#cc785c] font-normal">tanpa kerumitan.</em>
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5850] mt-2 max-w-xl">
            Dirancang khusus untuk gaya transaksi lokal Indonesia yang mengandalkan kehangatan komunikasi di WhatsApp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-7 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all cursor-default group"
          >
            <div>
              <div className="size-10 rounded-lg bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mb-6 group-hover:scale-110 group-hover:bg-[#fae7e0] transition-transform duration-300">
                <Layers className="size-5" />
              </div>
              <h3 className="font-sans text-xl font-bold text-[#141413] tracking-tight group-hover:text-[#cc785c] transition-colors">
                All-in-One Link Bio
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] mt-3 leading-relaxed">
                Satukan profil media sosial (Instagram, TikTok, Shopee, Google Maps) dan katalog barang dalam satu tautan ringkas yang mudah disematkan di bio.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#e8e2d9]/60 text-xs font-medium text-[#cc785c] flex items-center gap-1.5">
              <span className="group-hover:translate-x-1 transition-transform">✦</span>
              <span>Gantikan bio-link konvensional</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-7 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all cursor-default group"
          >
            <div>
              <div className="size-10 rounded-lg bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mb-6 group-hover:scale-110 group-hover:bg-[#fae7e0] transition-transform duration-300">
                <ShoppingBag className="size-5" />
              </div>
              <h3 className="font-sans text-xl font-bold text-[#141413] tracking-tight group-hover:text-[#cc785c] transition-colors">
                Katalog Mikro & Varian
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] mt-3 leading-relaxed">
                Tampilan katalog bersih 2 kolom dengan foto tajam dan pemilih varian (seperti Ukuran atau Warna). Perhitungan total harga berjalan otomatis.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#e8e2d9]/60 text-xs font-medium text-[#cc785c] flex items-center gap-1.5">
              <span className="group-hover:translate-x-1 transition-transform">✦</span>
              <span>Responsif & nyaman di smartphone</span>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-7 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between shadow-2xs hover:shadow-lg transition-all cursor-default group"
          >
            <div>
              <div className="size-10 rounded-lg bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mb-6 group-hover:scale-110 group-hover:bg-[#fae7e0] transition-transform duration-300">
                <SendHorizontal className="size-5" />
              </div>
              <h3 className="font-sans text-xl font-bold text-[#141413] tracking-tight group-hover:text-[#cc785c] transition-colors">
                Checkout Cepat ke WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] mt-3 leading-relaxed">
                Pembeli cukup memasukkan nama dan alamat pengiriman. Sistem otomatis menyusun rekapan order lengkap dan membuka percakapan WhatsApp Anda.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#e8e2d9]/60 text-xs font-medium text-[#cc785c] flex items-center gap-1.5">
              <span className="group-hover:translate-x-1 transition-transform">✦</span>
              <span>Tanpa login pembeli yang berbelit</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SECTION USE CASES (#usecases) */}
      <section id="usecases" className="border-t border-[#e8e2d9] bg-[#efe9de]/30 px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
              02 — Solusi Bisnis
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-[#141413] mt-2">
              Didesain untuk berbagai kategori jualanmu.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { label: 'Kuliner & F&B', desc: 'Coffee shop, roti, katering, frozen food', icon: Coffee },
              { label: 'Fashion & Kriya', desc: 'Batik, pakaian thrift, tenun, aksesoris', icon: Shirt },
              { label: 'Reseller & Hampers', desc: 'Kado custom, parcel, dropshipper produk', icon: Gift },
              { label: 'Jasa & Kreator', desc: 'Desain grafis, fotografi, pesanan khusus', icon: Laptop },
            ].map((cat, idx) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between aspect-square shadow-2xs hover:shadow-md transition-all cursor-default group"
                >
                  <div className="size-10 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] group-hover:scale-110 group-hover:bg-[#fae7e0] transition-all">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-sans text-base font-bold text-[#141413] group-hover:text-[#cc785c] transition-colors">{cat.label}</h4>
                    <p className="text-xs text-muted mt-1">{cat.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. SECTION ROADMAP / CARA KERJA (#how) */}
      <section id="how" className="px-4 sm:px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
            03 — Alur Kerja
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-[#141413] mt-2">
            Mulai berjualan dalam <em className="italic text-[#cc785c] font-normal">tiga langkah ringkas.</em>
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5850] mt-2">
            Panduan cepat menyiapkan etalase jualan profesional tanpa memerlukan skill teknis coding.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {[
            {
              step: '01',
              title: 'Klaim Tautan Toko',
              desc: 'Daftarkan tokomu dalam 30 detik. Dapatkan alamat web ringkas tautan.site/namatokomu yang siap dibagikan ke pelanggan.',
            },
            {
              step: '02',
              title: 'Upload Produk & Varian',
              desc: 'Masukkan foto produk, tentukan harga dasar, tambahkan opsi varian (ukuran/warna), dan sematkan tautan media sosial bisnismu.',
            },
            {
              step: '03',
              title: 'Pasang di Bio & Terima Order',
              desc: 'Pasang tautan di bio Instagram dan TikTok. Setiap kali pembeli berbelanja, notifikasi dan rincian lengkap pesanan langsung masuk ke WhatsApp Anda.',
            },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="flex flex-col p-4 rounded-xl hover:bg-white/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-sans text-4xl sm:text-5xl font-extrabold text-[#cc785c] transition-transform hover:scale-105 tracking-tight">{item.step}</span>
                <div className="h-px flex-1 bg-[#e8e2d9]" />
              </div>
              <h3 className="font-sans text-xl font-bold text-[#141413] mt-4">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] mt-2 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. SECTION FAQ (#faq) */}
      <section id="faq" className="border-t border-[#e8e2d9] bg-[#efe9de]/30 px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 sm:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
              04 — Pertanyaan Umum
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] mt-2">
              Hal yang sering ditanyakan.
            </h2>
            <p className="text-xs text-[#5c5850] mt-2 leading-relaxed">
              Informasi seputar cara kerja, privasi data transaksi, dan pengelolaan pesanan.
            </p>
          </motion.div>

          <div className="divide-y divide-[#e8e2d9] border-y border-[#e8e2d9]">
            {faqItems.map((item, idx) => (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer select-none"
                >
                  <span className="font-medium text-sm sm:text-base text-[#141413] group-hover:text-[#cc785c] transition-colors">
                    {item.q}
                  </span>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  >
                    <ChevronDown
                      className={`size-4 transition-colors shrink-0 ${
                        activeFaq === idx ? 'text-[#cc785c]' : 'text-[#706c64]'
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', duration: 0.35, bounce: 0, opacity: { duration: 0.2 } }}
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

      {/* 7. PRE-FOOTER CTA SECTION */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-14 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs"
        >
          <div className="max-w-xl">
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
              Mulai buat etalase tokomu hari ini.
            </h2>
            <p className="text-xs sm:text-sm text-[#5c5850] mt-2 leading-relaxed">
              Daftar gratis dalam 30 detik. Tanpa kartu kredit. Tanpa potongan komisi transaksi.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#141413] px-6 py-3.5 text-xs sm:text-sm font-medium text-[#faf8f5] hover:bg-[#252523] transition-all shadow-sm shrink-0"
          >
            <span>Buka Toko Sekarang</span>
            <span className="grid size-5 place-items-center rounded-full bg-[#cc785c] text-white font-semibold text-xs group-hover:scale-110 transition-transform">
              ↗
            </span>
          </motion.button>
        </motion.div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-[#e8e2d9] bg-[#efe9de]/40 py-10 px-4 sm:px-6 text-[#5c5850] text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-sans text-base font-bold text-[#141413]">tautan.site</span>
            <span>— Platform Etalase Mikro & Checkout WhatsApp</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-[#141413] transition-colors">Fitur</a>
            <a href="#usecases" className="hover:text-[#141413] transition-colors">Solusi Bisnis</a>
            <a href="#how" className="hover:text-[#141413] transition-colors">Alur Kerja</a>
            <a href="#faq" className="hover:text-[#141413] transition-colors">FAQ</a>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="hover:text-[#141413] transition-colors font-medium text-[#cc785c]"
            >
              Masuk Penjual
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-[#e8e2d9]/60 flex items-center justify-between text-[11px] text-[#706c64]">
          <span>© 2026 tautan.site. Didesain dengan penuh apresiasi untuk UMKM & pedagang mandiri Indonesia.</span>
          <span className="flex items-center gap-1 font-medium text-[#141413]">
            <Check className="size-3 text-status-success" />
            Bebas Komisi Penjualan
          </span>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
