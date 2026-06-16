import type { Metric } from '@/data/projects'

// Single place where "Result" vs "Target" is decided — driven by data, never by call sites.
export function MetricDisplay({ metric, compact = false }: { metric: Metric; compact?: boolean }) {
  const hasResult = Boolean(metric.result)
  const hasTarget = Boolean(metric.target)

  if (!hasResult && !hasTarget) return null

  const isResult = hasResult
  const displayValue = hasResult ? metric.result! : metric.target!
  const labelText = isResult ? 'Result' : 'Target'

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest ${
            isResult
              ? 'text-green-600 dark:text-green-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {labelText}
        </span>
        {isResult && hasTarget && !compact && (
          <span className="text-xs line-through text-neutral-300 dark:text-neutral-600">
            {metric.target}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 leading-snug">
        {displayValue}
      </p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">{metric.label}</p>
      {!compact && metric.baseline && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
          Baseline: {metric.baseline}
        </p>
      )}
      {!compact && metric.context && (
        <p className="text-xs text-neutral-400 dark:text-neutral-500">vs. {metric.context}</p>
      )}
    </div>
  )
}
