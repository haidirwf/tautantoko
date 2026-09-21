import { createClient } from '@supabase/supabase-js'
import type { Store, StoreLink, Category, Product, Order, OrderStatus, DashboardMetrics, Review } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Initial Mock Data for instant out-of-the-box local testing & showcase
const INITIAL_STORE: Store = {
  id: 'store-batik-01',
  slug: 'batik-nusantara',
  name: 'Batik & Tenun Nusantara',
  tagline: 'Koleksi busana etnik modern berbahan katun primisima & pewarna alam.',
  avatar_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80',
  whatsapp_number: '6281298765432',
  created_at: new Date().toISOString(),
}

const INITIAL_LINKS: StoreLink[] = [
  { id: 'l1', store_id: 'store-batik-01', title: 'Shopee Official Store', url: 'https://shopee.co.id', sort_order: 1 },
  { id: 'l2', store_id: 'store-batik-01', title: 'Instagram @batik.nusantara', url: 'https://instagram.com', sort_order: 2 },
  { id: 'l3', store_id: 'store-batik-01', title: 'Katalog Lookbook 2026', url: '#katalog', sort_order: 3 },
]

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', store_id: 'store-batik-01', name: 'Semua Produk', sort_order: 0 },
  { id: 'cat-kemeja', store_id: 'store-batik-01', name: 'Kemeja Pria', sort_order: 1 },
  { id: 'cat-dress', store_id: 'store-batik-01', name: 'Dress Wanita', sort_order: 2 },
  { id: 'cat-aksesoris', store_id: 'store-batik-01', name: 'Aksesoris & Tas', sort_order: 3 },
]

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    store_id: 'store-batik-01',
    category_id: 'cat-kemeja',
    name: 'Kemeja Batik Parang Klasik',
    description: 'Batik cap katun primisima halus dilapisi furing trikot adem. Cocok untuk acara formal & semi-formal.',
    base_price: 245000,
    image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    is_digital: false,
    is_active: true,
    sort_order: 1,
    variant_groups: [
      {
        id: 'vg-size-1',
        product_id: 'prod-01',
        name: 'Ukuran',
        sort_order: 1,
        options: [
          { id: 'vo-s', group_id: 'vg-size-1', name: 'S', price_delta: 0, sort_order: 1 },
          { id: 'vo-m', group_id: 'vg-size-1', name: 'M', price_delta: 0, sort_order: 2 },
          { id: 'vo-l', group_id: 'vg-size-1', name: 'L', price_delta: 0, sort_order: 3 },
          { id: 'vo-xl', group_id: 'vg-size-1', name: 'XL', price_delta: 15000, sort_order: 4 },
        ],
      },
    ],
  },
  {
    id: 'prod-02',
    store_id: 'store-batik-01',
    category_id: 'cat-dress',
    name: 'Dress Tenun Ikat Jepara',
    description: 'Tenun tradisional Jepara dengan potongan A-line modern dan aksen pita pinggang yang anggun.',
    base_price: 320000,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
    is_digital: false,
    is_active: true,
    sort_order: 2,
    variant_groups: [
      {
        id: 'vg-color-2',
        product_id: 'prod-02',
        name: 'Warna',
        sort_order: 1,
        options: [
          { id: 'vo-terracotta', group_id: 'vg-color-2', name: 'Terracotta', price_delta: 0, sort_order: 1 },
          { id: 'vo-sage', group_id: 'vg-color-2', name: 'Sage Green', price_delta: 0, sort_order: 2 },
        ],
      },
      {
        id: 'vg-size-2',
        product_id: 'prod-02',
        name: 'Ukuran',
        sort_order: 2,
        options: [
          { id: 'vo-allsize', group_id: 'vg-size-2', name: 'All Size (Fit to L)', price_delta: 0, sort_order: 1 },
          { id: 'vo-bigsize', group_id: 'vg-size-2', name: 'Big Size (XL-XXL)', price_delta: 25000, sort_order: 2 },
        ],
      },
    ],
  },
  {
    id: 'prod-03',
    store_id: 'store-batik-01',
    category_id: 'cat-kemeja',
    name: 'Kemeja Linen Organik Casual',
    description: 'Bahan 100% French Linen berserat rapat, breathable dan nyaman dipakai seharian di iklim tropis.',
    base_price: 185000,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    is_digital: false,
    is_active: true,
    sort_order: 3,
    variant_groups: [
      {
        id: 'vg-size-3',
        product_id: 'prod-03',
        name: 'Ukuran',
        sort_order: 1,
        options: [
          { id: 'vo-m-3', group_id: 'vg-size-3', name: 'M', price_delta: 0, sort_order: 1 },
          { id: 'vo-l-3', group_id: 'vg-size-3', name: 'L', price_delta: 0, sort_order: 2 },
          { id: 'vo-xl-3', group_id: 'vg-size-3', name: 'XL', price_delta: 10000, sort_order: 3 },
        ],
      },
    ],
  },
  {
    id: 'prod-04',
    store_id: 'store-batik-01',
    category_id: 'cat-aksesoris',
    name: 'Totebag Canvas Tenun Baduy',
    description: 'Kombinasi kanvas tebal 14oz dengan selempang ornamen tenun Baduy asli buatan tangan.',
    base_price: 135000,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    is_digital: false,
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'prod-05',
    store_id: 'store-batik-01',
    category_id: 'cat-aksesoris',
    name: 'Scarf Sutra Motif Kawung',
    description: 'Sutra satin lembut berukuran 110x110 cm dengan finishing jahit tepi rapi.',
    base_price: 160000,
    image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80',
    is_digital: false,
    is_active: true,
    sort_order: 5,
  },
]

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    store_id: 'store-batik-01',
    order_code: '#ORD-20260920-8472',
    buyer_name: 'Dewi Lestari',
    buyer_phone: '081234889900',
    shipping_address: 'Jl. Surya Kencana No. 45, Bogor Tengah, Kota Bogor',
    order_notes: 'Tolong packing rapi untuk kado ya kak',
    subtotal: 320000,
    shipping_fee: 15000,
    total_amount: 335000,
    payment_method: 'Transfer BCA',
    status: 'COMPLETED',
    courier_name: 'JNE Regular',
    tracking_number: 'JNE88291039941',
    seller_internal_note: 'Sudah selesai dan customer puas',
    items_snapshot: [
      { product_id: 'prod-02', product_name: 'Dress Tenun Ikat Jepara', unit_price: 320000, quantity: 1, subtotal: 320000, variants: { Warna: 'Terracotta', Ukuran: 'All Size (Fit to L)' } },
    ],
    paid_at: '2026-09-20T10:15:00Z',
    shipped_at: '2026-09-20T14:30:00Z',
    completed_at: '2026-09-21T02:00:00Z',
    created_at: '2026-09-20T09:40:00Z',
  },
  {
    id: 'ord-102',
    store_id: 'store-batik-01',
    order_code: '#ORD-20260920-9182',
    buyer_name: 'Rian Pratama',
    buyer_phone: '085711223344',
    shipping_address: 'Apartemen Sudirman Park Tower B Lt 12, Jakarta Pusat',
    subtotal: 490000,
    shipping_fee: 20000,
    total_amount: 510000,
    payment_method: 'QRIS Manual',
    status: 'SHIPPED',
    courier_name: 'SiCepat BEST',
    tracking_number: '003992817291',
    items_snapshot: [
      { product_id: 'prod-01', product_name: 'Kemeja Batik Parang Klasik', unit_price: 245000, quantity: 2, subtotal: 490000, variants: { Ukuran: 'L' } },
    ],
    paid_at: '2026-09-20T15:00:00Z',
    shipped_at: '2026-09-20T18:00:00Z',
    created_at: '2026-09-20T14:45:00Z',
  },
  {
    id: 'ord-103',
    store_id: 'store-batik-01',
    order_code: '#ORD-20260921-1029',
    buyer_name: 'Siti Rahmawati',
    buyer_phone: '081399887766',
    shipping_address: 'Jl. Dago Asri Blok G No. 8, Bandung',
    order_notes: 'Kirim pakai bubble wrap',
    subtotal: 185000,
    shipping_fee: 12000,
    total_amount: 197000,
    payment_method: 'Transfer Mandiri',
    status: 'PROCESSING',
    seller_internal_note: 'Bahan kemeja sedang disiapkan furingnya',
    items_snapshot: [
      { product_id: 'prod-03', product_name: 'Kemeja Linen Organik Casual', unit_price: 185000, quantity: 1, subtotal: 185000, variants: { Ukuran: 'M' } },
    ],
    paid_at: '2026-09-21T07:20:00Z',
    created_at: '2026-09-21T07:05:00Z',
  },
  {
    id: 'ord-104',
    store_id: 'store-batik-01',
    order_code: '#ORD-20260921-2304',
    buyer_name: 'Budi Santoso',
    buyer_phone: '081234567890',
    shipping_address: 'Jl. Melati No. 12, RT 01/RW 02, Bandung',
    order_notes: 'Mohon info rekening ya kak',
    subtotal: 545000,
    shipping_fee: 0,
    total_amount: 545000,
    payment_method: 'Belum Terkonfirmasi',
    status: 'PENDING_WA',
    items_snapshot: [
      { product_id: 'prod-03', product_name: 'Kemeja Linen Organik Casual', unit_price: 185000, quantity: 1, subtotal: 185000, variants: { Ukuran: 'L' } },
      { product_id: 'prod-02', product_name: 'Dress Tenun Ikat Jepara', unit_price: 360000, quantity: 1, subtotal: 360000, variants: { Warna: 'Sage Green', Ukuran: 'All Size (Fit to L)' } },
    ],
    created_at: '2026-09-21T08:10:00Z',
  },
]

const STORAGE_KEYS = {
  STORE: 'tautan_store_data',
  ORDERS: 'tautan_orders_data',
  PRODUCTS: 'tautan_products_data',
  REVIEWS: 'tautan_reviews_data',
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    store_id: 'store-batik-01',
    order_id: 'ord-102',
    buyer_name: 'Dewi Lestari',
    rating: 5,
    comment: 'Batiknya halus banget, jahitannya rapi dan pengiriman cepat via SiCepat. Seller sangat ramah!',
    created_at: '2026-09-20T19:30:00Z',
  },
  {
    id: 'rev-02',
    store_id: 'store-batik-01',
    order_id: 'ord-103',
    buyer_name: 'Siti Rahmawati',
    rating: 5,
    comment: 'Bahan kemeja linennya adem dipakai seharian di kantor. Rekomen banget buat seragam!',
    created_at: '2026-09-21T08:00:00Z',
  },
]

function getStoredReviews(): Review[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error reading localStorage reviews', e)
  }
  return INITIAL_REVIEWS
}

function saveStoredReviews(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))
  } catch (e) {
    console.error('Error saving localStorage reviews', e)
  }
}

function getStoredOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error reading localStorage orders', e)
  }
  return INITIAL_ORDERS
}

function saveStoredOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  } catch (e) {
    console.error('Error saving localStorage orders', e)
  }
}

// Data Access Service (Dual-Mode: Supabase / Mock Local)
export const api = {
  async getStoreBySlug(slug: string): Promise<Store | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) return null
      return data
    }
    // Mock store
    if (slug === 'batik-nusantara' || slug === 'demo') {
      return INITIAL_STORE
    }
    return INITIAL_STORE
  },

  async getStoreLinks(storeId: string): Promise<StoreLink[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('store_links')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true })
      return data || []
    }
    return INITIAL_LINKS
  },

  async getCategories(storeId: string): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true })
      return data || []
    }
    return INITIAL_CATEGORIES
  },

  async getProducts(storeId: string): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('products')
        .select('*, variant_groups(*, variant_options(*))')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      return data || []
    }
    return INITIAL_PRODUCTS
  },

  async createOrder(orderInput: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const newOrder: Order = {
      ...orderInput,
      id: 'ord-' + Date.now(),
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          store_id: newOrder.store_id,
          order_code: newOrder.order_code,
          buyer_name: newOrder.buyer_name,
          buyer_phone: newOrder.buyer_phone,
          shipping_address: newOrder.shipping_address,
          order_notes: newOrder.order_notes || '',
          subtotal: newOrder.subtotal,
          shipping_fee: newOrder.shipping_fee || 0,
          total_amount: newOrder.total_amount,
          payment_method: newOrder.payment_method || 'PENDING_WA',
          status: newOrder.status,
          items_snapshot: newOrder.items_snapshot,
        }])
        .select()
        .single()
      if (!error && data) return data
    }

    // LocalStorage fallback
    const orders = getStoredOrders()
    const updated = [newOrder, ...orders]
    saveStoredOrders(updated)
    return newOrder
  },

  async getOrders(storeId: string): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
      return data || []
    }
    return getStoredOrders()
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    extra?: Partial<Order>
  ): Promise<Order> {
    const patch: Partial<Order> = {
      status,
      updated_at: new Date().toISOString(),
      ...extra,
    }

    if (status === 'PAID' && !patch.paid_at) {
      patch.paid_at = new Date().toISOString()
    } else if (status === 'SHIPPED' && !patch.shipped_at) {
      patch.shipped_at = new Date().toISOString()
    } else if (status === 'COMPLETED' && !patch.completed_at) {
      patch.completed_at = new Date().toISOString()
    }

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('orders')
        .update(patch)
        .eq('id', orderId)
        .select()
        .single()
      if (data) return data
    }

    // Local update
    const orders = getStoredOrders()
    const index = orders.findIndex((o) => o.id === orderId)
    if (index !== -1) {
      const updatedOrder = { ...orders[index], ...patch }
      // Recalculate total if shipping fee changed
      if (extra?.shipping_fee !== undefined) {
        updatedOrder.total_amount = updatedOrder.subtotal + extra.shipping_fee
      }
      orders[index] = updatedOrder
      saveStoredOrders(orders)
      return updatedOrder
    }
    throw new Error('Order not found')
  },

  async getDashboardMetrics(storeId: string): Promise<DashboardMetrics> {
    const orders = await this.getOrders(storeId)

    const paidStatuses: OrderStatus[] = ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED']

    let total_settled_revenue = 0
    let pending_revenue = 0
    let paid_orders_count = 0
    let pending_orders_count = 0
    const methodCounts: Record<string, number> = {}

    for (const order of orders) {
      if (paidStatuses.includes(order.status)) {
        total_settled_revenue += order.total_amount || order.subtotal
        paid_orders_count += 1
      } else if (order.status === 'PENDING_WA') {
        pending_revenue += order.subtotal
        pending_orders_count += 1
      }

      const method = order.payment_method || 'Transfer Bank'
      methodCounts[method] = (methodCounts[method] || 0) + 1
    }

    const total_checkouts = orders.length
    const conversion_rate = total_checkouts > 0 ? (paid_orders_count / total_checkouts) * 100 : 0
    const aov = paid_orders_count > 0 ? total_settled_revenue / paid_orders_count : 0

    // Payment distribution
    const payment_distribution = Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count,
      percentage: total_checkouts > 0 ? Math.round((count / total_checkouts) * 100) : 0,
    }))

    // 7-day revenue trend simulation
    const revenue_trends = [
      { date: '15 Sep', settled: 420000, pending: 185000 },
      { date: '16 Sep', settled: 680000, pending: 245000 },
      { date: '17 Sep', settled: 510000, pending: 320000 },
      { date: '18 Sep', settled: 890000, pending: 190000 },
      { date: '19 Sep', settled: 740000, pending: 210000 },
      { date: '20 Sep', settled: 845000, pending: 350000 },
      { date: '21 Sep', settled: total_settled_revenue, pending: pending_revenue },
    ]

    const reviews = await this.getReviews(storeId)
    const totalRatingSum = reviews.reduce((sum, r) => sum + r.rating, 0)
    const average_rating = reviews.length > 0 ? Number((totalRatingSum / reviews.length).toFixed(1)) : 5.0
    const total_reviews = reviews.length

    return {
      total_settled_revenue,
      pending_revenue,
      total_checkouts,
      paid_orders_count,
      pending_orders_count,
      conversion_rate,
      aov,
      revenue_trends,
      payment_distribution,
      average_rating,
      total_reviews,
    }
  },

  async getReviews(storeId: string): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
      if (error) {
        console.warn('Supabase fetch failed, falling back to local reviews', error)
        return getStoredReviews().filter((r) => r.store_id === storeId)
      }
      return data || []
    }
    return getStoredReviews().filter((r) => r.store_id === storeId)
  },

  async createReview(input: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const newRev: Review = {
      ...input,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    const current = getStoredReviews()
    const updated = [newRev, ...current]
    saveStoredReviews(updated)

    if (isSupabaseConfigured && supabase) {
      await supabase.from('reviews').insert(newRev)
    }

    return newRev
  },
}
