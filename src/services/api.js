import axios from "axios";

//  Base API URL 
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

//  Axios Instance 
const instance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Token Handlers 
const setToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const clearToken = () => {
  delete instance.defaults.headers.common["Authorization"];
};

//  Auth APIs 
const login = async (email, password) => {
  const response = await instance.post("/auth/login", { email, password });
  return response.data;
};

// REGISTER USER
const register = async (name, email, password,role) => {
  const response = await instance.post("/auth/register", {
    name,
    email,
    password,
    role
  });
  return response.data;
};

//  Fetch All Users 
const getUsers = async () => {
  const response = await instance.get("/users");
  const users = response.data || [];
  return users.filter((user) => user.role !== "Admin");
};



//  CRUD Helpers 
const get = (url, config) => instance.get(url, config).then((r) => r.data);
const post = (url, data, config) =>
  instance.post(url, data, config).then((r) => r.data);
const put = (url, data, config) =>
  instance.put(url, data, config).then((r) => r.data);
const remove = (url, config) =>
  instance.delete(url, config).then((r) => r.data);

//  Exported API Object 
const api = {
  instance,
  setToken,
  clearToken,
  login,
  register,
  get,
  post,
  put,
  delete: remove,
  getUsers,
};

export default api;
