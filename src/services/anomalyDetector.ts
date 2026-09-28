/**
 * Anomaly Detection Service (Statistical heuristics & Z-Score analysis)
 * Identifies unusual spikes, dips, and outlier volumes.
 * Explicitly frames detections as "Possible Anomalies for Review".
 */

import { AnomalyItem, BusinessRecord } from '../types/data';
import { DataEngine } from './dataEngine';

export class AnomalyDetector {
  /**
   * Run anomaly detection across sales transactions and daily aggregates
   */
  static detectAnomalies(records: BusinessRecord[]): AnomalyItem[] {
    if (records.length < 5) return [];

    const anomalies: AnomalyItem[] = [];

    // 1. Daily sales timeline analysis (sudden jumps and plunges)
    const dailyPoints = DataEngine.getTimeSeries(records, 'day');
    const salesValues = dailyPoints.map(p => p.sales);
    const { mean: avgDailySales, stdDev: salesStdDev } = DataEngine.getStats(salesValues);

    // If stdDev is significant, evaluate Z-scores
    if (salesStdDev > 0) {
      dailyPoints.forEach((point, index) => {
        const zScore = (point.sales - avgDailySales) / salesStdDev;
        const deviationPct = Math.round(((point.sales - avgDailySales) / avgDailySales) * 100);

        // Check for sudden drop (Z <= -1.8 or > 45% drop from average)
        if (zScore <= -1.75 && point.sales < avgDailySales * 0.55) {
          anomalies.push({
            id: `anom-drop-${point.date}-${index}`,
            date: point.date,
            type: 'sudden_drop',
            title: `Sudden Sales Drop on ${point.displayDate}`,
            description: `Total sales of $${point.sales.toLocaleString()} were ${Math.abs(deviationPct)}% below the daily average baseline ($${Math.round(avgDailySales).toLocaleString()}).`,
            actualValue: point.sales,
            expectedBaseline: Math.round(avgDailySales),
            deviationPercent: deviationPct,
            severity: zScore <= -2.2 ? 'high' : 'medium',
            affectedDimension: `Date: ${point.date}`,
          });
        }

        // Check for sudden spike (Z >= 2.0 or > 65% above average)
        if (zScore >= 1.95 && point.sales > avgDailySales * 1.6) {
          anomalies.push({
            id: `anom-spike-${point.date}-${index}`,
            date: point.date,
            type: 'sudden_spike',
            title: `Sales Spike on ${point.displayDate}`,
            description: `Total sales of $${point.sales.toLocaleString()} surged ${deviationPct}% above normal baseline ($${Math.round(avgDailySales).toLocaleString()}).`,
            actualValue: point.sales,
            expectedBaseline: Math.round(avgDailySales),
            deviationPercent: deviationPct,
            severity: zScore >= 2.5 ? 'high' : 'medium',
            affectedDimension: `Date: ${point.date}`,
          });
        }
      });
    }

    // 2. Quantity outlier analysis (Wholesale or bulk transaction spikes)
    const quantities = records.map(r => r.quantity);
    const { mean: avgQty, stdDev: qtyStdDev } = DataEngine.getStats(quantities);

    if (qtyStdDev > 0) {
      // Find top 2 highest quantity outliers
      const qtyOutliers = records
        .map(r => ({
          record: r,
          zScore: (r.quantity - avgQty) / qtyStdDev,
        }))
        .filter(item => item.zScore >= 2.3)
        .sort((a, b) => b.record.quantity - a.record.quantity)
        .slice(0, 2);

      qtyOutliers.forEach((item, idx) => {
        const r = item.record;
        const devPct = Math.round(((r.quantity - avgQty) / avgQty) * 100);
        anomalies.push({
          id: `anom-qty-high-${r.id}-${idx}`,
          date: r.date,
          type: 'unusual_quantity_high',
          title: `Unusually High Volume: ${r.product}`,
          description: `Order of ${r.quantity} units (${r.customerType} at ${r.location}) is ${devPct}% higher than typical order volume (~${Math.round(avgQty)} units).`,
          actualValue: r.quantity,
          expectedBaseline: Math.round(avgQty),
          deviationPercent: devPct,
          severity: item.zScore >= 2.8 ? 'medium' : 'low',
          affectedDimension: `Product: ${r.product}`,
        });
      });
    }

    // 3. Sequential day-over-day sudden drop detection
    for (let i = 1; i < dailyPoints.length; i++) {
      const prev = dailyPoints[i - 1];
      const curr = dailyPoints[i];
      if (prev.sales > 500 && curr.sales < prev.sales * 0.45) {
        // Only add if not already captured
        const alreadyAdded = anomalies.some(a => a.date === curr.date && a.type === 'sudden_drop');
        if (!alreadyAdded) {
          const dropPct = Math.round(((prev.sales - curr.sales) / prev.sales) * 100);
          anomalies.push({
            id: `anom-dod-${curr.date}`,
            date: curr.date,
            type: 'sudden_drop',
            title: `Sharp Day-over-Day Drop on ${curr.displayDate}`,
            description: `Sales plummeted by ${dropPct}% compared to the immediate prior sales date ($${curr.sales.toLocaleString()} vs $${prev.sales.toLocaleString()}).`,
            actualValue: curr.sales,
            expectedBaseline: prev.sales,
            deviationPercent: -dropPct,
            severity: 'medium',
            affectedDimension: 'Sequential Day Sales',
          });
        }
      }
    }

    // Sort by date descending and severity
    return anomalies.sort((a, b) => {
      if (a.severity === 'high' && b.severity !== 'high') return -1;
      if (b.severity === 'high' && a.severity !== 'high') return 1;
      return b.date.localeCompare(a.date);
    });
  }
}
