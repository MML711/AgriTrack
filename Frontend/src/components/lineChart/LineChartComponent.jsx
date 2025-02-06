import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function LineChartComponent() {
  // const data = [
  //   {
  //     name: "Page A",
  //     uv: 4000,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     name: "Page B",
  //     uv: 3000,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     name: "Page C",
  //     uv: 2000,
  //     pv: 9800,
  //     amt: 2290,
  //   },
  //   {
  //     name: "Page D",
  //     uv: 2780,
  //     pv: 3908,
  //     amt: 2000,
  //   },
  //   {
  //     name: "Page E",
  //     uv: 1890,
  //     pv: 4800,
  //     amt: 2181,
  //   },
  //   {
  //     name: "Page F",
  //     uv: 2390,
  //     pv: 3800,
  //     amt: 2500,
  //   },
  //   {
  //     name: "Page G",
  //     uv: 3490,
  //     pv: 4300,
  //     amt: 2100,
  //   },
  // ];

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
    const getProductProgress = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/line-chart/1");
        setDataa(res.data);
        // console.log(dataa);
        
      } catch (err) {
        console.log(err);
      }
    }

    getProductProgress();
  }, [])

  // List of all crop types
const allCropTypes = ["Food Crop", "Feed Crop", "Cash Crop", "Medicinal Crop", "Ornamental Crop"];

const year = "2024"; // Fixed year for yearMonth formatting

// Step 1: Include all months with default values if missing
const monthsWithData = months.map((month, index) => {
    const monthNumber = String(index + 1).padStart(2, "0");
    const yearMonth = `${year}-${monthNumber}`;

    // Find existing data for the month or create default
    const existingData = dataa.find(data => data.yearMonth === yearMonth);

    return {
        month,
        yearMonth,
        data: existingData ? existingData.data : []
    };
});

// Step 2: Add missing crop types to each month's data
monthsWithData.forEach(monthData => {
    allCropTypes.forEach(cropType => {
        // Check if the crop type already exists in the month's data array
        if (!monthData.data.some(data => data.crop_type === cropType)) {
            // Add missing crop type with default values
            monthData.data.push({
                crop_type: cropType,
                earnings_count: 0,
                total_contribution: +"0",
                total_earning: +"0.00"
            });
        }
    });
    
  // Sort the data by the order defined in allCropTypes
  monthData.data.sort((a, b) => allCropTypes.indexOf(a.crop_type) - allCropTypes.indexOf(b.crop_type));
});

console.log(monthsWithData);


  return (
    <ResponsiveContainer width={450} height={300}>
      <LineChart 
        data={monthsWithData}
         margin={{
          top: 15,
          right: 5,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" 
          interval={0} 
          padding={{ left: 0, right: 8 }} 
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="data[0].total_earning"
          name="Food Crops"
          stroke="#82ca9d"
          // activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="data[1].total_earning" name="Feed Crops" stroke="#7b246d" />
        <Line type="monotone" dataKey="data[2].total_earning" name="Cash Crops" stroke="#8884d8" />
        <Line type="monotone" dataKey="data[3].total_earning" name="Medicinal Crops" stroke="#FFBB28" />
        <Line type="monotone" dataKey="data[4].total_earning" name="Ornamental Crops" stroke="#C30010" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;
