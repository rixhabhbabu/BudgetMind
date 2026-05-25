import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogIn, LogOut, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ThemeToggle } from "../ui/ThemeToggle.jsx";
import { Button } from "../ui/Button.jsx";
import { navItems } from "./Sidebar.jsx";

export function Topbar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const visibleItems = navItems.filter(([key]) => key !== "admin" || user?.role === "admin");
  const initial = (user?.name || user?.email || "U").slice(0, 1).toUpperCase();

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function goTo(page) {
    onNavigate(page);
    setMenuOpen(false);
  }

  return (
    <header className="app-topbar relative z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="topbar-copy min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400">{user ? "Welcome back" : "Explore BudgetMind"}</p>
        <h1 className="truncate text-xl font-bold">{user?.name ?? "Guest mode"}</h1>
        {user && !user.mobile && (
          <button type="button" onClick={() => onNavigate("settings")} className="mt-1 text-left text-sm font-semibold text-amber-600 dark:text-amber-300">
            Add mobile number to complete your profile
          </button>
        )}
      </div>
      <div className="topbar-actions flex shrink-0 items-center gap-2">
        <div className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-500 md:flex dark:border-slate-700">
          <Search size={16} />
          Search finance data
        </div>
        <div className="theme-action">
          <ThemeToggle />
        </div>
        {user ? (
          <Button variant="ghost" className="hidden md:inline-flex" onClick={logout} aria-label="Logout">
            <LogOut size={18} />
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => onNavigate("auth")}>
            <LogIn size={18} /> Sign in
          </Button>
        )}
        {user && (
          <div ref={menuRef} className="mobile-profile-menu relative md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="profile-menu-button flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-2 text-left shadow-sm dark:border-slate-700 dark:bg-slate-900"
              aria-expanded={menuOpen}
              aria-label="Open profile navigation"
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="" className="h-8 w-8 rounded-md object-cover" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-md bg-ocean text-sm font-black text-white">{initial}</span>
              )}
              <ChevronDown size={16} className={`text-slate-500 transition ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="mobile-nav-dropdown absolute right-0 mt-3 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-950">
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="truncate text-sm font-bold">{user.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
                <nav className="grid max-h-[65vh] gap-1 overflow-y-auto p-2">
                  {visibleItems.map(([key, Icon, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => goTo(key)}
                      className={`flex h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${activePage === key ? "bg-ocean text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex h-11 items-center gap-3 rounded-md px-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
