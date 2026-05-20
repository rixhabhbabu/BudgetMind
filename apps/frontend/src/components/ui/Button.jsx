export function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-ocean text-white hover:bg-teal-800",
    secondary: "bg-white text-ink border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-700",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  };
  return (
    <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
