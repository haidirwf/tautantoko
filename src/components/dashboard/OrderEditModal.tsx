import React, { useState, useEffect } from 'react'
import { MessageCircle, Save } from 'lucide-react'
import type { Order, OrderStatus } from '@/types'
import { formatIDR, sanitizeWhatsApp } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'

interface OrderEditModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onSave: (orderId: string, status: OrderStatus, extra: Partial<Order>) => Promise<void>
}

export function OrderEditModal({ order, isOpen, onClose, onSave }: OrderEditModalProps) {
  const [status, setStatus] = useState<OrderStatus>('PENDING_WA')
  const [shippingFee, setShippingFee] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [courierName, setCourierName] = useState<string>('')
  const [trackingNumber, setTrackingNumber] = useState<string>('')
  const [sellerNote, setSellerNote] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (order) {
      setStatus(order.status)
      setShippingFee(order.shipping_fee || 0)
      setPaymentMethod(order.payment_method || 'Transfer BCA')
      setCourierName(order.courier_name || '')
      setTrackingNumber(order.tracking_number || '')
      setSellerNote(order.seller_internal_note || '')
    }
  }, [order])

  if (!order) return null

  const calculatedTotal = order.subtotal + (shippingFee || 0)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await onSave(order.id, status, {
        shipping_fee: shippingFee,
        total_amount: calculatedTotal,
        payment_method: paymentMethod,
        courier_name: courierName,
        tracking_number: trackingNumber,
        seller_internal_note: sellerNote,
      })
      onClose()
    } catch (error) {
      console.error('Error updating order', error)
      alert('Gagal menyimpan perubahan pesanan.')
    } finally {
      setIsSaving(false)
    }
  }

  const buyerWaClean = sanitizeWhatsApp(order.buyer_phone)
  const directWaUrl = `https://wa.me/${buyerWaClean}?text=${encodeURIComponent(
    `Halo kak ${order.buyer_name}, perihal pesanan ${order.order_code}...`
  )}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Kelola Pesanan: ${order.order_code}`}
      description={`Dibuat pada ${new Date(order.created_at).toLocaleString('id-ID')}`}
      maxWidth="lg"
      surface="canvas"
    >
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        {/* Customer & Items Overview */}
        <div className="p-4 rounded-lg bg-surface-card border border-hairline flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-ink">{order.buyer_name}</span>
                <span className="font-mono text-xs text-muted">({order.buyer_phone})</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{order.shipping_address}</p>
            </div>
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#136329] border border-[#25D366]/30 text-xs font-medium transition-colors shrink-0"
            >
              <MessageCircle className="size-3.5" />
              <span>Chat Pembeli via WA</span>
            </a>
          </div>

          {/* Items Table Snapshot */}
          <div className="pt-2 border-t border-hairline/60">
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted block mb-1.5">
              Rincian Barang
            </span>
            <div className="flex flex-col divide-y divide-hairline/40 text-xs">
              {order.items_snapshot.map((item, idx) => (
                <div key={idx} className="py-1.5 flex justify-between">
                  <div className="truncate pr-2">
                    <span className="font-medium text-ink">
                      {item.quantity}x {item.product_name}
                    </span>
                    {item.variants && Object.keys(item.variants).length > 0 && (
                      <span className="text-muted ml-1">
                        ({Object.entries(item.variants).map(([k, v]) => `${k}: ${v}`).join(', ')})
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-ink shrink-0">{formatIDR(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Lifecycle Status Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-ink block">
            Status Progres Pesanan
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(
              [
                { id: 'PENDING_WA', label: '1. Menunggu WA' },
                { id: 'PAID', label: '2. Sudah Bayar' },
                { id: 'PROCESSING', label: '3. Diproses' },
                { id: 'SHIPPED', label: '4. Dikirim' },
                { id: 'COMPLETED', label: '5. Selesai' },
                { id: 'CANCELLED', label: 'Batal / Expired' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatus(s.id)}
                className={`p-2.5 rounded-md border text-xs font-medium text-left transition-all ${
                  status === s.id
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                    : 'border-hairline bg-surface-card text-ink hover:bg-surface-soft'
                }`}
              >
                <Badge status={s.id} className="mb-1 block" />
                <span className="block text-[11px] text-muted">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shipping & Financial Ledger Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Ongkos Kirim Disepakati (IDR)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={shippingFee}
              onChange={(e) => setShippingFee(Number(e.target.value) || 0)}
              className="w-full h-10 px-3.5 rounded-md bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Metode Pembayaran
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="Transfer BCA">Transfer BCA</option>
              <option value="Transfer Mandiri">Transfer Mandiri</option>
              <option value="Transfer BRI">Transfer BRI</option>
              <option value="Transfer BNI">Transfer BNI</option>
              <option value="QRIS Manual">QRIS Manual</option>
              <option value="COD / Bayar di Tempat">COD / Bayar di Tempat</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Courier & Tracking (Resi) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Nama Kurir
            </label>
            <input
              type="text"
              placeholder="cth. JNE Regular, SiCepat, GoSend"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Nomor Resi Pengiriman
            </label>
            <input
              type="text"
              placeholder="cth. JNE1029384829"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
            />
          </div>
        </div>

        {/* Internal Seller Notes */}
        <div>
          <label className="text-xs font-medium text-ink block mb-1">
            Catatan Khusus Penjual (Internal)
          </label>
          <input
            type="text"
            placeholder="Catatan rahasia untuk merchant..."
            value={sellerNote}
            onChange={(e) => setSellerNote(e.target.value)}
            className="w-full h-10 px-3.5 rounded-md bg-canvas border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Financial Summary & Save Button */}
        <div className="pt-3 border-t border-hairline flex items-center justify-between">
          <div>
            <span className="text-xs text-muted block">Total Akhir Pesanan:</span>
            <span className="font-serif text-2xl font-medium text-ink tracking-tight">
              {formatIDR(calculatedTotal)}
            </span>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="size-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
