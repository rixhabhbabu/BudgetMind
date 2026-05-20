import { useMemo, useState } from "react";
import { transactions } from "../data/mockData.js";

export function useExpenseQuery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("date");

  const expenses = useMemo(() => {
    return transactions
      .filter((item) => category === "All" || item.category === category)
      .filter((item) => `${item.merchant} ${item.category}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => sort === "amount" ? b.amount - a.amount : b.date.localeCompare(a.date));
  }, [category, query, sort]);

  return { expenses, query, setQuery, category, setCategory, sort, setSort };
}
