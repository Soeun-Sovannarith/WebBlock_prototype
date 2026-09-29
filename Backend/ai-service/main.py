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
            
        print("\n" + "="*80, flush=True)
        print(f"🚀 [AI CODE GENERATOR] Generated Storefront Code for '{req.subdomain}' ({len(code)} characters):", flush=True)
        print("="*80, flush=True)
        print(code, flush=True)
        print("="*80 + "\n", flush=True)

        logger.info(f"Successfully generated storefront code for {req.subdomain} directly via Groq AI")
        return GenerateCodeResponse(page_tsx=code)
    except Exception as e:
        logger.error(f"Error calling Groq AI code generator: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Groq AI Code Generation failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)


