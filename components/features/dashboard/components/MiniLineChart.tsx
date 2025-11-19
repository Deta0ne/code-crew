import { CHART_CONFIG } from '../constants';

interface MiniLineChartProps {
    data: number[];
    color: string;
}

export function MiniLineChart({ data, color }: MiniLineChartProps) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const { WIDTH, HEIGHT, PADDING } = CHART_CONFIG;
    const points = data.length;

    const linePath = data
        .map((value, index) => {
            const x = (index / (points - 1)) * WIDTH;
            const y = PADDING + (HEIGHT - PADDING * 2) - ((value - min) / range) * (HEIGHT - PADDING * 2);
            return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
        })
        .join(' ');

    const areaPath = `${linePath} L ${WIDTH},${HEIGHT} L 0,${HEIGHT} Z`;
    const gradientId = `gradient-${color.replace('#', '')}`;

    return (
        <svg width={WIDTH} height={HEIGHT} className="overflow-visible">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            {/* Area fill */}
            <path d={areaPath} fill={`url(#${gradientId})`} />
            {/* Line */}
            <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth={CHART_CONFIG.STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
