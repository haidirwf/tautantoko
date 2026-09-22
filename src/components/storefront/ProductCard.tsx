import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Check } from 'lucide-react'
import type { Product, VariantOption } from '@/types'
import { formatIDR } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useCartStore } from '@/store/useCartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, VariantOption>>({})
  const [addedAnimation, setAddedAnimation] = useState(false)

  const hasVariants = product.variant_groups && product.variant_groups.length > 0

  // Initialize default variant choices
  const handleOpenVariantModal = () => {
    if (hasVariants) {
      const defaults: Record<string, VariantOption> = {}
      product.variant_groups?.forEach((group) => {
        if (group.options.length > 0) {
          defaults[group.name] = group.options[0]
        }
      })
      setSelectedVariants(defaults)
      setIsVariantModalOpen(true)
    } else {
      handleAddDirect()
    }
  }

  const handleAddDirect = () => {
    addItem(product, {}, 1)
    triggerAddedFeedback()
  }

  const handleAddWithVariants = () => {
    addItem(product, selectedVariants, 1)
    setIsVariantModalOpen(false)
    triggerAddedFeedback()
  }

  const triggerAddedFeedback = () => {
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 1200)
  }

  // Calculate current price with chosen variants
  const calculatedPrice = product.base_price + Object.values(selectedVariants).reduce(
    (sum, opt) => sum + (opt.price_delta || 0),
    0
  )

  const isOutOfStock = product.stock !== undefined && product.stock !== null && product.stock <= 0
  const isLimitedStock = product.stock !== undefined && product.stock !== null && product.stock > 0

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col rounded-xl overflow-hidden bg-surface-card border border-hairline transition-shadow duration-200 hover:shadow-md group"
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-[#e8e2d8]">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-600 text-white shadow-2xs">
                Stok Habis
              </span>
            ) : isLimitedStock && product.stock! <= 5 ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-300/80 shadow-2xs">
                Sisa {product.stock}
              </span>
            ) : null}
            {hasVariants && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-canvas/90 backdrop-blur-xs text-ink border border-hairline shadow-2xs">
                Ada Varian
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
          <div>
            <h3 className="font-semibold text-xs sm:text-base text-ink line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-[11px] sm:text-xs text-muted mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-hairline/60 gap-1">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-muted block uppercase tracking-wider font-mono">
                Harga
              </span>
              <span className="font-sans text-xs sm:text-base font-bold text-ink tracking-tight truncate block">
                {formatIDR(product.base_price)}
              </span>
            </div>

            <motion.button
              whileHover={isOutOfStock ? undefined : { scale: 1.05 }}
              whileTap={isOutOfStock ? undefined : { scale: 0.95 }}
              type="button"
              disabled={isOutOfStock}
              onClick={isOutOfStock ? undefined : handleOpenVariantModal}
              className={`h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[11px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-colors shadow-2xs shrink-0 ${
                isOutOfStock
                  ? 'bg-[#eae5dd] text-[#8c867b] cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-status-success/15 text-status-success border border-status-success/30'
                  : 'bg-primary hover:bg-primary-active text-white cursor-pointer'
              }`}
              aria-label={isOutOfStock ? `${product.name} stok habis` : `Tambah ${product.name} ke keranjang`}
            >
              {isOutOfStock ? (
                <span>Habis</span>
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  {addedAnimation ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="size-3 sm:size-3.5" />
                      <span>Masuk</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="normal"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center gap-1"
                    >
                      <Plus className="size-3 sm:size-3.5" />
                      <span>Tambah</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Variant Selection Modal */}
      {hasVariants && (
        <Modal
          isOpen={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          title={`Pilih Varian: ${product.name}`}
          surface="canvas"
        >
          <div className="flex flex-col gap-5">
            {/* Image Preview in Modal */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-card border border-hairline">
              <img
                src={product.image_url}
                alt={product.name}
                className="size-16 rounded-md object-cover border border-hairline shrink-0"
              />
              <div className="truncate">
                <h4 className="text-sm font-medium text-ink truncate">{product.name}</h4>
                <p className="font-sans text-base font-bold text-primary mt-0.5 tracking-tight">
                  {formatIDR(calculatedPrice)}
                </p>
              </div>
            </div>

            {/* Variant Groups */}
            {product.variant_groups?.map((group) => (
              <div key={group.id} className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted uppercase tracking-wider font-mono">
                  {group.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const isSelected = selectedVariants[group.name]?.id === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [group.name]: option,
                          }))
                        }
                        className={`px-3 py-1.5 text-xs rounded-md border font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-surface-card text-ink border-hairline hover:bg-surface-soft'
                        }`}
                      >
                        {option.name}
                        {option.price_delta > 0 && ` (+${formatIDR(option.price_delta)})`}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Modal Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-hairline">
              <div>
                <span className="text-[10px] text-muted block uppercase tracking-wider font-mono">
                  Total
                </span>
                <span className="font-sans text-lg font-bold text-ink tracking-tight">
                  {formatIDR(calculatedPrice)}
                </span>
              </div>
              <Button onClick={handleAddWithVariants}>
                <Plus className="size-4" />
                Tambah ke Keranjang
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
