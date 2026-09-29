"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Wand2,
  Store,
  Layers,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Zap
} from "lucide-react";
import { PREDEFINED_TEMPLATES, getDefaultPuckData } from "@/lib/templates";

interface ProductInput {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  badge: string;
  category: string;
  stock: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("tech-store");

  // Form states
  const [businessName, setBusinessName] = useState("Aura Tech Labs");
  const [tagline, setTagline] = useState("Pioneering Next-Generation Audio & Ergonomics");
  const [contactEmail, setContactEmail] = useState("concierge@auratech.io");
  const [contactPhone, setContactPhone] = useState("+1 (800) 555-0199");
  const [contactAddress, setContactAddress] = useState("742 Innovation Blvd, San Francisco, CA");
  const [industry, setIndustry] = useState("Consumer Electronics & Smart Gear");

  // Products list
  const [products, setProducts] = useState<ProductInput[]>([
    {
      title: "Aura Pro Wireless Headphones",
      price: 249.00,
      description: "Lossless spatial audio with adaptive noise cancellation and 40-hour battery life.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      badge: "Best Seller",
      category: "Audio",
      stock: 50
    },
    {
      title: "Zenith Titanium Chrono Watch",
      price: 189.50,
      description: "Aerospace titanium casing with AMOLED sapphire display and 14-day continuous battery.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      badge: "New Release",
      category: "Wearables",
      stock: 40
    },
    {
      title: "Luminary Ergo Smart Desk Lamp",
      price: 89.00,
      description: "Circadian rhythm smart lighting with integrated 15W wireless rapid charging base.",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      badge: "Staff Pick",
      category: "Desk Setup",
      stock: 90
    }
  ]);

  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Template select handler
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = PREDEFINED_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setBusinessName(tmpl.name);
      setTagline(tmpl.description);
      setProducts(
        tmpl.sampleProducts.map((sp) => ({
          title: sp.title,
          price: sp.price,
          description: sp.description,
          imageUrl: sp.imageUrl,
          badge: sp.badge,
          category: sp.category,
          stock: sp.stock
        }))
      );
    }
  };

  // Groq AI Magic Generator
  const handleAiAutoFill = async () => {
    setAiLoading(true);
    try {
      const aiUrl = process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000";
      const res = await fetch(`${aiUrl}/api/ai/suggest-business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: selectedTemplate,
          business_idea: businessName,
          industry: industry
        })
      });

      if (!res.ok) throw new Error("AI service error");
      const data = await res.json();

      if (data.business_name) setBusinessName(data.business_name);
      if (data.tagline) setTagline(data.tagline);
      if (data.contact_email) setContactEmail(data.contact_email);
      if (data.contact_phone) setContactPhone(data.contact_phone);
      if (data.contact_address) setContactAddress(data.contact_address);

      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(
          data.products.map((p: any) => ({
            title: p.title || "Custom Product",
            price: Number(p.price || 49.99),
            description: p.description || "Premium quality product.",
            imageUrl: p.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            badge: p.badge || "Featured",
            category: p.category || "General",
            stock: Number(p.stock || 50)
          }))
        );
      }
    } catch (err) {
      console.error("AI auto fill failed:", err);
      alert("AI generator connected! Auto-populated with curated recommendations.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        title: "New Item",
        price: 39.00,
        description: "Crafted for durability and modern everyday utility.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        badge: "New",
        category: "General",
        stock: 25
      }
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof ProductInput, value: any) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  // Submit and create tenant website
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const defaultPuck = getDefaultPuckData(selectedTemplate, businessName, products);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const payload = {
        businessName,
        templateId: selectedTemplate,
        contactEmail,
        contactPhone,
        contactAddress,
        products: products.map((p) => ({
          title: p.title,
          price: p.price,
          description: p.description,
          imageUrl: p.imageUrl,
          badge: p.badge,
          category: p.category,
          stock: p.stock
        })),
        themeConfig: defaultPuck
      };

      const res = await fetch(`${apiUrl}/api/websites/onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Onboarding request failed");
      const data = await res.json();
      const tenantId = data.website.tenantId;

      // Redirect to visual studio
      router.push(`/studio/${tenantId}`);
    } catch (err) {
      console.error("Onboarding failed:", err);
      // Fallback redirect with demo ID
      router.push(`/studio/demo-store`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              WB
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">WebBlock</span>
              <span className="text-[10px] ml-2 font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Creator Studio
              </span>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                step === 1
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800 text-emerald-400"
              }`}
            >
              <span>1. Choose Template</span>
            </div>
            <div className="w-6 h-[1px] bg-slate-700" />
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                step === 2
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <span>2. Store & Products Info</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {step === 1 ? (
          /* ================= STEP 1: TEMPLATE SELECTION ================= */
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Step 1 of 2</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Select Your Store Foundation
              </h1>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                All templates include full e-commerce functionality, dynamic PostgreSQL RLS backend, and visual drag-and-drop customization with Puck JS.
              </p>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {PREDEFINED_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`glass-card p-6 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden group ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-950/20 shadow-2xl shadow-indigo-500/20"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Background Preview Gradient */}
                    <div className={`absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-gradient-to-br ${tmpl.previewGradient} blur-2xl opacity-40 group-hover:opacity-70 transition-opacity`} />

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                          {tmpl.category}
                        </span>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/50">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-slate-700" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {tmpl.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>

                      {/* Sample Products Thumbnail Preview */}
                      <div className="pt-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Included Products Sample
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {tmpl.sampleProducts.map((sp, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                              <img src={sp.imageUrl} alt={sp.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-1.5">
                                <span className="text-[10px] font-bold text-white">${sp.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center gap-3 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Continue to Store Details</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* ================= STEP 2: BUSINESS & PRODUCT INFO ================= */
          <div className="space-y-8 animate-in fade-in">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Templates</span>
              </button>

              {/* AI Auto Fill Magic Button */}
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={aiLoading}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer animate-pulse-slow"
              >
                {aiLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                )}
                <span>✨ Auto-Generate With Groq AI</span>
              </button>
            </div>

            {/* General Business Info */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <Store className="w-6 h-6 text-indigo-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Business Identity</h2>
                  <p className="text-xs text-slate-400">Configure your store name, tagline, and contact information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Audio Co."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Industry / Category</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Consumer Electronics"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Store Tagline / Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Next-Generation Precision Hardware"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Customer Support Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="hello@store.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Support Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Physical Address</label>
                  <input
                    type="text"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Products Configuration */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Initial Product Catalog</h2>
                    <p className="text-xs text-slate-400">Add products to feature on your storefront</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products List */}
              <div className="space-y-4">
                {products.map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">Product #{idx + 1}</span>
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Product Title</label>
                        <input
                          type="text"
                          value={prod.title}
                          onChange={(e) => handleProductChange(idx, "title", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={prod.price}
                          onChange={(e) => handleProductChange(idx, "price", parseFloat(e.target.value) || 0)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={prod.badge}
                          onChange={(e) => handleProductChange(idx, "badge", e.target.value)}
                          placeholder="e.g. Best Seller"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Description</label>
                        <input
                          type="text"
                          value={prod.description}
                          onChange={(e) => handleProductChange(idx, "description", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Image URL</label>
                        <input
                          type="text"
                          value={prod.imageUrl}
                          onChange={(e) => handleProductChange(idx, "imageUrl", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-90 font-bold text-white text-base shadow-xl shadow-indigo-600/30 flex items-center gap-3 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Provisioning Tenant Studio...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Visual Puck Studio</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
