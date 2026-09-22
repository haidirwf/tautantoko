-- ==============================================================================
-- tautan.site: PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- Built for Supabase Backend (PRD v1.1.0)
-- ==============================================================================

-- 1. Profiles / Tenants (Stores)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  whatsapp_number TEXT NOT NULL, -- Format: 628...
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. External Social Links (Link-in-Bio)
CREATE TABLE IF NOT EXISTS store_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'link',
  sort_order INT DEFAULT 0
);

-- 3. Product Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  base_price INT NOT NULL, -- In IDR (Rupiah)
  image_url TEXT DEFAULT '',
  is_digital BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Product Variant Groups (e.g. Size, Color)
CREATE TABLE IF NOT EXISTS variant_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 6. Product Variant Options
CREATE TABLE IF NOT EXISTS variant_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES variant_groups(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price_delta INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

-- 7. Orders (Manual Progress Tracking & Financial Ledger)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  order_code TEXT UNIQUE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  order_notes TEXT DEFAULT '',
  subtotal INT NOT NULL,                          -- Subtotal of items in IDR
  shipping_fee INT DEFAULT 0,                     -- Manual shipping fee agreed via WA
  total_amount INT NOT NULL,                      -- subtotal + shipping_fee
  payment_method TEXT DEFAULT 'MANUAL_TRANSFER',  -- 'Transfer BCA', 'Mandiri', 'QRIS', 'COD'
  status TEXT DEFAULT 'PENDING_WA',               -- 'PENDING_WA', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'
  courier_name TEXT DEFAULT '',                   -- e.g. 'JNE Regular', 'J&T', 'SiCepat'
  tracking_number TEXT DEFAULT '',                -- Resi pengiriman
  seller_internal_note TEXT DEFAULT '',           -- Catatan khusus penjual
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  items_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Reviews / Testimonials (Buyer Reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- Indexes for High Performance Querying
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_status ON orders(store_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_store ON reviews(store_id);

-- ==============================================================================
-- Row Level Security (RLS) Setup
-- ==============================================================================
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Stores: Public read, owner update/delete
CREATE POLICY "Public can view active stores" ON stores
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage their store" ON stores
  FOR ALL USING (auth.uid() = user_id);

-- Catalog: Public read for storefront, owner write
CREATE POLICY "Public can view store links" ON store_links
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage store links" ON store_links
  FOR ALL USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = store_links.store_id AND stores.user_id = auth.uid()));

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage categories" ON categories
  FOR ALL USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = categories.store_id AND stores.user_id = auth.uid()));

CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage products" ON products
  FOR ALL USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid()));

CREATE POLICY "Public can view variant groups" ON variant_groups
  FOR SELECT USING (true);

CREATE POLICY "Public can view variant options" ON variant_options
  FOR SELECT USING (true);

-- Orders: Public checkout insert allowed, read/update restricted to store owner
CREATE POLICY "Public can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can view and update their orders" ON orders
  FOR ALL USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()));

-- Reviews: Public can view and submit reviews, owners can manage
CREATE POLICY "Public can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Public can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can manage reviews" ON reviews
  FOR ALL USING (EXISTS (SELECT 1 FROM stores WHERE stores.id = reviews.store_id AND stores.user_id = auth.uid()));

-- ==============================================================================
-- Automatic Store Creation Trigger on User Sign Up (Supabase Auth)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  store_slug TEXT;
  store_name TEXT;
BEGIN
  -- Extract store name & slug from user_metadata or fallback to email
  store_name := COALESCE(NEW.raw_user_meta_data->>'store_name', split_part(NEW.email, '@', 1));
  store_slug := COALESCE(
    NEW.raw_user_meta_data->>'store_slug',
    lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9]', '-', 'g'))
  );

  INSERT INTO public.stores (user_id, name, slug, whatsapp_number, tagline)
  VALUES (
    NEW.id,
    store_name,
    store_slug,
    COALESCE(NEW.raw_user_meta_data->>'whatsapp_number', '6281234567890'),
    'Koleksi produk berkualitas siap pesan via WhatsApp.'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Storage Bucket Setup for Product Images
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

