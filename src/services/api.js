import axios from "axios";

const api = axios.create({
  baseURL: "http://134.209.64.29:3000/api/assets/",
});

export default api;
