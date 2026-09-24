<div align="center">
  <img src="public/vite.svg" alt="tautan.site Logo" width="100" height="100" />

  # tautan.site
  **Open Source Link-in-Bio & Micro-Catalogue Storefront Platform for Indonesian SMBs**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

</div>

<br />

**tautan.site** is an ultra-fast, modern, open-source multi-tenant platform designed for Indonesian small-and-medium businesses (SMBs), independent online sellers, and creator-merchants. It seamlessly unites a social link-in-bio profile with an interactive micro-catalogue storefront, direct WhatsApp checkout with **0% transaction fees**, and a professional fintech-grade merchant dashboard to manage orders, catalog inventory, customer relationships, and financial analytics.

---

## Table of Contents

- [Key Features](#-key-features)
- [Architecture & Technology Stack](#-architecture--technology-stack)
- [System Requirements](#-system-requirements)
- [Local Installation & Setup](#-local-installation--setup)
- [Project Directory Structure](#-project-directory-structure)
- [Security Hardening](#-security-hardening)
- [Deployment Guide](#-deployment-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## Key Features

- **Instant Storefront & Onboarding (`tautan.site/:slug`):** Launch a personalized, high-conversion storefront in seconds with custom brand avatar, bio, and social links.
- **Direct WhatsApp Checkout (0% Fees):** No third-party payment gateway cuts. The frictionless shopping cart formats orders into clean, ready-to-send WhatsApp messages directly to the seller's active WhatsApp number.
- **Fluid Multi-Step Cart & Morphing Modal:** Interactive modal with smooth width & height spring extension animations when advancing from shopping cart to customer delivery and payment confirmation.
- **Fintech-Style Financial Dashboard (`/dashboard`):** Real-time tracking of settled gross revenue, pending WhatsApp pipeline, average order value (AOV), and conversion rates with interactive monthly & weekly revenue charts.
- **Manual Order Lifecycle Control (`/orders`):** Full control over order statuses (`PENDING_WA`, `PAID`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELLED`) with direct 1-tap buyer follow-up via WhatsApp.
- **Product & Variant Inventory Management (`/katalog`):** Comprehensive catalog CRUD supporting categories, stock counters, variant groups (e.g. Size, Color), and price delta adjustments (`priceDelta`).
- **Customer CRM & Insights (`/pelanggan`):** Automatically aggregates customer records, order counts, lifetime spending (LTV), and last order dates with instant WhatsApp contact actions.
- **Buyer Reviews & Social Proof (`/ulasan`):** Integrated post-checkout buyer rating and review collection system displayed within the merchant dashboard.
- **Sales & Financial Reports (`/laporan`):** In-depth breakdown of verified revenue, WhatsApp conversion pipelines, and payment settlement records.
- **cPanel & Static Hosting Ready:** Ultra-lightweight static bundle build optimized for instant delivery on standard cPanel Apache hosting, Vercel, Netlify, or Cloudflare Pages.

---

## Architecture & Technology Stack

**tautan.site** is built with modern, battle-tested technologies for maximum performance, responsiveness, and maintainability:

- **Frontend Core:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) Single Page Application (SPA).
- **Type Safety:** [TypeScript 5.7](https://www.typescriptlang.org/) for robust end-to-end interface contracts.
- **Styling & Design System:** [Tailwind CSS v3.4](https://tailwindcss.com/) with an editorial warm cream canvas palette, serif typography hierarchy, and accessible contrast ratios.
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with persistent local storage hydration for cart and authentication sessions.
- **Micro-Animations & Physics:** [Motion](https://motion.dev/) (Framer Motion v13) for fluid spring physics, dynamic modal height transitions, and interactive UI feedback.
- **Routing:** [React Router v7](https://reactrouter.com/) for fast client-side navigation.
- **Icons:** [Lucide React](https://lucide.dev/) for crisp, scalable UI icons.
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL 15, Supabase Auth with automated JWT refresh, and Row Level Security).

---

## System Requirements

Before running the project locally, ensure you have:

- [Node.js](https://nodejs.org/) v18.0.0 or higher (or [Bun](https://bun.sh/) / [pnpm](https://pnpm.io/))
- npm v9+ or equivalent package manager
- A [Supabase](https://supabase.com/) project (free tier is fully sufficient)

---

## Local Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/haidirwf/tautantoko.git tautan-site
cd tautan-site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Duplicate the template environment file:

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*(Note: If Supabase credentials are not provided during initial exploration, the app falls back to local storage mock data).*

### 4. Database Setup (Supabase)

1. Open your Supabase Project Dashboard.
2. Navigate to the **SQL Editor**.
3. Copy and run the contents of [`supabase/schema.sql`](supabase/schema.sql) to set up tables (`stores`, `products`, `orders`, `categories`, `store_links`, `reviews`) and Row Level Security (RLS) policies.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 6. Build for Production

```bash
npm run build
```

The production-ready static assets will be compiled into the `dist/` directory.

---

## Project Directory Structure

```text
tautan.site/
├── public/
│   ├── .htaccess             # Apache rewrite rules for SPA client routing on cPanel
│   └── vite.svg              # Brand icon
├── scripts/
│   ├── seed_mock_account.mjs # Database seeder script
│   └── verify_seeded_data.mjs# Data verification test utility
├── src/
│   ├── components/
│   │   ├── auth/             # Login, Signup, & Auth modal dialogs
│   │   ├── common/           # Shared components (Navbar, Badge, TopProgressBar)
│   │   ├── dashboard/        # Merchant analytics, RevenueChart, OrderEditModal
│   │   ├── storefront/       # Public store components (ProductCard, CartDrawer)
│   │   └── ui/               # Base UI primitives (Button, Modal, Toaster)
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client, data access layer & mock fallback
│   │   └── utils.ts          # Currency formatter, order code generator, WhatsApp formatter
│   ├── pages/
│   │   ├── AuthPage.tsx      # Sign-in & Sign-up page
│   │   ├── CatalogPage.tsx   # Product & variant management
│   │   ├── CustomersPage.tsx # Customer directory & lifetime value CRM
│   │   ├── DashboardPage.tsx # Financial summary & revenue charts
│   │   ├── LandingPage.tsx   # Platform landing & feature showcase
│   │   ├── OnboardingPage.tsx# New store setup wizard
│   │   ├── OrdersPage.tsx    # Order pipeline & status management
│   │   ├── ReportsPage.tsx   # Detailed financial & conversion reports
│   │   ├── ReviewsPage.tsx   # Buyer rating & review management
│   │   ├── SettingsPage.tsx  # Store profile & WhatsApp settings
│   │   └── StorefrontPage.tsx# Public link-in-bio & micro-catalogue
│   ├── store/
│   │   ├── useAuthStore.ts   # Merchant auth state & session persistence
│   │   ├── useCartStore.ts   # Buyer cart, item quantities, and checkout state
│   │   └── useToastStore.ts  # Notification toast system
│   ├── types/
│   │   └── index.ts          # Core TypeScript data schemas & order statuses
│   ├── App.tsx               # Route declarations & layout shell
│   ├── index.css             # Tailwind design tokens & font imports
│   └── main.tsx              # Application entrypoint
├── supabase/
│   └── schema.sql            # PostgreSQL schema, indexes, and RLS policies
├── .cpanel.yml               # Automated cPanel deployment specification
├── .env.example              # Environment variables template
├── LICENSE                   # MIT License
├── SECURITY.md               # Security & vulnerability reporting policy
├── tailwind.config.js        # Design tokens & color configuration
├── tsconfig.json             # TypeScript compiler settings
└── vite.config.ts            # Vite bundler plugins & path aliases
```

---

## Security Hardening

**tautan.site** implements essential security measures to protect merchants and buyers:

- **Row Level Security (RLS):** All Supabase database tables enforce strict RLS policies. Merchants can only read and mutate their own store records, catalog items, and financial data.
- **Client-Safe Authentication:** Authentication is handled directly through Supabase Auth using client-safe anonymous keys with secure short-lived JWT tokens and automated refresh loops.
- **Robust WhatsApp URL Formatting:** WhatsApp order templates use clean, universally supported WhatsApp markdown formatting (`*Pesanan:*`, `*Nama:*`, `- 1x...`) and direct API endpoints to prevent 4-byte Unicode encoding corruption (`?` characters) during browser redirects.
- **Input Sanitization & Normalization:** Indonesian phone numbers are automatically sanitized and normalized to the standard international format (`628...`) to prevent malformed messaging links.
- **Safe Local Storage Scoping:** Persistent merchant session tokens and cart records are namespaced and sanitized to prevent cross-account pollution.

---

## Deployment Guide

### Deploying to cPanel (Shared Hosting)

1. Run `npm run build` locally or through CI/CD.
2. Upload the contents of the `dist/` directory directly to your `public_html/` (or subdomain folder).
3. The included `public/.htaccess` automatically ensures that client-side SPA routes (e.g. `/dashboard`, `/:slug`) resolve properly through `index.html`.
4. Alternatively, use the included `.cpanel.yml` file for Git Version Control automatic deployment in cPanel.

### Deploying to Vercel / Netlify / Cloudflare Pages

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## Contributing

Contributions are welcome! If you want to contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

Please check [SECURITY.md](SECURITY.md) for vulnerability reporting guidelines.

---

## License

This project is licensed under the **[MIT License](LICENSE)**.

```text
Copyright (c) 2026 tautan.site contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```
