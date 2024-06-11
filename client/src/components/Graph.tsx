import { categories, expenses, ExpenseInterface } from "@/data";
import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import dayjs from "dayjs";
import { Line, Bar } from "react-chartjs-2";
function getLineChartDates(expenses: ExpenseInterface[]) {
  // Extract unique dates from expenses
  const uniqueDatesSet = new Set(expenses.map((expense) => expense.date));
  const uniqueDates = Array.from(uniqueDatesSet);

  // Sort dates in ascending order
  uniqueDates.sort((a, b) => dayjs(a).diff(dayjs(b)));

  // Ensure at most 5 dates
  const slicedDates =
    uniqueDates.length > 5 ? uniqueDates.slice(0, 5) : uniqueDates;

  // Calculate gap between consecutive dates
  const gapBetweenDates = [];
  for (let i = 0; i < slicedDates.length - 1; i++) {
    const currentDate = dayjs(slicedDates[i]);
    const nextDate = dayjs(slicedDates[i + 1]);
    const gap = nextDate.diff(currentDate, "day"); // Gap in days
    gapBetweenDates.push(gap);
  }

  return { dates: slicedDates, gapBetweenDates };
}

console.log(getLineChartDates(expenses));

const Graph = () => {
  return <div>Bar</div>;
};

export default Graph;
