import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { expenses } from "@/data";
Chart.register(CategoryScale);

const Graphs = () => {
  return (
    <div className="w-full flex justify-center gap-3 m-3 ">
      <div className="w-[80%] flex justify-center">
        <Bar
          data={{
            labels: expenses.map((expense) => expense.category),
            datasets: [
              {
                label: "Revenue",
                data: expenses.map((expense) => expense.amount),
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Graphs;
