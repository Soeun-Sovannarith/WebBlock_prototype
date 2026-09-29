"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, X, ChevronRight, MessageSquare, Wand2, RefreshCw } from "lucide-react";

interface StudioAiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  templateId: string;
  puckData: any;
  onApplyModification?: (mod: any) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export function StudioAiCopilot({
  isOpen,
  onClose,
  businessName,
  templateId,
  puckData,
  onApplyModification
}: StudioAiCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello! I'm **BlockAI**, your intelligent design co-pilot for **${businessName}**. How would you like to elevate your store design or marketing copy today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "✨ Generate high-converting headline copy",
    "🎨 Suggest a modern luxury color palette",
    "🛍️ Add urgency badge and promo announcement",
    "📦 Suggest product feature highlights"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const aiUrl = process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000";
      const res = await fetch(`${aiUrl}/api/ai/studio-copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          business_context: {
            businessName,
            templateId,
            blockCount: puckData?.content?.length || 0
          }
        })
      });

      if (!res.ok) throw new Error("AI service error");
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: data.reply || "I have analyzed your layout. You can adjust the headline and button styles to maximize conversion!"
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Tip: For maximum conversions, place your top 3 best-selling products right beneath the hero section with high-contrast 'Add to Cart' buttons and verified customer reviews."
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-all animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              BlockAI Studio Copilot
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                Groq LLM
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextual UI & Copy Generator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white shadow-md rounded-br-none"
                  : "glass-card text-slate-200 border border-slate-700/80 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {msg.sender === "user" ? "You" : "BlockAI"}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 glass-card p-3 rounded-2xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Thinking with Groq LLM...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Suggestions
        </p>
        <div className="flex flex-col gap-1.5">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              disabled={loading}
              className="text-left text-xs p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50 flex items-center justify-between group"
            >
              <span className="truncate">{qp}</span>
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BlockAI to optimize copy or design..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
