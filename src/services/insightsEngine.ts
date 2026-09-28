/**
 * Business Insights and Recommendation Engine
 * Dynamically evaluates mathematically computed patterns and generates
 * actionable business insights and recommendations.
 */

import { BusinessRecord, InsightItem, SuggestionItem } from '../types/data';
import { DataEngine } from './dataEngine';

export class InsightsEngine {
  /**
   * Generates dynamic data-driven insights from the dataset
   */
  static generateInsights(records: BusinessRecord[]): InsightItem[] {
    if (records.length === 0) return [];

    const insights: InsightItem[] = [];
    const stats = DataEngine.computeDatasetStats(records);
    const growth = DataEngine.computeGrowthAnalysis(records);
    const productGroups = DataEngine.groupBy(records, 'product');
    const categoryGroups = DataEngine.groupBy(records, 'category');
    const locationGroups = DataEngine.groupBy(records, 'location');
    const customerGroups = DataEngine.groupBy(records, 'customerType');

    // 1. Top performing product
    if (productGroups.length > 0) {
      const top = productGroups[0];
      const shareOfTotal = stats.totalSales > 0 ? ((top.sales / stats.totalSales) * 100).toFixed(1) : '0';
      insights.push({
        id: 'ins-top-product',
        type: 'success',
        title: 'Star Revenue Generator',
        description: `“${top.name}” generated the highest sales ($${top.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}) accounting for ${shareOfTotal}% of total revenue across ${top.quantity.toLocaleString()} units sold.`,
        metric: `$${top.sales.toLocaleString()}`,
        tag: 'Top Product',
        dataPoint: `${shareOfTotal}% of Sales`,
      });
    }

    // 2. Lowest performing product
    if (productGroups.length > 2) {
      const lowest = productGroups[productGroups.length - 1];
      const lowestShare = stats.totalSales > 0 ? ((lowest.sales / stats.totalSales) * 100).toFixed(1) : '0';
      insights.push({
        id: 'ins-lowest-product',
        type: 'warning',
        title: 'Lowest Revenue Contributor',
        description: `“${lowest.name}” is currently your lowest-performing product with $${lowest.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${lowestShare}% share) across ${lowest.quantity} units.`,
        metric: `$${lowest.sales.toLocaleString()}`,
        tag: 'Product Review',
        dataPoint: `${lowest.quantity} units sold`,
      });
    }

    // 3. Growth or Decline Trend
    if (growth.periodLabel !== 'Insufficient data points') {
      const isPositive = growth.growthPercent > 0;
      const formattedPercent = Math.abs(growth.growthPercent);
      if (growth.trendDirection === 'growth') {
        insights.push({
          id: 'ins-growth-trend',
          type: 'success',
          title: 'Positive Revenue Momentum',
          description: `Sales expanded by ${formattedPercent}% in the second half of the period ($${growth.currentSales.toLocaleString()} vs $${growth.priorSales.toLocaleString()} in the baseline period).`,
          metric: `+${formattedPercent}%`,
          changePercent: growth.growthPercent,
          tag: 'Period Growth',
          dataPoint: 'Upward Trend',
        });
      } else if (growth.trendDirection === 'decline') {
        insights.push({
          id: 'ins-decline-trend',
          type: 'warning',
          title: 'Period Sales Contraction',
          description: `Sales decreased by ${formattedPercent}% compared with the previous baseline period ($${growth.currentSales.toLocaleString()} vs $${growth.priorSales.toLocaleString()}).`,
          metric: `-${formattedPercent}%`,
          changePercent: growth.growthPercent,
          tag: 'Period Decline',
          dataPoint: 'Needs Investigation',
        });
      } else {
        insights.push({
          id: 'ins-stable-trend',
          type: 'info',
          title: 'Stable Revenue Baseline',
          description: `Revenue remained steady across periods with a minor ${growth.growthPercent}% variation ($${growth.currentSales.toLocaleString()} vs $${growth.priorSales.toLocaleString()}).`,
          metric: `${growth.growthPercent}%`,
          tag: 'Steady Baseline',
          dataPoint: 'Balanced Flow',
        });
      }
    }

    // 4. Highest-Sales Category
    if (categoryGroups.length > 0) {
      const topCat = categoryGroups[0];
      insights.push({
        id: 'ins-top-category',
        type: 'opportunity',
        title: 'Dominant Product Category',
        description: `“${topCat.name}” leads all categories with $${topCat.sales.toLocaleString()} in sales (${topCat.percentage}% of overall business volume) with an average gross margin of ${topCat.marginPercent}%.`,
        metric: `${topCat.percentage}% Share`,
        tag: 'Category Driver',
        dataPoint: `${topCat.marginPercent}% Margin`,
      });
    }

    // 5. Highest-Sales Location
    if (locationGroups.length > 0) {
      const topLoc = locationGroups[0];
      insights.push({
        id: 'ins-top-location',
        type: 'info',
        title: 'Top Performing Location',
        description: `“${topLoc.name}” produced the most revenue ($${topLoc.sales.toLocaleString()} or ${topLoc.percentage}% of company sales) spanning ${topLoc.transactions} recorded transactions.`,
        metric: `$${topLoc.sales.toLocaleString()}`,
        tag: 'Leading Branch',
        dataPoint: `${topLoc.transactions} Transactions`,
      });
    }

    // 6. Products with declining or sluggish velocity in recent records
    if (records.length >= 10 && productGroups.length >= 3) {
      const sortedByDate = [...records].sort((a, b) => a.date.localeCompare(b.date));
      const mid = Math.floor(sortedByDate.length / 2);
      const earlyRecords = sortedByDate.slice(0, mid);
      const recentRecords = sortedByDate.slice(mid);

      const earlySalesByProduct = new Map<string, number>();
      const recentSalesByProduct = new Map<string, number>();

      earlyRecords.forEach(r => earlySalesByProduct.set(r.product, (earlySalesByProduct.get(r.product) || 0) + r.sales));
      recentRecords.forEach(r => recentSalesByProduct.set(r.product, (recentSalesByProduct.get(r.product) || 0) + r.sales));

      let maxDropProd = '';
      let maxDropPercent = 0;

      earlySalesByProduct.forEach((earlySales, prod) => {
        const recentSales = recentSalesByProduct.get(prod) || 0;
        if (earlySales > 300 && recentSales < earlySales * 0.7) {
          const drop = Math.round(((earlySales - recentSales) / earlySales) * 100);
          if (drop > maxDropPercent) {
            maxDropPercent = drop;
            maxDropProd = prod;
          }
        }
      });

      if (maxDropProd && maxDropPercent > 0) {
        insights.push({
          id: 'ins-declining-product',
          type: 'warning',
          title: 'Product Velocity Slowdown',
          description: `“${maxDropProd}” experienced a ${maxDropPercent}% sales drop in the latter half of the recorded timeframe, signaling potential consumer fatigue or inventory stockouts.`,
          metric: `-${maxDropPercent}% Drop`,
          tag: 'Velocity Alert',
          dataPoint: maxDropProd,
        });
      }
    }

    // 7. Customer type distribution insight
    if (customerGroups.length > 1) {
      const topCustomerType = customerGroups[0];
      insights.push({
        id: 'ins-customer-segment',
        type: 'info',
        title: 'Primary Customer Segment',
        description: `“${topCustomerType.name}” customers generated $${topCustomerType.sales.toLocaleString()} (${topCustomerType.percentage}% of total sales), highlighting your core audience.`,
        metric: `${topCustomerType.percentage}%`,
        tag: 'Customer Segment',
        dataPoint: topCustomerType.name,
      });
    }

    return insights;
  }

  /**
   * Generates practical, data-based suggestions (framed clearly as recommendations)
   */
  static generateSuggestions(records: BusinessRecord[]): SuggestionItem[] {
    if (records.length === 0) return [];

    const suggestions: SuggestionItem[] = [];
    const stats = DataEngine.computeDatasetStats(records);
    const productGroups = DataEngine.groupBy(records, 'product');
    const categoryGroups = DataEngine.groupBy(records, 'category');
    const locationGroups = DataEngine.groupBy(records, 'location');

    // 1. High-margin or top product inventory focus
    if (productGroups.length > 0) {
      const top = productGroups[0];
      suggestions.push({
        id: 'sug-top-product-inventory',
        priority: 'high',
        category: 'inventory',
        title: `Protect Stock Levels for "${top.name}"`,
        recommendation: `Ensure zero stockout days for "${top.name}", which supplies ${((top.sales / (stats.totalSales || 1)) * 100).toFixed(0)}% of your business cashflow.`,
        rationale: `High velocity items with strong margins suffer disproportionate revenue loss when inventory is depleted.`,
        potentialImpact: `Prevent estimated 5–12% uncaptured sales leakage from stockouts.`,
      });
    }

    // 2. Low-performing or slow-moving product strategy
    if (productGroups.length >= 3) {
      const lowest = productGroups[productGroups.length - 1];
      suggestions.push({
        id: 'sug-lowest-product-action',
        priority: 'medium',
        category: 'pricing',
        title: `Re-evaluate or Bundle "${lowest.name}"`,
        recommendation: `Consider reviewing "${lowest.name}" because sales have remained low ($${lowest.sales.toLocaleString()}). Test bundling it with your best-seller or discounting to clear working capital.`,
        rationale: `Low-turnover products tie up shelf space and cash that could be reallocated into faster-moving categories.`,
        potentialImpact: `Free up working capital and reduce carrying costs.`,
      });
    }

    // 3. Category concentration risk & cross-selling
    if (categoryGroups.length >= 2) {
      const topCat = categoryGroups[0];
      if (topCat.percentage && topCat.percentage > 45) {
        suggestions.push({
          id: 'sug-category-expansion',
          priority: 'medium',
          category: 'marketing',
          title: `Diversify Beyond "${topCat.name}"`,
          recommendation: `“${topCat.name}” contributes ${topCat.percentage}% of your entire sales. Introduce cross-category promotional bundles to grow secondary categories.`,
          rationale: `High category concentration makes the business vulnerable if seasonal demand or supply chain disruptions hit this single sector.`,
          potentialImpact: `Increase Average Order Value (AOV) by encouraging multi-item checkout carts.`,
        });
      }
    }

    // 4. Regional / Location performance disparity
    if (locationGroups.length >= 2) {
      const topLoc = locationGroups[0];
      const botLoc = locationGroups[locationGroups.length - 1];
      if (topLoc.sales > botLoc.sales * 1.5) {
        suggestions.push({
          id: 'sug-location-benchmarking',
          priority: 'low',
          category: 'operations',
          title: `Benchmark "${botLoc.name}" against "${topLoc.name}"`,
          recommendation: `Investigate why "${topLoc.name}" generates substantially higher revenue ($${topLoc.sales.toLocaleString()} vs $${botLoc.sales.toLocaleString()}). Audit staffing, foot traffic, or local product mix differences.`,
          rationale: `Replicating merchandising or operating practices from top locations can lift underperforming stores.`,
          potentialImpact: `Potential 15–20% uplift in lagging branch productivity.`,
        });
      }
    }

    return suggestions;
  }
}
