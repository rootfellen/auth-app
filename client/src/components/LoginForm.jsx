import React, { useState } from "react";
import useStore from "../store";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, registration } = useStore();

  return (
    <div>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="text"
        placeholder="email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="password"
      />
      <button onClick={() => login(email, password)}>Login</button>
      <button onClick={() => registration(email, password)}>
        Registration
      </button>
    </div>
  );
};

export default LoginForm;
