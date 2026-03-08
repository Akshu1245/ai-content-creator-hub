const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`surface-raised p-5 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-9 h-9 rounded-xl animate-shimmer" />
      <div className="w-12 h-3 rounded animate-shimmer" />
    </div>
    <div className="w-20 h-7 rounded animate-shimmer mb-2" />
    <div className="w-16 h-3 rounded animate-shimmer" />
  </div>
);

const SkeletonRow = ({ className = "" }: { className?: string }) => (
  <div className={`surface-raised p-5 ${className}`}>
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl animate-shimmer shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-3/4 h-4 rounded animate-shimmer" />
        <div className="w-1/2 h-3 rounded animate-shimmer" />
      </div>
      <div className="w-16 h-5 rounded-full animate-shimmer" />
    </div>
  </div>
);

const SkeletonChart = ({ className = "" }: { className?: string }) => (
  <div className={`surface-raised p-6 ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="w-32 h-4 rounded animate-shimmer" />
      <div className="w-20 h-3 rounded animate-shimmer" />
    </div>
    <div className="h-48 flex items-end gap-1">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="flex-1 rounded-t animate-shimmer"
          style={{ height: `${30 + Math.random() * 50}%`, animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  </div>
);

export { SkeletonCard, SkeletonRow, SkeletonChart };
