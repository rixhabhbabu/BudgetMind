import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card.jsx";
import { fetchAuditLogs, fetchNotifications } from "../services/api.js";

function formatDate(value) {
  return value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
}

export function Activity() {
  const [notifications, setNotifications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadActivity() {
      setLoading(true);
      setError("");
      try {
        const [notificationData, logData] = await Promise.all([fetchNotifications(), fetchAuditLogs()]);
        if (!active) return;
        setNotifications(notificationData);
        setLogs(logData);
      } catch (err) {
        if (active) setError(err.response?.data?.message ?? "Could not load activity.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadActivity();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-black">Activity</h2>
        <p className="text-slate-500">Operational timeline for account events and alerts.</p>
      </div>
      {loading && <p className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">Loading real activity...</p>}
      {error && <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
      <Card>
        <h3 className="mb-3 font-black">Notifications</h3>
        <div className="grid gap-3">
          {notifications.length ? notifications.map((item) => (
            <p key={item._id} className="rounded-md border border-slate-100 p-3 text-sm dark:border-slate-800">
              <strong className="mr-2 text-ocean">{item.title}</strong>{item.message}
              <span className="mt-1 block text-xs text-slate-500">{formatDate(item.createdAt)}</span>
            </p>
          )) : <p className="text-sm font-semibold text-slate-500">No notifications yet.</p>}
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-black">Audit log</h3>
        <div className="grid gap-3">
          {logs.length ? logs.map((log) => (
            <p key={log._id} className="rounded-md border border-slate-100 p-3 text-sm dark:border-slate-800">
              <strong className="mr-2 text-ocean">{log.action}</strong>{log.entity}
              <span className="mt-1 block text-xs text-slate-500">{formatDate(log.createdAt)}</span>
            </p>
          )) : <p className="text-sm font-semibold text-slate-500">No audit events recorded yet.</p>}
        </div>
      </Card>
    </div>
  );
}
