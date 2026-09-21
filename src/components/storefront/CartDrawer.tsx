import React, { useState } from 'react'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react'
import type { Store, Order } from '@/types'
import { formatIDR, sanitizeWhatsApp, generateOrderCode, buildWhatsAppOrderMessage } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useCartStore } from '@/store/useCartStore'
import { api } from '@/lib/supabase'

interface CartDrawerProps {
  store: Store
}

export function CartDrawer({ store }: CartDrawerProps) {
  const {
    items,
    isCartOpen,
    customerInfo,
    setCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    setCustomerInfo,
    getSubtotal,
    getItemCount,
  } = useCartStore()

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null)
  const [waLink, setWaLink] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const subtotal = getSubtotal()
  const itemCount = getItemCount()

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!customerInfo.name.trim()) {
      errors.name = 'Nama lengkap wajib diisi'
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Nomor WhatsApp wajib diisi'
    } else if (customerInfo.phone.replace(/[^0-9]/g, '').length < 9) {
      errors.phone = 'Nomor WhatsApp minimal 9 digit'
    }
    if (!customerInfo.address.trim()) {
      errors.address = 'Alamat pengiriman wajib diisi'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const orderCode = generateOrderCode()
      const sanitizedPhone = sanitizeWhatsApp(customerInfo.phone)
      const sellerPhone = sanitizeWhatsApp(store.whatsapp_number)

      const itemsSnapshot = items.map((item) => {
        const variantMap: Record<string, string> = {}
        Object.entries(item.selectedVariants).forEach(([k, v]) => {
          variantMap[k] = v.name
        })
        return {
          product_id: item.product.id,
          product_name: item.product.name,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity,
          variants: variantMap,
        }
      })

      const newOrder = await api.createOrder({
        store_id: store.id,
        order_code: orderCode,
        buyer_name: customerInfo.name.trim(),
        buyer_phone: sanitizedPhone,
        shipping_address: customerInfo.address.trim(),
        order_notes: customerInfo.notes?.trim() || '',
        subtotal: subtotal,
        shipping_fee: 0,
        total_amount: subtotal,
        payment_method: 'Belum Terkonfirmasi',
        status: 'PENDING_WA',
        items_snapshot: itemsSnapshot,
      })

      // Generate WhatsApp Link
      const message = buildWhatsAppOrderMessage(newOrder, store)
      const encodedMsg = encodeURIComponent(message)
      const generatedWaUrl = `https://wa.me/${sellerPhone}?text=${encodedMsg}`

      setLastCreatedOrder(newOrder)
      setWaLink(generatedWaUrl)
      setStep('success')
      clearCart()

      // Open WhatsApp automatically in a new window/tab
      window.open(generatedWaUrl, '_blank')
    } catch (err) {
      console.error('Failed to submit order', err)
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCartOpen(false)
    if (step === 'success') {
      setTimeout(() => setStep('cart'), 300)
    }
  }

  return (
    <>
      {/* Floating Bottom Cart Bar (visible when cart has items) */}
      {itemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-5 inset-x-0 z-40 px-4 flex justify-center pointer-events-none animate-in slide-in-from-bottom-5">
          <button
            onClick={() => {
              setStep('cart')
              setCartOpen(true)
            }}
            className="pointer-events-auto w-full max-w-md flex items-center justify-between p-3.5 pl-5 rounded-full bg-ink text-canvas border border-hairline shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="size-5 text-primary" />
                <span className="absolute -top-1.5 -right-2 size-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs text-canvas/70 block leading-none">
                  {itemCount} Produk dalam keranjang
                </span>
                <span className="font-serif text-base font-medium text-canvas tracking-tight">
                  {formatIDR(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-medium group-hover:bg-primary-active transition-colors">
              <span>Lihat Pesanan</span>
              <ArrowRight className="size-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      <Modal
        isOpen={isCartOpen}
        onClose={handleClose}
        title={
          step === 'cart'
            ? `Keranjang Belanja (${itemCount})`
            : step === 'checkout'
            ? 'Detail Pengiriman'
            : 'Pesanan Diteruskan ke WhatsApp'
        }
        surface="canvas"
        maxWidth={step === 'checkout' ? 'lg' : 'md'}
      >
        {/* Step 1: Cart Items */}
        {step === 'cart' && (
          <div className="flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <ShoppingBag className="size-12 text-muted/40 mb-3" />
                <p className="font-serif text-lg text-ink font-medium">Keranjang Anda Masih Kosong</p>
                <p className="text-xs text-muted mt-1 max-w-xs">
                  Pilih produk favorit Anda di katalog lalu klik tombol Tambah.
                </p>
                <Button variant="secondary" size="sm" onClick={handleClose} className="mt-4">
                  Kembali ke Katalog
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col divide-y divide-hairline max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="size-14 rounded-md object-cover border border-hairline shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-ink truncate">
                            {item.product.name}
                          </h4>
                          {Object.keys(item.selectedVariants).length > 0 && (
                            <p className="text-[11px] text-muted truncate mt-0.5">
                              {Object.entries(item.selectedVariants)
                                .map(([k, v]) => `${k}: ${v.name}`)
                                .join(' • ')}
                            </p>
                          )}
                          <p className="font-serif text-sm font-medium text-ink mt-1">
                            {formatIDR(item.unitPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center rounded-md border border-hairline bg-surface-card">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-muted hover:text-ink transition-colors"
                            aria-label="Kurangi"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-medium font-mono text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-muted hover:text-ink transition-colors"
                            aria-label="Tambah"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[10px] text-status-error/80 hover:text-status-error flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="size-3" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Next Step */}
                <div className="pt-4 border-t border-hairline flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Subtotal Barang</span>
                    <span className="font-serif text-xl font-medium text-ink">
                      {formatIDR(subtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted">
                    *Ongkos kirim akan dihitung & disepakati bersama penjual via WhatsApp.
                  </p>
                  <Button onClick={() => setStep('checkout')} className="w-full mt-1">
                    <span>Lanjut ke Pengiriman</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Customer Shipping Form */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Nama Lengkap <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth. Budi Santoso"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ name: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-md bg-canvas border border-hairline text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {formErrors.name && (
                  <span className="text-[11px] text-status-error mt-1 block">{formErrors.name}</span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Nomor WhatsApp Aktif <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="cth. 081234567890"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-md bg-canvas border border-hairline text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {formErrors.phone && (
                  <span className="text-[11px] text-status-error mt-1 block">{formErrors.phone}</span>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-medium text-ink block mb-1">
                  Alamat Lengkap Pengiriman <span className="text-primary">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, kota & kode pos"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ address: e.target.value })}
                  className="w-full p-3 rounded-md bg-canvas border border-hairline text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
                {formErrors.address && (
                  <span className="text-[11px] text-status-error mt-1 block">{formErrors.address}</span>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-muted block mb-1">
                  Catatan untuk Penjual (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="cth. Mohon bungkus bubble wrap tebal"
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ notes: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-md bg-canvas border border-hairline text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {/* Summary bar */}
            <div className="pt-3 border-t border-hairline flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Total Belanja ({itemCount} produk):</span>
                <span className="font-serif text-lg font-medium text-ink">
                  {formatIDR(subtotal)}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep('cart')}
                  className="w-1/3"
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 bg-primary hover:bg-primary-active"
                >
                  <MessageCircle className="size-4" />
                  <span>{isSubmitting ? 'Memproses...' : 'Kirim ke WhatsApp'}</span>
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 'success' && lastCreatedOrder && (
          <div className="py-6 text-center flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-status-success/15 text-[#1e6f32] flex items-center justify-center border border-status-success/30">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <h4 className="font-serif text-2xl font-medium text-ink">
                Pesanan Berhasil Dibuat!
              </h4>
              <p className="font-mono text-xs font-medium text-muted mt-1">
                Kode Pesanan: {lastCreatedOrder.order_code}
              </p>
            </div>

            <p className="text-xs text-muted max-w-sm leading-relaxed">
              Jendela WhatsApp Anda telah dibuka secara otomatis. Jika tidak terbuka, silakan klik tombol di bawah untuk meneruskan rincian pesanan ke penjual.
            </p>

            <div className="w-full flex flex-col gap-2 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-md bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="size-4" />
                <span>Buka WhatsApp Lagi</span>
              </a>

              <Button variant="outline" size="md" onClick={handleClose}>
                Kembali ke Toko
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
