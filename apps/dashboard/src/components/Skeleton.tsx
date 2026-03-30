export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-gradient-to-r from-brand-secondary/10 via-brand-primary/10 to-brand-secondary/10 bg-[length:200%_100%] ${className}`}
    />
  );
}
