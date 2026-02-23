import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Attendance %",
      data: [92, 88, 95, 90, 93, 97],
      backgroundColor: "rgba(34,211,238,0.7)",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Attendance Analytics" },
  },
  scales: {
    y: { beginAtZero: true, max: 100 },
  },
};

function AnalyticsChart() {
  return (
    <div className="bg-white/10 border border-white/20 rounded-lg p-6 mt-8">
      <Bar data={data} options={options} />
    </div>
  );
}

export default AnalyticsChart;
