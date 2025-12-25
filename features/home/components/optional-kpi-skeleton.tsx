"use client";

export default function OptionalKPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-xl border bg-muted animate-pulse"
        />
      ))}
    </div>
  );
}
