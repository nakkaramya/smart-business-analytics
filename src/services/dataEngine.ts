/**
 * High-performance Data Engine (Pandas-like computational core)
 * Computes exact aggregates, group-by summaries, trends, and period comparisons.
 */

import { BusinessRecord, DatasetStats, FilterState } from '../types/data';

export interface GroupSummary {
  name: string;
  sales: number;
  cost: number;
  profit: number;
  quantity: number;
  transactions: number;
  marginPercent: number;
  percentage?: number;
}

export interface TimeSeriesPoint {
  date: string;
  displayDate: string;
  sales: number;
  cost: number;
  profit: number;
  quantity: number;
  transactions: number;
}

export class DataEngine {
  /**
   * Filter records based on active user filters
   */
  static filterRecords(records: BusinessRecord[], filters: FilterState): BusinessRecord[] {
    return records.filter(row => {
      // Date range filter
      if (filters.startDate && row.date < filters.startDate) return false;
      if (filters.endDate && row.date > filters.endDate) return false;

      // Product filter
      if (filters.product && filters.product !== 'all' && row.product !== filters.product) return false;

      // Category filter
      if (filters.category && filters.category !== 'all' && row.category !== filters.category) return false;

      // Location filter
      if (filters.location && filters.location !== 'all' && row.location !== filters.location) return false;

      // Customer type filter
      if (filters.customerType && filters.customerType !== 'all' && row.customerType !== filters.customerType) return false;

      // Search term
      if (filters.searchTerm) {
        const q = filters.searchTerm.toLowerCase();
        const matches = 
          row.product.toLowerCase().includes(q) ||
          row.category.toLowerCase().includes(q) ||
          row.location.toLowerCase().includes(q) ||
          row.customerType.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }

  /**
   * Calculate top-level executive KPIs
   */
  static computeDatasetStats(records: BusinessRecord[]): DatasetStats {
    if (records.length === 0) {
      return {
        totalSales: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        totalQuantity: 0,
        totalTransactions: 0,
        uniqueProductsCount: 0,
        uniqueCategoriesCount: 0,
        uniqueLocationsCount: 0,
        uniqueCustomerTypesCount: 0,
        averageOrderValue: 0,
        topProduct: { name: 'None', sales: 0, quantity: 0, profit: 0 },
        lowestProduct: { name: 'None', sales: 0, quantity: 0, profit: 0 },
        topCategory: { name: 'None', sales: 0, percentage: 0 },
        topLocation: { name: 'None', sales: 0, percentage: 0 },
        dateRange: { start: '', end: '', daysCount: 0 },
      };
    }

    let totalSales = 0;
    let totalCost = 0;
    let totalQuantity = 0;

    const productsMap = new Map<string, { sales: number; quantity: number; cost: number }>();
    const categoriesMap = new Map<string, number>();
    const locationsMap = new Map<string, number>();
    const customerTypesMap = new Map<string, number>();
    const datesSet = new Set<string>();

    records.forEach(r => {
      totalSales += r.sales;
      totalCost += r.cost;
      totalQuantity += r.quantity;
      datesSet.add(r.date);

      // Product
      const prod = productsMap.get(r.product) || { sales: 0, quantity: 0, cost: 0 };
      prod.sales += r.sales;
      prod.quantity += r.quantity;
      prod.cost += r.cost;
      productsMap.set(r.product, prod);

      // Category
      categoriesMap.set(r.category, (categoriesMap.get(r.category) || 0) + r.sales);

      // Location
      locationsMap.set(r.location, (locationsMap.get(r.location) || 0) + r.sales);

      // Customer
      customerTypesMap.set(r.customerType, (customerTypesMap.get(r.customerType) || 0) + 1);
    });

    const totalProfit = totalSales - totalCost;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    const averageOrderValue = records.length > 0 ? totalSales / records.length : 0;

    // Top & lowest product
    const sortedProducts = Array.from(productsMap.entries()).sort((a, b) => b[1].sales - a[1].sales);
    const topProdEntry = sortedProducts[0] || ['None', { sales: 0, quantity: 0, cost: 0 }];
    const lowProdEntry = sortedProducts[sortedProducts.length - 1] || ['None', { sales: 0, quantity: 0, cost: 0 }];

    // Top category
    const sortedCategories = Array.from(categoriesMap.entries()).sort((a, b) => b[1] - a[1]);
    const topCatEntry = sortedCategories[0] || ['None', 0];

    // Top location
    const sortedLocations = Array.from(locationsMap.entries()).sort((a, b) => b[1] - a[1]);
    const topLocEntry = sortedLocations[0] || ['None', 0];

    // Date range
    const sortedDates = Array.from(datesSet).sort();
    const startDate = sortedDates[0] || '';
    const endDate = sortedDates[sortedDates.length - 1] || '';
    const daysCount = sortedDates.length;

    return {
      totalSales: Number(totalSales.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      profitMargin: Number(profitMargin.toFixed(1)),
      totalQuantity,
      totalTransactions: records.length,
      uniqueProductsCount: productsMap.size,
      uniqueCategoriesCount: categoriesMap.size,
      uniqueLocationsCount: locationsMap.size,
      uniqueCustomerTypesCount: customerTypesMap.size,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      topProduct: {
        name: topProdEntry[0],
        sales: Number(topProdEntry[1].sales.toFixed(2)),
        quantity: topProdEntry[1].quantity,
        profit: Number((topProdEntry[1].sales - topProdEntry[1].cost).toFixed(2)),
      },
      lowestProduct: {
        name: lowProdEntry[0],
        sales: Number(lowProdEntry[1].sales.toFixed(2)),
        quantity: lowProdEntry[1].quantity,
        profit: Number((lowProdEntry[1].sales - lowProdEntry[1].cost).toFixed(2)),
      },
      topCategory: {
        name: topCatEntry[0],
        sales: Number(topCatEntry[1].toFixed(2)),
        percentage: totalSales > 0 ? Number(((topCatEntry[1] / totalSales) * 100).toFixed(1)) : 0,
      },
      topLocation: {
        name: topLocEntry[0],
        sales: Number(topLocEntry[1].toFixed(2)),
        percentage: totalSales > 0 ? Number(((topLocEntry[1] / totalSales) * 100).toFixed(1)) : 0,
      },
      dateRange: {
        start: startDate,
        end: endDate,
        daysCount,
      },
    };
  }

  /**
   * Group by dimension (Product, Category, Location, CustomerType)
   */
  static groupBy(records: BusinessRecord[], dimension: keyof BusinessRecord): GroupSummary[] {
    const totalSalesAll = records.reduce((sum, r) => sum + r.sales, 0);
    const map = new Map<string, { sales: number; cost: number; quantity: number; transactions: number }>();

    records.forEach(r => {
      const key = String(r[dimension] || 'Unknown');
      const cur = map.get(key) || { sales: 0, cost: 0, quantity: 0, transactions: 0 };
      cur.sales += r.sales;
      cur.cost += r.cost;
      cur.quantity += r.quantity;
      cur.transactions += 1;
      map.set(key, cur);
    });

    const result: GroupSummary[] = [];
    map.forEach((val, name) => {
      const profit = val.sales - val.cost;
      const marginPercent = val.sales > 0 ? (profit / val.sales) * 100 : 0;
      const percentage = totalSalesAll > 0 ? (val.sales / totalSalesAll) * 100 : 0;

      result.push({
        name,
        sales: Number(val.sales.toFixed(2)),
        cost: Number(val.cost.toFixed(2)),
        profit: Number(profit.toFixed(2)),
        quantity: val.quantity,
        transactions: val.transactions,
        marginPercent: Number(marginPercent.toFixed(1)),
        percentage: Number(percentage.toFixed(1)),
      });
    });

    // Default sort by sales descending
    return result.sort((a, b) => b.sales - a.sales);
  }

  /**
   * Sales timeline: Group by date (or formatted monthly if long period)
   */
  static getTimeSeries(records: BusinessRecord[], groupByPeriod: 'day' | 'month' = 'day'): TimeSeriesPoint[] {
    const map = new Map<string, { sales: number; cost: number; quantity: number; transactions: number }>();

    records.forEach(r => {
      let key = r.date;
      if (groupByPeriod === 'month') {
        key = r.date.slice(0, 7); // YYYY-MM
      }
      const cur = map.get(key) || { sales: 0, cost: 0, quantity: 0, transactions: 0 };
      cur.sales += r.sales;
      cur.cost += r.cost;
      cur.quantity += r.quantity;
      cur.transactions += 1;
      map.set(key, cur);
    });

    const sortedKeys = Array.from(map.keys()).sort();

    return sortedKeys.map(key => {
      const val = map.get(key)!;
      let displayDate = key;
      if (groupByPeriod === 'month') {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        const [year, month, day] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      return {
        date: key,
        displayDate,
        sales: Number(val.sales.toFixed(2)),
        cost: Number(val.cost.toFixed(2)),
        profit: Number((val.sales - val.cost).toFixed(2)),
        quantity: val.quantity,
        transactions: val.transactions,
      };
    });
  }

  /**
   * Period-over-period comparison (e.g. second half vs first half of timeline)
   */
  static computeGrowthAnalysis(records: BusinessRecord[]): {
    growthPercent: number;
    priorSales: number;
    currentSales: number;
    trendDirection: 'growth' | 'decline' | 'stable';
    periodLabel: string;
  } {
    if (records.length < 4) {
      return {
        growthPercent: 0,
        priorSales: 0,
        currentSales: 0,
        trendDirection: 'stable',
        periodLabel: 'Insufficient data points',
      };
    }

    const sortedByDate = [...records].sort((a, b) => a.date.localeCompare(b.date));
    const midIdx = Math.floor(sortedByDate.length / 2);

    const firstHalf = sortedByDate.slice(0, midIdx);
    const secondHalf = sortedByDate.slice(midIdx);

    const priorSales = firstHalf.reduce((sum, r) => sum + r.sales, 0);
    const currentSales = secondHalf.reduce((sum, r) => sum + r.sales, 0);

    const diff = currentSales - priorSales;
    const growthPercent = priorSales > 0 ? (diff / priorSales) * 100 : 0;

    let trendDirection: 'growth' | 'decline' | 'stable' = 'stable';
    if (growthPercent > 2.5) trendDirection = 'growth';
    else if (growthPercent < -2.5) trendDirection = 'decline';

    return {
      growthPercent: Number(growthPercent.toFixed(1)),
      priorSales: Number(priorSales.toFixed(2)),
      currentSales: Number(currentSales.toFixed(2)),
      trendDirection,
      periodLabel: `Recent period vs Prior period (${firstHalf[0]?.date || ''} to ${secondHalf[secondHalf.length - 1]?.date || ''})`,
    };
  }

  /**
   * Statistical metrics: mean and standard deviation
   */
  static getStats(values: number[]): { mean: number; stdDev: number; median: number } {
    if (values.length === 0) return { mean: 0, stdDev: 0, median: 0 };
    const n = values.length;
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const stdDev = Math.sqrt(variance);

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    return {
      mean: Number(mean.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      median: Number(median.toFixed(2)),
    };
  }
}
