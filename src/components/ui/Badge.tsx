type BadgeVariant = 'gold' | 'red' | 'green' | 'blue' | 'muted';

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
  red: 'bg-accent-red/20 text-accent-red border-accent-red/30',
  green: 'bg-accent-green/20 text-accent-green border-accent-green/30',
  blue: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
  muted: 'bg-bg-tertiary text-text-muted border-border',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'muted', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-display font-semibold tracking-wider uppercase border rounded ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
