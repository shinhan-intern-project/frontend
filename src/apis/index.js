import axios from "axios";

const baseURL = "";

// 주식 API
export const stockAPI = axios.create({
  baseURL: `${baseURL}/api/stocks`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 품목 API
export const productAPI = axios.create({
  baseURL: `${baseURL}/api/products`,
  headers: {
    "Content-Type": "application/json",
  },
});
