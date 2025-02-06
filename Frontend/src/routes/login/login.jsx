import React from "react";
import "./login.scss";

function Login() {
  return (
    <main className="login">
      <div className="main-content">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <div className="bg-gradient-dark">
                <h2>Welcome Back</h2>
                <h4>Login</h4>
              </div>
            </div>
            <div className="formContainer">
              <form>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Sign in</button>
                <p>
                  Don't have an account?{" "}
                  <a href="../pages/sign-up.html">Sign up</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
