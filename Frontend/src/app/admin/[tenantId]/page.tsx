"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Store,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  DollarSign,
  Package,
  CheckCircle2,
  RefreshCw,
  Rocket,
  Globe,
  Mail,
  Phone,
  MapPin,
  X,
  Eye,
  Sliders,
  Wand2
} from "lucide-react";
import { DeployModal } from "@/components/deploy/DeployModal";

export default function AdminDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.tenantId as string;

  const [loading, setLoading] = useState(true);
  const [tenantData, setTenantData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [aiEnhancing, setAiEnhancing] = useState(false);

  // Form states for Product Add/Edit
  const [prodTitle, setProdTitle] = useState("");
  const [prodPrice, setProdPrice] = useState<number>(49.99);
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodBadge, setProdBadge] = useState("Best Seller");
  const [prodCategory, setProdCategory] = useState("General");
  const [prodStatus, setProdStatus] = useState("ACTIVE");

  // Fetch tenant details & products
  const fetchTenantData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/websites/tenant/${tenantId}`);
      if (!res.ok) throw new Error("Failed to load tenant");
      const data = await res.json();
      setTenantData(data);
      setProducts(data.products || []);
    } catch (err) {
      console.warn("Using demo data fallback:", err);
      setTenantData({
        website: {
          tenantId,
          subdomain: "aura-tech",
          status: "DEPLOYED",
          domainName: ""
        },
        siteSetting: {
          themeConfig: {
            businessName: "Aura Tech Labs"
          }
        }
      });
      setProducts([
        {
          id: "p1",
          title: "Aura Pro Wireless Headphones",
          price: 249.00,
          status: "ACTIVE",
          customFields: {
            description: "Lossless spatial acoustics with active noise cancelling.",
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            badge: "Best Seller"
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) fetchTenantData();
  }, [tenantId]);

  const openAddModal = () => {
    setEditingProduct(null);
    setProdTitle("");
    setProdPrice(49.99);
    setProdDesc("");
    setProdImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80");
    setProdBadge("New Arrival");
    setProdCategory("General");
    setProdStatus("ACTIVE");
    setShowProductModal(true);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdPrice(Number(prod.price));
    setProdDesc(prod.customFields?.description || "");
    setProdImage(prod.customFields?.imageUrl || "");
    setProdBadge(prod.customFields?.badge || "");
    setProdCategory(prod.customFields?.category || "General");
    setProdStatus(prod.status || "ACTIVE");
    setShowProductModal(true);
  };

  // AI Product Enhancer via FastAPI
  const handleAiEnhanceProduct = async () => {
    if (!prodTitle.trim()) {
      alert("Please enter a product title first!");
      return;
    }
    setAiEnhancing(true);
    try {
      const aiUrl = process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000";
      const res = await fetch(`${aiUrl}/api/ai/enhance-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prodTitle,
          category: prodCategory,
          raw_notes: prodDesc
        })
      });
      if (!res.ok) throw new Error("AI enhancer error");
      const data = await res.json();
      if (data.title) setProdTitle(data.title);
      if (data.description) setProdDesc(data.description);
      if (data.suggested_price) setProdPrice(Number(data.suggested_price));
      if (data.badge) setProdBadge(data.badge);
    } catch (err) {
      console.error("AI enhance failed:", err);
    } finally {
      setAiEnhancing(false);
    }
  };

  // Save product (create or update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const payload = {
      title: prodTitle,
      price: prodPrice,
      status: prodStatus,
      customFields: {
        description: prodDesc,
        imageUrl: prodImage,
        badge: prodBadge,
        category: prodCategory
      }
    };

    try {
      if (editingProduct) {
        // Update product
        await fetch(`${apiUrl}/api/tenants/${tenantId}/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Create product
        await fetch(`${apiUrl}/api/tenants/${tenantId}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      setShowProductModal(false);
      fetchTenantData();
    } catch (err) {
      console.error("Failed to save product:", err);
      // Optimistic update
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
      } else {
        setProducts([...products, { id: "p-" + Date.now(), ...payload }]);
      }
      setShowProductModal(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await fetch(`${apiUrl}/api/tenants/${tenantId}/products/${productId}`, {
        method: "DELETE"
      });
      fetchTenantData();
    } catch (err) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-300 gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading Tenant Admin Dashboard...</p>
      </div>
    );
  }

  const businessName =
    tenantData?.siteSetting?.themeConfig?.businessName ||
    tenantData?.website?.subdomain ||
    "Store";
  const subdomain = tenantData?.website?.subdomain || "brand";

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25 cursor-pointer hover:scale-105 transition-transform"
            >
              WB
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-2">
                {businessName}
                <span className="text-xs font-normal text-slate-400">Admin Control Panel</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct link to visual puck editor */}
            <button
              type="button"
              onClick={() => router.push(`/studio/${tenantId}`)}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize UI in Studio</span>
            </button>

            {/* Re-deploy button */}
            <button
              type="button"
              onClick={() => setShowDeployModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Re-Deploy CI/CD</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Live Subdomain</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <a
              href={`/site/${subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="text-base font-bold text-white hover:text-indigo-400 flex items-center gap-1.5 truncate"
            >
              <span>{subdomain}.webblock.io</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Edge Route Active</span>
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Total Catalog Items</span>
              <Package className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{products.length} Products</p>
            <p className="text-[11px] text-slate-400">PostgreSQL Tenant RLS Isolated</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Deployment Status</span>
              <Rocket className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400">
              {tenantData?.website?.status || "DEPLOYED"}
            </p>
            <p className="text-[11px] text-slate-400">Automated Next.js SSR pipeline</p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">GitHub Repository</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <a
              href={tenantData?.githubRepoUrl || `https://github.com/WebBlock-Organization/${subdomain}-store`}
              target="_blank"
              rel="noreferrer"
              className="text-base font-bold text-white hover:text-purple-400 flex items-center gap-1.5 truncate"
            >
              <span className="truncate">{subdomain}-store</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
            <p className="text-[11px] text-slate-400">Next.js + Prisma Auto-Pushed</p>
          </div>
        </div>

        {/* Product Catalog Management Section */}
        <div className="glass-card rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <span>Product Catalog Management</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, modify prices, edit descriptions, or update inventory for your storefront
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Items Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-4 group hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 relative">
                    <img
                      src={prod.customFields?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {prod.customFields?.badge && (
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow">
                        {prod.customFields.badge}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base">{prod.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {prod.customFields?.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Price</span>
                    <p className="text-lg font-black text-white">
                      ${Number(prod.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(prod)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-300">Product Title</label>
                  <button
                    type="button"
                    onClick={handleAiEnhanceProduct}
                    disabled={aiEnhancing}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{aiEnhancing ? "Enhancing..." : "✨ Enhance with Groq AI"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. Wireless Pro Earbuds"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Badge Tag</label>
                  <input
                    type="text"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    placeholder="e.g. Best Seller"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Compelling product details and key benefits..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs shadow-lg shadow-indigo-600/30"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CI/CD Re-Deployment Modal */}
      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        tenantId={tenantId}
        subdomain={subdomain}
        domainName={tenantData?.website?.domainName || ""}
      />
    </div>
  );
}
