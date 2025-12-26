"use client";

export default function PageHeader({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-3 flex items-end justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}
