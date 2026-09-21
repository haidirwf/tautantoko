import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ArrowRight, Utensils, Shirt, Package, Sparkles, ChevronDown } from 'lucide-react'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/useAuthStore'

export function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [quickEmail, setQuickEmail] = useState('')
  const [quickSlug, setQuickSlug] = useState('')
  const [quickPassword, setQuickPassword] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const navigate = useNavigate()
  const { signup, login } = useAuthStore()

  const handleQuickSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickEmail.trim()) return
    const cleanSlug = quickSlug.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'tokoku'
    signup(quickEmail, cleanSlug)
    navigate('/dashboard')
  }

  const handleGoogleAuth = () => {
    login('penjual.umkm@gmail.com')
    navigate('/dashboard')
  }

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx)
  }

  const faqs = [
    {
      q: 'Apakah benar-benar 0% biaya potongan transaksi?',
      a: 'Benar sekali. Semua transfer dana dari pembeli langsung masuk ke rekening bank pribadi (BCA, Mandiri, BRI) atau QRIS milik Anda tanpa potongan sepeser pun dari pihak ketiga.',
    },
    {
      q: 'Apakah saya membutuhkan kartu kredit untuk mendaftar?',
      a: 'Tidak perlu. Pendaftaran toko cukup dengan email atau akun Google — tanpa kartu kredit, tanpa masa percobaan terkunci.',
    },
    {
      q: 'Bagaimana alur transaksi dan checkout WhatsApp bekerja?',
      a: 'Pembeli memilih barang dan varian di etalase Anda, mengisi alamat pengiriman, lalu menekan tombol checkout. Sistem langsung menyusun pesan pesanan terformat rapi dan membuka chat WhatsApp Anda.',
    },
    {
      q: 'Apakah saya bisa menambahkan varian ukuran, warna, dan catatan khusus?',
      a: 'Ya, Anda bebas menambahkan kelompok varian (seperti Ukuran S/M/L atau Pilihan Warna) dengan penyesuaian harga otomatis.',
    },
    {
      q: 'Di mana saya bisa mengelola pesanan dan laporan penjualan?',
      a: 'Setelah Anda masuk (login), Anda memiliki akses privat ke Dashboard Toko untuk memantau omzet, mencatat bukti transfer, menginput nomor resi, dan memantau status pesanan.',
    },
  ]

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between selection:bg-primary/20 selection:text-ink">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-24 max-w-5xl mx-auto text-left sm:text-center">
        {/* Made for sellers badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-card px-3.5 py-1 text-xs text-muted mb-8 shadow-2xs">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          <span>Solusi Etalase WhatsApp untuk UMKM & Penjual Mandiri</span>
        </div>

        {/* Display Headline matching user inspiration */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-display leading-[1.02] text-ink max-w-4xl mx-auto">
          Toko online <span className="italic font-light text-primary">kamu,</span>
          <br />siap dalam 5 menit.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
          Satu halaman. Semua link sosmed, semua katalog produk, satu tombol checkout langsung masuk ke WhatsApp. Tanpa potongan transaksi untuk semua penjual.
        </p>

        {/* Hero CTA Buttons matching user reference */}
        <div className="mt-9 flex flex-wrap items-center sm:justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-canvas hover:bg-ink/90 transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Klaim tautan tokomu</span>
            <span className="grid size-6 place-items-center rounded-full bg-primary text-white font-semibold text-xs group-hover:scale-110 transition-transform">
              ↗
            </span>
          </button>

          <Link
            to="/batik-nusantara"
            className="rounded-full border border-hairline bg-surface-card hover:bg-surface-soft px-6 py-3.5 text-sm font-medium text-ink transition-all inline-block shadow-2xs active:scale-[0.98]"
          >
            Lihat demo storefront
          </Link>
        </div>

        {/* 2. INLINE SIGNUP MANIFESTO CARD */}
        <div className="mt-14 max-w-lg mx-auto p-6 sm:p-7 rounded-2xl bg-surface-card border border-hairline shadow-xs text-left">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-serif text-2xl font-normal tracking-tight text-ink">
              Bikin akun tokomu.
            </h3>
            <span className="text-xs font-mono text-primary font-medium bg-canvas px-2 py-0.5 rounded border border-hairline">
              30 detik
            </span>
          </div>
          <p className="text-xs text-muted mb-5">
            Mulai gratis sekarang. Tanpa kartu kredit. Tanpa masa percobaan terkunci.
          </p>

          <form onSubmit={handleQuickSignup} className="flex flex-col gap-3">
            <div className="flex items-center rounded-lg bg-canvas border border-hairline focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 px-3">
              <span className="text-xs text-muted font-mono select-none">tautan.site/</span>
              <input
                type="text"
                required
                placeholder="namatokomu"
                value={quickSlug}
                onChange={(e) => setQuickSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="w-full h-10 bg-transparent text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none pl-0.5 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="email"
                required
                placeholder="Email kamu"
                value={quickEmail}
                onChange={(e) => setQuickEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg bg-canvas border border-hairline text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="password"
                required
                placeholder="Password"
                value={quickPassword}
                onChange={(e) => setQuickPassword(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg bg-canvas border border-hairline text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-full bg-primary hover:bg-primary-active text-white text-xs sm:text-sm font-medium transition-colors shadow-2xs mt-1 flex items-center justify-center gap-2"
            >
              <span>Mulai Buat Toko Gratis</span>
              <ArrowRight className="size-3.5" />
            </button>
          </form>

          {/* Or with Google */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-hairline" />
            <span className="text-[10px] font-mono text-muted uppercase">atau</span>
            <div className="h-px flex-1 bg-hairline" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full h-10 px-4 rounded-full border border-hairline bg-canvas hover:bg-surface-soft text-ink text-xs font-medium flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <svg className="size-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sudah punya akun? Masuk dengan Google</span>
          </button>
        </div>
      </section>

      {/* 3. TICKER / DIPAKAI OLEH */}
      <section className="border-y border-hairline bg-surface-card/60 py-5 overflow-hidden">
        <div className="max-w-5xl mx-auto flex items-center gap-8 px-4 text-xs font-mono tracking-widest text-muted uppercase">
          <span className="shrink-0 font-semibold text-ink">Dipakai Oleh</span>
          <div className="flex gap-10 overflow-x-auto no-scrollbar whitespace-nowrap text-muted">
            <span>KOPI SENJA</span>
            <span>•</span>
            <span>BATIK NUSANTARA</span>
            <span>•</span>
            <span>HIJAB ATELIER</span>
            <span>•</span>
            <span>SNACK KERIPIK IBU</span>
            <span>•</span>
            <span>TENUN JEPARA</span>
            <span>•</span>
            <span>DESAIN KREATIF HUB</span>
          </div>
        </div>
      </section>

      {/* 4. SECTION FITUR (#features) */}
      <section id="features" className="px-4 sm:px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-muted">
            01 — Fitur Utama
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ink mt-2">
            Tiga hal yang <em className="italic text-primary font-normal">benar-benar</em> dibutuhkan penjual online.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {/* Feature 1 */}
          <div className="p-7 rounded-xl bg-surface-card border border-hairline flex flex-col justify-between hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>/01</span>
                <span className="text-primary font-semibold">↗</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink tracking-tight mt-8">
                All-in-One Link
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2.5 leading-relaxed">
                Satu tautan ringkas untuk bio Instagram, TikTok, Shopee, lokasi toko, dan katalog produk langsung. Tak perlu sewa layanan link-in-bio lain.
              </p>
            </div>
            <div className="mt-8 pt-3 border-t border-hairline/60 text-[11px] font-mono text-ink flex items-center gap-1">
              <span>✦</span>
              <span>Gantikan link bio biasa</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-xl bg-surface-card border border-hairline flex flex-col justify-between hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>/02</span>
                <span className="text-primary font-semibold">↗</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink tracking-tight mt-8">
                Micro-Catalogue
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2.5 leading-relaxed">
                Tampilan katalog bersih 2 kolom dengan varian ukuran, warna, serta penyesuaian harga instan yang mudah dipahami pembeli di layar ponsel.
              </p>
            </div>
            <div className="mt-8 pt-3 border-t border-hairline/60 text-[11px] font-mono text-ink flex items-center gap-1">
              <span>✦</span>
              <span>Mudah dipilih di smartphone</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-xl bg-surface-card border border-hairline flex flex-col justify-between hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>/03</span>
                <span className="text-primary font-semibold">↗</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink tracking-tight mt-8">
                WhatsApp Order Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2.5 leading-relaxed">
                Pembeli tidak perlu login rumit. Form alamat otomatis dirangkai menjadi pesan terstruktur yang siap dikirim langsung ke WhatsApp Anda.
              </p>
            </div>
            <div className="mt-8 pt-3 border-t border-hairline/60 text-[11px] font-mono text-ink flex items-center gap-1">
              <span>✦</span>
              <span>Zero friction checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION USE CASES (#usecases) */}
      <section id="usecases" className="border-t border-hairline bg-surface-card/40 px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted">
              02 — Use Cases
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ink mt-2">
              Cocok untuk beragam jenis jualanmu.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12">
            {/* Card 1 */}
            <div className="p-6 rounded-xl bg-canvas border border-hairline hover:border-primary/40 transition-all flex flex-col justify-between aspect-square">
              <div className="size-10 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-primary">
                <Utensils className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-ink">F&B & Kuliner</h4>
                <p className="text-xs text-muted mt-1">Coffee shop, bakery, snack, katering</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl bg-canvas border border-hairline hover:border-primary/40 transition-all flex flex-col justify-between aspect-square">
              <div className="size-10 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-primary">
                <Shirt className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-ink">Fashion & Thrift</h4>
                <p className="text-xs text-muted mt-1">Batik, kaos, hijab, aksesoris</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl bg-canvas border border-hairline hover:border-primary/40 transition-all flex flex-col justify-between aspect-square">
              <div className="size-10 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-primary">
                <Package className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-ink">Reseller & Agen</h4>
                <p className="text-xs text-muted mt-1">Dropshipper, pre-order, katalog distributor</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-xl bg-canvas border border-hairline hover:border-primary/40 transition-all flex flex-col justify-between aspect-square">
              <div className="size-10 rounded-lg bg-surface-card border border-hairline flex items-center justify-center text-primary">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-ink">Jasa & Kreator</h4>
                <p className="text-xs text-muted mt-1">Desain, hampers, custom gift, fotografi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION CARA KERJA / ROADMAP SIMPEL (#how) */}
      <section id="how" className="px-4 sm:px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-muted">
            03 — Cara Kerja
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-ink mt-2">
            Tiga langkah ringkas. <em className="italic text-primary font-normal">Tidak ribet.</em>
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Panduan cepat bagi penjual yang ingin segera mulai menerima pesanan hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {/* Step 1 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-serif text-5xl font-light tracking-tight text-primary/70">
                01
              </span>
              <div className="h-px flex-1 bg-hairline" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-ink mt-4">
              Daftar & Klaim Tautan
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
              Buat akun dalam 30 detik tanpa kartu kredit. Amankan nama tokomu dengan slug khusus <span className="font-mono text-ink text-xs bg-surface-card px-1.5 py-0.5 rounded border border-hairline">tautan.site/tokomu</span>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-serif text-5xl font-light tracking-tight text-primary/70">
                02
              </span>
              <div className="h-px flex-1 bg-hairline" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-ink mt-4">
              Upload Produk & Sosmed
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
              Masukkan foto produk, harga, varian (ukuran/warna), dan link media sosial Anda (Instagram, Shopee, TikTok) dari panel manajemen.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-serif text-5xl font-light tracking-tight text-primary/70">
                03
              </span>
              <div className="h-px flex-1 bg-hairline" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-ink mt-4">
              Pasang di Bio & Terima Order
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
              Tempelkan link di bio media sosial. Setiap pesanan pembeli langsung masuk dengan rincian lengkap ke chat WhatsApp Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SECTION FAQ (#faq) */}
      <section id="faq" className="border-t border-hairline bg-surface-card/30 px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 sm:gap-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted">
              04 — FAQ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink mt-2">
              Pertanyaan yang sering diajukan.
            </h2>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Semua hal penting seputar pembukaan toko, alur pembayaran, dan privasi akun Anda.
            </p>
          </div>

          <div className="divide-y divide-hairline border-y border-hairline">
            {faqs.map((item, idx) => (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="font-medium text-sm sm:text-base text-ink group-hover:text-primary transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted transition-transform shrink-0 ${
                      activeFaq === idx ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <p className="text-xs sm:text-sm text-muted mt-2.5 leading-relaxed pr-6 animate-in fade-in duration-200">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRE-FOOTER CTA SECTION (Warm, cohesive, no out-of-place black box) */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-14 rounded-2xl bg-surface-card border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
              Siap membuat toko online kamu sekarang?
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Buka tokomu dalam 30 detik. Tanpa kartu kredit. Tanpa potongan biaya transaksi.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-xs sm:text-sm font-medium text-canvas hover:bg-ink/90 transition-all shadow-sm"
            >
              <span>Mulai gratis sekarang</span>
              <span className="grid size-5 place-items-center rounded-full bg-primary text-white font-semibold text-xs group-hover:scale-110 transition-transform">
                ↗
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-hairline bg-surface-card/60 py-10 px-4 sm:px-6 text-muted text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-medium text-ink">tautan.site</span>
            <span>— Storefront Instan & WhatsApp Checkout untuk UMKM</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-ink transition-colors">Fitur</a>
            <a href="#how" className="hover:text-ink transition-colors">Cara Kerja</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
            <button onClick={() => setIsAuthOpen(true)} className="hover:text-ink transition-colors font-medium text-primary">
              Masuk Penjual
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-hairline/60 flex items-center justify-between text-[11px] text-muted">
          <span>© 2026 tautan.site. Dibuat dengan cinta untuk UMKM & penjual mandiri Indonesia.</span>
          <span className="flex items-center gap-1">
            <Check className="size-3 text-status-success" />
            0% Komisi Transaksi
          </span>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
