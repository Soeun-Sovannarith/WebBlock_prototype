"use client";

/**
 * ====================================================================================
 * WEBBLOCK TENANT WEBSITE RUNTIME ENGINE (NEXT.JS + PRISMA SINGLE-FILE ARCHITECTURE)
 * ====================================================================================
 * This single-file Next.js client/server component renders any tenant website dynamically
 * by querying PostgreSQL tenant data and rendering the serialized Puck components.
 */

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Eye,
  Sparkles,
  Truck,
  ShieldCheck,
  Leaf,
  Star,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  Zap,
  ArrowRight,
  Globe,
  Sliders,
  Award
} from "lucide-react";

interface ProductItem {
  id: string;
  title: string;
  price: number;
  customFields?: {
    imageUrl?: string;
    description?: string;
    badge?: string;
    category?: string;
    features?: string[];
  };
}

export default function TenantWebsiteSingleFilePage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;

  const [loading, setLoading] = useState(true);
  const [tenantWebsite, setTenantWebsite] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Load tenant website from Backend / Prisma
  useEffect(() => {
    async function loadTenantData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${apiUrl}/api/websites/resolve?subdomain=${subdomain}`);
        if (!res.ok) throw new Error("Subdomain not found");
        const data = await res.json();
        setTenantWebsite(data.website);
        setSiteSettings(data.siteSetting);
        setProducts(data.products || []);
      } catch (err) {
        console.warn("Using offline fallback data for subdomain:", subdomain);
        setTenantWebsite({
          tenantId: "demo-tenant-id",
          subdomain: subdomain || "artisan-brand",
          domainName: ""
        });
        setSiteSettings({
          themeConfig: {
            businessName: (subdomain || "Apex Gear").replace(/-/g, " ").toUpperCase(),
            theme: "tech-store"
          }
        });
        setProducts([
          {
            id: "demo-p1",
            title: "Apex Wireless Acoustic System",
            price: 249.00,
            customFields: {
              description: "Lossless spatial acoustics with active noise cancellation.",
              imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
              badge: "Best Seller",
              category: "Audio",
              features: ["Spatial 3D Audio", "45hr Battery", "Active Noise Cancellation"]
            }
          },
          {
            id: "demo-p2",
            title: "Zenith Titanium Smartwatch",
            price: 189.50,
            customFields: {
              description: "Aerospace titanium casing with AMOLED sapphire display.",
              imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
              badge: "New Release",
              category: "Wearables",
              features: ["Titanium Case", "Sapphire Glass", "14-Day Battery"]
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    if (subdomain) loadTenantData();
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-300">
        <Zap className="w-8 h-8 animate-pulse text-indigo-500 mb-3" />
        <p className="text-sm font-semibold tracking-wide">Connecting to {subdomain}.webblock.io...</p>
      </div>
    );
  }

  const themeConfig = siteSettings?.themeConfig || {};
  const businessName =
    themeConfig.businessName || (subdomain || "Store").replace(/-/g, " ").toUpperCase();
  const puckContent = Array.isArray(themeConfig.content) ? themeConfig.content : [];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Announcement Bar */}
      <div className="w-full py-2.5 px-4 text-center text-xs font-semibold text-indigo-200 bg-indigo-950/90 border-b border-indigo-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>⚡ Free worldwide express delivery on orders over $50 • Authenticity Guaranteed</span>
        </div>
      </div>

      {/* Main Tenant Storefront Header */}
      <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-500/30">
              {businessName.charAt(0)}
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">{businessName}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#products" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Collection
            </a>
            <a href="#contact" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Dynamic Content: Render Puck Blocks or Default Template */}
      <main className="flex-1">
        {puckContent.length > 0 ? (
          puckContent.map((block: any, idx: number) => {
            const { type, props } = block;

            if (type === "Hero") {
              return (
                <section key={idx} className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                    <div className="lg:col-span-7 space-y-6 text-left">
                      {props.badge && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{props.badge}</span>
                        </div>
                      )}
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                        {props.title || "Elevate Your Lifestyle"}
                      </h1>
                      <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
                        {props.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        <a
                          href="#products"
                          style={{ backgroundColor: props.accentColor || "#6366f1" }}
                          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-all cursor-pointer"
                        >
                          <Eye className="w-5 h-5" />
                          <span>{props.primaryBtnText || "Explore Catalog"}</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative">
                      <div className="relative rounded-3xl overflow-hidden glass-card p-3 shadow-2xl">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative">
                          <img
                            src={props.imageUrl || products[0]?.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                            alt="Hero Banner"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            if (type === "ProductGrid") {
              return (
                <section key={idx} id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  <div className="text-center space-y-4 mb-14">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {props.headline || "Featured Collection"}
                    </h2>
                    {props.subheadline && (
                      <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                        {props.subheadline}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800 hover:border-indigo-500/40 transition-all duration-300"
                      >
                        <div
                          className="relative aspect-[4/3] overflow-hidden bg-slate-900 cursor-pointer"
                          onClick={() => setSelectedProduct(prod)}
                        >
                          <img
                            src={prod.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {prod.customFields?.badge && (
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                              {prod.customFields.badge}
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/20">
                            In Stock
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h3
                              onClick={() => setSelectedProduct(prod)}
                              className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer"
                            >
                              {prod.title}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                              {prod.customFields?.description || "Engineered for unmatched performance."}
                            </p>
                            {Array.isArray(prod.customFields?.features) && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {prod.customFields.features.slice(0, 3).map((f: string, fi: number) => (
                                  <span key={fi} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-slate-500 uppercase font-medium">Price</p>
                              <p className="text-xl font-extrabold text-white">
                                ${Number(prod.price || 0).toFixed(2)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(prod)}
                              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (type === "StatsCounter") {
              return (
                <section key={idx} className="py-12 border-y border-slate-800/80 bg-slate-950/40 backdrop-blur-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {(props.items || []).map((item: any, i: number) => (
                        <div key={i} className="text-center space-y-1">
                          <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
                            {item.value}
                          </div>
                          <div className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide uppercase">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            if (type === "FeatureList") {
              return (
                <section key={idx} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
                  <div className="text-center space-y-3 mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {props.headline || "Why Choose Us"}
                    </h2>
                    {props.subheadline && (
                      <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                        {props.subheadline}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(props.features || []).map((feat: any, fi: number) => (
                      <div key={fi} className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            if (type === "ContactSection") {
              return (
                <section key={idx} id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 space-y-6">
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {props.headline || "Contact Our Concierge"}
                      </h2>
                      <p className="text-slate-400 text-base leading-relaxed">
                        {props.subheadline || "We are here to assist with any questions or order inquiries."}
                      </p>
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4 text-slate-300">
                          <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                            <p className="text-sm font-medium">{props.email || "hello@store.com"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-300">
                          <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Phone</p>
                            <p className="text-sm font-medium">{props.phone || "+1 (800) 555-0199"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-6 glass-card p-8 rounded-2xl border border-slate-800">
                      <form onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent directly to " + businessName); }} className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Send Direct Message</h3>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="email"
                          required
                          placeholder="your.email@domain.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <textarea
                          rows={3}
                          required
                          placeholder="How can we help?"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                        >
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                </section>
              );
            }

            return null;
          })
        ) : (
          /* Default products grid if no puck blocks */
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white mb-10 text-center">Store Catalog</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((prod) => (
                <div key={prod.id} className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white">{prod.title}</h3>
                  <p className="text-xl font-black text-indigo-400 mt-2">${prod.price}</p>
                  <button
                    onClick={() => setSelectedProduct(prod)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">{businessName}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Powered by WebBlock • Multi-Tenant PostgreSQL RLS & Next.js Engine
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Product Image */}
            <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center relative min-h-[280px] md:min-h-[420px]">
              <img
                src={
                  selectedProduct.customFields?.imageUrl ||
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                }
                alt={selectedProduct.title}
                className="w-full h-full object-cover object-center max-h-[450px]"
              />
              {selectedProduct.customFields?.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                  {selectedProduct.customFields.badge}
                </div>
              )}
            </div>

            {/* Right: Product Information */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                    In Stock
                  </span>
                  {selectedProduct.customFields?.category && (
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold">
                      {selectedProduct.customFields.category}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {selectedProduct.title}
                </h2>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                    ${Number(selectedProduct.price || 0).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">USD</span>
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed font-normal">
                    {selectedProduct.customFields?.description ||
                      "Engineered with premium quality materials, designed for durability, exceptional performance, and everyday reliability."}
                  </p>
                </div>

                {Array.isArray(selectedProduct.customFields?.features) &&
                  selectedProduct.customFields.features.length > 0 && (
                    <div className="border-t border-slate-800 pt-4 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Key Specifications
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedProduct.customFields.features.map((feat: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div className="pt-6 border-t border-slate-800 space-y-3">
                <a
                  href="#contact"
                  onClick={() => setSelectedProduct(null)}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Inquire About This Product</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Back to Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

