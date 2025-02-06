import React from "react";
import "./item.scss";

function Item({itemData}) {
  return (
    <div className="itemInfo">
        <span>{itemData.name}</span>
        <img src={itemData.pic} alt="" />
        <div className="amount">
            <span>{itemData.price} $ / kg</span>
        </div>
        <button className="order">Order</button>
    </div>
  )
}

export default Item;