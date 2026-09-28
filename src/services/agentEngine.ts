/**
 * BizInsight Agent Query Engine
 * 
 * Pipeline:
 * User Question -> Intent Matcher -> Analysis Tool Dispatch -> Exact Calculation -> Answer Synthesis
 * 
 * Guarantees zero hallucinations by delegating numerical calculation to reliable analytical tools.
 */

import { AgentQueryResult, BusinessRecord } from '../types/data';
import { AnomalyDetector } from './anomalyDetector';
import { DataEngine } from './dataEngine';

export interface AgentPredefinedQuestion {
  id: string;
  category: string;
  question: string;
  iconName?: string;
}

export const PREDEFINED_QUESTIONS: AgentPredefinedQuestion[] = [
  {
    id: 'q1',
    category: 'Products',
    question: 'Which product has the highest sales?',
  },
  {
    id: 'q2',
    category: 'Locations',
    question: 'Which location generated the most revenue?',
  },
  {
    id: 'q3',
    category: 'Products',
    question: 'What are my top 5 products?',
  },
  {
    id: 'q4',
    category: 'Timeline',
    question: 'Which month had the highest sales?',
  },
  {
    id: 'q5',
    category: 'Products',
    question: 'Which products are performing poorly?',
  },
  {
    id: 'q6',
    category: 'Financials',
    question: 'What is our total profit and average margin?',
  },
  {
    id: 'q7',
    category: 'Customers',
    question: 'Which customer type generates the most revenue?',
  },
  {
    id: 'q8',
    category: 'Anomalies',
    question: 'Are there any unusual sales activities or anomalies?',
  },
];

export class AgentEngine {
  /**
   * Main entry point to ask questions
   */
  static askQuestion(questionText: string, records: BusinessRecord[]): AgentQueryResult {
    const q = questionText.trim().toLowerCase();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (records.length === 0) {
      return {
        question: questionText,
        answeredAt: now,
        toolUsed: 'None (Dataset is empty)',
        answerSummary: 'Please upload a CSV file or load the sample dataset first before asking questions.',
      };
    }

    // 1. "Highest sales product" / "top product" / "best seller"
    if (
      (q.includes('product') && (q.includes('highest') || q.includes('best') || q.includes('top') || q.includes('most'))) &&
      !q.includes('5') && !q.includes('top 5')
    ) {
      return this.handleTopProduct(questionText, records, now);
    }

    // 2. "Top 5 products"
    if (q.includes('top 5') || (q.includes('top') && (q.includes('5') || q.includes('five')))) {
      return this.handleTop5Products(questionText, records, now);
    }

    // 3. "Which location" / "location revenue" / "most revenue location"
    if (q.includes('location') || q.includes('branch') || q.includes('store') || q.includes('city')) {
      return this.handleLocationRevenue(questionText, records, now);
    }

    // 4. "Which month" / "monthly sales" / "best month"
    if (q.includes('month') || q.includes('period') || q.includes('time') || q.includes('season')) {
      return this.handleMonthlySales(questionText, records, now);
    }

    // 5. "Performing poorly" / "lowest" / "worst" / "underperforming"
    if (q.includes('poorly') || q.includes('underperforming') || q.includes('lowest') || q.includes('worst') || q.includes('slow')) {
      return this.handleUnderperforming(questionText, records, now);
    }

    // 6. "Profit" / "margin" / "financials" / "cost"
    if (q.includes('profit') || q.includes('margin') || q.includes('cost') || q.includes('financial')) {
      return this.handleProfitAndMargins(questionText, records, now);
    }

    // 7. "Customer" / "segment" / "who buys"
    if (q.includes('customer') || q.includes('client') || q.includes('buyer') || q.includes('segment')) {
      return this.handleCustomerBreakdown(questionText, records, now);
    }

    // 8. "Anomaly" / "unusual" / "spikes" / "drops"
    if (q.includes('anomaly') || q.includes('unusual') || q.includes('spike') || q.includes('drop') || q.includes('abnormal')) {
      return this.handleAnomalies(questionText, records, now);
    }

    // 9. Fallback: General executive business overview
    return this.handleGeneralOverview(questionText, records, now);
  }

  /**
   * Tool: Product Leader
   */
  private static handleTopProduct(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const products = DataEngine.groupBy(records, 'product');
    const top = products[0];
    const stats = DataEngine.computeDatasetStats(records);
    const share = ((top.sales / (stats.totalSales || 1)) * 100).toFixed(1);

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.groupBy("product").sortDescending("sales")',
      calculatedFormula: 'MAX(SUM(sales) GROUP BY product)',
      badge: 'Product Intelligence',
      answerSummary: `“${top.name}” is your highest-selling product, generating $${top.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })} across ${top.quantity.toLocaleString()} units sold. It represents ${share}% of total business sales with a ${top.marginPercent}% gross profit margin.`,
      detailedData: {
        'Product Name': top.name,
        'Total Revenue': `$${top.sales.toLocaleString()}`,
        'Gross Profit': `$${top.profit.toLocaleString()}`,
        'Units Sold': top.quantity.toLocaleString(),
        'Profit Margin': `${top.marginPercent}%`,
        'Revenue Contribution': `${share}%`,
      },
      tableData: products.slice(0, 3).map(p => ({
        Rank: p.name === top.name ? '🥇 1st' : 'Runner-up',
        Product: p.name,
        Sales: `$${p.sales.toLocaleString()}`,
        Profit: `$${p.profit.toLocaleString()}`,
        Margin: `${p.marginPercent}%`,
      })),
    };
  }

  /**
   * Tool: Top 5 Products
   */
  private static handleTop5Products(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const products = DataEngine.groupBy(records, 'product').slice(0, 5);
    const top5Total = products.reduce((sum, p) => sum + p.sales, 0);
    const stats = DataEngine.computeDatasetStats(records);
    const share = ((top5Total / (stats.totalSales || 1)) * 100).toFixed(1);

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.groupBy("product").limit(5)',
      calculatedFormula: 'TOP_N(5, SUM(sales) GROUP BY product DESC)',
      badge: 'Product Ranking',
      answerSummary: `Your top 5 products collectively generated $${top5Total.toLocaleString()} (${share}% of your business revenue). Leading the group is “${products[0]?.name || 'N/A'}”.`,
      tableData: products.map((p, idx) => ({
        Rank: `#${idx + 1}`,
        Product: p.name,
        Sales: `$${p.sales.toLocaleString()}`,
        Units: p.quantity.toLocaleString(),
        Profit: `$${p.profit.toLocaleString()}`,
        'Margin %': `${p.marginPercent}%`,
      })),
    };
  }

  /**
   * Tool: Location Revenue Analysis
   */
  private static handleLocationRevenue(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const locations = DataEngine.groupBy(records, 'location');
    const top = locations[0];
    const stats = DataEngine.computeDatasetStats(records);

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.groupBy("location").sortDescending("sales")',
      calculatedFormula: 'SUM(sales) GROUP BY location ORDER BY SUM(sales) DESC',
      badge: 'Geographic Intelligence',
      answerSummary: `“${top.name}” generated the most revenue with $${top.sales.toLocaleString()} across ${top.transactions} sales transactions (${top.percentage}% of all revenue).`,
      detailedData: {
        'Top Location': top.name,
        'Revenue Generated': `$${top.sales.toLocaleString()}`,
        'Net Profit': `$${top.profit.toLocaleString()}`,
        'Orders Handled': top.transactions.toLocaleString(),
        'Share of Company Revenue': `${top.percentage}%`,
      },
      tableData: locations.map(loc => ({
        Location: loc.name,
        'Sales Volume': `$${loc.sales.toLocaleString()}`,
        'Gross Profit': `$${loc.profit.toLocaleString()}`,
        'Margin %': `${loc.marginPercent}%`,
        'Share %': `${loc.percentage}%`,
      })),
    };
  }

  /**
   * Tool: Monthly Sales Leader
   */
  private static handleMonthlySales(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const monthly = DataEngine.getTimeSeries(records, 'month');
    if (monthly.length === 0) {
      return {
        question,
        answeredAt: time,
        toolUsed: 'DataEngine.getTimeSeries("month")',
        answerSummary: 'No monthly records found to compare.',
      };
    }

    const sortedBySales = [...monthly].sort((a, b) => b.sales - a.sales);
    const topMonth = sortedBySales[0];

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.getTimeSeries(records, "month").sort("sales")',
      calculatedFormula: 'MAX(SUM(sales) GROUP BY STRFTIME("%Y-%m", date))',
      badge: 'Temporal Trend',
      answerSummary: `${topMonth.displayDate} was your peak sales month, delivering $${topMonth.sales.toLocaleString()} in revenue with a net profit of $${topMonth.profit.toLocaleString()} across ${topMonth.quantity} units.`,
      tableData: monthly.map(m => ({
        Month: m.displayDate,
        Sales: `$${m.sales.toLocaleString()}`,
        Profit: `$${m.profit.toLocaleString()}`,
        Units: m.quantity.toLocaleString(),
        Transactions: m.transactions.toLocaleString(),
      })),
    };
  }

  /**
   * Tool: Underperforming Products
   */
  private static handleUnderperforming(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const products = DataEngine.groupBy(records, 'product');
    const bottom = [...products].sort((a, b) => a.sales - b.sales).slice(0, 4);

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.groupBy("product").sortAscending("sales").limit(4)',
      calculatedFormula: 'BOTTOM_N(4, SUM(sales) GROUP BY product ASC)',
      badge: 'Product Optimization',
      answerSummary: `Your lowest revenue products are “${bottom[0]?.name}” ($${bottom[0]?.sales.toLocaleString()}) and “${bottom[1]?.name || 'N/A'}” ($${bottom[1]?.sales.toLocaleString() || '0'}). Review stock carrying costs and consider bundle promotions.`,
      tableData: bottom.map((p, idx) => ({
        Status: idx === 0 ? 'Lowest Sales' : 'Low Velocity',
        Product: p.name,
        Sales: `$${p.sales.toLocaleString()}`,
        Units: p.quantity.toLocaleString(),
        'Margin %': `${p.marginPercent}%`,
      })),
    };
  }

  /**
   * Tool: Profit and Margins
   */
  private static handleProfitAndMargins(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const stats = DataEngine.computeDatasetStats(records);

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.computeDatasetStats(records).financials',
      calculatedFormula: 'Profit = Sales - Cost; Margin % = (Profit / Sales) * 100',
      badge: 'Financial Health',
      answerSummary: `Your overall business generated $${stats.totalSales.toLocaleString()} in revenue against $${stats.totalCost.toLocaleString()} in cost of goods, resulting in $${stats.totalProfit.toLocaleString()} net profit with an overall gross margin of ${stats.profitMargin}%.`,
      detailedData: {
        'Total Sales': `$${stats.totalSales.toLocaleString()}`,
        'Cost of Goods': `$${stats.totalCost.toLocaleString()}`,
        'Net Profit': `$${stats.totalProfit.toLocaleString()}`,
        'Gross Margin': `${stats.profitMargin}%`,
        'Average Order Value': `$${stats.averageOrderValue.toLocaleString()}`,
      },
    };
  }

  /**
   * Tool: Customer Breakdown
   */
  private static handleCustomerBreakdown(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const customers = DataEngine.groupBy(records, 'customerType');
    const top = customers[0];

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.groupBy("customerType").sortDescending("sales")',
      calculatedFormula: 'SUM(sales) GROUP BY customerType ORDER BY sales DESC',
      badge: 'Customer Intelligence',
      answerSummary: `“${top.name}” customers generated the highest revenue ($${top.sales.toLocaleString()} or ${top.percentage}% of company revenue) across ${top.transactions} transactions.`,
      tableData: customers.map(c => ({
        'Customer Type': c.name,
        Sales: `$${c.sales.toLocaleString()}`,
        'Share %': `${c.percentage}%`,
        Transactions: c.transactions.toLocaleString(),
        'Avg Spend/Tx': `$${(c.sales / (c.transactions || 1)).toFixed(2)}`,
      })),
    };
  }

  /**
   * Tool: Anomaly Review
   */
  private static handleAnomalies(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const anomalies = AnomalyDetector.detectAnomalies(records);

    if (anomalies.length === 0) {
      return {
        question,
        answeredAt: time,
        toolUsed: 'AnomalyDetector.detectAnomalies(records)',
        calculatedFormula: 'Z-Score (|z| >= 1.95 on daily aggregates)',
        badge: 'Anomaly Detector',
        answerSummary: 'No significant statistical anomalies were detected in the current data. Sales patterns remain within normal operating ranges (within +/- 2 standard deviations).',
      };
    }

    return {
      question,
      answeredAt: time,
      toolUsed: 'AnomalyDetector.detectAnomalies(records)',
      calculatedFormula: 'Z-Score thresholding on daily sales and volume distributions',
      badge: 'Anomaly Detector',
      answerSummary: `Detected ${anomalies.length} potential anomalies that warrant review. The most noticeable event was "${anomalies[0].title}" on ${anomalies[0].date}.`,
      tableData: anomalies.map(a => ({
        Date: a.date,
        Event: a.title,
        Severity: a.severity.toUpperCase(),
        Deviation: `${a.deviationPercent > 0 ? '+' : ''}${a.deviationPercent}%`,
        'Expected Baseline': `$${a.expectedBaseline.toLocaleString()}`,
      })),
    };
  }

  /**
   * Tool: Fallback General Overview
   */
  private static handleGeneralOverview(question: string, records: BusinessRecord[], time: string): AgentQueryResult {
    const stats = DataEngine.computeDatasetStats(records);

    return {
      question,
      answeredAt: time,
      toolUsed: 'DataEngine.computeDatasetStats(records)',
      calculatedFormula: 'Aggregates across all dimensional tables',
      badge: 'Executive Synthesis',
      answerSummary: `Here is the operational summary: across ${stats.totalTransactions.toLocaleString()} orders, total sales reached $${stats.totalSales.toLocaleString()} yielding $${stats.totalProfit.toLocaleString()} profit (${stats.profitMargin}% margin). Your star product is “${stats.topProduct.name}” and top branch is “${stats.topLocation.name}”.`,
      detailedData: {
        'Total Revenue': `$${stats.totalSales.toLocaleString()}`,
        'Net Profit': `$${stats.totalProfit.toLocaleString()}`,
        'Top Product': stats.topProduct.name,
        'Top Branch': stats.topLocation.name,
        'Date Span': `${stats.dateRange.start} to ${stats.dateRange.end}`,
      },
    };
  }
}
