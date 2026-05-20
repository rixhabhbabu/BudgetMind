import { LogOut, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ThemeToggle } from "../ui/ThemeToggle.jsx";
import { Button } from "../ui/Button.jsx";

export function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
        <h1 className="text-xl font-bold">{user?.name ?? "Founder"}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-500 md:flex dark:border-slate-700">
          <Search size={16} />
          Search finance data
        </div>
        <ThemeToggle />
        <Button variant="ghost" onClick={logout} aria-label="Logout">
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
}
