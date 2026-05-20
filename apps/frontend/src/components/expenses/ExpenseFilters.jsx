import { Search } from "lucide-react";

export function ExpenseFilters({ query, setQuery, category, setCategory, sort, setSort }) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
      <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
        <Search size={17} />
        <input className="w-full bg-transparent outline-none" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search expenses" />
      </label>
      <select className="rounded-md border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900" value={category} onChange={(e) => setCategory(e.target.value)}>
        {["All", "Food", "Travel", "Work", "Health", "Subscriptions"].map((item) => <option key={item}>{item}</option>)}
      </select>
      <select className="rounded-md border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900" value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="date">Newest</option>
        <option value="amount">Highest amount</option>
      </select>
    </div>
  );
}
