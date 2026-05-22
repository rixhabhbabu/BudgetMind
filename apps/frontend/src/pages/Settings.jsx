import { useEffect, useMemo, useState } from "react";
import { Camera, LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ThemeToggle } from "../components/ui/ThemeToggle.jsx";

const emptyProfile = {
  name: "",
  email: "",
  mobile: "",
  profilePicture: "",
  monthlyIncome: "",
  monthlyBudget: "",
  savingsTarget: ""
};

export function Settings() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initials = useMemo(() => (profile.name || user?.name || "U").slice(0, 1).toUpperCase(), [profile.name, user?.name]);

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name ?? "",
      email: user.email ?? "",
      mobile: user.mobile ?? "",
      profilePicture: user.profilePicture ?? "",
      monthlyIncome: user.monthlyIncome ?? "",
      monthlyBudget: user.monthlyBudget ?? "",
      savingsTarget: user.savingsTarget ?? 30
    });
  }, [user]);

  function update(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await updateProfile({
        ...profile,
        monthlyIncome: Number(profile.monthlyIncome || 0),
        monthlyBudget: Number(profile.monthlyBudget || 0),
        savingsTarget: Number(profile.savingsTarget || 0)
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await changePassword(passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not change password.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadProfilePicture(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setError("Cloudinary env missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
      return;
    }

    setMessage("");
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message ?? "Cloudinary upload failed");
      update("profilePicture", data.secure_url);
      setMessage("Profile picture uploaded. Save profile to keep it.");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  if (!user) {
    return (
      <Card>
        <h2 className="text-xl font-black">Sign in required</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Open Sign in to manage your profile, email, mobile number, password, and picture.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <Card>
        <div className="mb-5 flex items-center gap-3">
          <UserRound className="text-ocean" />
          <div>
            <h2 className="text-xl font-black">Profile settings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage account identity and financial preferences.</p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="grid gap-4">
          <div className="flex flex-col gap-4 rounded-md bg-slate-50 p-4 dark:bg-slate-900 sm:flex-row sm:items-center">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="" className="h-20 w-20 rounded-md object-cover" />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-md bg-ocean text-3xl font-black text-white">{initials}</div>
            )}
            <div className="min-w-0 flex-1">
              <Input label="Profile picture URL" value={profile.profilePicture} onChange={(e) => update("profilePicture", e.target.value)} placeholder="https://..." />
              <label className="mt-3 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-ink transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <Camera size={18} /> {uploading ? "Uploading..." : "Upload from device"}
                <input type="file" accept="image/*" className="hidden" onChange={uploadProfilePicture} disabled={uploading} />
              </label>
            </div>
            <Camera className="hidden text-slate-400 sm:block" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full name" value={profile.name} onChange={(e) => update("name", e.target.value)} required />
            <Input label="Email address" type="email" value={profile.email} onChange={(e) => update("email", e.target.value)} required />
            <Input label="Mobile number" type="tel" value={profile.mobile} onChange={(e) => update("mobile", e.target.value)} />
            <Input label="Monthly income" type="number" value={profile.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} />
            <Input label="Monthly budget" type="number" value={profile.monthlyBudget} onChange={(e) => update("monthlyBudget", e.target.value)} />
            <Input label="Savings target %" type="number" value={profile.savingsTarget} onChange={(e) => update("savingsTarget", e.target.value)} />
          </div>

          {message && <p className="rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{message}</p>}
          {error && <p className="text-sm font-semibold text-coral">{error}</p>}
          <Button type="submit" disabled={saving}><Save size={18} /> {saving ? "Saving..." : "Save profile"}</Button>
        </form>
      </Card>

      <div className="grid gap-5">
        <Card>
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="text-ocean" />
            <h2 className="text-xl font-black">Preferences</h2>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-900">
            <span className="font-semibold">Theme</span>
            <ThemeToggle />
          </div>
          <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-900">
            <span className="font-semibold">Role</span>
            <p className="mt-1 capitalize text-slate-500 dark:text-slate-300">{user.role ?? "user"}</p>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-3">
            <LockKeyhole className="text-ocean" />
            <h2 className="text-xl font-black">Change password</h2>
          </div>
          <form onSubmit={savePassword} className="grid gap-4">
            <Input label="Current password" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords((current) => ({ ...current, currentPassword: e.target.value }))} />
            <Input label="New password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords((current) => ({ ...current, newPassword: e.target.value }))} />
            <Button type="submit" disabled={saving || !passwords.currentPassword || passwords.newPassword.length < 8}>Update password</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
