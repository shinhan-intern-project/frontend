import { stockAPI } from "@/apis";

export async function getStockAPI(stockId) {
  try {
    const response = await stockAPI.get(`/${stockId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
