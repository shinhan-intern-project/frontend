import { newsAPI } from "@/apis";

export async function getStockSentimentAPI(stockId) {
  try {
    const response = await newsAPI.get(`/stock/${stockId}/sentiment`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


export async function getProductSentimentAPI(stockId) {
  try {
    const response = await newsAPI.get(`/product/${stockId}/sentiment`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
