import React, { useState, useEffect } from 'react'
import { Plus, Search, Tag, Eye } from 'lucide-react'
import type { Product } from '@/types'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

export function CatalogPage() {
  const storeId = 'store-batik-01'
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // New product inputs
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [categoryName, setCategoryName] = useState('Kemeja Pria')

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const data = await api.getProducts(storeId)
        setProducts(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price) return

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      store_id: storeId,
      name,
      description,
      base_price: Number(price),
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      is_digital: false,
      is_active: true,
      sort_order: products.length + 1,
    }

    setProducts([newProd, ...products])
    setName('')
    setPrice('')
    setDescription('')
    setIsAddModalOpen(false)
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout onAddProductClick={() => setIsAddModalOpen(true)}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e8e2d9]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#cc785c] font-semibold">
              Manajemen Katalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] tracking-tight mt-1">
              Daftar Produk & Varian
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Kelola barang jualan, ketersediaan, dan harga varian yang tampil di etalase tokomu.
            </p>
          </div>

          <Button onClick={() => setIsAddModalOpen(true)} className="self-start sm:self-auto">
            <Plus className="size-4" />
            <span>Tambah Produk</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3.5 rounded-lg bg-white border border-[#e8e2d9] text-xs sm:text-sm text-ink focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c]"
          />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="size-8 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-sm text-muted mt-3">Memuat katalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white border border-[#e8e2d9]">
            <p className="font-serif text-lg font-medium text-[#141413]">Belum ada produk</p>
            <p className="text-xs text-muted mt-1">Mulai tambahkan produk pertamamu sekarang.</p>
            <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="mt-4">
              + Tambah Produk
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="rounded-xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video relative overflow-hidden bg-[#efe9de]">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm text-[#141413] truncate">{prod.name}</h3>
                    {prod.description && (
                      <p className="text-xs text-muted mt-1 line-clamp-2">{prod.description}</p>
                    )}
                    {prod.variant_groups && prod.variant_groups.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {prod.variant_groups.map((vg) => (
                          <span
                            key={vg.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#faf8f5] border border-[#e8e2d9] text-muted font-mono"
                          >
                            <Tag className="size-2.5" />
                            <span>{vg.name}: {vg.options.length} opsi</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-[#e8e2d9]/60 flex items-center justify-between">
                  <span className="font-serif text-base font-medium text-[#141413]">
                    {formatIDR(prod.base_price)}
                  </span>
                  <span className="text-[11px] text-status-success font-medium flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>Aktif</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Produk Baru"
        surface="canvas"
      >
        <form onSubmit={handleAddProduct} className="flex flex-col gap-4 py-1 text-sm">
          <div>
            <label className="text-xs font-medium block mb-1">Nama Produk <span className="text-primary">*</span></label>
            <input
              type="text"
              required
              placeholder="cth. Kemeja Tenun Parang"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-md bg-[#faf8f5] border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1">Harga (IDR) <span className="text-primary">*</span></label>
              <input
                type="number"
                required
                placeholder="250000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3.5 rounded-md bg-[#faf8f5] border border-hairline text-sm font-mono text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Kategori</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-[#faf8f5] border border-hairline text-xs sm:text-sm text-ink focus:outline-none focus:border-primary"
              >
                <option value="Kemeja Pria">Kemeja Pria</option>
                <option value="Dress Wanita">Dress Wanita</option>
                <option value="Aksesoris & Tas">Aksesoris & Tas</option>
                <option value="Kuliner & F&B">Kuliner & F&B</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1">Deskripsi Produk</label>
            <textarea
              rows={2}
              placeholder="Jelaskan keunggulan dan bahan produk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-md bg-[#faf8f5] border border-hairline text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-hairline">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit">
              Simpan ke Katalog
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
