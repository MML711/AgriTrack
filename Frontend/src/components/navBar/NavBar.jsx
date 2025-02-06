import "./navbar.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@material-ui/core";
import { ShoppingCartOutlined } from "@material-ui/icons";
import { useSelector } from "react-redux";

function Navbar() {

  const quantity = useSelector((state) => state.cart.quantity);
const currentUser = true;

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>AgriTrack</span>
        </Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Products</Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={"/noavatar.jpg"}
              alt=""
            />
            <span>{"John Doe"}</span>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        <Link to="/cart">
          <div className="menuIcon">
              <Badge badgeContent={quantity} color="primary">
                <ShoppingCartOutlined />
              </Badge>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
