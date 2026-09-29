import os
import json
import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-service")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
MODEL_NAME = "openai/gpt-oss-20b"

app = FastAPI(title="WebBlock AI Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)

# ==================== DATA MODELS ====================

class BusinessSuggestRequest(BaseModel):
    template_id: Optional[str] = "tech-store"
    business_idea: Optional[str] = ""
    industry: Optional[str] = "Retail & E-commerce"

class ProductSpec(BaseModel):
    title: str
    price: float
    description: str
    image_url: str
    badge: Optional[str] = "Best Seller"
    category: Optional[str] = "General"
    stock: Optional[int] = 50
    features: Optional[List[str]] = []

class BusinessSuggestResponse(BaseModel):
    business_name: str
    tagline: str
    hero_title: str
    hero_subtitle: str
    primary_color: str
    accent_color: str
    products: List[ProductSpec]
    contact_email: str
    contact_phone: str
    contact_address: str
    faqs: List[Dict[str, str]]
    testimonials: List[Dict[str, str]]

class EnhanceProductRequest(BaseModel):
    title: str
    category: Optional[str] = "General"
    raw_notes: Optional[str] = ""

class EnhanceProductResponse(BaseModel):
    title: str
    description: str
    suggested_price: float
    badge: str
    features: List[str]

class StudioCopilotRequest(BaseModel):
    prompt: str
    current_puck_data: Optional[Dict[str, Any]] = None
    business_context: Optional[Dict[str, Any]] = None

class StudioCopilotResponse(BaseModel):
    reply: str
    suggested_modifications: Optional[Dict[str, Any]] = None

# ==================== CURATED PRESET IMAGES ====================

CATEGORY_IMAGES = {
    "tech": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    ],
    "coffee": [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
        "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=800&q=80",
    ],
    "fashion": [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    ],
    "fitness": [
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    ],
    "saas": [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
    ]
}

# ==================== ENDPOINTS ====================

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "webblock-ai-microservice", "model": MODEL_NAME}

@app.post("/api/ai/suggest-business", response_model=BusinessSuggestResponse)
def suggest_business(req: BusinessSuggestRequest):
    """
    Generates a full business identity, tagline, curated products, contact, FAQs, and testimonials
    using Groq's fast LLM engine.
    """
    prompt = f"""
Generate a high-converting e-commerce store profile in JSON format based on:
- Template: {req.template_id}
- Business Concept: {req.business_idea or 'Modern Premium Boutique'}
- Industry: {req.industry}

Output valid JSON matching this schema:
{{
  "business_name": "Catchy Modern Name",
  "tagline": "Short slogan under 10 words",
  "hero_title": "Compelling bold headline",
  "hero_subtitle": "Two-sentence value proposition",
  "primary_color": "#6366f1",
  "accent_color": "#ec4899",
  "contact_email": "hello@store.com",
  "contact_phone": "+1 (800) 555-0199",
  "contact_address": "San Francisco, CA",
  "products": [
    {{
      "title": "Product Name 1",
      "price": 79.00,
      "description": "Short compelling product description.",
      "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "badge": "Best Seller",
      "category": "General",
      "stock": 50,
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    }},
    {{
      "title": "Product Name 2",
      "price": 129.00,
      "description": "Short compelling product description.",
      "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "badge": "New Arrival",
      "category": "General",
      "stock": 35,
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    }},
    {{
      "title": "Product Name 3",
      "price": 49.00,
      "description": "Short compelling product description.",
      "image_url": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      "badge": "Featured",
      "category": "General",
      "stock": 80,
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    }}
  ],
  "faqs": [
    {{"question": "How fast is shipping?", "answer": "Worldwide delivery in 3-5 business days."}},
    {{"question": "What is the warranty policy?", "answer": "2-year full replacement warranty."}}
  ],
  "testimonials": [
    {{"name": "Elena Rostova", "role": "Verified Customer", "comment": "Outstanding build quality and fast shipping.", "rating": "5.0"}}
  ]
}}
"""
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a specialized e-commerce JSON generator. Return valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=4096
        )
        content = completion.choices[0].message.content
        data = json.loads(content)

        # Assign high quality real unsplash photos if none or invalid
        cat_key = "tech"
        tmpl = (req.template_id or "").lower()
        if "coffee" in tmpl or "cafe" in tmpl:
            cat_key = "coffee"
        elif "fashion" in tmpl or "boutique" in tmpl:
            cat_key = "fashion"
        elif "fitness" in tmpl or "gym" in tmpl:
            cat_key = "fitness"
        elif "saas" in tmpl or "digital" in tmpl:
            cat_key = "saas"

        img_list = CATEGORY_IMAGES.get(cat_key, CATEGORY_IMAGES["tech"])
        for idx, prod in enumerate(data.get("products", [])):
            if not prod.get("image_url") or "unsplash" not in prod.get("image_url", ""):
                prod["image_url"] = img_list[idx % len(img_list)]

        return BusinessSuggestResponse(**data)
    except Exception as e:
        logger.error(f"Error calling Groq: {e}")
        # Fallback graceful response
        return BusinessSuggestResponse(
            business_name="Aura Modern Goods",
            tagline="Engineered for Everyday Elegance",
            hero_title="Elevate Your Daily Lifestyle",
            hero_subtitle="Discover meticulously crafted essentials designed to empower your productivity and elevate your aesthetic.",
            primary_color="#6366f1",
            accent_color="#ec4899",
            contact_email="hello@auragoods.co",
            contact_phone="+1 (800) 555-0199",
            contact_address="742 Evergreen Terrace, San Francisco, CA",
            products=[
                ProductSpec(
                    title="Aura Pro Wireless Headphones",
                    price=249.00,
                    description="Active noise-cancelling spatial acoustics with 40-hour ultra-fast battery charging.",
                    image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                    badge="Best Seller",
                    category="Audio",
                    stock=75,
                    features=["Spatial Audio 3D", "40hr Battery Life", "Active Noise Cancellation"]
                ),
                ProductSpec(
                    title="Zenith Precision Chrono Watch",
                    price=189.50,
                    description="Minimalist sapphire crystal timepiece crafted from aerospace-grade titanium.",
                    image_url="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                    badge="New Release",
                    category="Accessories",
                    stock=30,
                    features=["Sapphire Crystal", "5ATM Water Resistance", "Titanium Casing"]
                ),
                ProductSpec(
                    title="Luminary Ergo Smart Desk Lamp",
                    price=89.00,
                    description="Circadian rhythm matching smart lighting with integrated wireless charging base.",
                    image_url="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
                    badge="Popular",
                    category="Living",
                    stock=120,
                    features=["Circadian Auto-Tune", "Qi Fast Charger", "Touch Slider Control"]
                )
            ],
            faqs=[
                {"question": "How fast is worldwide shipping?", "answer": "Standard shipping takes 3-5 business days. Express next-day delivery is available at checkout."},
                {"question": "What is your return policy?", "answer": "We offer a 30-day money-back guarantee with hassle-free free return shipping."},
                {"question": "Are all products covered by warranty?", "answer": "Yes, every product includes an automatic 2-year full replacement warranty."}
            ],
            testimonials=[
                {"name": "Sophia Bennett", "role": "Creative Director", "comment": "The build quality and attention to detail surpassed all my expectations. Absolutely stunning.", "rating": "5.0"},
                {"name": "Marcus Vance", "role": "Tech Founder", "comment": "WebBlock delivered the smoothest online shopping experience I've had in years. 10/10 recommended.", "rating": "5.0"}
            ]
        )

@app.post("/api/ai/enhance-product", response_model=EnhanceProductResponse)
def enhance_product(req: EnhanceProductRequest):
    """
    Takes basic product details and enhances copy, features, and pricing suggestions.
    """
    prompt = f"""
You are an expert e-commerce copywriter.
Enhance this product listing:
- Title: {req.title}
- Category: {req.category}
- Notes: {req.raw_notes}

Return a valid JSON object:
{{
  "title": "string (Punchy, polished product title)",
  "description": "string (Compelling, benefits-driven 2-3 sentence description)",
  "suggested_price": 59.99,
  "badge": "string (e.g. Best Seller, Staff Pick, New, Premium)",
  "features": ["3-4 key product highlights"]
}}
"""
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a product optimization expert. Return JSON only."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content = completion.choices[0].message.content
        data = json.loads(content)
        return EnhanceProductResponse(**data)
    except Exception as e:
        logger.error(f"Error enhancing product: {e}")
        return EnhanceProductResponse(
            title=req.title or "Premium Artisan Product",
            description="Expertly engineered for high performance, exceptional durability, and undeniable aesthetics.",
            suggested_price=79.99,
            badge="Featured",
            features=["Premium Build", "Eco-friendly Materials", "Lifetime Guarantee"]
        )

class GenerateCodeRequest(BaseModel):
    subdomain: str
    business_name: str
    tagline: Optional[str] = ""
    hero_title: Optional[str] = ""
    hero_subtitle: Optional[str] = ""
    contact_email: Optional[str] = "support@webblock.io"
    contact_phone: Optional[str] = "+1 (800) 555-0199"
    products: Optional[List[Dict[str, Any]]] = []
    puck_content: Optional[List[Dict[str, Any]]] = []

class GenerateCodeResponse(BaseModel):
    page_tsx: str
    generated_by: str = "Groq LLaMA Code Engine (WebBlock AI)"

@app.post("/api/ai/generate-storefront-code", response_model=GenerateCodeResponse)
def generate_storefront_code(req: GenerateCodeRequest):
    """
    Leverages Groq LLM to dynamically generate complete, customized Next.js 14 + Tailwind + Lucide
    single-file storefront source code for a tenant repository.
    """
    products_json_str = json.dumps(req.products or [], indent=2)
    initial_letter = req.business_name.strip()[:1].upper() if req.business_name else "S"
    
    prompt = f"""
You are a Senior Frontend Architect generating production-ready Next.js 14 (App Router) TypeScript code.
Generate the complete, single-file client component for `src/app/page.tsx` for:
- Store Name: "{req.business_name}"
- Subdomain: "{req.subdomain}"
- Hero Headline: "{req.hero_title or 'The Future of Tech Gear'}"
- Hero Subtitle: "{req.hero_subtitle or req.tagline or 'Meticulously crafted items for peak lifestyle.'}"
- Initial Seed Products: {products_json_str}
- Contact Email: "{req.contact_email}"
- Contact Phone: "{req.contact_phone}"

MANDATORY TECHNICAL REQUIREMENTS:
1. Start with `"use client";`.
2. Import `React, {{ useState, useEffect }}` from `"react"`.
3. Import icons from `"lucide-react"`: `Eye, Sparkles, Truck, ShieldCheck, Leaf, Star, Mail, Phone, MapPin, X, CheckCircle2, Zap, ArrowRight`.
4. Define interface `ProductItem`: `id: string; title: string; price: number; customFields?: {{ imageUrl?: string; description?: string; badge?: string; category?: string; features?: string[]; }};`.
5. Define `INITIAL_PRODUCTS: ProductItem[]` initialized with the products provided.
6. Main component `export default function SingleFileTenantStore()`.
7. Dynamic database hydration via `useEffect` calling `fetch("/api/products")`.
8. Manage `selectedProduct` state (`useState<ProductItem | null>(null)`).
9. Top announcement bar with glassmorphic dark theme (`bg-[#090d16] text-slate-100 font-sans`).
10. Sticky navbar displaying Store Name (`{req.business_name}`) with first letter logo icon `{initial_letter}`.
11. Split hero section with custom headline and CTA button linking to `#products`.
12. 4-column Stats Counter bar.
13. Featured Collection product grid. Each product card MUST have:
    - In-stock badge & category tag
    - High quality image
    - Title, price, and description
    - Feature tags
    - A "View Details" button with `Eye` icon that opens the Product Detail Modal.
14. A full Product Detail Modal (`{{selectedProduct && (...)}}`) with:
    - High-res image
    - Full title, price, description
    - Key Specifications bullet list with checkmark icons
    - Inquire button linking to `#contact` and Back to Catalog button.
15. Why Choose Us feature cards & Contact form section.
16. Footer with copyright and WebBlock badge.

Return ONLY the raw TypeScript/TSX code. Do NOT wrap with markdown backticks if possible.
"""
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a Next.js 14 and React senior engineer. Output only clean, valid TypeScript JSX code for src/app/page.tsx."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=4096
        )
        code = completion.choices[0].message.content or ""
        
        # Clean markdown code blocks if the LLM wrapped it in ```tsx ... ```
        if "```" in code:
            lines = code.splitlines()
            cleaned_lines = []
            inside_block = False
            for line in lines:
                if line.strip().startswith("```"):
                    inside_block = not inside_block
                    continue
                cleaned_lines.append(line)
            code = "\n".join(cleaned_lines).strip()
            
        if not code.startswith('"use client"') and not code.startswith("'use client'"):
            code = '"use client";\n\n' + code
            
        logger.info(f"Successfully generated storefront code for {req.subdomain} via AI")
        return GenerateCodeResponse(page_tsx=code)
    except Exception as e:
        logger.error(f"Error calling AI code generator, falling back: {e}")
        # Safe deterministic fallback
        fallback_code = f"""\"use client\";

import React, {{ useState, useEffect }} from "react";
import {{
  Eye,
  Sparkles,
  Truck,
  ShieldCheck,
  Leaf,
  Mail,
  Phone,
  X,
  CheckCircle2,
  Zap,
  ArrowRight
}} from "lucide-react";

interface ProductItem {{
  id: string;
  title: string;
  price: number;
  customFields?: {{
    imageUrl?: string;
    description?: string;
    badge?: string;
    category?: string;
    features?: string[];
  }};
}}

const INITIAL_PRODUCTS: ProductItem[] = {products_json_str};

export default function SingleFileTenantStore() {{
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  useEffect(() => {{
    async function loadDbProducts() {{
      try {{
        const res = await fetch("/api/products");
        if (res.ok) {{
          const dbProducts = await res.json();
          if (Array.isArray(dbProducts) && dbProducts.length > 0) {{
            setProducts(dbProducts.map((p: any) => ({{
              id: p.id,
              title: p.title,
              price: Number(p.price || 0),
              customFields: typeof p.customFields === "object" && p.customFields ? p.customFields : {{
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                description: "High quality curated product.",
                badge: "Featured",
                features: ["Premium Grade", "Warranty Included"]
              }}
            }})));
          }}
        }}
      }} catch (err) {{
        console.warn("Could not load dynamic products, using fallback:", err);
      }}
    }}
    loadDbProducts();
  }}, []);

  const heroImage = products[0]?.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      <div className="w-full py-2.5 px-4 text-center text-xs font-semibold text-indigo-200 bg-indigo-950/90 border-b border-indigo-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>⚡ Free worldwide express delivery on orders over $50 • Authenticity Guaranteed</span>
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-500/30">
              {initial_letter}
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">{req.business_name}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href="#products" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">Collection</a>
            <a href="#contact" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI GENERATED STORE 2026</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {req.hero_title or req.business_name}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              {req.hero_subtitle or req.tagline or 'Engineered for unmatched performance and daily reliability.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#products" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all cursor-pointer">
                <Eye className="w-5 h-5" />
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden glass-card p-3 shadow-2xl">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative">
                <img src={heroImage} alt="Hero Banner" className="w-full h-full object-cover object-center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Featured Collection</h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">Meticulously crafted items from {req.business_name}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {{products.map((prod) => (
            <div key={{prod.id}} className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800 hover:border-indigo-500/40 transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 cursor-pointer" onClick={{() => setSelectedProduct(prod)}}>
                <img src={{prod.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}} alt={{prod.title}} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {{prod.customFields?.badge && <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">{{prod.customFields.badge}}</div>}}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/20">In Stock</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 onClick={{() => setSelectedProduct(prod)}} className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer">{{prod.title}}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{{prod.customFields?.description || "Engineered for unmatched performance."}}</p>
                  {{Array.isArray(prod.customFields?.features) && prod.customFields.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {{prod.customFields.features.slice(0, 3).map((f: string, fi: number) => (
                        <span key={{fi}} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">{{f}}</span>
                      ))}}
                    </div>
                  )}}
                </div>
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Price</p>
                    <p className="text-xl font-extrabold text-white">${{Number(prod.price || 0).toFixed(2)}}</p>
                  </div>
                  <button type="button" onClick={{() => setSelectedProduct(prod)}} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer active:scale-95">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))}}
        </div>
      </section>

      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Need Assistance? We're Here.</h2>
            <p className="text-slate-400 text-base leading-relaxed">Get in touch with our customer care concierge team anytime.</p>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400"><Mail className="w-5 h-5" /></div>
                <div><p className="text-xs text-slate-500 uppercase font-bold">Email</p><p className="text-sm font-medium">{req.contact_email}</p></div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400"><Phone className="w-5 h-5" /></div>
                <div><p className="text-xs text-slate-500 uppercase font-bold">Phone</p><p className="text-sm font-medium">{req.contact_phone}</p></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 glass-card p-8 rounded-2xl border border-slate-800">
            <form onSubmit={{(e) => {{ e.preventDefault(); alert("Inquiry sent directly to {req.business_name}"); }}}} className="space-y-4">
              <h3 className="text-xl font-bold text-white">Send Direct Message</h3>
              <input type="text" required placeholder="Your Name" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500" />
              <input type="email" required placeholder="your.email@domain.com" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500" />
              <textarea rows={{3}} required placeholder="How can we help?" className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500" />
              <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">{req.business_name}</h3>
            <p className="text-xs text-slate-400 mt-1">Generated by WebBlock AI Engine • Next.js & Prisma</p>
          </div>
          <div className="text-xs text-slate-500"><p>© 2026 {req.business_name}. All rights reserved.</p></div>
        </div>
      </footer>

      {{selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={{() => setSelectedProduct(null)}}>
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto" onClick={{(e) => e.stopPropagation()}}>
            <button type="button" onClick={{() => setSelectedProduct(null)}} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[280px] md:min-h-[420px]">
              <img src={{selectedProduct.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}} alt={{selectedProduct.title}} className="w-full h-full object-cover object-center max-h-[450px]" />
              {{selectedProduct.customFields?.badge && <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">{{selectedProduct.customFields.badge}}</div>}}
            </div>
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">In Stock</span>
                  {{selectedProduct.customFields?.category && <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">{{selectedProduct.customFields.category}}</span>}}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">{{selectedProduct.title}}</h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">${{Number(selectedProduct.price || 0).toFixed(2)}}</span>
                  <span className="text-xs text-slate-400 font-medium">USD</span>
                </div>
                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed font-normal">{{selectedProduct.customFields?.description || "Engineered with premium materials."}}</p>
                </div>
                {{Array.isArray(selectedProduct.customFields?.features) && selectedProduct.customFields.features.length > 0 && (
                  <div className="border-t border-slate-800 pt-4 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Specifications</h4>
                    <ul className="space-y-1.5">
                      {{selectedProduct.customFields.features.map((feat: string, idx: number) => (
                        <li key={{idx}} className="flex items-center gap-2 text-xs text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /><span>{{feat}}</span></li>
                      ))}}
                    </ul>
                  </div>
                )}}
              </div>
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <a href="#contact" onClick={{() => setSelectedProduct(null)}} className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"><Mail className="w-4 h-4" /><span>Inquire About This Product</span></a>
                <button type="button" onClick={{() => setSelectedProduct(null)}} className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer">Back to Catalog</button>
              </div>
            </div>
          </div>
        </div>
      )}}
    </div>
  );
}}
"""
        return GenerateCodeResponse(page_tsx=fallback_code)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

