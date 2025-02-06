import "./cart.scss";
import { Link, useNavigate } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import Product from "../../components/product/Product";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Cart() {
  const cart = useSelector((state) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const navigate = useNavigate();

  const KEY = import.meta.env.VITE_REACT_APP_STRIPE;

  console.log(KEY);
  

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await axios.post("http://localhost:3000/api/checkout/payment", {
          tokenId: stripeToken.id,
          amount: cart.total,
          customerName: stripeToken.card.name,
          shippingCountry: stripeToken.card.address_country,
          shippingAddress: stripeToken.card.address_line1,  // Adjust this if shipping address is handled differently
          shippingCity: stripeToken.card.address_city,      // Include additional fields for shipping/billing
          shippingZip: stripeToken.card.address_zip,
          products: cart.products,
        });

        navigate("/success", {
          stripeData: res.data,
          products: cart,
        });
      } catch (error) {
        console.error("Payment failed", error);
      }
    };

    stripeToken && makeRequest();
  }, [stripeToken, cart, navigate]);

  // console.log(cart);
  

  return (
    <div className="cart">
      <h1>YOUR BASKET</h1>
      <div className="top">
        <Link to="/products">
          <button className="topButton">Continue Shopping</button>
        </Link>
      </div>
      <div className="bottom">
        <div className="info">
          <div className="title">
            <h3 className="prod">Product</h3>
            <h3>Quantity</h3>
            <h3>Price</h3>
            <h3>Total</h3>
          </div>
          <hr />
          {cart.products.map((product) => (
            <div key={product.id}>
              <Product productData={product}/>
              <hr />
            </div>
          ))}
        </div>
        <div className="summary">
          <h1>Order Summary</h1>
          <div className="summaryItem">
            <span>Subtotal</span>
            <span>$ {cart.total}</span>
          </div>
          <div className="summaryItem">
            <span>Estimated Shipping</span>
            <span>$ 5.90</span>
          </div>
          <div className="summaryItem">
            <span>Shipping Discount</span>
            <span>$ -5.90</span>
          </div>
          <div className="summaryItem">
            <span>Total</span>
            <span>$ {cart.total}</span>
          </div>
          <StripeCheckout
            name="AgriTrack"
            image="/logo.png"
            billingAddress
            shippingAddress
            description={`Your total is $ ${cart.total}`}
            amount={cart.total * 100}
            token={onToken}
            stripeKey={KEY}
          >
            <button>CHECKOUT NOW</button>
          </StripeCheckout>
        </div>
      </div>
    </div>
  );
}

export default Cart;
