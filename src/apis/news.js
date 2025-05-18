// src/apis/news.js
import { newsAPI } from "@/apis"; // 여기서 undefined가 되면 오류 발생


// 종목 관련 뉴스 조회
export async function getStockRelatedNewsAPI(stockId) {
    try {
      const response = await newsAPI.get(`/stock/${stockId}`);
      return response.data;
    } catch (error) {
      console.error("종목 관련 뉴스 API 호출 실패:", error);
    }
  }
  
  // 품목 관련 뉴스 조회
  export async function getProductRelatedNewsAPI(productId) {
    try {
      const response = await newsAPI.get(`/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("품목 관련 뉴스 API 호출 실패:", error);
    }
  }