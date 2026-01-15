# Professional Kids Wholesale E‑Commerce (Next.js + Strapi v4)

This repository contains a complete project scaffold to build a professional B2B kids wholesale storefront:
- Frontend: Next.js (pt-BR)
- Backend / CMS: Strapi v4 (Headless)
- Database: PostgreSQL
- Frontend hosting: Netlify
- Backend hosting: Render / Railway / VPS (prepared)

This scaffold includes:
- Strapi v4 content-type schemas (store_settings, products, categories, shipping_rules, shipping_methods, orders)
- Strapi bootstrap script: creates a default admin and ensures Correios shipping method exists
- Next.js frontend with pages: Home, Category, Product, Cart, Checkout, Order confirmation
- Cart using Context API with localStorage persistence and business rules enforcement:
  - "Roupas, conjuntos, calçados e chinelos exigem compra mínima de 6 unidades. Outros itens não possuem quantidade mínima."
- Shipping by state and shipping method selection at checkout
- Pix / Sunize payment flow skeleton (structure only)

IMPORTANT: No store name, logo, prices, or product instances are pre-created. All content must be managed in the Strapi admin panel.

---

## Quick start (development)

Prerequisites:
- Node >= 18
- Yarn or npm
- PostgreSQL database
- Git

1) Backend (Strapi)
- cd backend
- copy `.env.example` -> `.env` and fill values (DATABASE_*, APP_KEYS, JWT_SECRET, ADMIN_JWT_SECRET)
- Install & run:
  - yarn install
  - yarn develop
- Visit Strapi admin: http://localhost:1337/admin
- Default admin credentials (example — change before production):
  - Email: admin@example.com
  - Password: ChangeMe123!

2) Frontend (Next.js)
- cd frontend
- copy `.env.example` -> `.env.local` and fill STRAPI_API_URL
- Install & run:
  - yarn install
  - yarn dev
- Visit frontend: http://localhost:3000

---

## Deployment

Frontend (Netlify)
- Build command: `yarn build`
- Publish directory: `.next`
- Set environment variables in Netlify: NEXT_PUBLIC_STRAPI_API_URL, NEXT_PUBLIC_API_TOKEN (if used)

Backend (Render / Railway / VPS)
- Use the `backend` folder.
- Provide PostgreSQL connection environment variables (in `.env`)
- Set APP_KEYS, JWT_SECRET, ADMIN_JWT_SECRET
- Use `yarn build` and `yarn start` (or `yarn develop` for dev)

---

## API & Content

API is REST via Strapi v4. Sample endpoints:
- GET /api/store-settings
- GET /api/products
- GET /api/categories
- GET /api/shipping-rules
- GET /api/shipping-methods
- POST /api/orders

Orders created by the frontend will be stored in Strapi `orders` collection. Payment processing (PIX / Sunize) is skeleton-only.

---

## Cart Rules (enforced in frontend)
Portuguese message:
“Roupas, conjuntos, calçados e chinelos exigem compra mínima de 6 unidades. Outros itens não possuem quantidade mínima.”

Checkout is blocked if any cart contains products of type `clothing` or `set` (includes footwear considered clothing) and their combined quantity is less than 6.

---

## Notes & TODOs for production
- Rotate/change admin default credentials and secrets before production
- Configure CORS and security headers in Strapi
- Add SSL and domain configuration for both frontend and backend
- Replace any placeholder email/webhooks with real providers
- If invoicing/Net terms are required, add accounting/invoicing flows

---

Now see the project scaffolding below.
