import { createClient } from '@supabase/supabase-js'
import type { Store, StoreLink, Category, Product, Order, OrderStatus, DashboardMetrics, Review } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const STORAGE_KEYS = {
  STORE: 'tautan_store_data',
  ORDERS: 'tautan_orders_data',
  PRODUCTS: 'tautan_products_data',
  REVIEWS: 'tautan_reviews_data',
}

/**
 * Utility to completely clear local storage mock/dump cache
 */
export function clearAllDumpData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.STORE)
    localStorage.removeItem(STORAGE_KEYS.ORDERS)
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS)
    localStorage.removeItem(STORAGE_KEYS.REVIEWS)
    localStorage.removeItem('auth-storage')

    // Clean any lingering keys starting with tautan_
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('tautan_') || key.startsWith('sb-') || key === 'auth-storage') {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.error('Failed to clear dump data from localStorage', e)
  }
}

function getStoredReviews(): Review[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error reading localStorage reviews', e)
  }
  return []
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
  return []
}

function saveStoredOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  } catch (e) {
    console.error('Error saving localStorage orders', e)
  }
}

function getStoredProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error reading localStorage products', e)
  }
  return []
}

function saveStoredProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
  } catch (e) {
    console.error('Error saving localStorage products', e)
  }
}

// Data Access Service (Pure Supabase with Clean Fallback)
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
    return null
  },

  async getStoreByUserId(userId: string): Promise<Store | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      if (error) return null
      return data
    }
    return null
  },

  async saveStoreOnboarding({
    userId,
    name,
    slug,
    whatsappNumber,
    tagline,
  }: {
    userId: string
    name: string
    slug: string
    whatsappNumber: string
    tagline: string
  }): Promise<Store> {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    let cleanWa = whatsappNumber.replace(/[^0-9]/g, '')
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.slice(1)
    }

    if (isSupabaseConfigured && supabase) {
      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (existingStore) {
        const { data, error } = await supabase
          .from('stores')
          .update({
            name: name.trim(),
            slug: cleanSlug,
            whatsapp_number: cleanWa,
            tagline: tagline.trim(),
            is_onboarded: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingStore.id)
          .select()
          .single()

        if (error) {
          if (error.code === '23505' || error.message?.includes('slug')) {
            throw new Error(`Tautan 'tautan.site/${cleanSlug}' sudah dipakai toko lain. Silakan gunakan variasi nama lain.`)
          }
          throw error
        }
        return data
      } else {
        const { data, error } = await supabase
          .from('stores')
          .insert([
            {
              user_id: userId,
              name: name.trim(),
              slug: cleanSlug,
              whatsapp_number: cleanWa,
              tagline: tagline.trim(),
              is_onboarded: true,
            },
          ])
          .select()
          .single()

        if (error) {
          if (error.code === '23505' || error.message?.includes('slug')) {
            throw new Error(`Tautan 'tautan.site/${cleanSlug}' sudah dipakai toko lain. Silakan gunakan variasi nama lain.`)
          }
          throw error
        }
        return data
      }
    }

    return {
      id: 'store-' + Date.now(),
      slug: cleanSlug,
      name: name.trim(),
      tagline: tagline.trim(),
      avatar_url: '',
      whatsapp_number: cleanWa,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  },

  async updateStore(storeId: string, updates: Partial<Store>): Promise<Store> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stores')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', storeId)
        .select()
        .single()
      if (error) throw error
      return data
    }
    return {
      id: storeId,
      slug: '',
      name: '',
      tagline: '',
      avatar_url: '',
      whatsapp_number: '',
      ...updates,
    }
  },

  async getStoreLinks(storeId: string): Promise<StoreLink[]> {
    if (isSupabaseConfigured && supabase && storeId) {
      const { data } = await supabase
        .from('store_links')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true })
      return data || []
    }
    return []
  },

  async getCategories(storeId: string): Promise<Category[]> {
    if (isSupabaseConfigured && supabase && storeId) {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true })
      return data || []
    }
    return []
  },

  async getProducts(storeId: string): Promise<Product[]> {
    if (!storeId) return []
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('products')
        .select('*, variant_groups(*, variant_options(*))')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      return data || []
    }
    return getStoredProducts().filter((p) => p.store_id === storeId)
  },

  async createProduct(productInput: Omit<Product, 'id'>): Promise<Product> {
    const newProd: Product = {
      ...productInput,
      id: 'prod-' + Date.now(),
      is_active: productInput.is_active ?? true,
      sort_order: productInput.sort_order ?? 1,
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([newProd])
        .select()
        .single()
      if (!error && data) return data
    }

    const current = getStoredProducts()
    const updated = [newProd, ...current]
    saveStoredProducts(updated)
    return newProd
  },

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    const current = getStoredProducts()
    const index = current.findIndex((p) => p.id === productId)
    if (index !== -1) {
      const updatedProduct = { ...current[index], ...updates }
      current[index] = updatedProduct
      saveStoredProducts(current)

      if (isSupabaseConfigured && supabase) {
        await supabase.from('products').update(updates).eq('id', productId)
      }

      return updatedProduct
    }
    throw new Error('Product not found')
  },

  async deleteProduct(productId: string): Promise<void> {
    const current = getStoredProducts()
    const filtered = current.filter((p) => p.id !== productId)
    saveStoredProducts(filtered)

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', productId)
    }
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
    if (!storeId) return []
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
      return data || []
    }
    return getStoredOrders().filter((o) => o.store_id === storeId)
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

    // 7-day weekly revenue trend from actual orders
    const now = new Date()
    const weekly_revenue_trends = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime()
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime()

      let settled = 0
      let pending = 0
      for (const order of orders) {
        const orderTime = new Date(order.created_at).getTime()
        if (orderTime >= dayStart && orderTime <= dayEnd) {
          if (paidStatuses.includes(order.status)) {
            settled += order.total_amount || order.subtotal
          } else if (order.status === 'PENDING_WA') {
            pending += order.subtotal
          }
        }
      }
      return { date: dateStr, settled, pending }
    })

    // 6-month monthly revenue trend
    const monthly_revenue_trends = Array.from({ length: 6 }, (_, i) => {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const dateStr = targetDate.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0).getTime()
      const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999).getTime()

      let settled = 0
      let pending = 0
      for (const order of orders) {
        const orderTime = new Date(order.created_at).getTime()
        if (orderTime >= monthStart && orderTime <= monthEnd) {
          if (paidStatuses.includes(order.status)) {
            settled += order.total_amount || order.subtotal
          } else if (order.status === 'PENDING_WA') {
            pending += order.subtotal
          }
        }
      }
      return { date: dateStr, settled, pending }
    })

    const reviews = await this.getReviews(storeId)
    const totalRatingSum = reviews.reduce((sum, r) => sum + r.rating, 0)
    const average_rating = reviews.length > 0 ? Number((totalRatingSum / reviews.length).toFixed(1)) : 0
    const total_reviews = reviews.length

    return {
      total_settled_revenue,
      pending_revenue,
      total_checkouts,
      paid_orders_count,
      pending_orders_count,
      conversion_rate,
      aov,
      revenue_trends: weekly_revenue_trends,
      weekly_revenue_trends,
      monthly_revenue_trends,
      payment_distribution,
      average_rating,
      total_reviews,
    }
  },

  async getReviews(storeId: string): Promise<Review[]> {
    if (!storeId) return []
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
      if (error) {
        return []
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

    if (isSupabaseConfigured && supabase) {
      await supabase.from('reviews').insert(newRev)
    }

    const current = getStoredReviews()
    const updated = [newRev, ...current]
    saveStoredReviews(updated)

    return newRev
  },
}
