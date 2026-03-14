'use client';

interface SparkLineProps {
    data: number[];
    color?: string;
    height?: number;
    width?: number;
    showDots?: boolean;
}

export default function SparkLine({
    data,
    color = '#3B82F6',
    height = 32,
    width = 80,
    showDots = false,
}: SparkLineProps) {
    if (data.length < 2) return null;

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const padding = 2;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;

    const points = data.map((val, i) => {
        const x = padding + (i / (data.length - 1)) * innerW;
        const y = padding + innerH - ((val - min) / range) * innerH;
        return { x, y };
    });

    const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(' ');

    const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

    const lastPoint = points[points.length - 1];

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`spark-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path
                d={areaD}
                fill={`url(#spark-grad-${color.replace('#', '')})`}
            />
            <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {showDots && lastPoint && (
                <circle
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r={2.5}
                    fill={color}
                />
            )}
        </svg>
    );
}
