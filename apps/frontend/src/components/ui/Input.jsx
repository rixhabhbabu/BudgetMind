export function Input({ label, className = "", ...props }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-600 dark:text-slate-200">
      {label}
      <input className={`min-h-11 rounded-md border border-slate-200 bg-white px-3 text-ink outline-none ring-ocean/20 transition focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-white ${className}`} {...props} />
    </label>
  );
}
