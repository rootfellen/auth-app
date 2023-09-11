import { create } from "zustand";
import AuthService from "../services/AuthService";
import axios from "axios";
import { API_URL } from "../http";

const useStore = create((set) => ({
  user: {},
  isAuth: false,
  isLoading: false,

  setAuth: (bool) => set({ isAuth: bool }),
  setUser: (user) => set({ user }),
  setLoading: (bool) => set({ isLoading: bool }),

  login: async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem("token", response.data.accessToken);
      set({ isAuth: true, user: response.data.user });
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  },

  registration: async (email, password) => {
    try {
      const response = await AuthService.registration(email, password);
      localStorage.setItem("token", response.data.accessToken);
      set({ isAuth: true, user: response.data.user });
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  },

  logout: async () => {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem("token");
      set({ isAuth: false, user: {} });
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
      });
      console.log(response);
      localStorage.setItem("token", response.data.accessToken);
      set({ isAuth: true, user: response.data.user });
    } catch (e) {
      console.log(e.response?.data?.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useStore;
