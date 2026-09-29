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

@app.post("/api/ai/studio-copilot", response_model=StudioCopilotResponse)
def studio_copilot(req: StudioCopilotRequest):
    """
    Interactive studio assistant that answers user questions, suggests layout tweaks,
    or generates customized copy for Puck blocks.
    """
    system_msg = """You are 'BlockAI', the intelligent co-pilot inside WebBlock Visual Studio.
You help website builders improve their store design, copy, CTA buttons, layout hierarchy, and product showcases.
Keep answers concise, helpful, actionable, and friendly.
If the user asks to modify a section, suggest exact text and color improvements.
"""
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": f"User prompt: {req.prompt}\nContext: {json.dumps(req.business_context or {})}"}
            ]
        )
        reply = completion.choices[0].message.content
        return StudioCopilotResponse(reply=reply)
    except Exception as e:
        logger.error(f"Error in studio copilot: {e}")
        return StudioCopilotResponse(
            reply="I'm here to help customize your WebBlock store! You can drag and drop any block from the left panel, tweak theme colors, or add high-converting CTA banners."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
