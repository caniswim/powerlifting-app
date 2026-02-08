interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = '', glow = false }: CardProps) {
  return (
    <div
      className={`bg-bg-card border border-border rounded-lg p-4 ${
        glow ? 'pr-glow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-xs font-display font-semibold tracking-wider uppercase text-text-muted mb-2 ${className}`}>
      {children}
    </div>
  );
}

export function CardValue({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-3xl font-mono font-bold text-text-primary ${className}`}>
      {children}
    </div>
  );
}
