export default function SectionDivider() {
  return (
    <div className="relative my-24 max-w-5xl m-auto px-6">
      <div className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 bg-linear-to-b from-primary/15 to-transparent blur-2xl" />
    </div>
  );
}
