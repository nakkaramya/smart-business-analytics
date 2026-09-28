import React, { useState } from 'react';
import { GroupSummary } from '../../services/dataEngine';

interface DonutChartProps {
  data: GroupSummary[];
  title?: string;
  totalLabel?: string;
}

const PALETTE = [
  '#4f46e5', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#64748b', // Slate
];

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  totalLabel = 'Total Sales',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        No category distribution available
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.sales, 0);
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = data.map((item, idx) => {
    const percent = total > 0 ? (item.sales / total) * 100 : 0;
    const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += percent;

    return {
      item,
      color: PALETTE[idx % PALETTE.length],
      percent: percent.toFixed(1),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
      {/* SVG Donut */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Slices */}
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <circle
                key={slice.item.name}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200 ease-out origin-center"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[11px] text-slate-500 font-medium leading-tight">
            {activeItem ? activeItem.item.name : totalLabel}
          </span>
          <span className="text-sm font-bold text-slate-900 mt-0.5">
            {activeItem
              ? `$${activeItem.item.sales.toLocaleString()}`
              : `$${Math.round(total).toLocaleString()}`}
          </span>
          {activeItem && (
            <span className="text-[10px] font-semibold text-indigo-600">
              {activeItem.percent}%
            </span>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2 w-full max-w-[220px]">
        {slices.map((slice, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={slice.item.name}
              className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                isHovered ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="font-medium text-slate-700 truncate" title={slice.item.name}>
                  {slice.item.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 pl-2">
                <span className="font-semibold text-slate-900">${slice.item.sales.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">({slice.percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
