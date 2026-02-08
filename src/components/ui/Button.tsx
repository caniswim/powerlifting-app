type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent-gold text-black hover:bg-accent-gold-bright active:bg-accent-gold font-bold',
  secondary: 'bg-bg-tertiary text-text-primary border border-border hover:bg-border active:bg-bg-secondary',
  danger: 'bg-accent-red text-white hover:bg-red-700 active:bg-accent-red font-bold',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary active:bg-bg-secondary',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  large?: boolean;
}

export function Button({
  variant = 'secondary',
  fullWidth = false,
  large = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-display font-semibold tracking-wider uppercase rounded-lg transition-all ${
        large ? 'h-14 text-lg px-6' : 'h-11 text-sm px-4'
      } ${fullWidth ? 'w-full' : ''} ${variantClasses[variant]} ${
        props.disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
