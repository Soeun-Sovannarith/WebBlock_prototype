"use client";

import React, { useState } from "react";
import { Code2, Copy, Check, Terminal, FileCode, Layers, Sparkles } from "lucide-react";

interface LiveCodeViewerProps {
  puckData: any;
  businessName?: string;
}

export function generateReactCode(puckData: any, businessName: string = "ModernStore"): string {
  const content = puckData?.content || [];

  const imports = `import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, Leaf, Star, Mail, Phone, MapPin, Zap, ArrowRight, Sparkles } from 'lucide-react';
`;

  const componentsCode = content.map((item: any, idx: number) => {
    const { type, props } = item;
    switch (type) {
      case "AnnouncementBar":
        return `      {/* Announcement Bar */}
      <div className="w-full py-2.5 px-4 text-center text-xs font-medium text-indigo-200 bg-indigo-950/80 border-b border-indigo-500/20">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span>${props.text || "Exclusive Offer"}</span>
        </div>
      </div>`;

      case "Hero":
        return `      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>${props.badge || "New"}</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight">${props.title || "Store Title"}</h1>
            <p className="text-lg text-slate-300">${props.subtitle || ""}</p>
            <div className="flex gap-4 pt-4">
              <button style={{ backgroundColor: '${props.accentColor || "#6366f1"}' }} className="px-7 py-3.5 rounded-xl font-semibold text-white shadow-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>${props.primaryBtnText || "Shop Now"}</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img src="${props.imageUrl || ""}" alt="Hero" className="rounded-2xl shadow-2xl object-cover aspect-square w-full" />
          </div>
        </div>
      </section>`;

      case "ProductGrid":
        return `      {/* Dynamic Products Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">${props.headline || "Featured Products"}</h2>
          <p className="text-slate-400 mt-2">${props.subheadline || ""}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${props.columns || 3} gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <img src={product.imageUrl} alt={product.title} className="rounded-xl aspect-video object-cover" />
              <div className="mt-4">
                <h3 className="font-bold text-white">{product.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-white">\${product.price}</span>
                  <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold">${props.buttonText || "Add to Cart"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>`;

      case "StatsCounter":
        return `      {/* Stats Section */}
      <section className="py-12 border-y border-slate-800 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
${(props.items || []).map((st: any) => `          <div className="text-center">
            <div className="text-3xl font-black text-indigo-400">${st.value}</div>
            <div className="text-xs uppercase text-slate-400">${st.label}</div>
          </div>`).join("\n")}
        </div>
      </section>`;

      case "FeatureList":
        return `      {/* Highlights & Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-white mb-12">${props.headline || "Why Choose Us"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
${(props.features || []).map((f: any) => `          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white">${f.title}</h3>
            <p className="text-sm text-slate-400 mt-2">${f.description}</p>
          </div>`).join("\n")}
        </div>
      </section>`;

      case "Testimonials":
        return `      {/* Social Proof & Testimonials */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-white mb-12">${props.headline || "Customer Reviews"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
${(props.testimonials || []).map((t: any) => `          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <p className="text-slate-300 italic">"${t.comment}"</p>
            <p className="text-sm font-bold text-indigo-400 mt-4">- ${t.name} ({t.role})</p>
          </div>`).join("\n")}
        </div>
      </section>`;

      case "ContactSection":
        return `      {/* Contact Concierge */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white">${props.headline || "Contact Us"}</h2>
        <p className="text-slate-400">${props.subheadline || ""}</p>
        <div className="mt-6 flex flex-col gap-2 text-slate-300">
          <p>Email: ${props.email || ""}</p>
          <p>Phone: ${props.phone || ""}</p>
          <p>Location: ${props.address || ""}</p>
        </div>
      </section>`;

      case "Footer":
        return `      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6 text-center text-slate-500 text-sm">
        <p className="font-bold text-white">${props.brandName || businessName}</p>
        <p className="mt-1">${props.copyright || ""}</p>
      </footer>`;

      default:
        return `      {/* Block: ${type} */}`;
    }
  }).join("\n\n");

  return `${imports}
export default function ${businessName.replace(/[^a-zA-Z0-9]/g, "")}Store({ products = [] }) {
  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 antialiased">
${componentsCode}
    </main>
  );
}
`;
}

export function LiveCodeViewer({ puckData, businessName }: LiveCodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"react" | "json">("react");

  const reactCode = generateReactCode(puckData, businessName);
  const jsonCode = JSON.stringify(puckData, null, 2);

  const handleCopy = () => {
    const textToCopy = activeTab === "react" ? reactCode : jsonCode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header toolbar */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-[1px] bg-slate-700 mx-1" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("react")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "react"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>React JSX Code (Live)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("json")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === "json"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Puck AST JSON</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Live Syncing
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0f19]">
        <pre className="whitespace-pre">
          <code>{activeTab === "react" ? reactCode : jsonCode}</code>
        </pre>
      </div>
    </div>
  );
}
