import { Plus, Trash2, X, Layers, Box } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import type { VariantGroup } from '@/types'

export interface VariantOptionDraft {
  id: string
  name: string
  price_delta: number
}

export interface VariantGroupDraft {
  id: string
  name: string
  options: VariantOptionDraft[]
}

export function draftToVariantGroups(
  drafts: VariantGroupDraft[],
  productId: string = ''
): VariantGroup[] {
  return drafts
    .filter((g) => g.name.trim() !== '' && g.options.some((o) => o.name.trim() !== ''))
    .map((g, gIdx) => ({
      id: g.id || `vg-${Date.now()}-${gIdx}`,
      product_id: productId,
      name: g.name.trim(),
      sort_order: gIdx + 1,
      options: g.options
        .filter((o) => o.name.trim() !== '')
        .map((o, oIdx) => ({
          id: o.id || `vo-${Date.now()}-${gIdx}-${oIdx}`,
          group_id: g.id,
          name: o.name.trim(),
          price_delta: Number(o.price_delta) || 0,
          sort_order: oIdx + 1,
        })),
    }))
}

export function variantGroupsToDraft(groups?: VariantGroup[]): VariantGroupDraft[] {
  if (!groups || groups.length === 0) return []
  return groups.map((g) => ({
    id: g.id,
    name: g.name,
    options: (g.options || []).map((o) => ({
      id: o.id,
      name: o.name,
      price_delta: o.price_delta || 0,
    })),
  }))
}

export interface ProductStockAndVariantsProps {
  manageStock: boolean
  onManageStockChange: (val: boolean) => void
  stockQuantity: string
  onStockQuantityChange: (val: string) => void

  hasVariants: boolean
  onHasVariantsChange: (val: boolean) => void
  variantGroups: VariantGroupDraft[]
  onVariantGroupsChange: (groups: VariantGroupDraft[]) => void
}

export function ProductStockAndVariants({
  manageStock,
  onManageStockChange,
  stockQuantity,
  onStockQuantityChange,
  hasVariants,
  onHasVariantsChange,
  variantGroups,
  onVariantGroupsChange,
}: ProductStockAndVariantsProps) {
  // Preset helpers
  const handleAddSizePreset = () => {
    onHasVariantsChange(true)
    const newGroup: VariantGroupDraft = {
      id: 'vg-' + Date.now(),
      name: 'Ukuran',
      options: [
        { id: 'vo-' + Date.now() + '-s', name: 'S', price_delta: 0 },
        { id: 'vo-' + Date.now() + '-m', name: 'M', price_delta: 0 },
        { id: 'vo-' + Date.now() + '-l', name: 'L', price_delta: 0 },
        { id: 'vo-' + Date.now() + '-xl', name: 'XL', price_delta: 10000 },
      ],
    }
    onVariantGroupsChange([...variantGroups, newGroup])
  }

  const handleAddColorPreset = () => {
    onHasVariantsChange(true)
    const newGroup: VariantGroupDraft = {
      id: 'vg-' + Date.now(),
      name: 'Warna',
      options: [
        { id: 'vo-' + Date.now() + '-blk', name: 'Hitam', price_delta: 0 },
        { id: 'vo-' + Date.now() + '-wht', name: 'Putih', price_delta: 0 },
        { id: 'vo-' + Date.now() + '-nvy', name: 'Navy', price_delta: 0 },
      ],
    }
    onVariantGroupsChange([...variantGroups, newGroup])
  }

  const handleAddNewCustomGroup = () => {
    onHasVariantsChange(true)
    const newGroup: VariantGroupDraft = {
      id: 'vg-' + Date.now(),
      name: '',
      options: [
        { id: 'vo-' + Date.now() + '-1', name: '', price_delta: 0 },
      ],
    }
    onVariantGroupsChange([...variantGroups, newGroup])
  }

  const handleRemoveGroup = (groupId: string) => {
    const updated = variantGroups.filter((g) => g.id !== groupId)
    onVariantGroupsChange(updated)
    if (updated.length === 0) {
      onHasVariantsChange(false)
    }
  }

  const handleUpdateGroupName = (groupId: string, name: string) => {
    const updated = variantGroups.map((g) => (g.id === groupId ? { ...g, name } : g))
    onVariantGroupsChange(updated)
  }

  const handleAddOption = (groupId: string) => {
    const updated = variantGroups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          options: [
            ...g.options,
            { id: 'vo-' + Date.now() + '-' + (g.options.length + 1), name: '', price_delta: 0 },
          ],
        }
      }
      return g
    })
    onVariantGroupsChange(updated)
  }

  const handleRemoveOption = (groupId: string, optionId: string) => {
    const updated = variantGroups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          options: g.options.filter((opt) => opt.id !== optionId),
        }
      }
      return g
    })
    onVariantGroupsChange(updated)
  }

  const handleUpdateOption = (
    groupId: string,
    optionId: string,
    field: 'name' | 'price_delta',
    val: string | number
  ) => {
    const updated = variantGroups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          options: g.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, [field]: val }
            }
            return opt
          }),
        }
      }
      return g
    })
    onVariantGroupsChange(updated)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 1. SECTION MANAJEMEN STOK */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-[#e8e2d9] bg-[#faf8f5]/50 p-3.5 flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-white border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] shrink-0">
              <Box className="size-3.5" />
            </div>
            <div>
              <label htmlFor="manageStockToggle" className="text-xs font-semibold text-[#141413] block cursor-pointer">
                Kelola Jumlah Stok Produk
              </label>
              <p className="text-[11px] text-[#706c64]">
                {manageStock
                  ? 'Batas stok aktif dipantau'
                  : 'Stok tidak terbatas / selalu tersedia'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              id="manageStockToggle"
              type="checkbox"
              checked={manageStock}
              onChange={(e) => onManageStockChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#e8e2d9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#cc785c]"></div>
          </label>
        </div>

        <AnimatePresence initial={false}>
          {manageStock && (
            <motion.div
              key="stock-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-[#e8e2d9]/60">
                <label className="text-[11px] font-semibold text-[#141413] block mb-1">
                  Jumlah Stok Tersedia (pcs) <span className="text-[#cc785c]">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="25"
                  value={stockQuantity}
                  onChange={(e) => onStockQuantityChange(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-white border border-[#e8e2d9] text-xs font-mono text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. SECTION VARIAN PRODUK */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-xl border border-[#e8e2d9] bg-[#faf8f5]/50 p-3.5 flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-white border border-[#e8e2d9] flex items-center justify-center text-[#cc785c] shrink-0">
              <Layers className="size-3.5" />
            </div>
            <div>
              <label htmlFor="hasVariantsToggle" className="text-xs font-semibold text-[#141413] block cursor-pointer">
                Varian Produk (Ukuran, Warna, dsb.)
              </label>
              <p className="text-[11px] text-[#706c64]">
                {hasVariants && variantGroups.length > 0
                  ? `${variantGroups.length} jenis varian aktif`
                  : 'Aktifkan jika produk memiliki opsi seperti ukuran atau warna'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
            <input
              id="hasVariantsToggle"
              type="checkbox"
              checked={hasVariants}
              onChange={(e) => {
                const checked = e.target.checked
                onHasVariantsChange(checked)
                if (checked && variantGroups.length === 0) {
                  handleAddSizePreset()
                }
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#e8e2d9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#cc785c]"></div>
          </label>
        </div>

        <AnimatePresence initial={false}>
          {hasVariants && (
            <motion.div
              key="variants-panel"
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.25 },
              }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-[#e8e2d9]/60 flex flex-col gap-3.5">
            {/* Quick Template Picker Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-white border border-[#e8e2d9]">
              <span className="text-[11px] text-[#8c867b] font-medium pl-1 mr-1">
                Template:
              </span>
              <button
                type="button"
                onClick={handleAddSizePreset}
                className="px-2.5 py-1 rounded-md bg-[#faf8f5] hover:bg-[#fae7e0]/50 border border-[#e8e2d9] hover:border-[#cc785c] text-[11px] font-medium text-[#141413] hover:text-[#cc785c] transition-colors cursor-pointer"
              >
                + Ukuran (S, M, L, XL)
              </button>
              <button
                type="button"
                onClick={handleAddColorPreset}
                className="px-2.5 py-1 rounded-md bg-[#faf8f5] hover:bg-[#fae7e0]/50 border border-[#e8e2d9] hover:border-[#cc785c] text-[11px] font-medium text-[#141413] hover:text-[#cc785c] transition-colors cursor-pointer"
              >
                + Warna (Hitam, Putih, Navy)
              </button>
            </div>

            {/* List of Variant Cards */}
            <div className="flex flex-col gap-3">
              {variantGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-3.5 rounded-xl bg-white border border-[#e8e2d9] shadow-2xs flex flex-col gap-3"
                >
                  {/* Variant Header: Name and Delete */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#e8e2d9]/60">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-[#141413] shrink-0">
                        Jenis Varian:
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ukuran, Warna, atau Bahan"
                        value={group.name}
                        onChange={(e) => handleUpdateGroupName(group.id, e.target.value)}
                        className="h-10 px-3.5 rounded-xl bg-[#faf8f5] border border-[#e8e2d9] text-sm font-semibold text-[#141413] placeholder:text-[#a09a8f] placeholder:font-normal focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] flex-1 w-full shadow-2xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(group.id)}
                      className="p-2 rounded-xl text-[#8c867b] hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 text-xs cursor-pointer shrink-0"
                      title="Hapus varian ini"
                    >
                      <Trash2 className="size-4" />
                      <span className="hidden sm:inline text-xs font-medium">Hapus</span>
                    </button>
                  </div>

                  {/* Options List */}
                  <div className="flex flex-col gap-2.5">
                    {/* Desktop Column Header (hidden on mobile for clean card layout) */}
                    <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-[#706c64] px-1">
                      <span className="flex-1 min-w-0">Nama Pilihan (Varian)</span>
                      <span className="w-44 lg:w-52 shrink-0">Tambahan Harga</span>
                      <span className="w-9 shrink-0"></span>
                    </div>

                    {group.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="p-3 sm:p-0 rounded-xl sm:rounded-none bg-[#faf8f5]/60 sm:bg-transparent border border-[#e8e2d9] sm:border-0 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3"
                      >
                        {/* Nama Pilihan */}
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8c867b] block mb-1 sm:hidden">
                              Nama Pilihan
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: S, M, L, Merah, dsb."
                              value={opt.name}
                              onChange={(e) => handleUpdateOption(group.id, opt.id, 'name', e.target.value)}
                              className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
                            />
                          </div>

                          {/* Delete button on mobile (aligned right of Nama Pilihan) */}
                          {group.options.length > 1 && (
                            <div className="sm:hidden shrink-0 mt-3.5">
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(group.id, opt.id)}
                                className="size-10 rounded-xl border border-[#e8e2d9] bg-white text-[#8c867b] hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                title="Hapus pilihan ini"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Tambahan Harga */}
                        <div className="w-full sm:w-44 lg:w-52 sm:shrink-0">
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-[#8c867b] block mb-1 sm:hidden">
                            Tambahan Harga
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="0"
                            value={opt.price_delta || ''}
                            onChange={(e) =>
                              handleUpdateOption(
                                group.id,
                                opt.id,
                                'price_delta',
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#e8e2d9] text-sm font-mono text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
                            title="Tambahan harga dari harga dasar produk"
                          />
                        </div>

                        {/* Delete button on desktop */}
                        <div className="hidden sm:flex w-9 shrink-0 justify-center">
                          {group.options.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(group.id, opt.id)}
                              className="size-9 rounded-xl text-[#8c867b] hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Hapus pilihan ini"
                            >
                              <X className="size-4" />
                            </button>
                          ) : (
                            <div className="size-9" />
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddOption(group.id)}
                      className="self-start mt-1 text-xs sm:text-sm font-medium text-[#cc785c] hover:text-[#a9583e] flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-[#fae7e0]/40 transition-colors cursor-pointer"
                    >
                      <Plus className="size-4" />
                      <span>Tambah Pilihan Lagi</span>
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddNewCustomGroup}
                className="h-10 px-4 rounded-xl border border-dashed border-[#cc785c]/60 bg-white hover:bg-[#fae7e0]/30 text-xs sm:text-sm font-medium text-[#cc785c] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="size-4" />
                <span>Tambah Jenis Varian Baru</span>
              </button>
            </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
