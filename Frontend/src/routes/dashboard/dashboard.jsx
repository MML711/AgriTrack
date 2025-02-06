import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import LineChartComponent from "../../components/lineChart/LineChartComponent";
import BarChartComponent from "../../components/barChart/BarChartComponent";
import PieChartComponent from "../../components/pieChart/PieChartComponent";
import TransactionList from "../../components/transactionList/TransactionList";
import axios from "axios";

function Dashboard() {
  const orders = [
    { icon: "🔔", text: "$2400, Design changes", date: "22 DEC 7:20 PM" },
    { icon: "🔧", text: "New order #1832412", date: "21 DEC 11 PM" },
    { icon: "🛒", text: "Server payments for April", date: "21 DEC 9:34 PM" },
    {
      icon: "💳",
      text: "New card added for order #4395133",
      date: "20 DEC 2:20 AM",
    },
    {
      icon: "🔓",
      text: "Unlock packages for development",
      date: "18 DEC 4:54 AM",
    },
    { icon: "📷", text: "New order #9583120", date: "17 DEC" },
  ];

  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const getEarningsAndTransaction = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/1");
        setEarnings(res.data);
        console.log(earnings);
      } catch (err) {
        console.log(err);
      }
    };

    getEarningsAndTransaction();
  }, []);

  return (
    <div className="dashboard">
      <div className="rowGraph">
        <div className="graph">
          <h3>Crop Progress</h3>
          <LineChartComponent />
        </div>
        <div className="graph">
          <h3>Earnings</h3>
          <BarChartComponent />
        </div>
        <div className="graph">
          <h3>Stocks</h3>
          <PieChartComponent />
        </div>
      </div>
      <div className="rowTransaction">
        <div className="transaction">
          <h3 className="title">Transactions overview</h3>
          <div className="table">
            <div className="head">
              <h4 className="custInfo">Customer Info</h4>
              <h4 className="prod">Product</h4>
              <h4 className="price">Price</h4>
              <h4 className="amount">Amount</h4>
              <h4 className="earning">Earning</h4>
              <h4 className="status">Status</h4>
            </div>
            <hr />
            <div className="body">
              {earnings.map((e) => (
                <>
                  <TransactionList key={e.earning_id} earningData={e} />
                  <hr />
                </>
              ))}
            </div>
          </div>
        </div>
        <div className="orders-overview">
          <h3 className="title">Orders overview</h3>
          <p className="subtitle">📈 24% this month</p>
          <ul className="timeline">
            {orders.map((order, index) => (
              <li key={index} className="timeline-item">
                <span className="icon">{order.icon}</span>
                <div className="content">
                  <p className="text">{order.text}</p>
                  <p className="date">{order.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
