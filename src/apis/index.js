import axios from "axios";

const baseURL = "";

// 주식 API
export const stockAPI = axios.create({
  baseURL: `${baseURL}/api/stocks`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 네트워크 그래프
export const networkAPI = axios.create({
  baseURL: `${baseURL}/api/graph`,
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


// 뉴스 API
export const newsAPI = axios.create({
  baseURL: `${baseURL}/api/news`,
  headers: {
    "Content-Type": "application/json",
  },
});