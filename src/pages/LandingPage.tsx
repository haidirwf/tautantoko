import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowRight,
  MessageCircle,
  TrendingUp,
  Percent,
  Sparkles,
  XCircle,
  CheckCircle2,
  ChevronRight,
  Store,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
  const [claimSlug, setClaimSlug] = useState('')
  const [activeSection, setActiveSection] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const handleOpenAuth = (mode: 'signup' | 'login', slug = '') => {
    if (isAuthenticated) {
      navigate('/dashboard')
      return
    }
    setAuthMode(mode)
    if (slug) setClaimSlug(slug)
    setIsAuthOpen(true)
  }

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = claimSlug.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'tokoku'
    handleOpenAuth('signup', clean)
  }

  const scrollToSection = (index: number) => {
    if (window.innerWidth >= 1024 && containerRef.current) {
      const st = ScrollTrigger.getById('horizontal-st')
      if (st) {
        const panels = gsap.utils.toArray<HTMLElement>('.gsap-panel')
        const totalPanels = panels.length
        const targetProgress = index / (totalPanels - 1)
        const targetScroll = st.start + (st.end - st.start) * targetProgress
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        })
      }
    } else {
      const panels = document.querySelectorAll('.gsap-panel')
      panels[index]?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScrollEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>
      if (customEvent.detail && typeof customEvent.detail.index === 'number') {
        scrollToSection(customEvent.detail.index)
      }
    }
    window.addEventListener('landing-scroll-to', handleScrollEvent)

    const ctx = gsap.context(() => {
      const track = trackRef.current
      const container = containerRef.current
      if (!track || !container) return

      const mm = gsap.matchMedia()

      // Desktop: Horizontal pin & scrub scroll (min-width: 1024px)
      mm.add('(min-width: 1024px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.gsap-panel')
        const totalPanels = panels.length

        const horizontalTween = gsap.to(panels, {
          xPercent: -100 * (totalPanels - 1),
          ease: 'none',
          scrollTrigger: {
            id: 'horizontal-st',
            trigger: container,
            pin: true,
            scrub: 0.8,
            snap: {
              snapTo: 1 / (totalPanels - 1),
              duration: { min: 0.25, max: 0.5 },
              delay: 0.05,
              ease: 'power2.inOut',
            },
            end: () => `+=${container.offsetWidth * (totalPanels - 1)}`,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`
              }
              const currentIdx = Math.round(self.progress * (totalPanels - 1))
              setActiveSection(currentIdx)
            },
          },
        })

        return () => {
          horizontalTween.scrollTrigger?.kill()
          horizontalTween.kill()
        }
      })

      // Mobile / Tablet: Smooth staggered entrance for stacked cards
      mm.add('(max-width: 1023px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.gsap-panel')
        panels.forEach((panel, i) => {
          gsap.from(panel, {
            opacity: 0.3,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              end: 'top 40%',
              scrub: true,
              onEnter: () => setActiveSection(i),
            },
          })
        })
      })
    }, containerRef)

    return () => {
      window.removeEventListener('landing-scroll-to', handleScrollEvent)
      ctx.revert()
    }
  }, [])

  const sectionsMeta = [
    { number: '01', title: 'Intro' },
    { number: '02', title: 'Tradisional vs Modern' },
    { number: '03', title: 'Keunggulan' },
    { number: '04', title: 'Klaim Toko' },
  ]

  return (
    <div className="relative bg-[#faf8f5] text-[#141413] selection:bg-[#cc785c]/25 selection:text-[#141413]">
      {/* Top Scrub Progress Bar (Pinned Viewport) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#e8e2d9]/40 pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-[#cc785c] origin-left transition-transform duration-75 will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Floating Bottom Navigation Bar (Desktop) */}
      <div className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 items-center gap-1.5 p-1.5 rounded-full bg-[#141413]/90 backdrop-blur-md border border-[#ffffff]/10 shadow-2xl text-white">
        {sectionsMeta.map((s, idx) => {
          const isActive = activeSection === idx
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => scrollToSection(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-white text-[#141413] font-bold shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{s.number}</span>
              <span className={`text-[11px] font-sans ${isActive ? 'inline-block' : 'hidden xl:inline-block'}`}>
                {s.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main GSAP Horizontal Container */}
      <div ref={containerRef} className="lg:h-screen lg:overflow-hidden w-full relative">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row lg:w-[400vw] lg:h-full will-change-transform"
        >
          {/* ==================================================================== */}
          {/* PANEL 1: HERO SECTION */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 shrink-0 relative border-b lg:border-b-0 lg:border-r border-[#e8e2d9]/70 bg-[#faf8f5]">
            {/* Background Texture & Glow */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-[#cc785c]/6 blur-3xl pointer-events-none" />

            {/* Top Tagline */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8c867b]">
                [ 01 • Era Baru Link-in-Bio ]
              </span>
              <span className="text-xs font-mono text-[#8c867b] hidden sm:block">
                tautan.site v1.2
              </span>
            </div>

            {/* Main Center Content */}
            <div className="my-auto py-10 lg:py-0 max-w-5xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efe9de] border border-[#e8e2d9] text-[#706c64] text-xs font-medium mb-6">
                <Sparkles className="size-3.5 text-[#cc785c]" />
                <span>Katalog Produk + Checkout Otomatis WhatsApp</span>
              </div>

              <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#141413] leading-[1.08]">
                Bukan Sekadar Tautan. <br />
                Ini <span className="italic font-bold text-[#cc785c]">Mesin Kasir</span> di Medsosmu.
              </h1>

              <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#5c5850] max-w-2xl leading-relaxed">
                Tampilkan seluruh etalase produk dalam satu tautan elegan. Pembeli memilih varian, mengisi alamat, dan pesanan masuk rapi ke WhatsApp Anda tanpa potongan komisi.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="px-6 py-3.5 rounded-full bg-[#141413] hover:bg-[#2b2824] text-white font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center gap-2.5 cursor-pointer"
                >
                  <span>Buka Toko Sekarang</span>
                  <ArrowRight className="size-4 text-[#cc785c]" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection(1)}
                  className="px-5 py-3.5 rounded-full bg-white hover:bg-[#efe9de] text-[#141413] border border-[#e8e2d9] font-medium text-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Lihat Perbedaannya</span>
                  <ChevronRight className="size-4 text-[#8c867b]" />
                </button>
              </div>
            </div>

            {/* Bottom Footer Cue */}
            <div className="flex items-center justify-between text-xs text-[#8c867b] font-mono border-t border-[#e8e2d9]/60 pt-4 z-10">
              <span className="hidden sm:inline">0% Komisi • Langsung ke WhatsApp Penjual</span>
              <div className="flex items-center gap-2 text-[#cc785c] animate-pulse">
                <span>Geser ke kanan untuk menjelajah</span>
                <ArrowRight className="size-3.5" />
              </div>
            </div>
          </section>

          {/* ==================================================================== */}
          {/* PANEL 2: TRADISIONAL VS MODERN (THE CONTRAST) */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 shrink-0 relative border-b lg:border-b-0 lg:border-r border-[#e8e2d9]/70 bg-[#faf8f5]">
            {/* Header */}
            <div className="flex items-center justify-between z-10 mb-6 lg:mb-0">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8c867b]">
                [ 02 • Tradisional vs Modern ]
              </span>
              <span className="text-xs font-mono text-[#8c867b] hidden sm:block">
                Efisiensi Bisnis
              </span>
            </div>

            {/* Center Content: Side by Side Cards */}
            <div className="my-auto py-6 lg:py-0 w-full max-w-6xl mx-auto z-10">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141413]">
                  Tinggalkan Cara Jualan Usang.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#5c5850]">
                  Bandingkan kerepotan membalas chat satu per satu dengan sistem checkout otomatis tautan.site.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
                {/* ❌ Cara Tradisional */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-rose-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-rose-400" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Cara Lama (Manual)
                      </span>
                      <XCircle className="size-5 text-rose-500" />
                    </div>

                    <h3 className="font-sans text-xl font-bold text-[#141413] mb-4">
                      Drama Chat yang Bikin Pembeli Kabur
                    </h3>

                    <ul className="space-y-3.5 text-xs sm:text-sm text-[#5c5850]">
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span><strong>Tanya jawab stok berulang:</strong> "Warna hitam ukuran L masih ada kak?" — penjual telat balas, pembeli batal beli.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span><strong>Ketik format order manual:</strong> Pembeli malas ketik panjang nama, alamat, nomor HP, sering typo & salah kirim.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span><strong>Hitung ongkir kalkulator:</strong> Rekap satu per satu secara manual, rawan salah jumlah transfer.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-rose-100 text-xs font-mono text-rose-700/80">
                    Konversi rendah • Waktu terbuang • Rawan kesalahan
                  </div>
                </div>

                {/* ✨ tautan.site Modern */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#141413] text-white border border-[#2b2824] shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#cc785c]" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#cc785c]/20 text-[#cc785c] border border-[#cc785c]/30">
                        Modern (tautan.site)
                      </span>
                      <CheckCircle2 className="size-5 text-[#cc785c]" />
                    </div>

                    <h3 className="font-sans text-xl font-bold text-white mb-4">
                      Satu Tautan, Langsung Rapi Masuk WA
                    </h3>

                    <ul className="space-y-3.5 text-xs sm:text-sm text-[#d4cebe]">
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#cc785c] font-bold">✓</span>
                        <span><strong>Katalog Visual Self-Service:</strong> Pembeli langsung lihat foto, deskripsi, dan ketersediaan stok sendiri.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#cc785c] font-bold">✓</span>
                        <span><strong>Pilih Varian & Alamat Sekaligus:</strong> Varian ukuran/warna dan alamat lengkap terisi otomatis dalam form cepat.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-[#cc785c] font-bold">✓</span>
                        <span><strong>Pesan WhatsApp Terstruktur:</strong> Rincian barang, jumlah, dan subtotal langsung tergenerate rapi saat tombol ditekan.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#2b2824] text-xs font-mono text-[#cc785c]">
                    Hemat 80% waktu chat • Konversi instan • Rekap terdata rapi
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Cue */}
            <div className="flex items-center justify-between text-xs text-[#8c867b] font-mono border-t border-[#e8e2d9]/60 pt-4 z-10">
              <span className="hidden sm:inline">Percepatan Alur Checkout Pelanggan</span>
              <div className="flex items-center gap-2 text-[#cc785c]">
                <span>Lanjut ke fitur utama</span>
                <ArrowRight className="size-3.5" />
              </div>
            </div>
          </section>

          {/* ==================================================================== */}
          {/* PANEL 3: 3 PILAR FITUR ESENSIAL */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 shrink-0 relative border-b lg:border-b-0 lg:border-r border-[#e8e2d9]/70 bg-[#faf8f5]">
            {/* Header */}
            <div className="flex items-center justify-between z-10 mb-6 lg:mb-0">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8c867b]">
                [ 03 • Tiga Pilar Esensial ]
              </span>
              <span className="text-xs font-mono text-[#8c867b] hidden sm:block">
                Nilai Tambah
              </span>
            </div>

            {/* Center Content: 3 Feature Cards */}
            <div className="my-auto py-6 lg:py-0 w-full max-w-6xl mx-auto z-10">
              <div className="max-w-2xl mb-10">
                <h2 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-[#141413]">
                  Semua yang Anda Butuhkan untuk Menjual Lebih Cepat.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#5c5850]">
                  Tanpa komplikasi e-commerce raksasa. Fokus pada apa yang menghasilkan uang untuk bisnis Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e8e2d9] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="size-12 rounded-2xl bg-[#cc785c]/10 text-[#cc785c] flex items-center justify-center mb-6">
                      <Percent className="size-6" />
                    </div>
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#141413] mb-2.5">
                      0% Potongan Komisi
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                      Marketplace memotong hingga 6-12% omzet Anda. Di tautan.site, 100% uang pembayaran pembeli masuk utuh langsung ke rekening bank atau QRIS pribadi Anda.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#e8e2d9]/60 font-mono text-xs text-[#cc785c] font-semibold">
                    100% Profit Milik Anda
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e8e2d9] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="size-12 rounded-2xl bg-[#141413] text-white flex items-center justify-center mb-6">
                      <MessageCircle className="size-6 text-[#cc785c]" />
                    </div>
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#141413] mb-2.5">
                      Checkout Cepat via WA
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                      Pembeli tidak perlu install aplikasi atau bikin akun baru. Pesanan langsung masuk ke WhatsApp Anda dengan format rapi beserta rincian varian & alamat.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#e8e2d9]/60 font-mono text-xs text-[#cc785c] font-semibold">
                    Tanpa Wajib Registrasi Pembeli
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#e8e2d9] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="size-12 rounded-2xl bg-[#efe9de] text-[#141413] flex items-center justify-center mb-6">
                      <TrendingUp className="size-6 text-[#cc785c]" />
                    </div>
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-[#141413] mb-2.5">
                      Dashboard Finansial & Resi
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5c5850] leading-relaxed">
                      Lacak pesanan yang sudah lunas, hitung omzet mingguan, catat catatan internal pembeli, dan input nomor resi pengiriman dalam satu dasbor rapi.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#e8e2d9]/60 font-mono text-xs text-[#cc785c] font-semibold">
                    Terdata Otomatis & Rapi
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Cue */}
            <div className="flex items-center justify-between text-xs text-[#8c867b] font-mono border-t border-[#e8e2d9]/60 pt-4 z-10">
              <span className="hidden sm:inline">Desain Ringan & Cepat Diakses</span>
              <div className="flex items-center gap-2 text-[#cc785c]">
                <span>Lanjut klaim domain</span>
                <ArrowRight className="size-3.5" />
              </div>
            </div>
          </section>

          {/* ==================================================================== */}
          {/* PANEL 4: CLAIM DOMAIN & SIGN UP (CALL TO ACTION) */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 shrink-0 relative bg-[#141413] text-white">
            {/* Header */}
            <div className="flex items-center justify-between z-10 mb-6 lg:mb-0">
              <span className="text-xs uppercase font-mono tracking-widest text-[#cc785c]">
                [ 04 • Mulai Sekarang ]
              </span>
              <span className="text-xs font-mono text-white/50 hidden sm:block">
                Klaim Domain Gratis
              </span>
            </div>

            {/* Center Content: Claim Domain Box */}
            <div className="my-auto py-8 lg:py-0 w-full max-w-4xl mx-auto text-center z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium mb-6">
                <Store className="size-3.5 text-[#cc785c]" />
                <span>Siap Digunakan dalam 60 Detik</span>
              </div>

              <h2 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Amankan Nama Tokomu <br />
                Sebelum Diambil Orang Lain.
              </h2>

              <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl mx-auto">
                Ketik nama bisnismu di bawah ini untuk mengklaim domain tokomu secara instan dan mulai upload produk sekarang.
              </p>

              {/* Claim Domain Input Form */}
              <form
                onSubmit={handleClaimSubmit}
                className="mt-8 max-w-lg mx-auto bg-white p-2 rounded-2xl sm:rounded-full border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center w-full sm:w-auto flex-1 pl-4 pr-2 py-1">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-[#8c867b] select-none">
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
                    className="w-full pl-1 pr-2 py-1.5 bg-transparent text-sm sm:text-base font-mono font-medium text-[#141413] placeholder:text-[#a09a8f] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-[#cc785c] hover:bg-[#b8674d] text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Klaim Sekarang</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#cc785c]" />
                  Gratis Selamanya
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#cc785c]" />
                  Tanpa Kartu Kredit
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#cc785c]" />
                  0% Biaya Transaksi
                </span>
              </div>
            </div>

            {/* Bottom Footer Credits */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40 font-mono border-t border-white/10 pt-4 z-10">
              <span>© {new Date().getFullYear()} tautan.site • Platform Etalase & Link-in-Bio</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenAuth('login')}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Sudah punya akun? Masuk
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Auth Modal Triggered by Claim Domain or Navbar */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        initialSlug={claimSlug}
      />
    </div>
  )
}
