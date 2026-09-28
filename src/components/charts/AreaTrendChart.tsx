import React, { useState } from 'react';
import { TimeSeriesPoint } from '../../services/dataEngine';

interface AreaTrendChartProps {
  data: TimeSeriesPoint[];
  height?: number;
  valueKey?: 'sales' | 'profit' | 'quantity';
  title?: string;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  data,
  height = 240,
  valueKey = 'sales',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        No timeline data available for the selected filters
      </div>
    );
  }

  const values = data.map(d => d[valueKey]);
  const maxValue = Math.max(...values, 10);
  const padding = { top: 20, right: 24, bottom: 32, left: 56 };
  const chartWidth = 700;
  const chartHeight = height;

  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth;
    const y = padding.top + innerHeight - (d[valueKey] / maxValue) * innerHeight;
    return { x, y, point: d };
  });

  // Build SVG path
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x} ${points[0].y} L ${points[0].x + 10} ${points[0].y}`;
  } else {
    pathD = points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth cubic curve control points
      const prev = arr[idx - 1];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }, '');
  }

  // Area fill path closing to bottom
  const firstX = points[0]?.x ?? padding.left;
  const lastX = points[points.length - 1]?.x ?? (padding.left + innerWidth);
  const bottomY = padding.top + innerHeight;
  const areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  // Grid ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(fraction => ({
    val: maxValue * fraction,
    y: padding.top + innerHeight - fraction * innerHeight,
  }));

  // X ticks (select 4-6 evenly spaced labels)
  const xTickStep = Math.max(1, Math.floor(data.length / 5));
  const xTicks = data.filter((_, idx) => idx % xTickStep === 0 || idx === data.length - 1);

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible select-none"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.32" />
            <stop offset="90%" stopColor="#4f46e5" stopOpacity="0.01" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={padding.left + innerWidth}
              y2={tick.y}
              stroke="#e2e8f0"
              strokeDasharray={i === 0 ? '' : '3 3'}
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={tick.y + 4}
              fontSize="10"
              textAnchor="end"
              fill="#64748b"
              fontFamily="inherit"
            >
              {valueKey === 'quantity'
                ? Math.round(tick.val)
                : `$${Math.round(tick.val) >= 1000 ? `${(tick.val / 1000).toFixed(1)}k` : Math.round(tick.val)}`}
            </text>
          </g>
        ))}

        {/* Shaded Area */}
        <path d={areaD} fill="url(#trendGradient)" />

        {/* Smooth Trend Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Data Point Dots & Hover columns */}
        {points.map((p, idx) => (
          <g
            key={idx}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredIdx(idx)}
          >
            <rect
              x={p.x - (innerWidth / data.length) / 2}
              y={padding.top}
              width={innerWidth / data.length}
              height={innerHeight}
              fill="transparent"
            />
            {hoveredIdx === idx && (
              <line
                x1={p.x}
                y1={padding.top}
                x2={p.x}
                y2={padding.top + innerHeight}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === idx ? 5.5 : 2.5}
              fill={hoveredIdx === idx ? '#4338ca' : '#4f46e5'}
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-150"
            />
          </g>
        ))}

        {/* X Axis Labels */}
        {xTicks.map((item, idx) => {
          const originalIdx = data.indexOf(item);
          const p = points[originalIdx];
          if (!p) return null;
          return (
            <text
              key={idx}
              x={p.x}
              y={chartHeight - 8}
              fontSize="10"
              textAnchor="middle"
              fill="#64748b"
            >
              {item.displayDate}
            </text>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {activePoint && (
        <div
          className="pointer-events-none absolute z-20 rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 text-xs text-white shadow-xl backdrop-blur-sm transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(activePoint.x / chartWidth) * 100}%`,
            top: `${(activePoint.y / chartHeight) * 100}%`,
            marginTop: '-12px',
          }}
        >
          <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1 mb-1.5 flex items-center justify-between gap-4">
            <span>{activePoint.point.displayDate}</span>
            <span className="text-[10px] text-slate-400 font-normal">{activePoint.point.transactions} orders</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Sales:</span>
              <span className="font-semibold text-emerald-400">${activePoint.point.sales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Profit:</span>
              <span className="font-medium text-indigo-300">${activePoint.point.profit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Units:</span>
              <span className="text-slate-200">{activePoint.point.quantity.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
