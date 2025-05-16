import { stockAPI } from "@/apis";

export async function getStockAPI(stockId) {
  try {
    const response = await stockAPI.get(`/${stockId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getStockChartAPI(stockId, type) {
  try {
    const response = await stockAPI.get(`/charts/${stockId}?type=${type}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getSearchAPI(searchKeyword) {
  try {
    const response = await stockAPI.get(`/search?keyword=${searchKeyword}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
