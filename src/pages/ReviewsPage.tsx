import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Star, MessageSquare, Search, Calendar } from 'lucide-react'
import type { Review } from '@/types'
import { api } from '@/lib/supabase'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useAuthStore } from '@/store/useAuthStore'

export function ReviewsPage() {
  const { user } = useAuthStore()
  const storeId = user?.storeId || 'store-batik-01'
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRating, setSelectedRating] = useState<number | 'ALL'>('ALL')

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true)
      try {
        const data = await api.getReviews(storeId)
        setReviews(data)
      } catch (err) {
        console.error('Failed to load reviews', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadReviews()
  }, [])

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = selectedRating === 'ALL' || r.rating === selectedRating
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      r.buyer_name.toLowerCase().includes(q) ||
      (r.comment && r.comment.toLowerCase().includes(q))
    return matchesRating && matchesSearch
  })

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0'

  const ratingCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percent:
      reviews.length > 0
        ? Math.round((reviews.filter((r) => r.rating === stars).length / reviews.length) * 100)
        : 0,
  }))

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e8e2d9]">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#141413] tracking-tight">
              Ulasan Pembeli
            </h1>
            <p className="text-xs sm:text-sm text-[#706c64] mt-0.5">
              Daftar testimoni dan kepuasan pelanggan setelah bertransaksi di toko Anda.
            </p>
          </div>
        </div>

        {/* Rating Overview Card */}
        <div className="rounded-2xl border border-[#e8e2d9] bg-white p-6 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#e8e2d9] pb-6 md:pb-0 md:pr-6">
            <span className="text-xs text-[#706c64] font-medium">Skor Kepuasan Toko</span>
            <div className="font-sans font-extrabold text-4xl sm:text-5xl text-[#141413] mt-2 tracking-tight">
              {averageRating}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`size-4 ${
                    s <= Math.round(Number(averageRating))
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-[#e8e2d9]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#8c867b] mt-1.5 font-mono">
              Dari total {reviews.length} ulasan terverifikasi
            </span>
          </div>

          <div className="md:col-span-8 flex flex-col gap-2">
            {ratingCounts.map(({ stars, count, percent }) => (
              <button
                key={stars}
                type="button"
                onClick={() => setSelectedRating(selectedRating === stars ? 'ALL' : stars)}
                className={`flex items-center gap-3 text-xs w-full py-1 px-2 rounded-lg transition-colors text-left cursor-pointer ${
                  selectedRating === stars ? 'bg-[#faf8f5]' : 'hover:bg-[#faf8f5]/60'
                }`}
              >
                <span className="w-12 font-medium text-[#141413] flex items-center gap-1 shrink-0">
                  <span>{stars}</span>
                  <Star className="size-3 text-amber-500 fill-amber-500" />
                </span>
                <div className="flex-1 h-2 bg-[#faf8f5] rounded-full overflow-hidden border border-[#e8e2d9]">
                  <div
                    style={{ width: `${percent}%` }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  />
                </div>
                <span className="w-16 text-right font-mono text-[#8c867b] shrink-0">
                  {count} ({percent}%)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedRating('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedRating === 'ALL'
                  ? 'bg-[#141413] text-white'
                  : 'bg-white text-[#706c64] hover:text-[#141413] border border-[#e8e2d9]'
              }`}
            >
              Semua Bintang ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length
              const isSelected = selectedRating === stars
              if (count === 0 && !isSelected) return null
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => setSelectedRating(stars)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#141413] text-white'
                      : 'bg-white text-[#706c64] hover:text-[#141413] border border-[#e8e2d9]'
                  }`}
                >
                  <span>{stars}</span>
                  <Star className={`size-3 ${isSelected ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'}`} />
                  <span className="font-mono ml-0.5 opacity-80">({count})</span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8c867b]" />
            <input
              type="text"
              placeholder="Cari kata ulasan atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-[#e8e2d9] text-xs text-[#141413] placeholder:text-[#a09a8f] focus:outline-none focus:border-[#cc785c] focus:ring-1 focus:ring-[#cc785c] shadow-2xs"
            />
          </div>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#e8e2d9] shadow-2xs">
            <div className="size-6 rounded-full border-2 border-[#cc785c] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#706c64] mt-2.5">Memuat ulasan pelanggan...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#e8e2d9] shadow-2xs">
            <MessageSquare className="size-8 text-[#8c867b]/50 mx-auto mb-2" />
            <p className="font-sans text-base font-bold text-[#141413]">Belum ada ulasan</p>
            <p className="text-xs text-[#706c64] mt-0.5">
              {searchQuery
                ? `Tidak ada ulasan yang cocok dengan pencarian "${searchQuery}".`
                : 'Ulasan pembeli setelah checkout WhatsApp akan muncul di sini.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredReviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: idx * 0.03 }}
                className="p-5 rounded-2xl border border-[#e8e2d9] bg-white shadow-2xs flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#faf8f5] border border-[#e8e2d9] flex items-center justify-center font-sans text-xs font-bold text-[#141413]">
                      {review.buyer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#141413]">{review.buyer_name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`size-3 ${
                                star <= review.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-[#e8e2d9]'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-[#8c867b]">
                          ({review.rating}.0)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#8c867b] font-mono">
                    <Calendar className="size-3" />
                    <span>
                      {new Date(review.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {review.comment ? (
                  <p className="text-xs sm:text-sm text-[#4a4740] leading-relaxed pl-12">
                    "{review.comment}"
                  </p>
                ) : (
                  <p className="text-xs text-[#8c867b] italic pl-12">
                    Pembeli tidak menyertakan komentar tertulis.
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
