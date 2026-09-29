# WebBlock — Next-Gen AI E-Commerce Platform & Visual Site Builder

WebBlock is an intelligent, multi-tenant e-commerce platform built with a modern microservice architecture, visual drag-and-drop customization via **Puck JS**, instant **React code generation**, **Groq AI (FastAPI)** content generation, and an automated **Spring Boot Control Plane** connected to **PostgreSQL with Row-Level Security (RLS)**.

---

## 🏛️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Next.js 14 WebBlock     │
                          │   Platform & Studio       │
                          │   (Port 3000)             │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
                 ▼                                             ▼
  ┌──────────────────────────────┐              ┌──────────────────────────────┐
  │  Spring Boot Control Plane   │              │   FastAPI AI Microservice    │
  │  Microservice (Port 8080)    │              │   (Port 8000)                │
  │  - Tenant Isolation          │              │   - Model: openai/gpt-oss-20b│
  │  - CI/CD Deploy Engine       │              │   - AI Brand Generator       │
  │  - Catalog & Settings APIs   │              │   - Product Enhancer & Chat  │
  └──────────────┬───────────────┘              └──────────────────────────────┘
                 │
                 ▼
  ┌────────────────────────────────────────────────────────────┐
  │                PostgreSQL (`webblock_db`)                  │
  │                                                            │
  │  [Control Plane Scope]                                     │
  │  - `platform_users` (id UUID, email, password_hash)        │
  │  - `websites` (tenant_id UUID, domain_name, subdomain)     │
  │                                                            │
  │  [PostgreSQL RLS Boundary - Logical Tenant Isolation]      │
  │  - `products` (id, tenant_id, title, price, custom_fields) │
  │  - `site_settings` (id, tenant_id, theme_config JSONB)     │
  └────────────────────────────────────────────────────────────┘
```

---

## ✨ Features & User Journey

1. **Predefined Templates & AI Auto-Fill**:
   - Choose from curated e-commerce foundations (Cyber Tech, Artisan Coffee, Minimal Fashion, Performance Fitness).
   - ✨ **Groq AI Auto-Fill**: Automatically generates business taglines, curated products with high-res imagery, pricing, and contact information with one click.
2. **Visual Customization Studio with Puck JS**:
   - Visual drag-and-drop page editor with blocks: Hero, Product Grid, Stats, Features, Testimonials, FAQ, Contact Concierge, Footer.
   - **Real-time Live React Code Inspector**: Inspects and copies instant React JSX code as you drag, drop, and edit elements.
   - **BlockAI Studio Copilot**: Chat with local Groq LLM to rewrite headlines, refine UX, or customize themes.
3. **Control Plane & Automated Backend Generation**:
   - Clicking **"Ready"** triggers Spring Boot to provision the tenant's database records and serialize Puck layout into `site_settings`.
4. **Domain Prompt & Automated CI/CD Deployment**:
   - Prompts for free subdomain (`*.webblock.io`) or custom domain.
   - Animated multi-stage CI/CD pipeline visualizer with live logs and confetti completion.
5. **Tenant Admin Panel**:
   - Site owners can add new products, edit prices, descriptions, and images.
   - ✨ **Groq AI Product Enhancer**: Enhances product copy and pricing strategy.
   - **"Customize UI in Studio"** button: Return to Puck studio anytime, modify layout, and re-deploy via CI/CD!
6. **Single-File User Website Engine**:
   - `Frontend/src/app/site/[subdomain]/page.tsx` powers all tenant sites via dynamic Next.js + Prisma runtime with active shopping cart drawer and checkout simulation.

---

## 🚀 Quick Start

### 1. Start All Services with 1 Command:
```bash
./start-all.sh
```

### 2. Or Start Services Individually:

#### A. AI Microservice (FastAPI + Groq)
```bash
cd Backend/ai-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### B. Spring Boot Control Plane (Port 8080)
```bash
cd Backend/control-plane
mvn spring-boot:run
```

#### C. Next.js Frontend (Port 3000)
```bash
cd Frontend
npm run dev
```

---

## 🌐 URLs & Endpoints

- **WebBlock Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Onboarding Wizard**: [http://localhost:3000/onboarding](http://localhost:3000/onboarding)
- **Visual Puck Studio**: [http://localhost:3000/studio/[tenantId]](http://localhost:3000/studio)
- **Tenant Admin Dashboard**: [http://localhost:3000/admin/[tenantId]](http://localhost:3000/admin)
- **Live User Website**: [http://localhost:3000/site/[subdomain]](http://localhost:3000/site)
- **Spring Boot API**: [http://localhost:8080](http://localhost:8080)
- **FastAPI AI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
