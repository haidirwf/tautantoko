import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Plus, Search, Tag, Package, ExternalLink, X, Pencil, Trash2 } from 'lucide-react'
import type { Product } from '@/types'
import { api } from '@/lib/supabase'
import { formatIDR } from '@/lib/utils'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useAuthStore } from '@/store/useAuthStore'

export function CatalogPage() {
  const { user } = useAuthStore()
  const storeId = 'store-batik-01'
  const storeSlug = user?.storeSlug || 'batik-nusantara'
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // New product inputs
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [categoryName, setCategoryName] = useState('Kemeja Pria')
  const [imageUrl, setImageUrl] = useState('')

  // Edit product states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editCategory, setEditCategory] = useState('Kemeja Pria')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)

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
      image_url:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      is_digital: false,
      is_active: true,
      sort_order: products.length + 1,
    }

    setProducts([newProd, ...products])
    setName('')
    setPrice('')
    setDescription('')
    setImageUrl('')
    setIsAddModalOpen(false)
  }

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod)
    setEditName(prod.name)
    setEditPrice(String(prod.base_price))
    setEditDesc(prod.description || '')
    setEditImageUrl(prod.image_url || '')
    setEditIsActive(prod.is_active)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !editName.trim() || !editPrice) return

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editName,
              base_price: Number(editPrice),
              description: editDesc,
              image_url: editImageUrl.trim() || p.image_url,
              is_active: editIsActive,
            }
          : p
      )
    )

    setIsEditModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari katalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      setIsEditModalOpen(false)
      setEditingProduct(null)
    }
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'Kemeja' && p.name.toLowerCase().includes('kemeja')) ||
      (selectedCategory === 'Dress' && p.name.toLowerCase().includes('dress'))

    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout onAddProductClick={() => setIsAddModalOpen(true)}>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#e8e2d9]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono tracking-widest text-[#cc785c] font-semibold uppercase">
                KATALOG ETALASE
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] tracking-tight">
              Daftar Produk & Varian
            </h1>
            <p className="text-xs sm:text-sm text-[#706c64] mt-0.5">
              {products.length} produk siap dipesan pembeli melalui etalase tokomu.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href={`/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3.5 rounded-lg bg-white border border-[#e8e2d9] text-xs font-medium text-[#141413] hover:bg-[#faf8f5] flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>Lihat di Etalase</span>
              <ExternalLink className="size-3 text-[#706c64]" />
            </a>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 px-4 rounded-lg bg-[#cc785c] hover:bg-[#a9583e] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Tambah Produk</span>
            </button>
          </div>
        </div>

        {/* Minimal Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'Semua Produk', count: products.length },
              {
                id: 'Kemeja',
                label: 'Kemeja',
                count: products.filter((p) => p.name.toLowerCase().includes('kemeja')).length,
              },
              {
                id: 'Dress',
                label: 'Dress',
                count: products.filter((p) => p.name.toLowerCase().includes('dress')).length,
              },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#141413] text-white'
                      : 'bg-white text-[#706c64] hover:text-[#141413] border border-[#e8e2d9]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`ml-1.5 text-[10px] font-mono ${isSelected ? 'opacity-70' : 'text-[#8c867b]'}`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c867b]" />
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-7 rounded-lg bg-white border border-[#e8e2d9] text-xs text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-[#8c867b] hover:text-[#141413]"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#e8e2d9] shadow-2xs">
            <div className="size-7 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#706c64] mt-3">Memuat katalog toko...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs">
            <Package className="size-10 text-[#8c867b]/50 mx-auto mb-2" />
            <p className="font-serif text-xl font-normal text-[#141413]">Belum ada produk ditemukan</p>
            <p className="text-xs text-[#706c64] mt-1 max-w-sm mx-auto">
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}" atau kategori yang dipilih.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 rounded-lg border border-[#e8e2d9] bg-white text-xs text-[#5c5850] hover:text-[#141413]"
                >
                  Reset Pencarian
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-[#cc785c] text-white text-xs font-semibold hover:bg-[#a9583e]"
              >
                + Tambah Produk Baru
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="rounded-2xl border border-[#e8e2d9] bg-white overflow-hidden shadow-2xs hover:shadow-sm hover:border-[#cc785c]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Clean Image Container */}
                  <div className="aspect-video relative overflow-hidden bg-[#faf8f5] border-b border-[#e8e2d9]">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="size-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      {prod.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 backdrop-blur-xs text-[#137333] border border-[#ceead6] shadow-2xs">
                          <span className="size-1.5 rounded-full bg-[#137333]" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 backdrop-blur-xs text-[#706c64] border border-[#e8e2d9] shadow-2xs">
                          <span>Nonaktif</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-sm text-[#141413] truncate group-hover:text-[#cc785c] transition-colors">
                      {prod.name}
                    </h3>
                    {prod.description && (
                      <p className="text-xs text-[#706c64] mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    )}

                    {prod.variant_groups && prod.variant_groups.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {prod.variant_groups.map((vg) => (
                          <span
                            key={vg.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-[#faf8f5] border border-[#e8e2d9] text-[#706c64] font-medium"
                          >
                            <Tag className="size-2.5 text-[#cc785c]" />
                            <span>{vg.name}: {vg.options.length} opsi</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Price & Edit Action Button */}
                <div className="p-4 sm:px-5 py-3 border-t border-[#e8e2d9]/60 flex items-center justify-between bg-[#faf8f5]/40">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#8c867b] block leading-none">
                      Harga Dasar
                    </span>
                    <span className="font-sans font-bold text-base text-[#141413] tracking-tight block mt-0.5">
                      {formatIDR(prod.base_price)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prod)}
                    className="h-8 px-3 rounded-lg bg-white hover:bg-[#faf8f5] border border-[#e8e2d9] text-xs font-medium text-[#141413] flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    title="Edit rincian dan harga produk"
                  >
                    <Pencil className="size-3 text-[#cc785c]" />
                    <span>Edit</span>
                  </button>
                </div>
              </motion.div>
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
            <label className="text-xs font-medium text-[#141413] block mb-1">
              Nama Produk <span className="text-[#cc785c]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="cth. Kemeja Batik Parang Klasik"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#141413] block mb-1">
                Harga (IDR) <span className="text-[#cc785c]">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="250000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm font-mono text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#141413] block mb-1">
                Kategori
              </label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e8e2d9] text-xs sm:text-sm text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
              >
                <option value="Kemeja Pria">Kemeja Pria</option>
                <option value="Dress Wanita">Dress Wanita</option>
                <option value="Aksesoris & Tas">Aksesoris & Tas</option>
                <option value="Kuliner & F&B">Kuliner & F&B</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              URL Foto Produk (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              Deskripsi Produk
            </label>
            <textarea
              rows={2}
              placeholder="Bahan katun adem, jahitan rapi, motif parang klasik..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#e8e2d9]">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#cc785c] hover:bg-[#a9583e] text-white">
              Simpan ke Katalog
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingProduct(null)
        }}
        title={`Edit Produk: ${editingProduct?.name || ''}`}
        surface="canvas"
      >
        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 py-1 text-sm">
          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              Nama Produk <span className="text-[#cc785c]">*</span>
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#141413] block mb-1">
                Harga Dasar (IDR) <span className="text-[#cc785c]">*</span>
              </label>
              <input
                type="number"
                required
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm font-mono text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#141413] block mb-1">
                Kategori
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#e8e2d9] text-xs sm:text-sm text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
              >
                <option value="Kemeja Pria">Kemeja Pria</option>
                <option value="Dress Wanita">Dress Wanita</option>
                <option value="Aksesoris & Tas">Aksesoris & Tas</option>
                <option value="Kuliner & F&B">Kuliner & F&B</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              URL Foto Produk
            </label>
            <input
              type="url"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#141413] block mb-1">
              Deskripsi Produk
            </label>
            <textarea
              rows={2}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="editIsActive"
              checked={editIsActive}
              onChange={(e) => setEditIsActive(e.target.checked)}
              className="size-4 rounded accent-[#cc785c] cursor-pointer"
            />
            <label htmlFor="editIsActive" className="text-xs text-[#141413] font-medium cursor-pointer">
              Tampilkan produk ini di etalase toko (Aktif)
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#e8e2d9] mt-2">
            {editingProduct && (
              <button
                type="button"
                onClick={() => handleDeleteProduct(editingProduct.id)}
                className="text-xs text-[#c5221f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Hapus Produk</span>
              </button>
            )}

            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingProduct(null)
                }}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-[#cc785c] hover:bg-[#a9583e] text-white">
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
