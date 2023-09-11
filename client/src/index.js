import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import useStore from "./store";

const store = useStore;

export const StoreContext = createContext(null);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreContext.Provider value={{ store }}>
      <App />
    </StoreContext.Provider>
  </React.StrictMode>
);
