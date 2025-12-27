"use client";

export default function PageHeader({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-3 flex items-baseline justify-start sm:justify-between gap-3">
      <h1 className="text-lg sm:text-2xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}
