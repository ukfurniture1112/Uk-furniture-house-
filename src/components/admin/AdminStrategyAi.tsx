import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import {
  Sparkles,
  Send,
  Loader2,
  TrendingUp,
  Truck,
  DollarSign,
  Share2,
  Copy,
  Check,
  Package,
  Layers,
  HelpCircle,
  BarChart3,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface StrategyMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  tag?: string;
}

export const AdminStrategyAi: React.FC = () => {
  const { orders, customers, stats } = useAdmin();
  const { products, settings } = useStore();

  const [messages, setMessages] = useState<StrategyMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `👋 **Welcome, Director! I am your High-Level Executive Strategy AI for UK Furniture Hub.**

I have real-time access to your showroom data:
• **Active Orders:** ${orders.length} orders totaling **${formatPrice(stats.totalRevenue)}** (AOV: ${formatPrice(stats.averageOrderValue)})
• **Active Catalogue:** ${products.length} products
• **Customer Base:** ${customers.length} verified buyers across England, Scotland & Wales

**How I can assist your business today:**
1. 📈 **Profit & Margin Strategy:** Maximize gross profit per van stop with Ottoman & Mattress bundles.
2. 🚚 **Cash on Delivery (COD) Risk Elimination:** Best WhatsApp confirmation scripts to achieve 90%+ doorstep handover rates.
3. 📢 **WhatsApp & Social Media Ad Campaigns:** Ready-to-use high-converting ad copy for Facebook, Instagram, TikTok & WhatsApp broadcasts.
4. 🏷️ **UK Retail Competitor Benchmarking:** Optimize your prices against DFS, Furniture Village & Dreams UK.
5. 📦 **Seasonal Restock & Demand Forecasting:** Prepare for upcoming UK home improvement & Bank Holiday peaks.

*Feel free to ask in British English, Roman Urdu, or Urdu — I understand all business strategies!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customPrompt?: string, tag?: string) => {
    const text = customPrompt || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: StrategyMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-8).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/admin/strategy-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          analysisType: tag || 'general',
        }),
      });

      if (!res.ok) {
        throw new Error('Strategy AI failed to respond');
      }

      const data = await res.json();
      const aiReply: StrategyMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'Strategy analysis complete. Let me know if you would like me to draft specific marketing or operational execution plans.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Error fetching strategy advice:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `⚠️ **Strategy Note:** Unable to connect to cloud AI server. However, based on your current **${orders.length} orders** and **${formatPrice(stats.totalRevenue)} gross sales**, I recommend confirming pending orders via WhatsApp (+44 7862 600142) immediately to ensure high delivery completion.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const strategicPlaybooks = [
    {
      title: '📈 Margin & Bundle Strategy',
      subtitle: 'Boost Average Order Value to £650+',
      icon: DollarSign,
      prompt:
        'Analyze my current catalogue pricing and give me a concrete strategy to bundle Ottoman Beds with Pocket Mattresses and Corner Sofas to increase our gross profit margin by 25%+ per 2-man delivery trip.',
      tag: 'margins',
    },
    {
      title: '🚚 COD Confirmation & Logistics',
      subtitle: 'Eliminate cancellations at the doorstep',
      icon: Truck,
      prompt:
        'Provide a complete WhatsApp 2-Step verification workflow and driver dispatch route strategy (M1, M62, M25, Scotland) to prevent Cash on Delivery order rejections.',
      tag: 'logistics',
    },
    {
      title: '📢 WhatsApp & Meta Ad Campaign',
      subtitle: 'Copywriting for UK Homeowners',
      icon: Share2,
      prompt:
        'Write 3 high-converting ad copy angles for Facebook/Instagram and 2 WhatsApp broadcast messages targeting UK buyers looking for Free Home Delivery + Cash on Delivery furniture.',
      tag: 'marketing',
    },
    {
      title: '🏷️ UK Competitor Price Audit',
      subtitle: 'Benchmark against DFS & Dreams',
      icon: TrendingUp,
      prompt:
        'Compare our average pricing on Chesterfield beds, sliding wardrobes, and U-shaped sofas against major UK retailers (DFS, Furniture Village, Dreams) and identify where we have the biggest competitive edge.',
      tag: 'pricing',
    },
    {
      title: '📦 Seasonal Stock Forecasting',
      subtitle: 'Anticipate peak UK buying cycles',
      icon: Package,
      prompt:
        'What inventory should we stock up for upcoming UK seasonal home decoration cycles, Bank Holiday sales events, and new home mover trends?',
      tag: 'inventory',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Strategic Overview Bar */}
      <div className="bg-linear-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-3xl p-6 border border-stone-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center font-bold shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-white">
                  Master Business & Strategy AI Copilot
                </h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Executive Level
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Real-time strategic intelligence for UK furniture manufacturing, pricing, Cash on Delivery logistics, and advertising.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-stone-800/80 p-3 rounded-2xl border border-stone-700 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">Active Orders:</span>
              <span className="font-bold text-amber-300 text-sm">{orders.length}</span>
            </div>
            <div className="w-px h-6 bg-stone-700" />
            <div>
              <span className="text-stone-400 block text-[10px]">Gross Booked:</span>
              <span className="font-bold text-emerald-400 text-sm">{formatPrice(stats.totalRevenue)}</span>
            </div>
            <div className="w-px h-6 bg-stone-700" />
            <div>
              <span className="text-stone-400 block text-[10px]">Average Basket:</span>
              <span className="font-bold text-white text-sm">{formatPrice(stats.averageOrderValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Playbooks Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" /> 1-Click Executive Strategy Playbooks
          </h3>
          <span className="text-xs text-stone-500">Instant actionable analysis & scripts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {strategicPlaybooks.map((pb, idx) => {
            const Icon = pb.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(pb.prompt, pb.tag)}
                disabled={isLoading}
                className="bg-white hover:bg-stone-50 p-4 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-amber-500 hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-stone-950 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-stone-900 group-hover:text-amber-800 transition-colors">
                    {pb.title}
                  </div>
                  <div className="text-[11px] text-stone-500 leading-tight">
                    {pb.subtitle}
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Run Strategy →
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Strategy Chat Window */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="bg-stone-900 text-white px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="font-bold text-sm text-white">UK Furniture Hub Strategic Engine</span>
              <span className="text-stone-400 text-xs ml-2 hidden sm:inline">
                (Grounded in British market standards & BS 5852)
              </span>
            </div>
          </div>
          <span className="text-[11px] text-stone-400 bg-stone-800 px-3 py-1 rounded-full border border-stone-700">
            Multi-Language: English / Urdu / Roman Urdu
          </span>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/70">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                    isAi ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className="max-w-[88%] sm:max-w-[80%] space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                      isAi
                        ? 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                        : 'bg-stone-900 text-white rounded-tr-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[10px] text-stone-400 px-1 ${
                      isAi ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => handleCopyText(msg.text, msg.id)}
                        className="hover:text-stone-700 flex items-center gap-1 font-medium ml-1 transition-colors"
                        title="Copy Strategy Response"
                      >
                        {copiedId === msg.id ? (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5">
                            <Copy className="w-3 h-3" /> Copy
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-stone-200 text-xs text-stone-600 flex items-center gap-2 shadow-2xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                <span>Executive Strategy AI is calculating margins, market rates & logistical routes...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask any strategy: e.g. 'How to increase London sales?', 'Write a WhatsApp promo for Wingback Beds', 'Aap mera profit kaise barhayen ge?'..."
              className="flex-1 bg-stone-50 border border-stone-300 text-stone-900 text-xs sm:text-sm rounded-xl px-4 py-3 focus:bg-white focus:border-stone-800 focus:outline-hidden transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
