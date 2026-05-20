import { useState } from "react";
import { WalletCards } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "Ritesh", email: "demo@budgetmind.dev", password: "budget123" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await (mode === "login" ? login(form) : register(form));
    } catch {
      setError("Demo API is offline. Using local showcase account.");
      localStorage.setItem("budgetmind_user", JSON.stringify({ name: form.name, email: form.email }));
      window.location.reload();
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950">
      <section className="surface grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-lg shadow-panel md:grid-cols-[1fr_0.8fr]">
        <div className="p-8 md:p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-ocean text-white"><WalletCards /></div>
            <strong className="text-2xl">BudgetMind</strong>
          </div>
          <h1 className="mb-3 text-4xl font-black leading-tight">AI finance command center</h1>
          <p className="max-w-xl text-slate-600 dark:text-slate-300">Track spending, scan bills, decode UPI messages, and turn messy transactions into practical financial decisions.</p>
        </div>
        <form onSubmit={submit} className="grid gap-4 border-l border-slate-200 p-8 dark:border-slate-800">
          <div className="flex rounded-md bg-slate-100 p-1 dark:bg-slate-900">
            {["login", "register"].map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)} className={`flex-1 rounded-md px-3 py-2 text-sm font-bold capitalize ${mode === item ? "bg-white shadow dark:bg-slate-800" : "text-slate-500"}`}>{item}</button>
            ))}
          </div>
          {mode === "register" && <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="text-sm text-coral">{error}</p>}
          <Button type="submit">{mode === "login" ? "Login" : "Create account"}</Button>
        </form>
      </section>
    </main>
  );
}
