// components/ConductivityChart.tsx
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { SensorData } from "../utils/socketClient";

interface ConductivityChartProps {
   data: SensorData | null;
}

// Maximum number of data points to show in chart
const MAX_DATA_POINTS = 50;

const ConductivityChart: React.FC<ConductivityChartProps> = ({ data }) => {
   const [chartData, setChartData] = useState<{
      time: string[];
      conductivity: number[];
   }>({ time: [], conductivity: [] });

   useEffect(() => {
      if (data?.C !== undefined) {
         // Create a new timestamp
         const now = new Date();
         const timeStr = now.toLocaleTimeString();

         // Update chart data (add new point)
         setChartData((prevData) => {
            const newTimes = [...prevData.time, timeStr];
            const newConductivity = [...prevData.conductivity, data.C as number];

            // Limit the number of points
            if (newTimes.length > MAX_DATA_POINTS) {
               newTimes.shift();
               newConductivity.shift();
            }

            return {
               time: newTimes,
               conductivity: newConductivity,
            };
         });
      }
   }, [data]);

   return (
      <div className="chart" id="conductivityChart">
         <Plot
            data={[
               {
                  x: chartData.time,
                  y: chartData.conductivity,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "#2ecc71" },
                  name: "Conductividad",
               },
            ]}
            layout={{
               title: { text: "Conductividad en Tiempo Real" },
               autosize: true,
               margin: { l: 60, r: 20, t: 50, b: 80 },
               xaxis: {
                  title: { text: "Tiempo" },
                  showgrid: true,
               },
               yaxis: {
                  title: { 
                     text: "Conductividad (μS/cm)",
                     font: { color: "#2ecc71" } 
                  },
                  tickfont: { color: "#2ecc71" },
                  range: [0, 1500],
               },
            }}
            style={{ width: "100%", height: "100%" }}
            config={{ responsive: true }}
         />
      </div>
   );
};

export default ConductivityChart;
