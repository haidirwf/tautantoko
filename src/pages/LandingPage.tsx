import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { formatIDR } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [claimSlug, setClaimSlug] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuthStore()

  useGSAP(
    () => {
      // 1. Hero Entrance Timeline with silky power3.out curve
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from('.hero-headline', { opacity: 0, y: 35, duration: 0.9 })
        .from('.hero-sub', { opacity: 0, y: 22, duration: 0.8 }, '-=0.65')
        .from('.hero-claim', { opacity: 0, y: 20, duration: 0.8 }, '-=0.65')
        .from('.hero-trust', { opacity: 0, y: 14, duration: 0.6 }, '-=0.6')
        .from('.hero-card-wrapper', { opacity: 0, y: 40, scale: 0.96, duration: 1 }, '-=0.85')

      // 2. Buttery Perpetual Floating Animation on the Showcase Card
      gsap.to('.hero-float-card', {
        y: -10,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      // 3. Bento Grid Section Reveal (Left cards from Left, Right cards from Right)
      gsap.from('.bento-header', {
        scrollTrigger: { trigger: '#features', start: 'top 85%' },
        opacity: 0,
        y: 35,
        duration: 0.85,
        ease: 'power3.out',
      })

      gsap.from('.bento-left', {
        scrollTrigger: { trigger: '.bento-grid', start: 'top 82%' },
        opacity: 0,
        x: -70,
        duration: 0.95,
        stagger: 0.18,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })

      gsap.from('.bento-right', {
        scrollTrigger: { trigger: '.bento-grid', start: 'top 82%' },
        opacity: 0,
        x: 70,
        duration: 0.95,
        stagger: 0.18,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      })

      // 4. Cara Kerja: Staggered sequential slide-in from left with line connections
      gsap.from('.how-header', {
        scrollTrigger: { trigger: '#how', start: 'top 85%' },
        opacity: 0,
        y: 35,
        duration: 0.85,
        ease: 'power3.out',
      })

      const stepsTl = gsap.timeline({
        scrollTrigger: { trigger: '#how .step-grid', start: 'top 80%' },
      })
      stepsTl
        .from('.step-box-0', {
          opacity: 0,
          x: -60,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        })
        .from(
          '.step-line-0',
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.45,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          '-=0.3'
        )
        .from(
          '.step-box-1',
          {
            opacity: 0,
            x: -60,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          '-=0.2'
        )
        .from(
          '.step-line-1',
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.45,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          '-=0.3'
        )
        .from(
          '.step-box-2',
          {
            opacity: 0,
            x: -60,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          '-=0.2'
        )

      // 5. Pre-Footer Conversion Banner Reveal
      gsap.from('.cta-banner-content', {
        scrollTrigger: { trigger: '.cta-banner', start: 'top 85%' },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

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
      a: 'Link bio biasa hanya menampilkan daftar tautan pasif. tautan.site menggabungkan tautan profil dengan etalase belanja, sehingga calon pembeli bisa melihat katalog produk, memilih varian, dan mengisi alamat pengiriman langsung. Pesanan terformat otomatis ke WhatsApp Anda tanpa pembeli perlu mengetik ulang.',
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
    <div
      ref={containerRef}
      className="min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col justify-between selection:bg-[#cc785c]/25 selection:text-[#141413] font-sans"
    >
      {/* ==================================================================== */}
      {/* 1. HERO SECTION (Single Viewport Height: Left Copy & Claim, Right Preview Component) */}
      {/* ==================================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 lg:py-0 min-h-[calc(100vh-4rem)] flex items-center justify-center max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full py-4 lg:py-6">
          {/* Left Column: Headline, Subtitle, Claim Input, Trust */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h1 className="hero-headline font-sans text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.08] max-w-2xl">
              Satu tautan untuk semua yang kamu <span className="text-[#cc785c]">jual dan bagikan.</span>
            </h1>

            <p className="hero-sub mt-4 text-sm sm:text-base lg:text-lg text-[#5c5850] max-w-xl leading-relaxed font-normal">
              Gantikan link bio pasif dengan etalase belanja modern. Pajang produk, terima pesanan terstruktur, dan sambungkan pembeli langsung ke WhatsApp tanpa potongan komisi.
            </p>

            {/* Minimal Claim Input */}
            <div className="hero-claim mt-6 sm:mt-8 max-w-md w-full">
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
                  className="px-5 h-10 rounded-full bg-[#141413] hover:bg-black text-white text-xs sm:text-sm font-bold transition-all shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 group"
                >
                  <span>Klaim</span>
                  <ArrowRight className="size-3.5 text-[#cc785c] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>

              {/* Clean Trust Indicators */}
              <div className="hero-trust flex items-center justify-start gap-x-5 gap-y-2 mt-3.5 text-xs text-[#706c64] flex-wrap font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  0% Potongan Komisi
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  Buka Toko 30 Detik
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                  Gratis Selamanya
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Pure Minimalist Showcase Card with Gentle Float & Interactive Items */}
          <div className="hero-card-wrapper lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-sm sm:max-w-md">
              <div className="hero-float-card w-full p-5 sm:p-6 rounded-3xl bg-white border border-[#e6dfd8] shadow-sm hover:shadow-md transition-all text-left">
                {/* Creator Profile */}
                <div className="text-center pb-3.5 border-b border-[#f0ece5]">
                  <div className="size-12 rounded-full bg-[#cc785c] text-white flex items-center justify-center font-bold text-base mx-auto mb-2 shadow-2xs hover:scale-105 transition-transform">
                    KS
                  </div>
                  <h3 className="font-extrabold text-sm text-[#141413]">Kedai Kopi Senja</h3>
                  <span className="text-xs font-mono text-[#8c867b]">tautan.site/senja</span>
                  <p className="text-xs text-[#5c5850] mt-1 leading-relaxed">
                    Biji kopi pilihan Nusantara, diseduh segar setiap hari.
                  </p>
                </div>

                {/* Simple Clean Product Items */}
                <div className="py-3 space-y-2">
                  <div className="p-3 rounded-2xl bg-[#faf9f5] border border-[#e6dfd8] flex items-center justify-between gap-3 transition-all hover:border-[#cc785c]/40 hover:bg-white hover:-translate-y-0.5 cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80"
                      alt="Kopi Susu Aren"
                      className="size-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-[#141413] block truncate">Kopi Susu Aren</span>
                      <span className="text-xs font-mono text-[#cc785c] font-bold">{formatIDR(22000)}</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-white border border-[#e6dfd8] text-[11px] font-bold text-[#141413] shadow-2xs transition-all hover:bg-[#141413] hover:text-white select-none active:scale-95">
                      Pesan
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#faf9f5] border border-[#e6dfd8] flex items-center justify-between gap-3 transition-all hover:border-[#cc785c]/40 hover:bg-white hover:-translate-y-0.5 cursor-pointer">
                    <img
                      src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&auto=format&fit=crop&q=80"
                      alt="Croissant"
                      className="size-11 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-[#141413] block truncate">Butter Croissant</span>
                      <span className="text-xs font-mono text-[#cc785c] font-bold">{formatIDR(18000)}</span>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-white border border-[#e6dfd8] text-[11px] font-bold text-[#141413] shadow-2xs transition-all hover:bg-[#141413] hover:text-white select-none active:scale-95">
                      Pesan
                    </span>
                  </div>
                </div>

                {/* Direct Checkout CTA Bar */}
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-[#141413] hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-98"
                >
                  <span>Buka WhatsApp Toko</span>
                  <ArrowRight className="size-3.5 text-[#cc785c] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. BENTO GRID FEATURES (GSAP Directional Entrance from Left & Right) */}
      {/* ==================================================================== */}
      <section id="features" className="scroll-mt-20 border-t border-[#e6dfd8] bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="bento-header text-center max-w-2xl mx-auto mb-12 sm:mb-16">
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

          <div className="bento-grid grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Bento Card 1: Etalase & Varian (Large - 8 cols, slides from Left) */}
            <div className="bento-left md:col-span-8 p-8 sm:p-10 rounded-3xl bg-[#faf9f5] border border-[#e6dfd8] flex flex-col justify-between shadow-2xs group hover:border-[#cc785c]/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
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
                <div className="p-3.5 rounded-2xl bg-white border border-[#e6dfd8] flex items-center gap-3 shadow-2xs transition-all hover:border-[#cc785c]/40 hover:-translate-y-0.5">
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

                <div className="p-3.5 rounded-2xl bg-white border border-[#e6dfd8] flex items-center gap-3 shadow-2xs transition-all hover:border-[#cc785c]/40 hover:-translate-y-0.5">
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

            {/* Bento Card 2: 0% Komisi (4 cols, slides from Right) */}
            <div className="bento-right md:col-span-4 p-8 sm:p-10 rounded-3xl bg-[#141413] text-white border border-neutral-800 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
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

            {/* Bento Card 3: Checkout WhatsApp (6 cols, slides from Left) */}
            <div className="bento-left md:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#faf9f5] border border-[#e6dfd8] flex flex-col justify-between shadow-2xs hover:border-[#cc785c]/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
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

            {/* Bento Card 4: All-in-One Link Bio (6 cols, slides from Right) */}
            <div className="bento-right md:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#faf9f5] border border-[#e6dfd8] flex flex-col justify-between shadow-2xs hover:border-[#cc785c]/40 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
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
      {/* 3. 3-STEP WORKFLOW (GSAP Sequential Left-to-Right with Connecting Lines) */}
      {/* ==================================================================== */}
      <section id="how" className="scroll-mt-20 border-t border-[#e6dfd8] bg-[#faf9f5] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="how-header text-center max-w-xl mx-auto mb-12 sm:mb-16">
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

          <div className="relative">
            <div className="step-grid grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
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
              ].map((step, idx) => (
                <div key={step.num} className="relative flex flex-col">
                  <div
                    className={`step-box-${idx} p-7 rounded-3xl bg-white border border-[#e6dfd8] shadow-2xs hover:-translate-y-1 hover:shadow-md hover:border-[#cc785c]/40 transition-all duration-300 flex flex-col justify-between h-full relative`}
                  >
                    <div>
                      {/* Step Number */}
                      <div className="mb-4">
                        <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#cc785c]">
                          {step.num}
                        </span>
                      </div>

                      <h3 className="font-sans text-lg font-bold text-[#141413] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    {/* Connecting line between boxes on desktop */}
                    {idx < 2 && (
                      <div
                        className={`step-line-${idx} hidden md:flex items-center absolute -right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none w-6`}
                      >
                        <div className="w-full h-[2px] bg-[#cc785c]/50" />
                      </div>
                    )}
                  </div>

                  {/* Connecting line on mobile between boxes */}
                  {idx < 2 && (
                    <div className="md:hidden flex justify-center py-1.5">
                      <div className="w-[2px] h-4 bg-[#cc785c]/40" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. PERTANYAAN UMUM / FAQ (#faq) */}
      {/* ==================================================================== */}
      <section id="faq" className="scroll-mt-20 border-t border-[#e6dfd8] bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
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
      <section className="cta-banner px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-6xl mx-auto w-full">
        <div className="cta-banner-content p-8 sm:p-14 rounded-3xl bg-[#141413] text-white border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xl">
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
              className="px-7 py-4 rounded-full bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer group active:scale-98"
            >
              <span>Buka Toko Gratis Sekarang</span>
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
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
