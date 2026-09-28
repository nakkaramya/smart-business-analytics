/**
 * Data Cleaning & Validation Pipeline
 * - CSV parsing
 * - Column profiling & type detection
 * - Missing values detection & smart imputation
 * - Duplicate rows detection & handling
 * - Date format standardization & validation
 * - Numeric string hygiene (currency, commas)
 * - Transparent cleaning audit summary
 */

import Papa from 'papaparse';
import { BusinessRecord, CleaningSummary, ColumnProfile, ColumnType, RawRow } from '../types/data';

export interface ParseResult {
  records: BusinessRecord[];
  rawRows: RawRow[];
  columnProfiles: ColumnProfile[];
  cleaningSummary: CleaningSummary;
  headers: string[];
  duplicateCount: number;
}

// Helper to clean numeric values (e.g., "$1,240.50" -> 1240.50)
export function parseCleanNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const str = String(val).trim().replace(/[$,€£¥\s]/g, '').replace(/,/g, '');
  const parsed = parseFloat(str);
  return isNaN(parsed) ? fallback : parsed;
}

// Standardize dates to YYYY-MM-DD
export function parseCleanDate(val: any): { dateStr: string; isValid: boolean } {
  if (!val) return { dateStr: new Date().toISOString().split('T')[0], isValid: false };
  const str = String(val).trim();
  
  // Try direct parse
  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    const d = new Date(timestamp);
    // basic sanity check: year between 1990 and 2100
    const year = d.getFullYear();
    if (year >= 1990 && year <= 2100) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return { dateStr: `${yyyy}-${mm}-${dd}`, isValid: true };
    }
  }

  // Handle DD/MM/YYYY or MM/DD/YYYY formats
  const parts = str.split(/[-/.]/);
  if (parts.length === 3) {
    let y = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10);
    let d = parseInt(parts[2], 10);

    // If first part is 2 or 1 digits, it might be MM/DD/YYYY or DD/MM/YYYY
    if (parts[2].length === 4) {
      y = parseInt(parts[2], 10);
      m = parseInt(parts[0], 10);
      d = parseInt(parts[1], 10);
    }

    if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1990 && y <= 2100) {
      return {
        dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        isValid: true,
      };
    }
  }

  // Fallback to today
  return { dateStr: new Date().toISOString().split('T')[0], isValid: false };
}

// Detect column data type based on sample values
export function detectColumnType(colName: string, values: any[]): ColumnType {
  const lower = colName.toLowerCase();
  if (lower.includes('date') || lower.includes('time') || lower.includes('day')) {
    return 'date';
  }
  if (lower.includes('sales') || lower.includes('cost') || lower.includes('price') || lower.includes('revenue') || lower.includes('profit')) {
    return 'currency';
  }
  if (lower.includes('quantity') || lower.includes('units') || lower.includes('count') || lower.includes('qty')) {
    return 'numeric';
  }

  let numberCount = 0;
  let dateCount = 0;
  let sampleCount = 0;

  for (const v of values.slice(0, 20)) {
    if (v === null || v === undefined || v === '') continue;
    sampleCount++;
    const str = String(v).trim();
    if (!isNaN(Date.parse(str)) && str.length > 5 && (str.includes('-') || str.includes('/'))) {
      dateCount++;
    }
    const cleanNum = str.replace(/[$,€£\s]/g, '').replace(/,/g, '');
    if (!isNaN(Number(cleanNum)) && cleanNum !== '') {
      numberCount++;
    }
  }

  if (sampleCount === 0) return 'text';
  if (dateCount / sampleCount > 0.6) return 'date';
  if (numberCount / sampleCount > 0.6) return 'numeric';
  return 'text';
}

// Find key column mappings flexibly (case-insensitive & aliases)
function findKey(headers: string[], targetKeywords: string[]): string {
  for (const header of headers) {
    const clean = header.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const kw of targetKeywords) {
      if (clean === kw || clean.includes(kw)) {
        return header;
      }
    }
  }
  return '';
}

/**
 * Main cleaning and parsing routine
 */
export function cleanAndProcessCSV(csvContent: string, deduplicate = true): ParseResult {
  const parsed = Papa.parse<Record<string, any>>(csvContent, {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
  });

  const rawRows: RawRow[] = parsed.data || [];
  const headers = parsed.meta.fields || (rawRows[0] ? Object.keys(rawRows[0]) : []);

  // Map columns
  const dateKey = findKey(headers, ['date', 'timestamp', 'day', 'time', 'orderdate']) || headers[0] || 'Date';
  const productKey = findKey(headers, ['product', 'item', 'productname', 'sku', 'title']) || headers[1] || 'Product';
  const categoryKey = findKey(headers, ['category', 'department', 'type', 'group']) || headers[2] || 'Category';
  const qtyKey = findKey(headers, ['quantity', 'qty', 'units', 'volume', 'count']) || headers[3] || 'Quantity';
  const salesKey = findKey(headers, ['sales', 'revenue', 'total', 'amount', 'price']) || headers[4] || 'Sales';
  const costKey = findKey(headers, ['cost', 'cogs', 'expense', 'unitcost']) || headers[5] || 'Cost';
  const locationKey = findKey(headers, ['location', 'store', 'city', 'branch', 'region']) || headers[6] || 'Location';
  const customerKey = findKey(headers, ['customertype', 'customer', 'segment', 'tier', 'client']) || headers[7] || 'CustomerType';

  let missingValuesFixed = 0;
  let invalidDatesFixed = 0;
  let numericConverted = 0;
  const actionsApplied: string[] = [];

  // Track duplicates using row fingerprint
  const seenFingerprints = new Set<string>();
  const duplicateIndices = new Set<number>();

  rawRows.forEach((row, idx) => {
    const fingerprint = JSON.stringify(row);
    if (seenFingerprints.has(fingerprint)) {
      duplicateIndices.add(idx);
    } else {
      seenFingerprints.add(fingerprint);
    }
  });

  const duplicateCount = duplicateIndices.size;
  if (duplicateCount > 0) {
    actionsApplied.push(
      deduplicate 
        ? `Removed ${duplicateCount} duplicate row${duplicateCount > 1 ? 's' : ''}` 
        : `Flagged ${duplicateCount} duplicate row${duplicateCount > 1 ? 's' : ''}`
    );
  }

  // Profile columns
  const columnProfiles: ColumnProfile[] = headers.map(header => {
    let missingCount = 0;
    const values: any[] = [];
    const uniqueVals = new Set<string>();

    rawRows.forEach(row => {
      const val = row[header];
      if (val === undefined || val === null || String(val).trim() === '') {
        missingCount++;
      } else {
        values.push(val);
        uniqueVals.add(String(val).trim());
      }
    });

    return {
      name: header,
      detectedType: detectColumnType(header, values),
      missingCount,
      uniqueValues: uniqueVals.size,
      sampleValues: values.slice(0, 4),
    };
  });

  const records: BusinessRecord[] = [];

  rawRows.forEach((row, idx) => {
    // If deduplicate is enabled and row is a duplicate, skip it
    if (deduplicate && duplicateIndices.has(idx)) {
      return;
    }

    const rawDateVal = row[dateKey];
    const { dateStr, isValid: isDateValid } = parseCleanDate(rawDateVal);
    if (!isDateValid) {
      invalidDatesFixed++;
    }

    const productVal = row[productKey] ? String(row[productKey]).trim() : 'Standard Product';
    const categoryVal = row[categoryKey] ? String(row[categoryKey]).trim() : 'General';
    const locationVal = row[locationKey] ? String(row[locationKey]).trim() : 'Main Location';
    const customerVal = row[customerKey] ? String(row[customerKey]).trim() : 'Retail';

    // Check missing values on main fields
    [dateKey, productKey, categoryKey, locationKey, customerKey].forEach(k => {
      if (row[k] === undefined || row[k] === null || String(row[k]).trim() === '') {
        missingValuesFixed++;
      }
    });

    // Clean numerical values
    const rawQty = row[qtyKey];
    const rawSales = row[salesKey];
    const rawCost = row[costKey];

    if (rawQty === undefined || rawQty === null || rawQty === '') missingValuesFixed++;
    if (rawSales === undefined || rawSales === null || rawSales === '') missingValuesFixed++;
    if (rawCost === undefined || rawCost === null || rawCost === '') missingValuesFixed++;

    const quantity = Math.max(1, Math.round(parseCleanNumber(rawQty, 1)));
    let sales = parseCleanNumber(rawSales, 0);
    let cost = parseCleanNumber(rawCost, 0);

    // If cost was completely missing, approximate realistic cost as 40% of sales
    if ((rawCost === undefined || rawCost === null || rawCost === '') && sales > 0) {
      cost = Number((sales * 0.4).toFixed(2));
    }

    // If sales was 0 or missing but cost is known, infer sales
    if (sales === 0 && cost > 0) {
      sales = Number((cost * 1.5).toFixed(2));
    }

    if (typeof rawSales === 'string' && (rawSales.includes('$') || rawSales.includes(','))) {
      numericConverted++;
    }

    const profit = Number((sales - cost).toFixed(2));

    records.push({
      id: `rec-${idx + 1}`,
      date: dateStr,
      rawDate: String(rawDateVal || ''),
      product: productVal,
      category: categoryVal,
      quantity,
      sales: Number(sales.toFixed(2)),
      cost: Number(cost.toFixed(2)),
      profit,
      location: locationVal,
      customerType: customerVal,
    });
  });

  if (missingValuesFixed > 0) {
    actionsApplied.push(`Imputed/handled ${missingValuesFixed} missing value${missingValuesFixed > 1 ? 's' : ''} across fields`);
  }
  if (invalidDatesFixed > 0) {
    actionsApplied.push(`Corrected ${invalidDatesFixed} invalid or missing date format${invalidDatesFixed > 1 ? 's' : ''}`);
  }
  if (numericConverted > 0) {
    actionsApplied.push(`Cleaned & parsed ${numericConverted} currency/numeric strings`);
  }
  if (actionsApplied.length === 0) {
    actionsApplied.push('Data passed validation with clean schema and no modifications required.');
  }

  const cleaningSummary: CleaningSummary = {
    totalRows: rawRows.length,
    totalColumns: headers.length,
    validRows: records.length,
    missingValuesFixed,
    duplicateRowsFound: duplicateCount,
    invalidDatesFixed,
    numericConverted,
    actionsApplied,
  };

  return {
    records,
    rawRows,
    columnProfiles,
    cleaningSummary,
    headers,
    duplicateCount,
  };
}
