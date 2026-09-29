import { TemplateInfo } from "./types";

export const PREDEFINED_TEMPLATES: TemplateInfo[] = [
  {
    id: "tech-store",
    name: "Cyber & Tech Gear",
    description: "Ultra-sleek dark aesthetic tailored for next-generation hardware, smart audio, and gaming devices.",
    category: "Consumer Tech",
    badge: "Most Popular",
    previewGradient: "from-indigo-600/30 via-slate-900 to-cyan-500/20",
    accentColor: "#6366f1",
    heroHeadline: "Future-Ready Hardware For Modern Innovators",
    heroSubtitle: "Experience boundary-pushing audio precision, smart ergonomics, and aerospace-grade accessories designed for performance.",
    sampleProducts: [
      {
        title: "Aura Pro Spatial Headset",
        price: 289.00,
        description: "Zero-latency lossless wireless audio with 45-hour battery and active adaptive spatial acoustics.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        badge: "Flagship",
        category: "Audio",
        stock: 50,
        features: ["Spatial Audio 3D", "45hr Battery", "Titanium Drivers"]
      },
      {
        title: "Chronos Titanium Smartwatch",
        price: 199.50,
        description: "Aerospace titanium casing with AMOLED sapphire display and 14-day continuous biometrics monitoring.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        badge: "Best Seller",
        category: "Wearables",
        stock: 40,
        features: ["Sapphire Glass", "5ATM Waterproof", "14-Day Battery"]
      },
      {
        title: "Nova Halo Magnetic Desk Lamp",
        price: 89.00,
        description: "Circadian rhythm smart lighting with integrated 15W MagSafe wireless rapid charger base.",
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
        badge: "New Release",
        category: "Desk Setup",
        stock: 90,
        features: ["Circadian Lighting", "15W MagSafe Base", "Touch Control"]
      }
    ]
  },
  {
    id: "artisan-coffee",
    name: "Artisan Coffee Roastery",
    description: "Warm, cozy aesthetic crafted for specialty coffee roasters, beans subscriptions, and cafe brewers.",
    category: "Food & Beverage",
    badge: "Trending",
    previewGradient: "from-amber-600/30 via-stone-900 to-orange-500/20",
    accentColor: "#d97706",
    heroHeadline: "Small-Batch Single Origin Coffee Roasted to Perfection",
    heroSubtitle: "Direct trade beans sustainably sourced from high-altitude micro-lots around the globe and delivered fresh to your door.",
    sampleProducts: [
      {
        title: "Ethiopian Yirgacheffe Natural",
        price: 24.00,
        description: "Delicate floral aroma with tasting notes of jasmine, blueberry jam, and candied bergamot.",
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
        badge: "Single Origin",
        category: "Whole Bean",
        stock: 100,
        features: ["Altitude: 2100m", "Light Roast", "Floral & Fruity"]
      },
      {
        title: "Midnight Espresso Reserve",
        price: 22.50,
        description: "Velvety dark chocolate and toasted almond notes with a thick, golden crema for rich espresso.",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        badge: "Barista Choice",
        category: "Espresso",
        stock: 80,
        features: ["Full Body", "Dark Chocolate Notes", "Slow Roasted"]
      },
      {
        title: "Precision Ceramic Pour-Over Dripper",
        price: 45.00,
        description: "Handcrafted Japanese ceramic brewer with spiral interior ribs for optimal extraction speed.",
        imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80",
        badge: "Crafted",
        category: "Brew Gear",
        stock: 35,
        features: ["Handmade Ceramic", "V60 Compatible", "Heat Retention"]
      }
    ]
  },
  {
    id: "minimal-fashion",
    name: "Minimalist Fashion House",
    description: "Sophisticated monochrome aesthetic for apparel lines, luxury streetwear, and jewelry brands.",
    category: "Apparel & Luxury",
    badge: "High Elegance",
    previewGradient: "from-fuchsia-600/20 via-zinc-900 to-slate-800",
    accentColor: "#ec4899",
    heroHeadline: "Timeless Silhouettes & Ethical Luxury Essentials",
    heroSubtitle: "Curated architectural garments made from 100% organic, sustainably dyed natural fibers.",
    sampleProducts: [
      {
        title: "Heavyweight Oversized Boxy Hoodie",
        price: 135.00,
        description: "500 GSM French terry cotton with drop-shoulder silhouette and double-layered hood.",
        imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
        badge: "Limited Edition",
        category: "Outerwear",
        stock: 45,
        features: ["500 GSM Organic Cotton", "Pre-shrunk", "Custom Hardware"]
      },
      {
        title: "Monochrome Tailored Wool Trousers",
        price: 165.00,
        description: "Relaxed wide-leg drape crafted from premium Italian virgin wool blend.",
        imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        badge: "New Silhouette",
        category: "Pants",
        stock: 30,
        features: ["Italian Virgin Wool", "Pleated Front", "Relaxed Fit"]
      },
      {
        title: "Minimalist Leather Crossbody Tote",
        price: 210.00,
        description: "Vegetable-tanned full-grain leather with magnetic snap closure and brass accents.",
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
        badge: "Artisan Leather",
        category: "Accessories",
        stock: 25,
        features: ["Full-Grain Leather", "YKK Hardware", "Interior Laptop Pocket"]
      }
    ]
  },
  {
    id: "fitness-lab",
    name: "Athletic Performance Lab",
    description: "High-energy bold aesthetic engineered for fitness equipment, gym apparel, and supplements.",
    category: "Sports & Fitness",
    badge: "High Energy",
    previewGradient: "from-emerald-600/30 via-slate-900 to-teal-500/20",
    accentColor: "#10b981",
    heroHeadline: "Uncompromising Gear For Relentless Performance",
    heroSubtitle: "Engineered with scientific ergonomics and durable composites to elevate your personal records.",
    sampleProducts: [
      {
        title: "Apex Carbon Grips & Straps",
        price: 48.00,
        description: "Aerospace carbon fiber weave for maximum barbell grip security and wrist support.",
        imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
        badge: "Pro Athlete",
        category: "Gear",
        stock: 60,
        features: ["Carbon Fiber Weave", "Wrist Support", "Zero Slippage"]
      },
      {
        title: "HydroFlow Thermal Insulated Flask",
        price: 36.00,
        description: "Triple-wall vacuum insulation keeps ice frozen for 36 hours. 32oz capacity.",
        imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
        badge: "Essential",
        category: "Hydration",
        stock: 120,
        features: ["36hr Cold", "Leak-proof Lid", "BPA-Free Steel"]
      },
      {
        title: "Elite Pro Resistance Band System",
        price: 65.00,
        description: "Multi-layered natural latex with heavy-duty carabiners and door anchor system.",
        imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
        badge: "Top Seller",
        category: "Training",
        stock: 85,
        features: ["Up to 150lbs Resistance", "Anti-Snap Tech", "Travel Case"]
      }
    ]
  }
];

export function getDefaultPuckData(templateId: string, businessName: string, products: any[]) {
  const template = PREDEFINED_TEMPLATES.find(t => t.id === templateId) || PREDEFINED_TEMPLATES[0];

  return {
    content: [
      {
        type: "AnnouncementBar",
        props: {
          id: "announcement-1",
          text: `⚡ Free worldwide express shipping on all orders over $75 • Code: FREESHIP`,
          bgGradient: "bg-gradient-to-r from-indigo-900/60 to-purple-900/60"
        }
      },
      {
        type: "Hero",
        props: {
          id: "hero-1",
          badge: "New Release 2026",
          title: template.heroHeadline,
          subtitle: template.heroSubtitle,
          primaryBtnText: "Explore Catalog",
          primaryBtnLink: "#products",
          secondaryBtnText: "Our Story",
          secondaryBtnLink: "#about",
          accentColor: template.accentColor,
          imageUrl: products[0]?.customFields?.imageUrl || template.sampleProducts[0].imageUrl
        }
      },
      {
        type: "StatsCounter",
        props: {
          id: "stats-1",
          items: [
            { value: "48,000+", label: "Happy Customers" },
            { value: "99.4%", label: "Satisfaction Rate" },
            { value: "24/7", label: "Dedicated Support" },
            { value: "30-Day", label: "Money Back Guarantee" }
          ]
        }
      },
      {
        type: "ProductGrid",
        props: {
          id: "products-1",
          headline: "Featured Collection",
          subheadline: `Meticulously crafted items from ${businessName}`,
          columns: 3,
          showBadge: true,
          buttonText: "Add to Bag"
        }
      },
      {
        type: "FeatureList",
        props: {
          id: "features-1",
          headline: "Why Choose WebBlock Built Stores",
          subheadline: "Every detail engineered for unrivaled satisfaction and speed",
          features: [
            {
              title: "Lightning Fast Delivery",
              description: "Direct dispatch within 24 hours with end-to-end tracked courier delivery.",
              icon: "Truck"
            },
            {
              title: "2-Year Full Warranty",
              description: "We stand 100% behind our craftsmanship with hassle-free replacements.",
              icon: "ShieldCheck"
            },
            {
              title: "Eco-Conscious Packaging",
              description: "100% biodegradable and recyclable packaging materials on all shipments.",
              icon: "Leaf"
            }
          ]
        }
      },
      {
        type: "Testimonials",
        props: {
          id: "testimonials-1",
          headline: "Loved by Over 40,000 Customers",
          testimonials: [
            {
              name: "Elena Rostova",
              role: "Verified Buyer",
              rating: 5,
              comment: "The precision quality and packaging exceeded my highest expectations. Will definitely order again!"
            },
            {
              name: "David Chen",
              role: "Design Lead",
              rating: 5,
              comment: "Exceptional craftsmanship. It looks even better in person than in the pictures."
            }
          ]
        }
      },
      {
        type: "ContactSection",
        props: {
          id: "contact-1",
          headline: "Need Assistance? We're Here.",
          subheadline: "Get in touch with our customer care concierge team anytime.",
          email: "support@" + businessName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
          phone: "+1 (800) 555-0199",
          address: "100 Innovation District, Suite 400"
        }
      },
      {
        type: "Footer",
        props: {
          id: "footer-1",
          brandName: businessName,
          tagline: template.description,
          copyright: `© ${new Date().getFullYear()} ${businessName}. Powered by WebBlock Engine.`
        }
      }
    ],
    root: {
      props: {
        title: businessName
      }
    }
  };
}
