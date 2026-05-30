import { useMemo, useState } from "react";
import { Mail, MessageSquareText, ShieldCheck, WalletCards } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ThemeToggle } from "../components/ui/ThemeToggle.jsx";
import { GoogleLoginButton } from "../components/common/GoogleLoginButton.jsx";

const initialForm = { name: "", email: "", password: "" };

export function AuthPage() {
  const { login, register, verifySignupOtp, resendSignupOtp, googleLogin } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [emailOtp, setEmailOtp] = useState("");
  const [pendingOtp, setPendingOtp] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const identifier = useMemo(() => form.email, [form.email]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setNotice("");
    setPendingOtp(null);
    setEmailOtp("");
  }

  function otpNotice(response) {
    if (response.devOtp) return `Demo email OTP: ${response.devOtp}`;
    return response.message;
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const payload = mode === "login" ? { identifier, password: form.password } : form;
      const response = await (mode === "login" ? login(payload) : register(payload));
      if (response?.requiresOtp) {
        setPendingOtp(response);
        setNotice(otpNotice(response));
      }
    } catch (err) {
      if (err.response?.data?.requiresOtp) {
        setPendingOtp(err.response.data);
        setNotice(otpNotice(err.response.data));
        return;
      }
      setError(err.response?.data?.message ?? "Unable to continue. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifySignupOtp({ identifier, emailOtp });
    } catch (err) {
      setError(err.response?.data?.message ?? "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const response = await resendSignupOtp({ identifier });
      setPendingOtp(response);
      setNotice(otpNotice(response));
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function continueWithGoogle() {
    setError("");
    setLoading(true);
    try {
      const email = form.email || "demo.google@budgetmind.dev";
      await googleLogin({ name: form.name || "Google User", email, mobile: form.mobile, googleId: `demo-${email}` });
    } catch (err) {
      setError(err.response?.data?.message ?? "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh bg-slate-50 px-4 py-4 pt-20 dark:bg-slate-950 md:grid md:place-items-center md:pt-4">
      <div className="fixed right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <section className="surface mx-auto grid w-full max-w-sm grid-cols-1 overflow-hidden rounded-lg shadow-panel md:max-w-5xl md:grid-cols-[1fr_0.86fr]">
        <div className="p-5 md:p-12">
          <div className="mb-5 flex items-center gap-3 md:mb-8">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-ocean text-white md:h-11 md:w-11"><WalletCards size={21} /></div>
            <strong className="text-xl md:text-2xl">BudgetMind</strong>
          </div>
          <h1 className="mb-3 text-3xl font-black leading-tight md:text-4xl">Secure finance dashboard</h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">Track expenses, budgets, goals, reports, and AI insights with a cleaner banking-style interface.</p>
        </div>

        <div className="border-t border-slate-200 p-5 dark:border-slate-800 md:border-l md:border-t-0 md:p-8">
          <div className="mb-5 flex rounded-md bg-slate-100 p-1 dark:bg-slate-900">
            {[
              ["login", "Sign in"],
              ["register", "Sign up"]
            ].map(([key, label]) => (
              <button key={key} type="button" onClick={() => switchMode(key)} className={`flex-1 rounded-md px-3 py-2 text-sm font-bold ${mode === key ? "bg-white shadow dark:bg-slate-800" : "text-slate-500"}`}>
                {label}
              </button>
            ))}
          </div>

          {pendingOtp ? (
            <form onSubmit={verifyOtp} className="grid gap-4">
              <div>
                <h2 className="text-xl font-black">Verify your account</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Enter the OTP sent to your email to activate signup.</p>
              </div>
              <Input label="Email OTP" inputMode="numeric" maxLength={6} value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} />
              {notice && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{notice}</p>}
              {error && <p className="text-sm text-coral">{error}</p>}
              <Button type="submit" disabled={loading || emailOtp.length < 6}>
                <ShieldCheck size={18} /> {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button type="button" variant="secondary" onClick={resendOtp} disabled={loading}>
                <MessageSquareText size={18} /> Resend OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              {mode === "register" && <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />}
              <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required={mode === "register"} />
              <Input label="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
              {notice && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{notice}</p>}
              {error && <p className="text-sm text-coral">{error}</p>}
              <Button type="submit" disabled={loading || !form.password || !identifier}>{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</Button>
              <div className="flex items-center gap-3 text-xs font-bold uppercase text-slate-400">
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /> or <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>
              <GoogleLoginButton />
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
