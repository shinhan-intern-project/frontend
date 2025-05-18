import { networkAPI, stockAPI } from "@/apis";

export async function getStockAPI(stockId) {
  try {
    const response = await stockAPI.get(`/${stockId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getStockChartAPI(
  stockId,
  type
  // selectedCountry
  // startDate,
  // endDate
) {
  try {
    // // 기본 URL (type 파라미터만)
    // let url = `/charts/${stockId}?type=${type}`;

    // // startDate/endDate가 둘 다 있을 때만 추가
    // if (startDate && endDate) {
    //   url += `&startDate=${startDate}&endDate=${endDate}`;
    // }

    // const response = await stockAPI.get(url);

    const response = await stockAPI.get(`/charts/${stockId}?type=${type}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function getStockNetworkAPI(stockId) {
  try {
    const response = await networkAPI.get(`/stock/${stockId}?depth=10`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllNetworkAPI() {
  try {
    const response = await networkAPI.get(`/all?maxDegree=3`);
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

export async function getTopStocksAPI(code = "KR") {
  try {
    const response = await stockAPI.get(`/rank?code=${code}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
