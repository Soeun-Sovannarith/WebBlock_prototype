"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Rocket,
  Layers,
  Code2,
  Database,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Store,
  Zap,
  Globe,
  Sliders,
  Cpu
} from "lucide-react";
import { PREDEFINED_TEMPLATES } from "@/lib/templates";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <div className="w-full py-2.5 px-4 text-center text-xs font-semibold text-indigo-200 bg-indigo-950/80 border-b border-indigo-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>WebBlock 2.0 MVP: AI-Powered E-Commerce Generator + Puck JS Visual Builder + Spring Boot Control Plane</span>
        </div>
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/30">
              WB
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">WebBlock</span>
              <span className="text-[10px] ml-2 font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                MVP Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>Create Your Store</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider animate-pulse-slow">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Local / Groq LLM + Puck Visual Builder + PostgreSQL RLS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
            Design, Customize & Deploy <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Modern E-Commerce Stores
            </span> in Minutes
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Choose from curated templates, auto-fill business & product data with **Groq AI**, customize layout with **Puck JS** with real-time React code generation, and launch via automated CI/CD.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-base shadow-2xl shadow-indigo-600/40 flex items-center gap-3 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Start Building Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#templates"
              className="px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 transition-all cursor-pointer"
            >
              Explore Templates
            </a>
          </div>

          {/* Architecture Badges */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase">
                <Store className="w-4 h-4" />
                <span>Frontend</span>
              </div>
              <p className="text-sm font-bold text-white">Next.js + Puck JS</p>
              <p className="text-[11px] text-slate-400">Visual drag-and-drop & live code</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase">
                <Cpu className="w-4 h-4" />
                <span>Control Plane</span>
              </div>
              <p className="text-sm font-bold text-white">Spring Boot Microservice</p>
              <p className="text-[11px] text-slate-400">Tenant lifecycle & deploy engine</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
                <Bot className="w-4 h-4" />
                <span>AI Intelligence</span>
              </div>
              <p className="text-sm font-bold text-white">FastAPI + Groq LLM</p>
              <p className="text-[11px] text-slate-400">Model: openai/gpt-oss-20b</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <Database className="w-4 h-4" />
                <span>Multi-Tenancy</span>
              </div>
              <p className="text-sm font-bold text-white">PostgreSQL RLS Boundary</p>
              <p className="text-[11px] text-slate-400">Tenant-isolated products & schema</p>
            </div>
          </div>
        </section>

        {/* Templates Showcase Section */}
        <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Predefined Store Foundations
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Select any template to launch your custom store with full e-commerce functionality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PREDEFINED_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-indigo-500/50 flex flex-col justify-between space-y-6 group transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                      {tmpl.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to Customize
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {tmpl.sampleProducts.map((sp, idx) => (
                      <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative">
                        <img src={sp.imageUrl} alt={sp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2">
                          <span className="text-xs font-bold text-white">${sp.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">Puck JSON AST • Next.js SSR</span>
                  <button
                    type="button"
                    onClick={() => router.push("/onboarding")}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Walkthrough */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How WebBlock Operates
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              From idea to production-ready deployed store in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-white text-base">Select Template & Fill Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose template, use **Groq AI** to generate marketing copy & product specs, or input your own.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-white text-base">Visual Drag & Drop (Puck JS)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customize sections, colors, copy, and layout. Watch React code synchronize in real-time.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-white text-base">Spring Boot Control Plane</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform creates tenant database boundary in PostgreSQL RLS and packages site_settings.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-bold text-white text-base">CI/CD Deploy & Admin Panel</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter domain, deploy instantly, manage products in admin dashboard, and re-customize anytime.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WebBlock Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Spring Boot 3</span>
            <span>•</span>
            <span>FastAPI + Groq</span>
            <span>•</span>
            <span>Next.js + Prisma</span>
            <span>•</span>
            <span>Puck JS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
