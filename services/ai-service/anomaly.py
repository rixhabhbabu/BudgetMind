import numpy as np
from scipy import stats


def detect_unusual_transactions(expenses):
    """Detect anomalous transactions using statistical methods."""
    if not expenses:
        return []
    
    amounts = [expense.get("amount", 0) for expense in expenses]
    
    if len(amounts) < 3:
        # Not enough data for anomaly detection
        return []
    
    # Method 1: Z-score based detection (standard deviation)
    mean = np.mean(amounts)
    std = np.std(amounts)
    
    anomalies_zscore = []
    if std > 0:
        z_scores = np.abs((np.array(amounts) - mean) / std)
        for i, (expense, z_score) in enumerate(zip(expenses, z_scores)):
            if z_score > 2.5:  # More than 2.5 standard deviations
                anomalies_zscore.append({
                    "expense": expense,
                    "anomalyType": "statistical_outlier",
                    "reason": f"Amount ₹{expense['amount']} is {z_score:.1f}σ away from average",
                    "severityScore": min(100, int(z_score * 30))
                })
    
    # Method 2: IQR (Interquartile Range) based detection
    q1 = np.percentile(amounts, 25)
    q3 = np.percentile(amounts, 75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    
    anomalies_iqr = []
    for expense in expenses:
        amount = expense.get("amount", 0)
        if amount > upper_bound or amount < lower_bound:
            if expense not in [a.get("expense") for a in anomalies_zscore]:
                anomalies_iqr.append({
                    "expense": expense,
                    "anomalyType": "outlier_iqr",
                    "reason": f"Amount ₹{amount} is outside normal range [₹{lower_bound:.0f}, ₹{upper_bound:.0f}]",
                    "severityScore": 70 if amount > upper_bound else 50
                })
    
    # Combine and deduplicate
    all_anomalies = anomalies_zscore + anomalies_iqr
    
    # Remove duplicates
    seen = set()
    unique_anomalies = []
    for anomaly in all_anomalies:
        key = (
            anomaly["expense"].get("category"),
            anomaly["expense"].get("amount")
        )
        if key not in seen:
            seen.add(key)
            unique_anomalies.append(anomaly)
    
    return sorted(unique_anomalies, key=lambda x: x["severityScore"], reverse=True)
