import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Check,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Layers,
  SendHorizontal,
  Coffee,
  Shirt,
  Gift,
  Laptop,
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
    <div className="min-h-screen bg-[#faf8f5] text-[#141413] flex flex-col justify-between selection:bg-[#cc785c]/20 selection:text-[#141413]">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-24 max-w-5xl mx-auto text-left sm:text-center">
        {/* Brand pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#e8e2d9] bg-[#efe9de]/70 px-4 py-1 text-xs text-[#5c5850] mb-8 shadow-2xs">
          <Sparkles className="size-3.5 text-[#cc785c]" />
          <span>Etalase Belanja Ringkas & Checkout WhatsApp</span>
        </div>

        {/* Display Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#141413] leading-[1.05] max-w-4xl mx-auto">
          Ubah Pengunjung Media Sosial <br className="hidden sm:inline" />
          Menjadi <span className="italic font-normal text-[#cc785c]">Pembeli Pasti.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-[#5c5850] max-w-2xl mx-auto leading-relaxed">
          Tampilkan seluruh produk dan tautan bisnismu dalam satu link elegan. Pembeli memilih varian, mengisi alamat, dan pesanan terkirim rapi ke WhatsApp Anda tanpa potongan biaya transaksi.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center sm:justify-center gap-3.5">
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="group inline-flex items-center gap-3 rounded-full bg-[#141413] px-6 py-3.5 text-sm font-medium text-[#faf8f5] hover:bg-[#252523] transition-all shadow-sm active:scale-[0.98]"
          >
            <span>Buka Toko Gratis</span>
            <span className="grid size-6 place-items-center rounded-full bg-[#cc785c] text-white font-semibold text-xs group-hover:scale-110 transition-transform">
              ↗
            </span>
          </button>

          <Link
            to="/batik-nusantara"
            className="rounded-full border border-[#e8e2d9] bg-white hover:bg-[#efe9de] px-6 py-3.5 text-sm font-medium text-[#141413] transition-all inline-block shadow-2xs active:scale-[0.98]"
          >
            Jelajahi Demo Etalase
          </Link>
        </div>

        {/* Quick Slug Claim Input */}
        <div className="mt-14 max-w-md mx-auto">
          <form
            onSubmit={handleClaimSubmit}
            className="p-1.5 rounded-full border border-[#e8e2d9] bg-white shadow-sm flex items-center gap-2 focus-within:border-[#cc785c] focus-within:ring-2 focus-within:ring-[#cc785c]/20 transition-all"
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
            <button
              type="submit"
              className="px-4 sm:px-5 h-9 rounded-full bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs font-semibold whitespace-nowrap transition-colors shrink-0 shadow-2xs"
            >
              Klaim Tautan
            </button>
          </form>
          <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-[#706c64]">
            <span className="flex items-center gap-1">
              <Check className="size-3 text-status-success" />
              0% Potongan Komisi
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="size-3 text-status-success" />
              Siap dalam 30 Detik
            </span>
          </div>
        </div>

        {/* Interactive Storefront Mockup Preview */}
        <div className="mt-16 max-w-2xl mx-auto rounded-2xl border border-[#e8e2d9] bg-white p-5 sm:p-7 shadow-sm text-left">
          <div className="flex items-center justify-between pb-4 border-b border-[#e8e2d9]/60">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center font-serif text-base font-semibold text-[#cc785c]">
                BN
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm text-[#141413]">Batik & Tenun Nusantara</h4>
                  <span className="size-1.5 rounded-full bg-status-success" />
                </div>
                <p className="text-xs text-muted">Koleksi busana etnik modern katun primisima</p>
              </div>
            </div>

            <Link
              to="/batik-nusantara"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-[#cc785c] hover:underline"
            >
              <span>Buka Demo</span>
              <span>↗</span>
            </Link>
          </div>

          {/* Sample Product Row */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&auto=format&fit=crop&q=80"
                alt="Kemeja Batik"
                className="size-14 rounded-lg object-cover border border-[#e8e2d9]"
              />
              <div className="truncate">
                <span className="font-medium text-xs text-[#141413] block truncate">
                  Kemeja Batik Parang
                </span>
                <span className="font-serif text-sm text-[#141413] font-medium block mt-0.5">
                  {formatIDR(245000)}
                </span>
                <span className="text-[10px] text-muted font-mono">Pilihan: S, M, L, XL</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&auto=format&fit=crop&q=80"
                alt="Dress Tenun"
                className="size-14 rounded-lg object-cover border border-[#e8e2d9]"
              />
              <div className="truncate">
                <span className="font-medium text-xs text-[#141413] block truncate">
                  Dress Tenun Ikat Jepara
                </span>
                <span className="font-serif text-sm text-[#141413] font-medium block mt-0.5">
                  {formatIDR(320000)}
                </span>
                <span className="text-[10px] text-muted font-mono">Pilihan: All Size, Big Size</span>
              </div>
            </div>
          </div>

          {/* Formatted Order Snippet */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#efe9de]/50 border border-[#e8e2d9] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#5c5850]">
              <MessageCircle className="size-4 text-[#25D366]" />
              <span>Checkout langsung mengirim ringkasan order rapi ke WhatsApp toko Anda</span>
            </div>
            <span className="font-mono text-[11px] text-[#cc785c] font-semibold hidden sm:inline">
              Otomatis & Rapi
            </span>
          </div>
        </div>
      </section>

      {/* 2. TICKER OF MERCHANTS */}
      <section className="border-y border-[#e8e2d9] bg-[#efe9de]/40 py-5 overflow-hidden">
        <div className="max-w-5xl mx-auto flex items-center gap-6 px-4 text-xs font-mono tracking-widest text-[#706c64] uppercase">
          <span className="shrink-0 font-semibold text-[#141413]">Dipercaya Penjual</span>
          <div className="flex gap-10 overflow-x-auto no-scrollbar whitespace-nowrap text-[#706c64]">
            <span>KOPI SENJA</span>
            <span>•</span>
            <span>BATIK NUSANTARA</span>
            <span>•</span>
            <span>HIJAB ATELIER</span>
            <span>•</span>
            <span>KERAJINAN ROTAN BALI</span>
            <span>•</span>
            <span>SNACK KERIPIK IBU</span>
            <span>•</span>
            <span>STUDIO KREATIF JEPARA</span>
          </div>
        </div>
      </section>

      {/* 3. SECTION FITUR (#features) */}
      <section id="features" className="px-4 sm:px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
            01 — Fitur Utama
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#141413] mt-2">
            Segala yang kamu butuhkan untuk jualan online, <em className="italic text-[#cc785c] font-normal">tanpa kerumitan.</em>
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5850] mt-2 max-w-xl">
            Dirancang khusus untuk gaya transaksi lokal Indonesia yang mengandalkan kehangatan komunikasi di WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
            <div>
              <div className="size-10 rounded-lg bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mb-6">
                <Layers className="size-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#141413] tracking-tight">
                All-in-One Link Bio
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] mt-3 leading-relaxed">
                Satukan profil media sosial (Instagram, TikTok, Shopee, Google Maps) dan katalog barang dalam satu tautan ringkas yang mudah disematkan di bio.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#e8e2d9]/60 text-xs font-medium text-[#cc785c] flex items-center gap-1">
              <span>✦</span>
              <span>Gantikan bio-link konvensional</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
            <div>
              <div className="size-10 rounded-lg bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mb-6">
                <ShoppingBag className="size-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#141413] tracking-tight">
                Katalog Mikro & Varian
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] mt-3 leading-relaxed">
                Tampilan katalog bersih 2 kolom dengan foto tajam dan pemilih varian (seperti Ukuran atau Warna). Perhitungan total harga berjalan otomatis.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#e8e2d9]/60 text-xs font-medium text-[#cc785c] flex items-center gap-1">
              <span>✦</span>
              <span>Responsif & nyaman di smartphone</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all">
            <div>
              <div className="size-10 rounded-lg bg-[#efe9de] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] mb-6">
                <SendHorizontal className="size-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#141413] tracking-tight">
                Checkout Cepat ke WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#5c5850] mt-3 leading-relaxed">
                Pembeli cukup memasukkan nama dan alamat pengiriman. Sistem otomatis menyusun rekapan order lengkap dan membuka percakapan WhatsApp Anda.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#e8e2d9]/60 text-xs font-medium text-[#cc785c] flex items-center gap-1">
              <span>✦</span>
              <span>Tanpa login pembeli yang berbelit</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION USE CASES (#usecases) */}
      <section id="usecases" className="border-t border-[#e8e2d9] bg-[#efe9de]/30 px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
              02 — Solusi Bisnis
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#141413] mt-2">
              Didesain untuk berbagai kategori jualanmu.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between aspect-square shadow-2xs">
              <div className="size-10 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c]">
                <Coffee className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-[#141413]">Kuliner & F&B</h4>
                <p className="text-xs text-muted mt-1">Coffee shop, roti, katering, frozen food</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between aspect-square shadow-2xs">
              <div className="size-10 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c]">
                <Shirt className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-[#141413]">Fashion & Kriya</h4>
                <p className="text-xs text-muted mt-1">Batik, pakaian thrift, tenun, aksesoris</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between aspect-square shadow-2xs">
              <div className="size-10 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c]">
                <Gift className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-[#141413]">Reseller & Hampers</h4>
                <p className="text-xs text-muted mt-1">Kado custom, parcel, dropshipper produk</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col justify-between aspect-square shadow-2xs">
              <div className="size-10 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center text-[#cc785c]">
                <Laptop className="size-5" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-normal text-[#141413]">Jasa & Kreator</h4>
                <p className="text-xs text-muted mt-1">Desain grafis, fotografi, pesanan khusus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION ROADMAP / CARA KERJA (#how) */}
      <section id="how" className="px-4 sm:px-6 py-20 sm:py-28 max-w-5xl mx-auto">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
            03 — Alur Kerja
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#141413] mt-2">
            Mulai berjualan dalam <em className="italic text-[#cc785c] font-normal">tiga langkah ringkas.</em>
          </h2>
          <p className="text-xs sm:text-sm text-[#5c5850] mt-2">
            Panduan cepat menyiapkan etalase jualan profesional tanpa memerlukan skill teknis coding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-serif text-5xl font-light text-[#cc785c]">01</span>
              <div className="h-px flex-1 bg-[#e8e2d9]" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#141413] mt-4">
              Klaim Tautan Toko
            </h3>
            <p className="text-xs sm:text-sm text-[#5c5850] mt-2 leading-relaxed">
              Daftarkan tokomu dalam 30 detik. Dapatkan alamat web ringkas <span className="font-mono text-xs bg-[#efe9de] px-1.5 py-0.5 rounded border border-[#e8e2d9]">tautan.site/namatokomu</span> yang siap dibagikan ke pelanggan.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-serif text-5xl font-light text-[#cc785c]">02</span>
              <div className="h-px flex-1 bg-[#e8e2d9]" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#141413] mt-4">
              Upload Produk & Varian
            </h3>
            <p className="text-xs sm:text-sm text-[#5c5850] mt-2 leading-relaxed">
              Masukkan foto produk, tentukan harga dasar, tambahkan opsi varian (ukuran/warna), dan sematkan tautan media sosial bisnismu.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="font-serif text-5xl font-light text-[#cc785c]">03</span>
              <div className="h-px flex-1 bg-[#e8e2d9]" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#141413] mt-4">
              Pasang di Bio & Terima Order
            </h3>
            <p className="text-xs sm:text-sm text-[#5c5850] mt-2 leading-relaxed">
              Pasang tautan di bio Instagram dan TikTok. Setiap kali pembeli berbelanja, notifikasi dan rincian lengkap pesanan langsung masuk ke WhatsApp Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECTION FAQ (#faq) */}
      <section id="faq" className="border-t border-[#e8e2d9] bg-[#efe9de]/30 px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 sm:gap-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#cc785c] font-semibold">
              04 — Pertanyaan Umum
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] mt-2">
              Hal yang sering ditanyakan.
            </h2>
            <p className="text-xs text-[#5c5850] mt-2 leading-relaxed">
              Informasi seputar cara kerja, privasi data transaksi, dan pengelolaan pesanan.
            </p>
          </div>

          <div className="divide-y divide-[#e8e2d9] border-y border-[#e8e2d9]">
            {faqItems.map((item, idx) => (
              <div key={idx} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className="font-medium text-sm sm:text-base text-[#141413] group-hover:text-[#cc785c] transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`size-4 text-[#706c64] transition-transform shrink-0 ${
                      activeFaq === idx ? 'rotate-180 text-[#cc785c]' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <p className="text-xs sm:text-sm text-[#5c5850] mt-2.5 leading-relaxed pr-6 animate-in fade-in duration-200">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRE-FOOTER CTA SECTION */}
      <section className="px-4 sm:px-6 py-16 sm:py-20 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-14 rounded-2xl bg-white border border-[#e8e2d9] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141413]">
              Mulai buat etalase tokomu hari ini.
            </h2>
            <p className="text-xs sm:text-sm text-[#5c5850] mt-2 leading-relaxed">
              Daftar gratis dalam 30 detik. Tanpa kartu kredit. Tanpa potongan komisi transaksi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#141413] px-6 py-3.5 text-xs sm:text-sm font-medium text-[#faf8f5] hover:bg-[#252523] transition-all shadow-sm shrink-0"
          >
            <span>Buka Toko Sekarang</span>
            <span className="grid size-5 place-items-center rounded-full bg-[#cc785c] text-white font-semibold text-xs group-hover:scale-110 transition-transform">
              ↗
            </span>
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-[#e8e2d9] bg-[#efe9de]/40 py-10 px-4 sm:px-6 text-[#5c5850] text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-medium text-[#141413]">tautan.site</span>
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
