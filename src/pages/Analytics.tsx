import { useAnalyticsData } from '../features/analytics/hooks/useAnalyticsData.ts';
import { useE1rmChartData } from '../features/analytics/hooks/useE1rmChartData.ts';
import { useEstimatedTotal } from '../features/analytics/hooks/useEstimatedTotal.ts';
import { useVolumeChartData } from '../features/analytics/hooks/useVolumeChartData.ts';
import { usePRTableData } from '../features/analytics/hooks/usePRTableData.ts';
import { MacrocycleFilter } from '../features/analytics/components/MacrocycleFilter.tsx';
import { E1rmChart } from '../features/analytics/components/E1rmChart.tsx';
import { TotalChart } from '../features/analytics/components/TotalChart.tsx';
import { VolumeStackedChart } from '../features/analytics/components/VolumeStackedChart.tsx';
import { VolumeTargetBars } from '../features/analytics/components/VolumeTargetBars.tsx';
import { PRTable } from '../features/analytics/components/PRTable.tsx';
import { EmptyState } from '../features/analytics/components/ChartShared.tsx';

export default function Analytics() {
  const {
    workouts,
    records,
    filteredWorkouts,
    macroFilter,
    setMacroFilter,
    availableMacros,
    hasData,
  } = useAnalyticsData();

  const e1rmData = useE1rmChartData(filteredWorkouts);
  const totalData = useEstimatedTotal(filteredWorkouts);
  const { volumeChartData, latestWeekVolume, activeMuscles } = useVolumeChartData(filteredWorkouts);
  const prRows = usePRTableData(workouts, records);

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-text-muted">
            POWERLIFTING TRACKER
          </h1>
          <div className="text-2xl font-display font-bold text-accent-gold uppercase tracking-wider">
            ANALYTICS
          </div>
        </div>

        <MacrocycleFilter
          macroFilter={macroFilter}
          availableMacros={availableMacros}
          onFilterChange={setMacroFilter}
        />

        {!hasData ? (
          <EmptyState />
        ) : (
          <>
            <E1rmChart data={e1rmData} />
            <TotalChart data={totalData} />
            <VolumeStackedChart data={volumeChartData} activeMuscles={activeMuscles} />
            <VolumeTargetBars volumeData={latestWeekVolume} />
            <PRTable rows={prRows} />
          </>
        )}
      </div>
    </div>
  );
}
