import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Rectangle,
  ResponsiveContainer,
} from "recharts";

function BarChartComponent() {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const months = [
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
  ];

  const [dataa, setDataa] = useState([]); // Use state for the data

  useEffect(() => {
    const getEarningProgress = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/dashboard/bar-chart/1"
        );
        setDataa(res.data);
        // console.log(dataa);
      } catch (err) {
        console.log(err);
      }
    };

    getEarningProgress();
  }, []);

  // Generate full months data with defaults for missing months
const year = "2024"; // Use the fixed year from the input
const monthsWithData = months.map((month, index) => {
    // Construct yearMonth format (e.g., "2024-01", "2024-02", ...)
    const monthNumber = String(index + 1).padStart(2, "0");
    const yearMonth = `${year}-${monthNumber}`;
    
    // Check if data exists for the current yearMonth
    const existingData = dataa.find(data => data.yearMonth === yearMonth);
    
    // Return either the existing data or default values
    return {
        month,
        yearMonth,
        earnings_count: existingData ? existingData.earnings_count : 0,
        total_contribution: existingData ? +existingData.total_contribution : +"0",
        total_earning: existingData ? +existingData.total_earning : +"0.00",
    };
});

  // console.log(monthsWithData);
  

  return (
    <ResponsiveContainer width={450} height={300}>
      <BarChart
        data={monthsWithData}
        margin={{
          top: 15,
          right: 5,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          // tickFormatter={(tick, index) => months[index]}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="total_earning"
          fill="#8884d8"
          activeBar={<Rectangle fill="#FFBB28" stroke="gold" />}
        />
        {/* <Bar
          dataKey="uv"
          fill="#82ca9d"
          activeBar={<Rectangle fill="#0088FE" stroke="blue" />}
        /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BarChartComponent;
