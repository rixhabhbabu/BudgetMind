export function Card({ children, className = "" }) {
  return <section className={`surface rounded-lg p-5 shadow-panel ${className}`}>{children}</section>;
}
