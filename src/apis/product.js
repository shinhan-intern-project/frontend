import { networkAPI, productAPI } from "@/apis";

export async function getProductAPI(productId) {
  try {
    const response = await productAPI.get(`/${productId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getRelatedStocksAPI(hscodeId) {
  try {
    const response = await productAPI.get(`/${hscodeId}/related-stocks`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProductNetworkAPI(productId, depth) {
  try {
    const response = await networkAPI.get(`/hs/${productId}?depth=${depth}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// 무역 통계 조회
export async function getProductTradeAPI(hscodeId) {
  try {
    const response = await productAPI.get(`/${hscodeId}/trade-stats`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getTradeRankAPI(
  country = "KR",
  direction = "import",
  limit = 10
) {
  try {
    const response = await productAPI.get(`/trade-rank`, {
      params: {
        country,
        direction,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("무역 품목 데이터를 가져오는 중 오류가 발생했습니다:", error);
    return { status: "ERROR", data: { items: [] } };
  }
}

export async function getSearchProductAPI(searchKeyword) {
  try {
    const response = await productAPI.get(`/search?keyword=${searchKeyword}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
