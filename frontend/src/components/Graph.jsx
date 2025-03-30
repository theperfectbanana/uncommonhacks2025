import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "@fontsource/ibm-plex-mono";

Chart.register(...registerables);

const Graph = ({ data }) => {
  return (
    <Line
      data={{
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            // label: "Returns",
            data: data,
            fill: false,
            backgroundColor: "white",
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Investment Returns",
            color: "white",
            font: {
              family: "IBM Plex Mono",
              size: "20px",
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            ticks: {
              color: "white", // X-axis labels color
              font: {
                family: "IBM Plex Mono",
                size: 14,
              },
            },
            grid: {
              color: "#ffffff33", // X-axis grid lines (optional transparency)
            },
          },
          y: {
            ticks: {
              color: "white", // Y-axis labels color
              font: {
                family: "IBM Plex Mono",
                size: 14,
              },
              padding: 10,
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
            grid: {
              color: "#ffffff33", // Y-axis grid lines (optional transparency)
            },
            min: 0
          },
        },
      }}
      plugins={[
        {
          id: "customCanvasBackgroundColor",
          beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext("2d");
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "rgb(35,20,60)"; // Purple background
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          },
        },
      ]}
    />
  );
};

export default Graph;
