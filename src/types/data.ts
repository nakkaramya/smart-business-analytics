/**
 * BizInsight Agent - Data Types and Domain Interfaces
 */

export interface RawRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface BusinessRecord {
  id: string;
  date: string; // ISO format YYYY-MM-DD
  rawDate?: string;
  product: string;
  category: string;
  quantity: number;
  sales: number;
  cost: number;
  location: string;
  customerType: string;
  profit: number;
}

export type ColumnType = 'date' | 'numeric' | 'text' | 'currency' | 'unknown';

export interface ColumnProfile {
  name: string;
  detectedType: ColumnType;
  missingCount: number;
  uniqueValues: number;
  sampleValues: (string | number)[];
}

export interface CleaningSummary {
  totalRows: number;
  totalColumns: number;
  validRows: number;
  missingValuesFixed: number;
  duplicateRowsFound: number;
  invalidDatesFixed: number;
  numericConverted: number;
  actionsApplied: string[];
}

export interface DatasetStats {
  totalSales: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalQuantity: number;
  totalTransactions: number;
  uniqueProductsCount: number;
  uniqueCategoriesCount: number;
  uniqueLocationsCount: number;
  uniqueCustomerTypesCount: number;
  averageOrderValue: number;
  topProduct: {
    name: string;
    sales: number;
    quantity: number;
    profit: number;
  };
  lowestProduct: {
    name: string;
    sales: number;
    quantity: number;
    profit: number;
  };
  topCategory: {
    name: string;
    sales: number;
    percentage: number;
  };
  topLocation: {
    name: string;
    sales: number;
    percentage: number;
  };
  dateRange: {
    start: string;
    end: string;
    daysCount: number;
  };
}

export interface FilterState {
  startDate: string;
  endDate: string;
  product: string; // 'all' or specific name
  category: string;
  location: string;
  customerType: string;
  searchTerm: string;
}

export interface InsightItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'opportunity';
  title: string;
  description: string;
  metric?: string;
  changePercent?: number;
  tag: string;
  dataPoint?: string;
}

export interface AnomalyItem {
  id: string;
  date: string;
  type: 'sudden_drop' | 'sudden_spike' | 'unusual_quantity_high' | 'unusual_quantity_low';
  title: string;
  description: string;
  actualValue: number;
  expectedBaseline: number;
  deviationPercent: number;
  severity: 'low' | 'medium' | 'high';
  affectedDimension: string;
}

export interface SuggestionItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'inventory' | 'pricing' | 'marketing' | 'operations';
  title: string;
  recommendation: string;
  rationale: string;
  potentialImpact: string;
}

export interface AgentQueryResult {
  question: string;
  answeredAt: string;
  toolUsed: string;
  answerSummary: string;
  detailedData?: Record<string, any>;
  tableData?: Array<Record<string, any>>;
  calculatedFormula?: string;
  badge?: string;
}
