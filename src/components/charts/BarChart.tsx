import React, { useState } from 'react';
import { GroupSummary } from '../../services/dataEngine';

interface BarChartProps {
  data: GroupSummary[];
  maxItems?: number;
  orientation?: 'horizontal' | 'vertical';
  barColor?: string;
  metricLabel?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxItems = 7,
  orientation = 'horizontal',
  barColor = '#3b82f6',
  metricLabel = 'Sales',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayData = data.slice(0, maxItems);
  const maxVal = Math.max(...displayData.map(d => d.sales), 1);

  if (displayData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        No records available for the selected criteria
      </div>
    );
  }

  if (orientation === 'horizontal') {
    return (
      <div className="space-y-3.5 py-1">
        {displayData.map((item, idx) => {
          const widthPct = Math.max(4, Math.round((item.sales / maxVal) * 100));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.name}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-[260px]" title={item.name}>
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">${item.sales.toLocaleString()}</span>
                  <span className="text-[11px] text-slate-400 w-11 text-right">
                    {item.percentage ? `${item.percentage}%` : ''}
                  </span>
                </div>
              </div>

              {/* Bar track and bar fill */}
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex items-center">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: isHovered ? '#1d4ed8' : barColor,
                  }}
                />
              </div>

              {/* Detailed tooltip on hover */}
              {isHovered && (
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                  <span>Units: <strong className="text-slate-700">{item.quantity}</strong></span>
                  <span>Profit: <strong className="text-emerald-600">${item.profit.toLocaleString()}</strong></span>
                  <span>Margin: <strong className="text-indigo-600">{item.marginPercent}%</strong></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical orientation
  const chartHeight = 220;
  const padding = { top: 20, right: 16, bottom: 40, left: 45 };
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return (
    <div className="relative w-full">
      <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-8 px-2 border-b border-slate-200">
        {displayData.map((item, idx) => {
          const heightPct = Math.max(8, Math.round((item.sales / maxVal) * 100));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.name}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Value floating above bar */}
              <span className={`text-[10px] mb-1 font-medium transition-colors ${isHovered ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                ${Math.round(item.sales) >= 1000 ? `${(item.sales / 1000).toFixed(1)}k` : Math.round(item.sales)}
              </span>

              {/* Bar */}
              <div className="w-full max-w-[42px] bg-slate-100 rounded-t-md overflow-hidden flex items-end" style={{ height: `${innerHeight}px` }}>
                <div
                  className="w-full rounded-t-md transition-all duration-300"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: isHovered ? '#4338ca' : barColor,
                  }}
                />
              </div>

              {/* Label below bar */}
              <span
                className="absolute -bottom-6 w-full text-center text-[11px] text-slate-600 font-medium truncate px-0.5"
                title={item.name}
              >
                {item.name}
              </span>

              {/* Tooltip on hover */}
              {isHovered && (
                <div className="pointer-events-none absolute -top-12 z-30 bg-slate-900 text-white text-[11px] rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                  <div><strong>{item.name}</strong>: ${item.sales.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-300">{item.quantity} units ({item.marginPercent}% margin)</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
