import { cn } from '@/lib/utils';
import { MiniLineChart } from './MiniLineChart';
import type { StatCardConfig, TabType } from '../types';

interface StatCardProps {
    stat: StatCardConfig;
    isActive: boolean;
    onClick: (id: TabType) => void;
}

export function StatCard({ stat, isActive, onClick }: StatCardProps) {
    const Icon = stat.icon;

    return (
        <div
            className={cn(
                'relative rounded-2xl p-[1px] transition-all duration-300',
                isActive ? `bg-gradient-to-br ${stat.gradient.replace(/\/10/g, '/60')}` : 'bg-transparent',
            )}
        >
            <button
                onClick={() => onClick(stat.id)}
                className={cn(
                    'group relative w-full overflow-hidden rounded-2xl backdrop-blur-2xl pt-3 pl-3 pb-0 pr-0',
                    'bg-white/5 dark:bg-black/20 ',
                    'transition-all duration-300 ease-out hover:-translate-y-1',
                    'text-left cursor-pointer',
                    isActive
                        ? 'shadow-[0_0_30px_rgba(0,0,0,0.1),0_0_20px_var(--glow-color)] scale-[1.02] bg-white/10 dark:bg-black/30'
                        : 'shadow-md hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-white/8 dark:hover:bg-black/25',
                )}
                style={isActive ? ({ '--glow-color': `${stat.chartColor}40` } as React.CSSProperties) : undefined}
            >
                {/* Background Gradient - Animated */}
                <div
                    className={cn(
                        'absolute inset-0 bg-gradient-to-br transition-opacity duration-300',
                        stat.gradient,
                        isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-20',
                    )}
                />

                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'flex h-5 w-5 items-center justify-center rounded-md',
                                    'bg-gradient-to-br backdrop-blur-sm',
                                    stat.gradient.replace(/\/10/g, '/30'),
                                )}
                            >
                                <Icon className={cn('h-3 w-3', stat.iconColor)} />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        </div>
                        {/* Badge */}
                        {stat.badge > 0 && (
                            <div
                                className={cn(
                                    'flex h-6 min-w-6 items-center justify-center rounded-full mr-2',
                                    'text-xs font-semibold text-white shadow-md',
                                    stat.badgeColor,
                                )}
                            >
                                {stat.badge}
                            </div>
                        )}
                    </div>
                    {/* Stats */}
                    <div className="flex items-center justify-between ">
                        <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                        {/* Mini Line Chart */}
                        <div className="mt-2">
                            <MiniLineChart data={stat.chartData} color={stat.chartColor} />
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
}
