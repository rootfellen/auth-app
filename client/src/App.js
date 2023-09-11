import React, { useEffect, useState } from "react";
import useStore from "./store";
import LoginForm from "./components/LoginForm";
import UserService from "./services/UserService";

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
      <div>
        <LoginForm />
        <button onClick={getUsers}>Get all users</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{isAuth ? `User is authorized ${user.email}` : "Log in"}</h1>
      <h1 style={user.isActivated ? { color: "green" } : { color: "red" }}>
        {user.isActivated
          ? "Account is activated"
          : "Please activate your account"}
      </h1>
      <button onClick={logout}>Logout</button>
      <div>
        <button onClick={getUsers}>Get users</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
}

export default App;
