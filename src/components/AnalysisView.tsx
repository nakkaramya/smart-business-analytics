import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  MapPin, 
  Layers, 
  ChevronDown,
  Table as TableIcon
} from 'lucide-react';
import { BusinessRecord, FilterState } from '../types/data';
import { DataEngine } from '../services/dataEngine';
import { AreaTrendChart } from './charts/AreaTrendChart';
import { BarChart } from './charts/BarChart';
import { DonutChart } from './charts/DonutChart';

interface AnalysisViewProps {
  records: BusinessRecord[];
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ records }) => {
  // Extract unique filter options from dataset
  const { allProducts, allCategories, allLocations, allCustomerTypes, minDate, maxDate } = useMemo(() => {
    const products = new Set<string>();
    const categories = new Set<string>();
    const locations = new Set<string>();
    const customerTypes = new Set<string>();
    let minD = '';
    let maxD = '';

    records.forEach(r => {
      products.add(r.product);
      categories.add(r.category);
      locations.add(r.location);
      customerTypes.add(r.customerType);
      if (!minD || r.date < minD) minD = r.date;
      if (!maxD || r.date > maxD) maxD = r.date;
    });

    return {
      allProducts: Array.from(products).sort(),
      allCategories: Array.from(categories).sort(),
      allLocations: Array.from(locations).sort(),
      allCustomerTypes: Array.from(customerTypes).sort(),
      minDate: minD,
      maxDate: maxD,
    };
  }, [records]);

  // Initial filter state
  const initialFilters: FilterState = {
    startDate: '',
    endDate: '',
    product: 'all',
    category: 'all',
    location: 'all',
    customerType: 'all',
    searchTerm: '',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [timeGranularity, setTimeGranularity] = useState<'day' | 'month'>('month');
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return DataEngine.filterRecords(records, filters);
  }, [records, filters]);

  // Summary stats on filtered set
  const filteredStats = useMemo(() => {
    return DataEngine.computeDatasetStats(filteredRecords);
  }, [filteredRecords]);

  // Grouped charts data
  const timeSeriesData = useMemo(() => {
    return DataEngine.getTimeSeries(filteredRecords, timeGranularity);
  }, [filteredRecords, timeGranularity]);

  const productData = useMemo(() => {
    return DataEngine.groupBy(filteredRecords, 'product');
  }, [filteredRecords]);

  const categoryData = useMemo(() => {
    return DataEngine.groupBy(filteredRecords, 'category');
  }, [filteredRecords]);

  const locationData = useMemo(() => {
    return DataEngine.groupBy(filteredRecords, 'location');
  }, [filteredRecords]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setTablePage(1);
  };

  const hasActiveFilters = 
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.product !== 'all' ||
    filters.category !== 'all' ||
    filters.location !== 'all' ||
    filters.customerType !== 'all' ||
    filters.searchTerm !== '';

  // Pagination for table
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sales Analysis & Segmentation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Dynamically slice and cross-examine performance across date ranges, product lines, and store locations.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Filter Control Console (Section 4) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Data Filters</span>
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredRecords.length}</strong> of {records.length} records
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, startDate: e.target.value }));
                setTablePage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, endDate: e.target.value }));
                setTablePage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Product Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Product</label>
            <select
              value={filters.product}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, product: e.target.value }));
                setTablePage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            >
              <option value="all">All Products ({allProducts.length})</option>
              {allProducts.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, category: e.target.value }));
                setTablePage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            >
              <option value="all">All Categories ({allCategories.length})</option>
              {allCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Location</label>
            <select
              value={filters.location}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, location: e.target.value }));
                setTablePage(1);
              }}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
            >
              <option value="all">All Locations ({allLocations.length})</option>
              {allLocations.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={filters.searchTerm}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
                  setTablePage(1);
                }}
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50 pl-7 pr-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>
        </div>

        {/* Quick summary of filtered data */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <div>
            Filtered Sales: <strong className="text-slate-900 font-bold">${filteredStats.totalSales.toLocaleString()}</strong>
          </div>
          <div className="text-slate-300">|</div>
          <div>
            Filtered Profit: <strong className="text-emerald-600 font-bold">${filteredStats.totalProfit.toLocaleString()}</strong>
          </div>
          <div className="text-slate-300">|</div>
          <div>
            Profit Margin: <strong className="text-indigo-600 font-bold">{filteredStats.profitMargin}%</strong>
          </div>
          <div className="text-slate-300">|</div>
          <div>
            Units Sold: <strong className="text-slate-900 font-bold">{filteredStats.totalQuantity.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* 4 Required Charts: (1) Sales Over Time, (2) Sales By Product, (3) Sales By Category, (4) Sales By Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Sales Over Time */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sales Over Time</h3>
                  <p className="text-[11px] text-slate-500">Revenue timeline for selected filters</p>
                </div>
              </div>

              {/* Day vs Month toggle */}
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium">
                <button
                  onClick={() => setTimeGranularity('day')}
                  className={`px-2 py-1 rounded-md transition-all ${timeGranularity === 'day' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeGranularity('month')}
                  className={`px-2 py-1 rounded-md transition-all ${timeGranularity === 'month' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <AreaTrendChart data={timeSeriesData} height={220} valueKey="sales" />
          </div>
        </div>

        {/* Chart 2: Sales by Product */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sales by Product</h3>
                  <p className="text-[11px] text-slate-500">Revenue generated by individual items</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">{productData.length} items</span>
            </div>

            <BarChart data={productData} maxItems={6} orientation="horizontal" barColor="#3b82f6" />
          </div>
        </div>

        {/* Chart 3: Sales by Category */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sales by Category</h3>
                <p className="text-[11px] text-slate-500">Revenue share across product categories</p>
              </div>
            </div>

            <DonutChart data={categoryData} totalLabel="Category Total" />
          </div>
        </div>

        {/* Chart 4: Sales by Location */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sales by Location</h3>
                  <p className="text-[11px] text-slate-500">Geographic branch revenue distribution</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">{locationData.length} locations</span>
            </div>

            <BarChart data={locationData} maxItems={6} orientation="horizontal" barColor="#f59e0b" />
          </div>
        </div>
      </div>

      {/* Filtered Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Filtered Transaction Details
            </h3>
            <span className="text-xs text-slate-400">
              ({filteredRecords.length} records matching)
            </span>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2 self-end sm:self-center text-xs">
            <button
              onClick={() => setTablePage(p => Math.max(1, p - 1))}
              disabled={tablePage === 1}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="text-slate-500 font-medium">
              Page {tablePage} of {totalPages}
            </span>
            <button
              onClick={() => setTablePage(p => Math.min(totalPages, p + 1))}
              disabled={tablePage === totalPages}
              className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Units</th>
                <th className="py-2.5 px-3 text-right">Sales</th>
                <th className="py-2.5 px-3 text-right">Cost</th>
                <th className="py-2.5 px-3 text-right">Profit</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 whitespace-nowrap">{rec.date}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">{rec.product}</td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                      {rec.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">{rec.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${rec.sales.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-500">${rec.cost.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">${rec.profit.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{rec.location}</td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {rec.customerType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
