import React from "react";
import "./product.scss";
import { DeleteOutlineOutlined } from "@material-ui/icons";
import { removeProduct } from "../../redux/cartRedux";
import { useDispatch } from "react-redux";

function Product({productData}) {
  const dispatch = useDispatch();

  const handleClick = () => {
        dispatch(removeProduct({ id: productData.id }));
      };
      
  return (
    <div className="product">
      <div className="productDetail">
        <img src={productData.pic} alt="" />
        <div className="details">
          <span>
            {productData.name}
          </span>
          <span>
          <b>Category: </b>{productData.category}
          </span>
          <span>
            {productData.title}
          </span>
        </div>
      </div>
      <div className="productQuantity">
        <h3>{productData.quantity} kg</h3>
      </div>
      <div className="productPrice">
        <h3>$ {productData.price}</h3>
      </div>
      <div className="priceDetail">
        <div className="productAmountContainer">
          <div className="productAmount">{productData.quantity} kg &times; ${productData.price}</div>
        </div>
        <div className="productTotalPrice">$ {productData.quantity * productData.price}</div>
        <div className="remove" onClick={handleClick}>
          <DeleteOutlineOutlined />
          <div className="sp">
            <span>Remove</span>
            <span>Product</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
