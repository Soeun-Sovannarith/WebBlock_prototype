"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Puck, Data } from "@measured/puck";
import { puckConfig } from "@/components/puck/puck-config";
import { LiveCodeViewer } from "@/components/live-code/LiveCodeViewer";
import { StudioAiCopilot } from "@/components/ai/StudioAiCopilot";
import { DeployModal } from "@/components/deploy/DeployModal";
import { getDefaultPuckData, PREDEFINED_TEMPLATES } from "@/lib/templates";
import {
  ArrowLeft,
  Save,
  Rocket,
  Bot,
  Code2,
  Eye,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronDown
} from "lucide-react";

export default function StudioPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params?.tenantId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [tenantData, setTenantData] = useState<any>(null);
  const [puckData, setPuckData] = useState<Data>({
    content: [],
    root: { props: { title: "Store" } }
  });

  // UI state
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);

  // Load tenant data & site settings
  useEffect(() => {
    async function loadTenant() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const res = await fetch(`${apiUrl}/api/websites/tenant/${tenantId}`);
        if (!res.ok) throw new Error("Failed to fetch tenant");
        const data = await res.json();
        setTenantData(data);

        // Inject products into Puck config / ProductGrid block props if available
        let initialPuck = data?.siteSetting?.themeConfig;
        if (!initialPuck || !initialPuck.content || initialPuck.content.length === 0) {
          initialPuck = getDefaultPuckData(
            data?.website?.templateId || "tech-store",
            data?.website?.businessName || data?.subdomain || "Modern Store",
            data?.products || []
          );
        }

        // Attach tenant products into ProductGrid block if missing
        if (data.products && data.products.length > 0 && initialPuck.content) {
          initialPuck.content = initialPuck.content.map((block: any) => {
            if (block.type === "ProductGrid") {
              return {
                ...block,
                props: {
                  ...block.props,
                  tenantProducts: data.products
                }
              };
            }
            return block;
          });
        }

        setPuckData(initialPuck);
      } catch (err) {
        console.warn("Using fallback demo tenant data:", err);
        const fallback = getDefaultPuckData("tech-store", "Aura Tech Labs", []);
        setPuckData(fallback);
        setTenantData({
          website: {
            tenantId: tenantId || "demo-tenant",
            subdomain: "aura-tech",
            status: "DRAFT"
          },
          products: []
        });
      } finally {
        setLoading(false);
      }
    }

    if (tenantId) loadTenant();
  }, [tenantId]);

  // Save current Puck configuration to Spring Boot backend
  const handleSave = async (dataToSave: Data = puckData) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await fetch(`${apiUrl}/api/websites/${tenantId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeConfig: dataToSave,
          allowedCustomFields: []
        })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  // Ready & Deploy clicked
  const handleReadyAndDeploy = async () => {
    // 1. Auto-save current state
    await handleSave(puckData);
    // 2. Open Deploy Modal
    setShowDeployModal(true);
  };

  // Memoized configured Puck
  const customConfig = useMemo(() => {
    // If tenant products exist, inject them into ProductGrid default render
    return puckConfig;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-300 gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading WebBlock Visual Studio...</p>
      </div>
    );
  }

  const businessName =
    tenantData?.siteSetting?.themeConfig?.businessName ||
    tenantData?.website?.subdomain ||
    "Store";

  return (
    <div className="h-screen w-screen bg-[#090d16] text-slate-100 flex flex-col overflow-hidden">
      {/* Studio Top Control Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-40 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push(`/admin/${tenantId}`)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Go to Admin Panel"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Admin Panel</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-xs">
              WB
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                {businessName}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {tenantData?.website?.subdomain || "draft"}.webblock.io
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Live Code Viewer Toggle */}
          <button
            type="button"
            onClick={() => setShowCodeViewer(!showCodeViewer)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              showCodeViewer
                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Live React Code</span>
          </button>

          {/* AI Copilot Toggle */}
          <button
            type="button"
            onClick={() => setShowAiCopilot(!showAiCopilot)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              showAiCopilot
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave(puckData)}
            disabled={saving}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 cursor-pointer"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saveSuccess ? "Saved!" : "Save Draft"}</span>
          </button>

          {/* Prominent Ready & Deploy Button */}
          <button
            type="button"
            onClick={handleReadyAndDeploy}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-90 font-bold text-white text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Rocket className="w-4 h-4" />
            <span>Ready & Deploy</span>
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Puck Canvas Container */}
        <div className={`flex-1 h-full overflow-auto transition-all ${showCodeViewer ? "w-1/2" : "w-full"}`}>
          <Puck
            config={customConfig}
            data={puckData}
            onPublish={(data) => {
              setPuckData(data);
              handleSave(data);
            }}
            onChange={(data) => {
              setPuckData(data);
            }}
          />
        </div>

        {/* Live React Code Viewer Drawer / Split view */}
        {showCodeViewer && (
          <div className="w-1/2 h-full border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
            <LiveCodeViewer puckData={puckData} businessName={businessName} />
          </div>
        )}

        {/* AI Studio Copilot Drawer */}
        <StudioAiCopilot
          isOpen={showAiCopilot}
          onClose={() => setShowAiCopilot(false)}
          businessName={businessName}
          templateId={tenantData?.website?.templateId || "tech-store"}
          puckData={puckData}
        />
      </div>

      {/* CI/CD Deploy Modal */}
      <DeployModal
        isOpen={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        tenantId={tenantId}
        subdomain={tenantData?.website?.subdomain || "my-brand"}
        domainName={tenantData?.website?.domainName || ""}
      />
    </div>
  );
}
