import axios from "axios";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Sector, Tooltip } from "recharts";

function PieChartComponent() {
// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];

// "#855424", "#19c3ed", "#603046"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8fa8b8", "#4e634a", "#7b246d"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);  

  return (
    <text
      x={x}
      y={y}
      fill="white"
      // textAnchor={x > cx ? "start" : "end"}
      textAnchor="middle"
      dominantBaseline="central"
      // dominantBaseline="middle"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    
    return (
      <div
        style={{
          background: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <p>{`Name: ${payload[0].name}`}</p>
        <p>{`Crop Type: ${payload[0].payload.crop_type}`}</p>
        <p>{`Category: ${payload[0].payload.category}`}</p>
        <p>{`Price: $${payload[0].payload.price}`}</p>
        <p>{`Amount: ${payload[0].payload.amount} kg`}</p>
        <p>{payload[0].payload.info}</p>
      </div>
    );
  }

  return null;
};

const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
}) => {
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // Highlight with larger outer radius
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

  const [activeIndex, setActiveIndex] = useState(null);
  const [dataa, setDataa] = useState([]); // Use state for the data

  const onPieEnter = (_, index) => {
    setActiveIndex(index); // Set the currently hovered index
  };

  const onPieLeave = () => {
    setActiveIndex(null); // Reset the hover state when the mouse leaves
  };

  useEffect(() => {
    const getProductStock = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/pie-chart/1");
        setDataa(res.data);
        console.log(dataa);
        
      } catch (err) {
        console.log(err);
      }
    }

    getProductStock();
  }, [])

  // console.log("PieChartComponent");

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={dataa}
        cx={230}
        cy={150}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={125}
        fill="#8884d8"
        dataKey="amount"
        activeIndex={activeIndex} // Pass the active slice index
        activeShape={renderActiveShape} // Custom rendering for active slice
        onMouseEnter={onPieEnter} // Handle mouse enter event
        onMouseLeave={onPieLeave} // Handle mouse leave event
      >
        {dataa.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
}

export default PieChartComponent;
