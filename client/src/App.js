import React, { useEffect, useState } from "react";
import useStore from "./store";
import LoginForm from "./components/LoginForm";
import UserService from "./services/UserService";
import "./styles/main.css";

function App() {
  const { isAuth, isLoading, user, login, logout, checkAuth } = useStore();
  const [users, setUsers] = useState([]);

  const { initAuth } = useStore();

  console.log(isAuth, isLoading, user, login, logout);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <LoginForm />
        <button className="users_btn" onClick={getUsers}>
          Get all users
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: "#fff" }}>
        {isAuth ? `User is authorized ${user.email}` : "Log in"}
      </h1>
      <h1 style={user.isActivated ? { color: "aquamarine" } : { color: "red" }}>
        {user.isActivated
          ? "Account is activated"
          : "Please activate your account"}
      </h1>
      <button className="logout_btn" onClick={logout}>
        Logout
      </button>
      <div>
        <button
          className="users_btn"
          style={isAuth ? { marginTop: "1rem" } : {}}
          onClick={getUsers}
        >
          Get users
        </button>
      </div>
      {users.map((user) => (
        <div style={{ color: "#fff", marginTop: "1rem" }} key={user.email}>
          {user.email}
        </div>
      ))}
    </div>
  );
}

export default App;
