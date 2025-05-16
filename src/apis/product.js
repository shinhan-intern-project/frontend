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

export async function getProductNetworkAPI(productId) {
  try {
    const response = await networkAPI.get(`/hs/${productId}?depth=3`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
