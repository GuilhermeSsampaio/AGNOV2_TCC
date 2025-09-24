import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // IA pode alterar aqui conforme necessário
});

export default api;