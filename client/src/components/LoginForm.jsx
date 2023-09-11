import React, { useState } from "react";
import useStore from "../store";
import "./style.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, registration } = useStore();

  return (
    <div className="login_form">
      <div className="login_form_inputs">
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="text"
          placeholder="email"
          className="login_form_input"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="password"
          className="login_form_input"
        />
      </div>
      <div className="login_form_buttons">
        <button className="btn" onClick={() => login(email, password)}>
          Login
        </button>
        <button className="btn" onClick={() => registration(email, password)}>
          Registration
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
