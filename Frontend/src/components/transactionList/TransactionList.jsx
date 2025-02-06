import React from "react";
import "./TransactionList.scss";

function TransactionList({earningData}) {
  // console.log(earningData);
  
  return (
    <div className="transactionList">
      <div className="customer">
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt=""
        />
        <div className="info">
          <div>{earningData.first_name} {earningData.last_name}</div>
          <div>{earningData.email}</div>
        </div>
      </div>
      <div className="item">
        <img src={earningData.product_image} alt="" />
        <span>{earningData.product_name}</span>
      </div>
      <div className="price">
        <span>{earningData.price} $ / kg</span>
      </div>
      <div className="totalAmount">
        <span>{earningData.quantity} kg</span>
      </div>
      <div className="totalEarning">
        <span>{earningData.earning} $</span>
      </div>
      <div className="status">
        <span>{earningData.order_status}</span>
      </div>
    </div>
  );
}

export default TransactionList;
