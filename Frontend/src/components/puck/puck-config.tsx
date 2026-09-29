"use client";

import React from "react";
import { Config } from "@measured/puck";
import {
  Sparkles,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Leaf,
  Star,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Award
} from "lucide-react";

export type ComponentProps = {
  AnnouncementBar: {
    text: string;
    bgGradient?: string;
  };
  Hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryBtnText: string;
    primaryBtnLink: string;
    secondaryBtnText: string;
    secondaryBtnLink: string;
    accentColor: string;
    imageUrl: string;
  };
  StatsCounter: {
    items: { value: string; label: string }[];
  };
  ProductGrid: {
    headline: string;
    subheadline: string;
    columns: number;
    showBadge: boolean;
    buttonText: string;
    tenantProducts?: any[];
  };
  FeatureList: {
    headline: string;
    subheadline: string;
    features: { title: string; description: string; icon: string }[];
  };
  Testimonials: {
    headline: string;
    testimonials: { name: string; role: string; comment: string; rating: number }[];
  };
  ContactSection: {
    headline: string;
    subheadline: string;
    email: string;
    phone: string;
    address: string;
  };
  Footer: {
    brandName: string;
    tagline: string;
    copyright: string;
  };
};

export const puckConfig: Config<ComponentProps> = {
  components: {
    AnnouncementBar: {
      fields: {
        text: { type: "text" },
        bgGradient: { type: "text" }
      },
      defaultProps: {
        text: "✨ Exclusive launch offer: 20% off all orders with code LAUNCH20",
        bgGradient: "bg-indigo-950/80 border-b border-indigo-500/20"
      },
      render: ({ text, bgGradient }) => (
        <div className={`w-full py-2.5 px-4 text-center text-xs sm:text-sm font-medium text-indigo-200 backdrop-blur-md ${bgGradient || "bg-indigo-950/80 border-b border-indigo-500/20"}`}>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>{text}</span>
          </div>
        </div>
      )
    },

    Hero: {
      fields: {
        badge: { type: "text" },
        title: { type: "text" },
        subtitle: { type: "textarea" },
        primaryBtnText: { type: "text" },
        primaryBtnLink: { type: "text" },
        secondaryBtnText: { type: "text" },
        secondaryBtnLink: { type: "text" },
        accentColor: { type: "text" },
        imageUrl: { type: "text" }
      },
      defaultProps: {
        badge: "Next-Gen Collection",
        title: "Future-Ready Hardware For Modern Innovators",
        subtitle: "Experience boundary-pushing precision, acoustic fidelity, and aerospace-grade aesthetics designed to empower your daily workflow.",
        primaryBtnText: "Explore Products",
        primaryBtnLink: "#products",
        secondaryBtnText: "Read Story",
        secondaryBtnLink: "#story",
        accentColor: "#6366f1",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
      },
      render: ({ badge, title, subtitle, primaryBtnText, secondaryBtnText, primaryBtnLink, secondaryBtnLink, accentColor, imageUrl }) => (
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 text-left">
              {badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{badge}</span>
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
                {subtitle}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href={primaryBtnLink || "#products"}
                  style={{ backgroundColor: accentColor || "#6366f1" }}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
                {secondaryBtnText && (
                  <a
                    href={secondaryBtnLink || "#"}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer"
                  >
                    <span>{secondaryBtnText}</span>
                  </a>
                )}
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden glass-card p-3 shadow-2xl group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative">
                  <img
                    src={imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                    alt={title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Premium Selection</p>
                      <p className="text-sm font-bold text-white">Verified Authentic</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-200">5.0 (1.2k)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    },

    StatsCounter: {
      fields: {
        items: {
          type: "array",
          arrayFields: {
            value: { type: "text" },
            label: { type: "text" }
          }
        }
      },
      defaultProps: {
        items: [
          { value: "50K+", label: "Orders Delivered" },
          { value: "99.8%", label: "Satisfaction Rate" },
          { value: "24/7", label: "VIP Concierge" },
          { value: "100%", label: "Authentic Goods" }
        ]
      },
      render: ({ items }) => (
        <section className="py-12 border-y border-slate-800/80 bg-slate-950/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(items || []).map((item, idx) => (
                <div key={idx} className="text-center space-y-1">
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
      )
    },

    ProductGrid: {
      fields: {
        headline: { type: "text" },
        subheadline: { type: "textarea" },
        columns: {
          type: "select",
          options: [
            { label: "2 Columns", value: 2 },
            { label: "3 Columns", value: 3 },
            { label: "4 Columns", value: 4 }
          ]
        },
        showBadge: { type: "radio", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
        buttonText: { type: "text" }
      },
      defaultProps: {
        headline: "Curated Store Collection",
        subheadline: "Handpicked items featuring exceptional build quality, sleek ergonomics, and backed by warranty.",
        columns: 3,
        showBadge: true,
        buttonText: "Add to Cart"
      },
      render: ({ headline, subheadline, columns = 3, showBadge = true, buttonText = "Add to Cart", tenantProducts = [] }) => {
        // Fallback default mock items if tenant products are not loaded yet in editor preview
        const displayProducts = tenantProducts && tenantProducts.length > 0 ? tenantProducts : [
          {
            id: "mock-1",
            title: "Aura Pro Wireless Headphones",
            price: 249.00,
            customFields: {
              description: "Active noise-cancelling spatial acoustics with 40-hour battery life.",
              imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
              badge: "Best Seller",
              category: "Audio",
              features: ["Spatial Audio", "40hr Battery", "ANC"]
            }
          },
          {
            id: "mock-2",
            title: "Zenith Titanium Chrono Watch",
            price: 189.50,
            customFields: {
              description: "Minimalist sapphire crystal timepiece crafted from aerospace titanium.",
              imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
              badge: "New Release",
              category: "Accessories",
              features: ["Sapphire Glass", "5ATM Water Resistant", "Titanium"]
            }
          },
          {
            id: "mock-3",
            title: "Luminary Ergo Smart Desk Lamp",
            price: 89.00,
            customFields: {
              description: "Circadian rhythm matching lighting with integrated wireless charging base.",
              imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
              badge: "Popular",
              category: "Desk Setup",
              features: ["Circadian Light", "Qi Charger", "Touch Control"]
            }
          }
        ];

        const gridColsClass =
          columns === 2 ? "grid-cols-1 md:grid-cols-2" :
          columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

        return (
          <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {headline}
              </h2>
              {subheadline && (
                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                  {subheadline}
                </p>
              )}
            </div>

            <div className={`grid ${gridColsClass} gap-8`}>
              {displayProducts.map((prod: any, idx: number) => {
                const img = prod?.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";
                const badgeText = prod?.customFields?.badge || (idx === 0 ? "Featured" : null);
                const desc = prod?.customFields?.description || "Engineered with highest grade materials.";
                const features = prod?.customFields?.features || [];

                return (
                  <div
                    key={prod.id || idx}
                    className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800 hover:border-indigo-500/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                      <img
                        src={img}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {showBadge && badgeText && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                          {badgeText}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        In Stock
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {prod.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                          {desc}
                        </p>
                        {Array.isArray(features) && features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {features.slice(0, 3).map((f: string, fi: number) => (
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
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              const event = new CustomEvent("add-to-cart", { detail: prod });
                              window.dispatchEvent(event);
                            }
                          }}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{buttonText}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      }
    },

    FeatureList: {
      fields: {
        headline: { type: "text" },
        subheadline: { type: "textarea" },
        features: {
          type: "array",
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
            icon: {
              type: "select",
              options: [
                { label: "Truck (Shipping)", value: "Truck" },
                { label: "ShieldCheck (Warranty)", value: "ShieldCheck" },
                { label: "Leaf (Eco)", value: "Leaf" },
                { label: "Award (Quality)", value: "Award" },
                { label: "Globe (Global)", value: "Globe" }
              ]
            }
          }
        }
      },
      defaultProps: {
        headline: "Crafted With Purpose",
        subheadline: "Every component is meticulously reviewed to guarantee unmatched longevity and performance.",
        features: [
          {
            title: "Direct Worldwide Dispatch",
            description: "Orders packaged in climate-neutral facilities and shipped with priority courier tracking within 24 hours.",
            icon: "Truck"
          },
          {
            title: "2-Year Comprehensive Guarantee",
            description: "No-questions-asked warranty covering all structural and electrical components with instant exchanges.",
            icon: "ShieldCheck"
          },
          {
            title: "Sustainably Engineered",
            description: "Built with 100% recycled aerospace aluminum, bio-based resin, and plastic-free minimal packaging.",
            icon: "Leaf"
          }
        ]
      },
      render: ({ headline, subheadline, features }) => {
        const renderIcon = (name: string) => {
          switch (name) {
            case "Truck": return <Truck className="w-6 h-6 text-indigo-400" />;
            case "ShieldCheck": return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
            case "Leaf": return <Leaf className="w-6 h-6 text-indigo-400" />;
            case "Globe": return <Globe className="w-6 h-6 text-indigo-400" />;
            default: return <Award className="w-6 h-6 text-indigo-400" />;
          }
        };

        return (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
            <div className="text-center space-y-3 mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {headline}
              </h2>
              {subheadline && (
                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                  {subheadline}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(features || []).map((feat, idx) => (
                <div key={idx} className="glass-card p-8 rounded-2xl space-y-4 relative group">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {renderIcon(feat.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      }
    },

    Testimonials: {
      fields: {
        headline: { type: "text" },
        testimonials: {
          type: "array",
          arrayFields: {
            name: { type: "text" },
            role: { type: "text" },
            comment: { type: "textarea" },
            rating: { type: "number" }
          }
        }
      },
      defaultProps: {
        headline: "Loved by Over 40,000 Verified Creators",
        testimonials: [
          {
            name: "Alexander Hayes",
            role: "Product Architect, San Francisco",
            comment: "The precision in build quality is unlike anything else on the market. It elevated my entire desk workflow on day one.",
            rating: 5
          },
          {
            name: "Maya Lin",
            role: "Creative Director, Tokyo",
            comment: "Remarkable craftsmanship and lightning fast international delivery. Customer service was immediately responsive.",
            rating: 5
          }
        ]
      },
      render: ({ headline, testimonials }) => (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(testimonials || []).map((t, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-base italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                    {t.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )
    },

    ContactSection: {
      fields: {
        headline: { type: "text" },
        subheadline: { type: "textarea" },
        email: { type: "text" },
        phone: { type: "text" },
        address: { type: "text" }
      },
      defaultProps: {
        headline: "Get in Touch With Our Concierge",
        subheadline: "Have questions about bulk orders, custom specifications, or sizing? Our specialists respond in minutes.",
        email: "concierge@store.com",
        phone: "+1 (800) 555-0199",
        address: "742 Innovation Blvd, Suite 300"
      },
      render: ({ headline, subheadline, email, phone, address }) => (
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {headline}
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                {subheadline}
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Phone</p>
                    <p className="text-sm font-medium">{phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-indigo-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
                    <p className="text-sm font-medium">{address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 glass-card p-8 rounded-2xl border border-slate-800">
              <form onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent to store concierge!"); }} className="space-y-4">
                <h3 className="text-xl font-bold text-white">Send Direct Message</h3>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Message / Inquiry</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we help with your order?"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      )
    },

    Footer: {
      fields: {
        brandName: { type: "text" },
        tagline: { type: "textarea" },
        copyright: { type: "text" }
      },
      defaultProps: {
        brandName: "Store",
        tagline: "Engineered for excellence and designed with aesthetic precision.",
        copyright: "© 2026 Store. Powered by WebBlock Platform."
      },
      render: ({ brandName, tagline, copyright }) => (
        <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{brandName}</h3>
              <p className="text-xs text-slate-400 max-w-sm">{tagline}</p>
            </div>
            <div className="text-xs text-slate-500">
              <p>{copyright}</p>
              <p className="mt-1">Logical Tenant Isolation • PostgreSQL RLS • Next.js & Puck</p>
            </div>
          </div>
        </footer>
      )
    }
  }
};
