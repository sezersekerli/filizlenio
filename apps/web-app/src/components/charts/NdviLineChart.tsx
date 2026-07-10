"use client";

import type { SpectralTimelinePoint } from "@filizlen/shared";

export function NdviLineChart({ points }: { points: SpectralTimelinePoint[] }) {
  const data = points.filter((p) => p.ndvi_mean != null);
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted py-8 text-center">
        Henüz grafik için yeterli veri yok. Ekim tarihi girin ve uydu senkronu yapın.
      </p>
    );
  }

  const width = 360;
  const height = 160;
  const pad = { t: 12, r: 8, b: 28, l: 36 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const ymin = 0;
  const ymax = 1;

  const xs = data.map((_, i) =>
    data.length === 1 ? pad.l + innerW / 2 : pad.l + (i / (data.length - 1)) * innerW,
  );
  const ys = data.map(
    (p) => pad.t + innerH - ((p.ndvi_mean! - ymin) / (ymax - ymin)) * innerH,
  );
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[280px] h-auto"
        role="img"
        aria-label="NDVI zaman serisi grafiği"
      >
        <line
          x1={pad.l}
          y1={pad.t + innerH}
          x2={pad.l + innerW}
          y2={pad.t + innerH}
          stroke="rgba(255,255,255,0.12)"
        />
        {[0.25, 0.5, 0.75].map((v) => {
          const y = pad.t + innerH - (v / (ymax - ymin)) * innerH;
          return (
            <g key={v}>
              <line
                x1={pad.l}
                y1={y}
                x2={pad.l + innerW}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={pad.l - 6}
                y={y + 4}
                textAnchor="end"
                className="fill-muted text-[9px]"
              >
                {v.toFixed(2)}
              </text>
            </g>
          );
        })}
        <path
          d={path}
          fill="none"
          stroke="#22c55e"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r={4} fill="#22c55e" />
        ))}
        {data.map((p, i) => (
          <text
            key={p.label}
            x={xs[i]}
            y={height - 6}
            textAnchor="middle"
            className="fill-muted text-[8px]"
          >
            {p.label.replace("Hafta ", "H").replace("Ay ", "A")}
          </text>
        ))}
      </svg>
    </div>
  );
}
