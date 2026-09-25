import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ChevronRight } from 'lucide-react'
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
  const [heroVariant, setHeroVariant] = useState<'ice' | 'hot'>('ice')
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'minuman' | 'pastry'>('all')
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(1)

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
        const getScrollDistance = () => track.scrollWidth - window.innerWidth

        const horizontalTween = gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'horizontal-st',
            trigger: container,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${self.progress})`
              }
            },
          },
        })

        return () => {
          horizontalTween.scrollTrigger?.kill()
          horizontalTween.kill()
        }
      })

      // Mobile / Tablet: Smooth entrance for stacked cards
      mm.add('(max-width: 1023px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.gsap-panel')
        panels.forEach((panel) => {
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
            },
          })
        })
      })
    }, containerRef)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('landing-scroll-to', handleScrollEvent)
      ctx.revert()
    }
  }, [])

  return (
    <div className="relative bg-[#faf8f5] text-[#141413] selection:bg-[#cc785c]/25 selection:text-[#141413]">
      {/* Top Scrub Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-[#e8e2d9]/40 pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-[#cc785c] origin-left transition-transform duration-75 will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Main GSAP Horizontal Container */}
      <div ref={containerRef} className="lg:h-screen lg:overflow-hidden w-full relative">
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row lg:w-[400vw] lg:h-full will-change-transform"
        >
          {/* ==================================================================== */}
          {/* PANEL 1: HERO */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-center pt-20 pb-8 px-6 sm:px-12 lg:px-20 shrink-0 relative border-b lg:border-b-0 lg:border-r border-[#e8e2d9]/70 bg-[#faf8f5]">
            <div className="max-w-6xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10">
              {/* Left: Headline & Copy */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#141413] leading-[1.08]">
                  Bukan Sekadar Tautan. <br />
                  <span className="text-[#cc785c]">Mesin Kasir</span> di Medsosmu.
                </h1>

                <p className="mt-5 text-base sm:text-lg text-[#5c5850] max-w-xl leading-relaxed">
                  Tampilkan etalase produk, terima pesanan terstruktur, dan arahkan pembeli langsung ke WhatsApp tanpa potongan komisi.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => handleOpenAuth('signup')}
                    className="px-6 py-3.5 rounded-full bg-[#141413] hover:bg-[#252523] text-white font-medium text-sm transition-colors shadow-sm flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>Buka Toko Gratis</span>
                    <ArrowRight className="size-4 text-[#cc785c]" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => scrollToSection(1)}
                    className="px-5 py-3.5 rounded-full bg-white hover:bg-[#efe9de] text-[#141413] border border-[#e8e2d9] font-medium text-sm transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Lihat Perbandingan</span>
                    <ChevronRight className="size-4 text-[#8c867b]" />
                  </motion.button>
                </div>
              </div>

              {/* Right: Clean Product Preview Card */}
              <div className="lg:col-span-5 w-full">
                <div className="rounded-3xl bg-white border border-[#e8e2d9] shadow-xs p-6 sm:p-7">
                  <div className="flex items-center justify-between pb-4">
                    <div>
                      <div className="text-sm font-bold text-[#141413]">Kedai Kopi Senja</div>
                      <div className="text-xs font-mono text-[#8c867b]">tautan.site/senja</div>
                    </div>
                    <span className="text-xs font-mono text-[#8c867b]">Etalase Toko</span>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e8e2d9]/60">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-sans text-sm sm:text-base font-bold text-[#141413]">
                          Kopi Susu Aren 250ml
                        </h3>
                        <p className="text-xs text-[#706c64] mt-0.5">Espresso, susu segar, gula aren organik</p>
                      </div>
                      <span className="text-sm font-mono font-bold text-[#141413] shrink-0">
                        Rp 22.000
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setHeroVariant('ice')}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            heroVariant === 'ice'
                              ? 'bg-[#141413] text-white'
                              : 'text-[#706c64] hover:text-[#141413]'
                          }`}
                        >
                          Dingin
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroVariant('hot')}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            heroVariant === 'hot'
                              ? 'bg-[#141413] text-white'
                              : 'text-[#706c64] hover:text-[#141413]'
                          }`}
                        >
                          Hangat
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenAuth('signup')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Pesan via WA</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================================== */}
          {/* PANEL 2: PERBANDINGAN BERSIH */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-center pt-20 pb-8 px-6 sm:px-12 lg:px-20 shrink-0 relative border-b lg:border-b-0 lg:border-r border-[#e8e2d9]/70 bg-[#faf8f5]">
            <div className="w-full max-w-5xl mx-auto my-auto z-10">
              <div className="max-w-2xl mb-10">
                <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#141413]">
                  Tinggalkan Cara Jualan Usang.
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[#5c5850]">
                  Bandingkan alur transaksi manual dengan kecepatan checkout terstruktur tautan.site.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Cara Tradisional */}
                <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e8e2d9] shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600">
                      Sebelumnya
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#141413] mt-3 mb-3">
                      Waktu habis merekap chat berulang
                    </h3>
                    <p className="text-sm text-[#5c5850] leading-relaxed">
                      Pertanyaan harga yang sama, konfirmasi varian manual, dan format alamat yang sering keliru memperlambat alur penjualan Anda setiap hari.
                    </p>
                  </div>
                  <div className="mt-8 text-xs font-mono text-[#8c867b]">
                    Pembeli sering batal transaksi karena lama menunggu balasan.
                  </div>
                </div>

                {/* Modern tautan.site */}
                <div className="p-8 sm:p-10 rounded-3xl bg-[#141413] text-white border border-[#2b2824] shadow-md flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#cc785c]">
                      Dengan tautan.site
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-white mt-3 mb-3">
                      Katalog rapi, checkout otomatis ke WhatsApp
                    </h3>
                    <p className="text-sm text-[#d4cebe] leading-relaxed">
                      Pembeli memilih varian dan mengisi alamat dalam hitungan detik. Rincian pesanan siap kirim langsung tersaji di WhatsApp Anda.
                    </p>
                  </div>
                  <div className="mt-8 text-xs font-mono text-[#cc785c]">
                    Alur transaksi instan tanpa drama chat bolak-balik.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================================== */}
          {/* PANEL 3: UI KATALOG PRODUK */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-center pt-20 pb-8 px-6 sm:px-12 lg:px-20 shrink-0 relative border-b lg:border-b-0 lg:border-r border-[#e8e2d9]/70 bg-[#faf8f5]">
            <div className="w-full max-w-5xl mx-auto my-auto z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
                <div>
                  <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#141413]">
                    Etalase Bersih, Belanja Cepat.
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-[#5c5850]">
                    Katalog simpel yang dilihat pembeli. Pilih produk, tentukan varian, lalu checkout ke WhatsApp.
                  </p>
                </div>

                {/* Filter Kategori Simpel */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#e8e2d9] shadow-2xs shrink-0 self-start sm:self-auto">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'minuman', label: 'Minuman' },
                    { id: 'pastry', label: 'Pastry' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCatalogFilter(tab.id as 'all' | 'minuman' | 'pastry')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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

              {/* Grid Kartu Produk */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {filteredCatalogProducts.map((item) => {
                  const isSelected = selectedCatalogId === item.id
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCatalogId(isSelected ? null : item.id)}
                      className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'border-[#cc785c] ring-2 ring-[#cc785c]/20 shadow-md'
                          : 'border-[#e8e2d9] hover:border-[#cc785c]/40 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#faf8f5] mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="size-full object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-sans text-base font-bold text-[#141413] group-hover:text-[#cc785c] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#706c64] mt-1 line-clamp-1">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#e8e2d9]/60 flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-[#141413]">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        <span
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#cc785c] text-white'
                              : 'bg-[#faf8f5] text-[#141413] border border-[#e8e2d9] group-hover:bg-[#141413] group-hover:text-white group-hover:border-[#141413]'
                          }`}
                        >
                          {isSelected ? 'Dipilih' : '+ Tambah'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bar Simulasi Checkout */}
              <div className="mt-6 p-4 rounded-2xl bg-[#141413] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                  <span className="text-white/60">Simulasi:</span>
                  <span className="font-medium text-white">
                    {selectedCatalogItem
                      ? `1 pesanan dipilih (${selectedCatalogItem.name} • Rp ${selectedCatalogItem.price.toLocaleString('id-ID')})`
                      : 'Pilih produk di atas untuk simulasi pemesanan'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#cc785c] hover:bg-[#b8674d] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <span>Buka Toko Sekarang</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* ==================================================================== */}
          {/* PANEL 4: KLAIM DOMAIN TOKO */}
          {/* ==================================================================== */}
          <section className="gsap-panel w-full lg:w-screen h-auto lg:h-full flex flex-col justify-center pt-20 pb-8 px-6 sm:px-12 lg:px-20 shrink-0 relative bg-[#141413] text-white">
            <div className="my-auto py-6 lg:py-0 w-full max-w-3xl mx-auto text-center z-10">
              <h2 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Amankan Nama Tokomu <br />
                Sebelum Diambil Penjual Lain.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
                Ketik nama tokomu untuk mengklaim link bio tokomu secara instan dan mulai pajang produk hari ini.
              </p>

              {/* Minimal Claim Domain Form */}
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-[#cc785c] hover:bg-[#b8674d] text-white text-sm font-semibold transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Klaim Sekarang</span>
                  <ArrowRight className="size-4" />
                </motion.button>
              </form>
            </div>

            {/* Bottom Footer Credits */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40 font-mono border-t border-white/10 pt-4 z-10 max-w-5xl mx-auto w-full">
              <span>© {new Date().getFullYear()} tautan.site • Platform Etalase dan Link-in-Bio</span>
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                Sudah punya akun? Masuk
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Auth Modal Triggered by Claim Domain or CTA */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        initialSlug={claimSlug}
      />
    </div>
  )
}
