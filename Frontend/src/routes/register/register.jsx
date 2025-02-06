import React from "react";
import "./register.scss";

function Register() {
  return (
    <div className="register">
      <div className="container">
        <div className="card">
            <div className="card-header">
              <div className="bg-gradient-dark">
                <h2>Register</h2>
                <h4>Enter your name, email and password to register</h4>
              </div>
            </div>
            <div className="formContainer">
              <form>
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Sign up</button>
                <p>
                  Do you have an account?{" "}
                  <a href="../login">Sign in</a>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="imgContainer">
            <img src="/landscape.jpg" alt="" />
        </div>
        </div>
  )
}

export default Register;