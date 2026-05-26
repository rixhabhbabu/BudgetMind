import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, TrendingUp, Target, Zap, X } from "lucide-react";
import { getSocket, onNotification, offNotification } from "../../services/socketService.js";

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    function handleNotification(data) {
      const id = Date.now();
      const notification = { ...data, id };
      
      setNotifications((prev) => [notification, ...prev].slice(0, 10));
      
      // Auto-remove after 6 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 6000);
    }

    onNotification(handleNotification);

    return () => {
      offNotification(handleNotification);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notif) => (
        <NotificationItem key={notif.id} notification={notif} />
      ))}
    </div>
  );
}

function NotificationItem({ notification }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const { type, data } = notification;

  // Determine icon and colors based on type
  let icon, bgColor, textColor, borderColor;

  switch (type) {
    case "expense_added":
      icon = <CheckCircle2 size={20} />;
      bgColor = "bg-blue-50 dark:bg-blue-950";
      textColor = "text-blue-700 dark:text-blue-200";
      borderColor = "border-blue-200 dark:border-blue-800";
      break;

    case "budget_alert":
      if (data.severity === "critical") {
        icon = <AlertCircle size={20} className="text-red-500" />;
        bgColor = "bg-red-50 dark:bg-red-950";
        textColor = "text-red-700 dark:text-red-200";
        borderColor = "border-red-200 dark:border-red-800";
      } else if (data.severity === "warning") {
        icon = <TrendingUp size={20} className="text-yellow-500" />;
        bgColor = "bg-yellow-50 dark:bg-yellow-950";
        textColor = "text-yellow-700 dark:text-yellow-200";
        borderColor = "border-yellow-200 dark:border-yellow-800";
      } else {
        icon = <Zap size={20} className="text-blue-500" />;
        bgColor = "bg-blue-50 dark:bg-blue-950";
        textColor = "text-blue-700 dark:text-blue-200";
        borderColor = "border-blue-200 dark:border-blue-800";
      }
      break;

    case "category_alert":
      icon = <AlertCircle size={20} />;
      bgColor = "bg-orange-50 dark:bg-orange-950";
      textColor = "text-orange-700 dark:text-orange-200";
      borderColor = "border-orange-200 dark:border-orange-800";
      break;

    case "goal_update":
      icon = <Target size={20} />;
      bgColor = "bg-green-50 dark:bg-green-950";
      textColor = "text-green-700 dark:text-green-200";
      borderColor = "border-green-200 dark:border-green-800";
      break;

    case "ai_insight":
      icon = <Zap size={20} />;
      bgColor = "bg-purple-50 dark:bg-purple-950";
      textColor = "text-purple-700 dark:text-purple-200";
      borderColor = "border-purple-200 dark:border-purple-800";
      break;

    default:
      icon = <CheckCircle2 size={20} />;
      bgColor = "bg-slate-50 dark:bg-slate-950";
      textColor = "text-slate-700 dark:text-slate-200";
      borderColor = "border-slate-200 dark:border-slate-800";
  }

  return (
    <div
      className={`${bgColor} ${borderColor} ${textColor} border rounded-lg p-3 shadow-lg animate-in slide-in-from-right-full duration-300 flex gap-3 items-start`}
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      
      <div className="flex-1 min-w-0">
        {type === "expense_added" && (
          <div className="text-sm">
            <p className="font-semibold">{data.merchant}</p>
            <p className="text-xs opacity-75">
              {data.category} via {data.method} • ₹{data.amount}
            </p>
          </div>
        )}

        {type === "budget_alert" && (
          <div className="text-sm">
            <p className="font-semibold">{data.message}</p>
            <p className="text-xs opacity-75">
              ₹{data.spent.toFixed(0)} / ₹{data.budget.toFixed(0)}
            </p>
          </div>
        )}

        {type === "category_alert" && (
          <div className="text-sm">
            <p className="font-semibold">{data.category}</p>
            <p className="text-xs opacity-75">₹{data.amount.toFixed(2)}</p>
          </div>
        )}

        {type === "goal_update" && (
          <div className="text-sm">
            <p className="font-semibold">{data.goalName}</p>
            <p className="text-xs opacity-75">
              {data.percentage}% complete • ₹{data.current} / ₹{data.target}
            </p>
          </div>
        )}

        {type === "ai_insight" && (
          <div className="text-sm">
            <p className="font-semibold">💡 {data.insight}</p>
            {data.recommendation && (
              <p className="text-xs opacity-75 mt-1">{data.recommendation}</p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 hover:opacity-70"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
