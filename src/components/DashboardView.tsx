import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { BusinessRecord, DatasetStats } from '../types/data';
import { DataEngine } from '../services/dataEngine';
import { AreaTrendChart } from './charts/AreaTrendChart';
import { BarChart } from './charts/BarChart';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  records: BusinessRecord[];
  stats: DatasetStats;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  stats,
  onNavigate,
}) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Data Loaded</h3>
        <p className="text-sm text-slate-500">
          Upload a CSV or load the sample business dataset to view your business dashboard metrics.
        </p>
        <button
          onClick={() => onNavigate('upload')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  const timelineData = DataEngine.getTimeSeries(records, records.length > 40 ? 'month' : 'day');
  const topProducts = DataEngine.groupBy(records, 'product');
  const topLocations = DataEngine.groupBy(records, 'location');
  const growth = DataEngine.computeGrowthAnalysis(records);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome / Date Range Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Business Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Key operational health metrics calculated from your uploaded transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-900">{stats.dateRange.start}</span>
            <span className="text-slate-400">to</span>
            <span className="font-semibold text-slate-900">{stats.dateRange.end}</span>
            <span className="text-[11px] text-slate-400">({stats.dateRange.daysCount} active dates)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Section 3: Total Sales, Total Cost, Profit, Quantity, Products, Customers, Best-Seller) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {growth.growthPercent >= 0 ? (
                <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{growth.growthPercent}%
                </span>
              ) : (
                <span className="inline-flex items-center font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  {growth.growthPercent}%
                </span>
              )}
              <span className="text-slate-400 text-[11px]">vs prior half</span>
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cost (COGS)</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ${stats.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Avg Order Value: <strong className="text-slate-700 font-semibold">${stats.averageOrderValue}</strong>
            </div>
          </div>
        </div>

        {/* Profit & Margin */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Profit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              ${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px]">
                {stats.profitMargin}% Margin
              </span>
              <span className="text-slate-400 text-[11px]">{records.length} transactions</span>
            </div>
          </div>
        </div>

        {/* Total Quantity Sold */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Quantity Sold</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalQuantity.toLocaleString()} <span className="text-sm font-medium text-slate-400">units</span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Across <strong className="text-slate-700">{stats.uniqueProductsCount}</strong> product lines
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Products, Customers, Best-selling Product Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Best-selling Product Hero Card */}
        <div className="sm:col-span-2 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Best-Selling Product</span>
            </div>
            <span className="bg-white/10 text-white/90 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              #1 Performer
            </span>
          </div>

          <div className="my-4">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {stats.topProduct.name}
            </h3>
            <p className="text-xs text-indigo-200 mt-1">
              Top contributor generating ${stats.topProduct.sales.toLocaleString()} across {stats.topProduct.quantity.toLocaleString()} units sold.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-indigo-300 block text-[11px]">Revenue</span>
              <strong className="text-white font-bold text-sm sm:text-base">${stats.topProduct.sales.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-indigo-300 block text-[11px]">Gross Profit</span>
              <strong className="text-emerald-400 font-bold text-sm sm:text-base">${stats.topProduct.profit.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-indigo-300 block text-[11px]">Volume</span>
              <strong className="text-white font-bold text-sm sm:text-base">{stats.topProduct.quantity.toLocaleString()} units</strong>
            </div>
          </div>
        </div>

        {/* Customer & Product Diversity Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Catalog & Audience
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Unique Products</span>
                    <span className="text-[11px] text-slate-400">Catalog items</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900">{stats.uniqueProductsCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Customer Types</span>
                    <span className="text-[11px] text-slate-400">Buyer segments</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-slate-900">{stats.uniqueCustomerTypesCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Top location: <strong className="text-slate-800">{stats.topLocation.name}</strong></span>
            <button
              onClick={() => onNavigate('analysis')}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              Analyze <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Visuals Row: Sales Over Time & Top Products Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Over Time Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sales Trend Overview</h3>
              <p className="text-xs text-slate-500">Historical performance curve over time</p>
            </div>
            <button
              onClick={() => onNavigate('analysis')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Interactive Analysis →
            </button>
          </div>

          <AreaTrendChart data={timelineData} height={220} valueKey="sales" />
        </div>

        {/* Top Products Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">Top Products</h3>
              <span className="text-xs text-slate-400">By revenue</span>
            </div>
            <BarChart data={topProducts} maxItems={5} orientation="horizontal" barColor="#4f46e5" />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Showing top 5 products</span>
            <button
              onClick={() => onNavigate('analysis')}
              className="font-semibold text-indigo-600 hover:underline"
            >
              View all {topProducts.length} →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access to Insights & Agent */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Have questions about your numbers?</h4>
            <p className="text-xs text-slate-600">
              Ask BizInsight Agent questions like “What are my top 5 products?” or “Which month had the highest sales?”
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('ask')}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span>Ask BizInsight</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
