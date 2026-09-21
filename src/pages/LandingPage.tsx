import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, MessageCircle, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 max-w-5xl mx-auto text-center">
        {/* Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-xs text-muted mb-8 shadow-2xs">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          <span>Versi 1.1.0 • Arsitektur WhatsApp Commerce & Fintech Dashboard</span>
        </div>

        {/* Display Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-display text-ink leading-[1.05] max-w-4xl mx-auto">
          Toko Link-in-Bio & Katalog Mikro <br className="hidden sm:inline" />
          <span className="italic text-primary">tanpa potongan</span> transaksi.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          Kombinasi elegan profil media sosial dan etalase belanja instan. Pesanan dikirim langsung ke WhatsApp penjual, dilengkapi dashboard finansial sekelas payment gateway.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/batik-nusantara">
            <Button size="lg" className="h-12 px-7 text-sm font-medium shadow-md">
              <ShoppingBag className="size-4" />
              <span>Buka Demo Etalase Toko</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="h-12 px-7 text-sm font-medium">
              <BarChart3 className="size-4 text-primary" />
              <span>Dashboard Finansial Merchant</span>
            </Button>
          </Link>
        </div>

        {/* Value Prop Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20 text-left">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl bg-surface-card border border-hairline flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-primary mb-4">
                <MessageCircle className="size-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink tracking-tight">
                Langsung ke WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Pembeli memilih varian produk, mengisi data kirim, dan pesanan otomatis diformat rapi ke chat WhatsApp penjual dalam 1 ketukan.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-hairline/60 flex items-center gap-1.5 text-xs font-medium text-primary">
              <Zap className="size-3.5" />
              <span>Zero-fee transaksi gateway</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-xl bg-surface-dark border border-[#2b2824] text-on-dark flex flex-col justify-between shadow-md">
            <div>
              <div className="size-10 rounded-lg bg-surface-dark-elevated border border-[#38342f] flex items-center justify-center text-primary mb-4">
                <BarChart3 className="size-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-on-dark tracking-tight">
                Fintech Command Center
              </h3>
              <p className="text-xs sm:text-sm text-on-dark-soft mt-2 leading-relaxed">
                Pantau Total Pendapatan Terverifikasi, Pending Pipeline, AOV, dan laju konversi dari transaksi manual dengan presisi matematis 100%.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-[#38342f] flex items-center gap-1.5 text-xs font-medium text-status-success">
              <ShieldCheck className="size-3.5" />
              <span>Transparansi finansial penuh</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-xl bg-surface-card border border-hairline flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-primary mb-4">
                <Zap className="size-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink tracking-tight">
                Ultra Cepat di cPanel
              </h3>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Single Page Application teroptimasi tanpa butuh server Node.js. Bundle statis di bawah 300KB siap di-deploy ke hosting cPanel standar dengan rewrite <code className="font-mono text-xs bg-canvas px-1 py-0.5 rounded border border-hairline">.htaccess</code>.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-hairline/60 flex items-center gap-1.5 text-xs font-medium text-primary">
              <Zap className="size-3.5" />
              <span>Lighthouse Score &gt; 95</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-surface-dark border-t border-[#2b2824] text-on-dark-soft py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg text-on-dark font-medium">tautan.site</span>
            <span>— Solusi Toko WhatsApp & Dashboard Finansial</span>
          </div>
          <p>© 2026 tautan.site. Dibangun berdasarkan PRD v1.1.0 & claude.design.md</p>
        </div>
      </footer>
    </div>
  )
}
