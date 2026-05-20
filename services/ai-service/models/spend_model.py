import numpy as np
from sklearn.linear_model import LinearRegression


def forecast_spending(values):
    if not values:
        values = [28000, 32000, 30000, 36000]
    x = np.arange(len(values)).reshape(-1, 1)
    y = np.array(values)
    model = LinearRegression().fit(x, y)
    next_index = np.array([[len(values)]])
    return round(float(model.predict(next_index)[0]), 2)
