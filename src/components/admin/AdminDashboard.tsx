import React, { useState } from 'react';
import { ActivityItem } from '../../types/admin';
import { CHART_MONTH_DATA } from '../../data/adminData';

interface AdminDashboardProps {
  stats: {
    totalApps: number;
    publishedApps: number;
    draftApps: number;
    totalDownloads: number;
  };
  recentActivities: ActivityItem[];
  onNavigateToApps?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  recentActivities,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Coordinates Calculation for 7 Days (Mon -> Sun)
  // Max value: 1000, Chart height: 200, Width: 460
  const chartWidth = 520;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const points = CHART_MONTH_DATA.map((d, index) => {
    const x = paddingX + (index / (CHART_MONTH_DATA.length - 1)) * innerWidth;
    const y = chartHeight - paddingY - (d.value / 1000) * innerHeight;
    return { x, y, day: d.day, value: d.value };
  });

  // Build SVG smooth cubic bezier path
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`;

  return (
    <div id="admin-dashboard-view" className="space-y-7">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
      </div>

      {/* 4 Top Metric Cards (Exact match to Image 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Apps */}
        <div className="p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Total Apps
          </span>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#a855f7] tracking-tight">
              {stats.totalApps}
            </span>
          </div>
        </div>

        {/* 2. Published Apps */}
        <div className="p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Published Apps
          </span>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#22c55e] tracking-tight">
              {stats.publishedApps}
            </span>
          </div>
        </div>

        {/* 3. Draft Apps */}
        <div className="p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Draft Apps
          </span>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#818cf8] tracking-tight">
              {stats.draftApps}
            </span>
          </div>
        </div>

        {/* 4. Total Downloads */}
        <div className="p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Total Downloads
          </span>
          <div className="mt-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats.totalDownloads.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Downloads Overview + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Downloads Overview Chart (Image 1 Left) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">
              Downloads Overview (This Month)
            </h2>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full relative flex items-center justify-center py-2">
            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto min-h-[220px] select-none"
              >
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#a855f7" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Y-Axis Grid Lines & Labels (1K, 800, 600, 400, 200, 0) */}
                {[
                  { val: 1000, label: '1K' },
                  { val: 800, label: '800' },
                  { val: 600, label: '600' },
                  { val: 400, label: '400' },
                  { val: 200, label: '200' },
                  { val: 0, label: '0' },
                ].map((gridItem, i) => {
                  const y = chartHeight - paddingY - (gridItem.val / 1000) * innerHeight;
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#1e2238"
                        strokeDasharray={gridItem.val === 0 ? 'none' : '4 4'}
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 10}
                        y={y + 4}
                        fill="#64748b"
                        fontSize="11"
                        textAnchor="end"
                        fontFamily="sans-serif"
                      >
                        {gridItem.label}
                      </text>
                    </g>
                  );
                })}

                {/* Gradient Fill under the Curve */}
                <path d={areaPath} fill="url(#purpleGlow)" />

                {/* Main Glowing Curve Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#shadow)"
                />

                {/* Data Points */}
                {points.map((pt, i) => {
                  const isHovered = hoveredIndex === i;
                  return (
                    <g
                      key={i}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Outer pulse */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="9"
                          fill="#c084fc"
                          opacity="0.4"
                        />
                      )}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#a855f7"
                        strokeWidth="2.5"
                      />
                    </g>
                  );
                })}

                {/* X-Axis Labels (Mon, Tue, Wed, Thu, Fri, Sat, Sun) */}
                {points.map((pt, i) => (
                  <text
                    key={i}
                    x={pt.x}
                    y={chartHeight - 6}
                    fill="#94a3b8"
                    fontSize="12"
                    fontWeight="500"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {pt.day}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity (Image 1 Right) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">
              Recent Activity
            </h2>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-around">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: act.iconColor, boxShadow: `0 0 8px ${act.iconColor}88` }}
                  />
                  <span className="text-sm text-slate-200 font-medium">
                    {act.title}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-normal whitespace-nowrap pl-2">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
