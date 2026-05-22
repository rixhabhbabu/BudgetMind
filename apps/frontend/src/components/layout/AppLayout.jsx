import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";

export function AppLayout({ activePage, onNavigate, children }) {
  return (
    <div className="app-shell bg-slate-50 dark:bg-slate-950">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="min-w-0">
        <Topbar activePage={activePage} onNavigate={onNavigate} />
        <div className="content-pad p-6">{children}</div>
      </main>
    </div>
  );
}
