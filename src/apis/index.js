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
export const commodityAPI = axios.create({
  baseURL: `${baseURL}/commodity/api/commodities`,
  headers: {
    "Content-Type": "application/json",
  },
});
