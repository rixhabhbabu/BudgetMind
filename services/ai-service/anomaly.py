def detect_unusual_transactions(expenses):
    if not expenses:
        return []
    amounts = [expense["amount"] for expense in expenses]
    average = sum(amounts) / len(amounts)
    return [expense for expense in expenses if expense["amount"] > average * 1.8]
