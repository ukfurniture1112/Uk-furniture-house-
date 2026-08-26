import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Copy,
  Check,
  Send,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Share2,
  PieChart,
  HelpCircle,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface HealthScores {
  overall: number;
  salesVelocity: number;
  inventoryHealth: number;
  codRiskManagement: number;
  regionalDensity: number;
}

interface RestockPriority {
  productName: string;
  category: string;
  urgency: 'High' | 'Medium' | 'Low';
  reason: string;
}

interface RegionalCluster {
  clusterName: string;
  orderCount: number;
  revenueShare?: string;
  recommendation: string;
}

interface StrategicRecommendation {
  id: string;
  category: 'Immediate Action' | 'Revenue & Margins' | 'Logistics & COD Risk' | 'Inventory Rebalance' | 'Marketing & WhatsApp' | string;
  priority: 'Critical' | 'High' | 'Medium';
  title: string;
  impact: string;
  actionSteps: string[];
  estimatedGains: string;
}

interface IntelligenceData {
  healthScores: HealthScores;
  executiveSummary: string;
  salesTrends: {
    keyFindings: string[];
    topRevenueCategories: string[];
    averageBasketInsights: string;
    growthTrajectory: string;
  };
  inventoryHealth: {
    stockStatusSummary: string;
    restockPriorities: RestockPriority[];
    slowMovingOrUnderpromoted: string[];
    actionPlan: string;
  };
  customerOrderPatterns: {
    regionalClusters: RegionalCluster[];
    basketBehavior: string;
    codRiskAssessment: string;
  };
  strategicRecommendations: StrategicRecommendation[];
  actionToolkits: {
    whatsappBroadcast: string;
    driverRoutePlan: string;
    bundlePromotion: string;
  };
}

export const AdminIntelligence: React.FC = () => {
  const { orders, customers, stats } = useAdmin();
  const { products, settings, showToast } = useStore();

  const [intelligence, setIntelligence] = useState<IntelligenceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'sales' | 'inventory' | 'customers' | 'recommendations' | 'toolkits'>('overview');
  const [recommendationFilter, setRecommendationFilter] = useState<string>('all');
  const [customFocusArea, setCustomFocusArea] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [analyzedSource, setAnalyzedSource] = useState<string>('gemini-ai');
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string>('');

  const fetchIntelligence = async (focus?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/intelligence/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusArea: focus || customFocusArea }),
      });

      if (!res.ok) {
        throw new Error('Intelligence scan request failed');
      }

      const json = await res.json();
      if (json.success && json.data) {
        setIntelligence(json.data);
        setAnalyzedSource(json.source || 'gemini-ai');
        setLastAnalyzedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        showToast('✨ Strategic intelligence updated successfully.', 'success');
      }
    } catch (err) {
      console.error('Error loading intelligence data:', err);
      showToast('Could not load online AI analysis. Displaying calculated metrics.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-black';
      case 'High':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300 font-medium';
    }
  };

  const filteredRecommendations = intelligence?.strategicRecommendations?.filter((r) => {
    if (recommendationFilter === 'all') return true;
    return r.category.toLowerCase().includes(recommendationFilter.toLowerCase());
  }) || [];

  return (
    <div className="space-y-6">
      {/* Top Strategic Header */}
      <div className="bg-linear-to-r from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center font-black shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-white tracking-tight">
                Gemini Admin Intelligence & Business Strategy
              </h2>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                {analyzedSource === 'gemini-ai' ? '✨ Gemini AI Real-Time' : '📊 Calculated Engine'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Automated multi-factor evaluation of sales trends, showroom inventory liquidity, and UK regional order corridors to maximize gross profit and eliminate Cash on Delivery delivery risks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {lastAnalyzedAt && (
              <span className="text-[11px] text-stone-400 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800">
                Last updated: <strong className="text-stone-200">{lastAnalyzedAt}</strong>
              </span>
            )}

            <button
              onClick={() => fetchIntelligence()}
              disabled={isLoading}
              className="bg-linear-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Scanning Business Data...' : 'Run Deep Intelligence Scan'}</span>
            </button>
          </div>
        </div>

        {/* Custom Focus Query Bar */}
        <div className="mt-5 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={customFocusArea}
            onChange={(e) => setCustomFocusArea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                fetchIntelligence(customFocusArea);
              }
            }}
            placeholder="Specify analysis target: e.g. 'How to optimize London delivery route?', 'Assess Chesterfield sofa margin'..."
            className="flex-1 bg-stone-900/90 border border-stone-700 text-stone-100 placeholder-stone-400 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:border-amber-400 transition-colors"
          />
          <button
            onClick={() => fetchIntelligence(customFocusArea)}
            disabled={isLoading}
            className="bg-stone-800 hover:bg-stone-700 text-amber-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0 border border-stone-700"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Targeted Deep-Dive</span>
          </button>
        </div>
      </div>

      {/* Strategic Health Scores Radar */}
      {intelligence && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Overall Business Index</span>
              <Target className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-2xl text-stone-900">
                {intelligence.healthScores.overall}
              </span>
              <span className="text-xs text-stone-400">/100</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${intelligence.healthScores.overall}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Sales Velocity</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-2xl text-stone-900">
                {intelligence.healthScores.salesVelocity}
              </span>
              <span className="text-xs text-stone-400">/100</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${intelligence.healthScores.salesVelocity}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Inventory Liquidity</span>
              <Package className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-2xl text-stone-900">
                {intelligence.healthScores.inventoryHealth}
              </span>
              <span className="text-xs text-stone-400">/100</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${intelligence.healthScores.inventoryHealth}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">COD Security Index</span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-2xl text-stone-900">
                {intelligence.healthScores.codRiskManagement}
              </span>
              <span className="text-xs text-stone-400">/100</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${intelligence.healthScores.codRiskManagement}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-500">Route Density</span>
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-2xl text-stone-900">
                {intelligence.healthScores.regionalDensity}
              </span>
              <span className="text-xs text-stone-400">/100</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${intelligence.healthScores.regionalDensity}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Executive Briefing Banner */}
      {intelligence && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-sm text-amber-950">
                Executive Strategy Briefing
              </h3>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
                {intelligence.executiveSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-1 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeSubTab === 'overview'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          <span>Strategic Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sales')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeSubTab === 'sales'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Sales & Margin Trends</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeSubTab === 'inventory'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-sky-500" />
          <span>Inventory Health & Alerts</span>
        </button>

        <button
          onClick={() => setActiveSubTab('customers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeSubTab === 'customers'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
          <span>Postcode Clusters & COD</span>
        </button>

        <button
          onClick={() => setActiveSubTab('toolkits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
            activeSubTab === 'toolkits'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Turnkey Action Toolkits</span>
        </button>
      </div>

      {/* SUB-VIEW 1: STRATEGIC MATRIX & ACTION RECOMMENDATIONS */}
      {activeSubTab === 'overview' && intelligence && (
        <div className="space-y-5">
          {/* Filter Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <span className="text-stone-500 mr-1 text-[11px]">Filter Category:</span>
              {[
                { label: 'All Recommendations', value: 'all' },
                { label: '⚡ Immediate Action', value: 'Immediate' },
                { label: '💰 Revenue & Margins', value: 'Revenue' },
                { label: '🚚 Logistics & COD', value: 'Logistics' },
                { label: '📦 Inventory', value: 'Inventory' },
                { label: '📢 Marketing & WhatsApp', value: 'Marketing' },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setRecommendationFilter(pill.value)}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    recommendationFilter === pill.value
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-stone-500 font-medium">
              Showing {filteredRecommendations.length} strategic initiative(s)
            </span>
          </div>

          {/* Recommendations Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                      {rec.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {rec.impact}
                    </p>
                  </div>

                  {/* Concrete Action Steps */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-stone-500 block tracking-wider">
                      Execution Action Plan:
                    </span>
                    <ul className="space-y-1">
                      {rec.actionSteps.map((step, idx) => (
                        <li key={idx} className="text-xs text-stone-800 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Projected Outcome: {rec.estimatedGains}</span>
                  </div>

                  <button
                    onClick={() => {
                      handleCopy(`${rec.title}\n${rec.impact}\nSteps:\n${rec.actionSteps.join('\n')}`, rec.id);
                    }}
                    className="text-stone-500 hover:text-stone-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === rec.id ? (
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Copy className="w-3 h-3" /> Copy Plan
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: SALES TRENDS & MARGIN DYNAMICS */}
      {activeSubTab === 'sales' && intelligence && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Key Commercial Sales Findings</span>
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {intelligence.salesTrends.growthTrajectory}
                </span>
              </div>

              <div className="space-y-2.5">
                {intelligence.salesTrends.keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 flex items-start gap-2.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>Average Basket Optimization</span>
              </h3>

              <div className="bg-stone-900 text-white p-4 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                  Current Showroom AOV
                </span>
                <div className="font-serif font-bold text-2xl text-white">
                  {formatPrice(stats.averageOrderValue)}
                </div>
                <div className="text-[11px] text-stone-300">
                  Targeted AOV with Gas-Lift Ottoman + Mattress cross-sell: <strong className="text-amber-300">£680+</strong>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {intelligence.salesTrends.averageBasketInsights}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INVENTORY HEALTH & RESTOCK ALERTS */}
      {activeSubTab === 'inventory' && intelligence && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Inventory Health Status & Liquidity Assessment
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {intelligence.inventoryHealth.stockStatusSummary}
                </p>
              </div>
              <span className="bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full hidden sm:inline">
                {products.length} Active SKUs in Showroom
              </span>
            </div>

            <div className="pt-2">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-700 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Workshop Restock Priority Matrix</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {intelligence.inventoryHealth.restockPriorities.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityBadge(item.urgency)}`}>
                        {item.urgency} Urgency
                      </span>
                      <span className="text-[10px] text-stone-500 font-bold uppercase">
                        {item.category}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-stone-900">{item.productName}</div>
                    <div className="text-[11px] text-stone-600">{item.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-1">
              <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Action Plan for Showroom Capacity</span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed">
                {intelligence.inventoryHealth.actionPlan}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: POSTCODE CLUSTERS & COD ROUTE OPTIMIZATION */}
      {activeSubTab === 'customers' && intelligence && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>UK Postcode Corridors & 2-Man Van Route Grouping</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Optimize transit routes across major British motorway arteries (M62, M1/M6, M25) to avoid single-drop mileage waste.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {intelligence.customerOrderPatterns.regionalClusters.map((cluster, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">
                        {cluster.clusterName}
                      </span>
                      {cluster.revenueShare && (
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">
                          {cluster.revenueShare} Sales
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {cluster.recommendation}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span>Active Dispatches: <strong>{cluster.orderCount}</strong></span>
                    <span className="text-emerald-700 font-bold">2-Man Team Route</span>
                  </div>
                </div>
              ))}
            </div>

            {/* COD Doorstep Protocol */}
            <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2">
              <div className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <span>Doorstep Cash on Delivery (COD) Risk Protocol</span>
              </div>
              <p className="text-xs text-stone-800 leading-relaxed">
                {intelligence.customerOrderPatterns.codRiskAssessment}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: TURNKEY ACTION TOOLKITS */}
      {activeSubTab === 'toolkits' && intelligence && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Toolkit 1: WhatsApp Broadcast */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    WhatsApp Campaign
                  </span>
                  <button
                    onClick={() => handleCopy(intelligence.actionToolkits.whatsappBroadcast, 'toolkit-wa')}
                    className="text-stone-500 hover:text-stone-900 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'toolkit-wa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'toolkit-wa' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Ready-to-Send Showroom Broadcast
                </h4>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap font-sans max-h-56 overflow-y-auto leading-relaxed">
                  {intelligence.actionToolkits.whatsappBroadcast}
                </div>
              </div>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(intelligence.actionToolkits.whatsappBroadcast)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in WhatsApp Web</span>
              </a>
            </div>

            {/* Toolkit 2: Driver Manifest */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Logistics Sheet
                  </span>
                  <button
                    onClick={() => handleCopy(intelligence.actionToolkits.driverRoutePlan, 'toolkit-route')}
                    className="text-stone-500 hover:text-stone-900 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'toolkit-route' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'toolkit-route' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  2-Man Driver Corridor Manifest
                </h4>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap font-sans max-h-56 overflow-y-auto leading-relaxed">
                  {intelligence.actionToolkits.driverRoutePlan}
                </div>
              </div>

              <button
                onClick={() => handleCopy(intelligence.actionToolkits.driverRoutePlan, 'toolkit-route')}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Driver Manifest</span>
              </button>
            </div>

            {/* Toolkit 3: Bundle Promo */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Margin Proposal
                  </span>
                  <button
                    onClick={() => handleCopy(intelligence.actionToolkits.bundlePromotion, 'toolkit-bundle')}
                    className="text-stone-500 hover:text-stone-900 text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedKey === 'toolkit-bundle' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'toolkit-bundle' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  High-Margin Bed + Mattress Bundle
                </h4>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 whitespace-pre-wrap font-sans max-h-56 overflow-y-auto leading-relaxed">
                  {intelligence.actionToolkits.bundlePromotion}
                </div>
              </div>

              <button
                onClick={() => handleCopy(intelligence.actionToolkits.bundlePromotion, 'toolkit-bundle')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Copy Bundle Pricing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
