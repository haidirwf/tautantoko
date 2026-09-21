# Product Requirements Document (PRD)

**Product**: Multi-Tenant Link-in-Bio & Micro-Catalogue Storefront Platform (WhatsApp-Driven Commerce with Merchant Financial Dashboard)  
**Version**: 1.1.0 (Implementation Blueprint)  
**Document Status**: Approved / Implementation Ready  
**Target Market**: Indonesian SMBs, Creator-Merchants, & Independent Online Sellers  
**Primary UI / Design System Reference**: /claude.design.md

---

## 1. Executive Summary

### Problem Statement
Indonesian small-and-medium businesses (SMBs) and independent merchants face a major dilemma in digital sales: automated payment gateways charge significant transaction cuts and often cause friction for local buyers who prefer direct WhatsApp negotiation, while manual WhatsApp sales lack an organized storefront, inventory tracking, and professional financial reporting, leaving merchants without clear revenue insights.

### Proposed Solution
The Platform is an all-in-one, ultra-fast multi-tenant web application combining a social link-in-bio profile with a micro-catalogue storefront. Instead of an automated third-party payment gateway, the checkout flow captures customer shipping details and seamlessly transfers a structured order to the merchant's WhatsApp chat (`https://wa.me/...`). 

Crucially, **the merchant dashboard is architected as a professional financial and order command center**:
1. **Manual Order Lifecycle Control (`/orders`)**: The merchant manually advances order stages (e.g., from *Pending WhatsApp Chat* to *Paid/Confirmed*, *Processing*, *Shipped with Tracking*, and *Completed*) based on actual interactions in WhatsApp.
2. **Fintech-Style Revenue & Analytics Dashboard (`/dashboard`)**: The dashboard renders high-end financial metrics (Total Settled Revenue, Pending Pipeline, Average Order Value, Conversion Rate, and Revenue Trends) presenting the clarity and prestige of an enterprise payment gateway dashboard while preserving the flexibility of manual WhatsApp commerce.

Built as a high-performance **React.js + Vite Single Page Application (SPA)**, the frontend compiles into a lightweight static bundle optimized for deployment on standard **cPanel** hosting, backed by **Supabase** for user authentication, PostgreSQL database, and cloud storage.

### Success Criteria & Key Performance Indicators (KPIs)
1. **Checkout to WhatsApp Transition**: Under 45 seconds for a buyer to browse the catalog, choose variants, fill delivery information, and open the pre-filled WhatsApp conversation.
2. **Order Progress Management Latency**: 1-click status updates from `/orders` reflecting immediately across Supabase and updating dashboard revenue aggregations in < 300ms.
3. **Financial Dashboard Integrity**: 100% mathematical accuracy in calculating Total Settled Revenue, Pending Pipeline, and Order Conversion rates based on manual order status flags.
4. **Static Build & cPanel Performance**: Initial bundle payload under 300KB (gzipped), achieving >= 95 Lighthouse Mobile Performance score with First Contentful Paint (FCP) <= 1.0s on cPanel static hosting.
5. **UI Fidelity Compliance**: 100% adherence to the editorial design tokens, color palette, typography hierarchy, and surface modes specified in [`claude.design.md`](file:///home/idal/sekolajh/tokolink-app/claude.design.md).

---

## 2. User Experience & Functionality

### User Personas
* **Persona A: Independent Online Merchant (e.g., "Seller")**: Sells fashion, packaged food, crafts, or digital products. Wants to close deals personally on WhatsApp, receive bank transfers directly (BCA, Mandiri, BRI, QRIS), manually track order progress, and monitor total store earnings and revenue charts on a clean dashboard.
* **Persona B: Mobile Social Buyer (e.g., "Buyer")**: Discovers the seller through Instagram or TikTok bio links. Wants to browse products, pick options, enter shipping details, and send the formatted order to WhatsApp in one tap.

---

### User Stories & Acceptance Criteria

#### 2.1 Merchant Authentication & Storefront Setup
* **Story**: *As a seller, I want to authenticate via Supabase (Email/Password, Magic Link OTP, or Google OAuth) and configure my store slug and WhatsApp phone number so that buyers can reach me directly.*
* **Acceptance Criteria**:
  - Authentication powered by `@supabase/supabase-js` with automated token refresh and local session persistence.
  - Store configuration requires:
    - Store Name & Tagline.
    - Unique URL Slug (letters, numbers, hyphens; rejects reserved paths like `admin`, `login`, `dashboard`).
    - Valid Indonesian WhatsApp phone number (auto-sanitized from `08...` or `+62...` to international format `628...`).
    - Store Avatar / Logo uploaded to Supabase Storage.
  - Generates a live storefront immediately accessible at `https://[domain]/{slug}`.

#### 2.2 Product & Variant Inventory Management
* **Story**: *As a seller, I want to add products with photos, descriptions, prices, categories, and optional variant options (e.g. Size, Color) with custom pricing.*
* **Acceptance Criteria**:
  - Full CRUD operations on products stored in Supabase PostgreSQL:
    - Product title, description, base price (IDR), category, and image URL.
    - Product type: Physical Goods (requires delivery address) vs Digital Goods (requires email/notes only).
    - Variant Groups & Options: e.g., Group "Ukuran" (Options: "S", "M", "L", "XL") with price delta adjustments (`priceDelta`).
  - Category manager allowing inline creation, editing, and ordering of catalog sections.
  - Direct client-to-storage upload of product images to Supabase Storage bucket with WebP compression or size optimization.

#### 2.3 Storefront Browsing & Link-in-Bio Presentation
* **Story**: *As a buyer visiting a merchant's store, I want to browse social links and filter products by category in an elegant, editorial interface.*
* **Acceptance Criteria**:
  - Visual theme strictly reflects the warm cream canvas, serif display typography, and coral CTAs defined in [`claude.design.md`](file:///home/idal/sekolajh/tokolink-app/claude.design.md).
  - Continuous-scroll layout displaying:
    - Merchant brand avatar, title, and bio description.
    - Social / External Link buttons (e.g., Shopee, Tokopedia, Instagram, Portfolio).
    - Category filter pills / tabs allowing instant filtering without reloading.
    - Product cards with thumbnail, title, formatted IDR pricing, and "Tambahkan / Add to Cart" CTA.

#### 2.4 Shopping Cart & Direct WhatsApp Order Dispatch (No Payment Gateway)
* **Story**: *As a buyer, I want to review my cart, enter my delivery information, and click a button to send my entire order directly to the seller's WhatsApp.*
* **Acceptance Criteria**:
  - Floating bottom cart indicator displaying total items and total price in IDR.
  - Cart drawer / modal allows adjusting quantities or removing items.
  - Checkout Form collects required customer data:
    - **Nama Lengkap / Full Name** (Required)
    - **Nomor WhatsApp / Phone Number** (Required)
    - **Alamat Lengkap Pengiriman / Delivery Address** (Required for physical goods)
    - **Catatan Pesanan / Order Notes** (Optional)
  - On submit:
    1. Generates a unique order code (e.g., `#ORD-YYYYMMDD-XXXX`).
    2. Saves the order record into Supabase PostgreSQL for merchant dashboard tracking with initial status `PENDING_WA`.
    3. Constructs a clean, professionally formatted WhatsApp message:
       ```text
       Halo kak [Store Name], saya ingin memesan:
       
       📦 *Pesanan*: #ORD-20260921-0492
       👤 *Nama*: Budi Santoso
       📱 *No. WA*: 081234567890
       📍 *Alamat*: Jl. Melati No. 12, RT 01/RW 02, Bandung
       
       🛒 *Rincian Barang*:
       • 1x Kemeja Linen (Ukuran: L, Warna: Putih) — Rp 185.000
       • 2x Celana Chino (Ukuran: 32) — Rp 360.000
       
       💰 *Subtotal*: Rp 545.000
       📝 *Catatan*: Mohon kirim pakai bubble wrap ya kak.
       
       Mohon info rekening untuk pembayaran dan estimasi ongkirnya ya kak. Terima kasih!
       ```
    4. Triggers redirect via `window.open("https://wa.me/{seller_phone}?text={encoded_message}", "_blank")`.
    5. Clears the shopping cart and displays a friendly order confirmation screen with a "Buka WhatsApp Lagi" fallback button.

#### 2.5 Manual Order Progress Management (`/orders`)
* **Story**: *As a seller, I want to manually update each order's progress based on our WhatsApp chat (e.g., mark as Paid when transfer proof is received, update shipping status, input tracking number) so that my order records stay organized.*
* **Acceptance Criteria**:
  - **Manual Lifecycle Status Stages**:
    - `PENDING_WA` (*Baru Checkout / Menunggu Chat WhatsApp*): Default status upon checkout dispatch.
    - `PAID` (*Pembayaran Diterima*): Seller manually toggles this once payment proof is received on WhatsApp.
    - `PROCESSING` (*Sedang Dikemas / Diproses*): Seller is preparing items for pickup/shipping.
    - `SHIPPED` (*Sedang Dikirim*): Seller has dispatched items via courier; modal prompts for optional Courier Name (JNE, J&T, SiCepat, GoSend) and Waybill / Tracking Number (`tracking_number`).
    - `COMPLETED` (*Pesanan Selesai*): Transaction complete and goods delivered.
    - `CANCELLED` (*Dibatalkan / Kadaluarsa*): Buyer cancelled or did not follow up within agreed time.
  - **Order Adjustments in Modal**:
    - Ability to add agreed **Shipping Fee** (`shipping_fee`), automatically updating `total_amount = subtotal + shipping_fee`.
    - Ability to tag manual **Payment Method** used (e.g. `Transfer BCA`, `Transfer Mandiri`, `Transfer BRI`, `QRIS Manual`, `COD`).
    - Ability to save private **Internal Seller Notes** (`seller_internal_note`).
  - **Direct WhatsApp Communication**:
    - A dedicated "Chat Pembeli via WhatsApp" action button on every order row, opening `https://wa.me/{buyer_phone}` with one click.
  - **Filtering & Search**:
    - Filter orders by status tabs (*Semua, Menunggu Pembayaran, Sudah Bayar, Diproses, Dikirim, Selesai, Batal*).
    - Search by Order Code, Buyer Name, or Phone Number.

#### 2.6 Financial & Analytics Dashboard (`/dashboard`)
* **Story**: *As a seller, I want my dashboard to display professional financial statistics—such as Total Earnings, Pending Pipeline, Average Order Value, and Sales Trends—so that I get the full visibility of a payment gateway dashboard while continuing to use WhatsApp for closing sales.*
* **Acceptance Criteria**:
  - **Fintech-Style Revenue Metrics**:
    - **Total Pendapatan Terverifikasi (Settled Revenue)**: Sum of `total_amount` for all orders with status `PAID`, `PROCESSING`, `SHIPPED`, or `COMPLETED`.
    - **Potensi Pendapatan / Pipeline (Pending Revenue)**: Sum of `subtotal` for orders still in `PENDING_WA` (representing active checkouts waiting for transfer).
    - **Total Pesanan Berhasil (Paid Orders Count)**: Total count of fulfilled/paid transactions.
    - **Tingkat Konversi WhatsApp (Conversion Rate)**: Percentage of checkouts that transitioned from `PENDING_WA` to `PAID` (`[Paid Orders / Total Checkouts] * 100`).
    - **Rata-rata Nilai Pesanan (Average Order Value / AOV)**: `Settled Revenue / Paid Orders Count`.
  - **Trend Visualizations & Breakdown**:
    - **Grafik Tren Pendapatan (Revenue Over Time)**: Daily and monthly bar/area charts showing revenue trajectory (built with lightweight SVG or Recharts following `claude.design.md` dark navy styling).
    - **Distribusi Metode Pembayaran**: Percentage breakdown of manual methods (e.g., 65% Transfer BCA, 25% QRIS, 10% Lainnya).
    - **Kartu Transaksi Terkini (Recent Transactions Feed)**: Displays recent orders styled with payment gateway aesthetics (timestamp, customer avatar initial, payment method badge, status pill, and currency amount in IDR).

---

### Non-Goals (Strictly Excluded)
* **Automated Payment Gateways**: No Midtrans, Xendit, DOKU, Stripe, or Iris Facilitator. All payments and transfers occur peer-to-peer (BCA, Mandiri, BRI, QRIS manual) through WhatsApp chat.
* **Automated Third-Party Courier Booking**: No automated Biteship courier booking API. Shipping fee calculation is agreed between seller and buyer via WhatsApp.
* **Server-Side Rendering (SSR) Node Server**: The app will not run a dynamic Node/Bun server in production. It is built strictly as a static Single Page Application (Vite bundle) for cPanel.

---

## 3. UI / UX Design System Specification

> [!IMPORTANT]
> All visual design, layout rules, color palettes, typography, and component styling **MUST strictly reference and follow [`claude.design.md`](file:///home/idal/sekolajh/tokolink-app/claude.design.md)**. Generic SaaS themes, harsh cool blues, and pure white backgrounds are strictly forbidden.

### 3.1 Design Philosophy & Surface Modes
* **Core Brand Atmosphere**: Tinted warm cream canvas paired with dark navy product surfaces, punctuated by warm coral CTAs.
* **Three Alternating Surface Modes**:
  1. **Canvas (`#faf9f5`)**: Default page floor. Warm, paper-like cream, deliberately non-pure-white.
  2. **Feature / Catalog Cards (`#efe9de`)**: Content card backgrounds, slightly deeper cream.
  3. **Dark Navy Surfaces (`#181715`)**: Dashboard panels, financial stat cards, order summary highlights, code/detail preview mockups, and footer.

### 3.2 Color Tokens (Direct Reference from `claude.design.md`)
| Token | Hex Value | Application in Storefront & Dashboard |
|---|---|---|
| **Primary (Coral)** | `#cc785c` | Main CTA buttons ("Tambah ke Keranjang", "Pesan via WhatsApp", "Simpan Perubahan"), active highlights |
| **Primary Active** | `#a9583e` | Hover / pressed state for coral buttons |
| **Primary Disabled** | `#e6dfd8` | Disabled button states |
| **Canvas** | `#faf9f5` | Main storefront floor, modal backdrop, input backgrounds |
| **Surface Card** | `#efe9de` | Product catalog cards, link-in-bio buttons, feature tiles |
| **Surface Dark** | `#181715` | Merchant dashboard cards, financial summary cards, order table headers, footer |
| **Surface Dark Elevated** | `#252320` | Elevated containers inside dark mode dashboard widgets |
| **Hairline Border** | `#e6dfd8` | Subtle 1px borders on cream cards and inputs |
| **Ink (Headlines)** | `#141413` | Headings, brand names, product titles |
| **Body Text** | `#3d3d3a` | Descriptions, running text |
| **Muted** | `#6c6a64` | Subtitles, category labels, timestamps, table column headers |
| **On Primary** | `#ffffff` | Text on coral buttons |
| **On Dark** | `#faf9f5` | Cream text on dark navy cards and footer |
| **On Dark Soft** | `#a09d96` | Secondary labels inside dark financial widgets |
| **Success** | `#5db872` | `PAID` / `COMPLETED` order status badge, positive revenue trend indicator |
| **Warning / Amber** | `#e8a55a` | `PENDING_WA` order status badge |
| **Accent Teal** | `#5db8a6` | `PROCESSING` / `SHIPPED` status badge |
| **Error** | `#c64545` | `CANCELLED` status badge, form validation errors |

### 3.3 Typography Hierarchy
* **Display Headlines & Large Revenue Figures**:
  - Font: **Copernicus** / **Tiempos Headline** (Fallback: **Cormorant Garamond** or **EB Garamond**, serif)
  - Weight: **400** (regular, never bolded)
  - Letter-spacing: Negative tracking (**-0.5px to -1.5px**). Applied to Store H1 and Dashboard revenue counters (e.g., `Rp 14.500.000` rendered in large Cormorant Garamond 400).
* **Body & UI Elements (Buttons, Inputs, Descriptions, Labels)**:
  - Font: **StyreneB** (Fallback: **Inter**, sans-serif)
  - Weight: **400** for body paragraphs, **500** for buttons, tabs, and form labels.
* **Order Codes & Financial Identifiers**:
  - Font: **JetBrains Mono**, ui-monospace.

### 3.4 Dashboard & Order Component Specifications
* **Financial Metric Card (`product-mockup-card-dark` / `pricing-tier-card-featured`)**:
  - Background: `{colors.surface-dark}` (`#181715`), rounded 12px (`rounded-lg`), padding 24px–32px.
  - Label: Humanist sans in `{colors.on-dark-soft}` (`#a09d96`), size 14px.
  - Value: Large serif display in `{colors.on-dark}` (`#faf9f5`), size 36px–48px, weight 400, negative tracking `-1px`.
  - Subtitle / Comparison: Green pill badge (`#5db872` at low opacity) or soft caption showing change over time.
* **Status Badges (`badge-pill`)**:
  - `PENDING_WA`: Cream card `#efe9de` with amber text `#e8a55a`, rounded pill.
  - `PAID`: Soft green background with `#5db872` text.
  - `SHIPPED`: Soft teal background with `#5db8a6` text.
  - `COMPLETED`: Deep green text.
  - `CANCELLED`: Soft red text `#c64545`.
* **Primary Button (`button-primary`)**: Coral background (`#cc785c`), white text, 8px rounded corners (`rounded-md`), height 40px, padding 12px 20px.
* **Order Modal & Inputs (`text-input`)**: Height 40px, `#faf9f5` background, `#141413` text, 1px `#e6dfd8` border; on focus shifts to coral `#cc785c` with a subtle 3px outer ring.

---

## 4. Technical Specifications & Architecture

### 4.1 Architecture Overview

```
+---------------------------------------------------------------------------------------+
|                                    Client Browser                                     |
|  - React.js 19 + Vite (Single Page Application - SPA)                                 |
|  - Tailwind CSS + UI Component System derived from `claude.design.md`                |
|  - Zustand Store (Cart, Checkout Draft, Filter States)                                |
|  - React Router DOM / TanStack Router (Client-Side Routing)                           |
+-------------------------------------------+-------------------------------------------+
                     |                                           |
       HTTPS / Static Asset Requests                    Direct Supabase REST / WS
                     |                                           |
+--------------------v----------------------+   +----------------v----------------------+
|          cPanel Web Hosting               |   |            Supabase Backend           |
|  - Apache / Nginx Web Server              |   |  - Supabase Auth (OAuth & Email OTP)  |
|  - Static Document Root (`public_html/`)  |   |  - PostgreSQL Database (with RLS)     |
|  - `.htaccess` Client Routing Rewrite     |   |  - Supabase Storage (Images / Avatars)|
+-------------------------------------------+   +---------------------------------------+
                                                                 |
                                              Direct URL WhatsApp Dispatch
                                                                 |
                                                +----------------v----------------------+
                                                |     WhatsApp Web / Mobile App         |
                                                |  - `https://wa.me/{seller_phone}`     |
                                                |  - Pre-filled URL-encoded order msg   |
                                                +---------------------------------------+
```

### 4.2 Frontend Architecture (Vite + React)
* **Build System**: Vite 6/7 bundling React 19 SPA to static assets in `dist/`.
* **State Management**:
  - `zustand`: Light client store managing local cart items (`items`, `addItem`, `removeItem`, `updateQty`, `clearCart`), customer checkout draft, and modal states.
  - `localStorage`: Local persistence for cart and seller form drafts.
* **Routing**: Client-side HTML5 history routing with catch-all routing fallback via `.htaccess`.

### 4.3 Database Schema (Supabase PostgreSQL)

```sql
-- Profiles / Tenants (Stores)
CREATE TABLE stores (
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

-- External Social Links
CREATE TABLE store_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'link',
  sort_order INT DEFAULT 0
);

-- Product Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Products
CREATE TABLE products (
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

-- Product Variant Groups (e.g. Size, Color)
CREATE TABLE variant_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Product Variant Options
CREATE TABLE variant_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES variant_groups(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price_delta INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

-- Orders (Supports Manual Progress Tracking & Financial Ledger)
CREATE TABLE orders (
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
```

### 4.4 Supabase Row Level Security (RLS) Rules
* `stores`: Public read access for active slugs; update/delete restricted strictly to `auth.uid() = user_id`.
* `products`, `variant_groups`, `variant_options`, `store_links`, `categories`: Public read access for storefront visitors; insert/update/delete restricted to store owners.
* `orders`: Public insert allowed (storefront checkout logging); read/update restricted exclusively to the respective `store_id` owner (`auth.uid() = stores.user_id`).

### 4.5 Financial Aggregation Queries (Dashboard Analytics)
The dashboard computes financial metrics directly via Supabase Client query or PostgreSQL RPC view:
* **Settled Revenue**:
  ```sql
  SELECT COALESCE(SUM(total_amount), 0) AS total_settled_revenue
  FROM orders 
  WHERE store_id = :store_id AND status IN ('PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED');
  ```
* **Pending Pipeline**:
  ```sql
  SELECT COALESCE(SUM(subtotal), 0) AS pending_revenue
  FROM orders 
  WHERE store_id = :store_id AND status = 'PENDING_WA';
  ```
* **Order Counts & Conversion**:
  ```sql
  SELECT 
    COUNT(*) AS total_checkouts,
    COUNT(*) FILTER (WHERE status IN ('PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED')) AS paid_orders,
    COUNT(*) FILTER (WHERE status = 'PENDING_WA') AS pending_orders
  FROM orders 
  WHERE store_id = :store_id;
  ```

### 4.6 cPanel Deployment Specification
* **Target Environment**: Apache / LiteSpeed Web Server on cPanel.
* **Build Artifact**: Static files generated inside `dist/` (`index.html`, `assets/*.js`, `assets/*.css`).
* **SPA Rewrite Configuration (`.htaccess`)**:
  To ensure direct URLs (e.g. `https://domain.com/my-store` or `/dashboard`) do not return 404 errors on cPanel, a root `.htaccess` must be bundled:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>

  # Enable Gzip / Deflate Compression
  <IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
  </IfModule>
  ```

---

## 5. Risks & Implementation Roadmap

### Phased Roadmap

```
[Phase 1: Foundation & Core Storefront]
  ├── Vite + React project setup with `claude.design.md` design system
  ├── Supabase project connection (Auth + Database Schema + Storage)
  ├── Merchant Store creation & Link-in-bio management
  └── Product catalog & Variant management

[Phase 2: WhatsApp Commerce Flow]
  ├── Mobile-first continuous scroll storefront
  ├── Dynamic category filtering & variant selection drawer
  ├── Zustand cart store with delivery form modal
  ├── WhatsApp message serializer & `wa.me` redirect trigger
  └── Order logging to Supabase database (`PENDING_WA`)

[Phase 3: Merchant Dashboard & Order Progress Workflow]
  ├── Interactive `/orders` management with manual status transitions
  ├── Order adjustment modal (shipping fee, payment tag, tracking number)
  ├── Direct "Chat Pembeli" WhatsApp action button
  ├── Financial dashboard (`/dashboard`) with fintech metric widgets & revenue trends
  ├── Production build optimization & cPanel `.htaccess` packaging
  └── End-to-end testing on cPanel hosting
```

### Technical Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **cPanel Direct URL 404 Errors on Refresh** | High | High | Strict inclusion of `.htaccess` rewrite rule in `public/` directory so Vite copies it automatically into `dist/`. |
| **Seller Forgetting to Update Status from WhatsApp** | Medium | Medium | In-dashboard reminders highlighting orders in `PENDING_WA` older than 24 hours; quick-action buttons on every row. |
| **Discrepancy Between Cart Subtotal and Actual Transfer** | Low | Medium | Provide inline editable `shipping_fee` and adjustment field on the order detail modal so the ledger matches the real bank transfer. |
| **Public Order Table Spam / Abuse** | Medium | Medium | Implement client-side debounce and honeypot field; enable Supabase rate limiting and RLS policies on `orders` table. |
| **Inconsistent Typography on Client Devices** | Low | Low | Embed web-font substitutes specified in `claude.design.md` (Cormorant Garamond / EB Garamond for serif display and Inter for body) via Google Fonts. |
