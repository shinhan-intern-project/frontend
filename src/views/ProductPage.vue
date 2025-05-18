<template>
  <DetailLayout
    :relatedNews="relatedNews"
    :productInfo="productInfo"
    type="product"
    :relatedStocks="relatedStocks"
    :productId="productId"
  />
</template>

<script>
import DetailLayout from "@/components/detailPage/Layout.vue";
import { getProductAPI, getRelatedStocksAPI } from "@/apis/product.js";
import { getProductRelatedNewsAPI } from "@/apis/news.js"; // ✅ 품목 뉴스 API

export default {
  name: "ProductPage",
  components: {
    DetailLayout,
  },
  data() {
    return {
      productInfo: null,
      relatedStocks: null,
      relatedNews: [],
      isProductInfoLoading: false,
      isRelatedStocksLoading: false,
    };
  },
  computed: {
    productId() {
      return this.$route.params.productId;
    },
  },
  methods: {
    async getProductInfo(id) {
      this.isProductInfoLoading = true;
      try {
        const res = await getProductAPI(id);
        this.productInfo = res.data;
      } catch (e) {
        this.error = e;
      } finally {
        this.isProductInfoLoading = false;
      }
    },
    async getRelatedStocks(id) {
      this.isRelatedStocksLoading = true;
      try {
        const res = await getRelatedStocksAPI(id);
        this.relatedStocks = res.data;
      } catch (e) {
        this.error = e;
      } finally {
        this.isRelatedStocksLoading = false;
      }
    },
    async getRelatedNews(id) {
      try {
        const res = await getProductRelatedNewsAPI(id);
        const newsList = res.data;

        this.relatedNews = newsList.map(news => ({
          id: news.newsId,
          tag: news.sentiment,
          tagColor: this.getTagColor(news.sentiment),
          image: news.imageOriginLink,
          url: "#", // 실제 URL로 대체 가능
          title: news.title,
          publisher: news.officeName,
          date: this.formatDate(news.datetime),
        }));
      } catch (e) {
        console.error("품목 관련 뉴스 호출 실패:", e);
      }
    },
    getTagColor(sentiment) {
      switch (sentiment) {
        case "호재": return "#E5484D";
        case "악재": return "#3D8BFF";
        case "중립":
        default: return "#A5A5A5";
      }
    },
    formatDate(datetime) {
      const date = new Date(datetime);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      return diffDays === 0 ? "오늘" : `${diffDays}일 전`;
    },
  },
  mounted() {
    const id = this.productId;
    this.getProductInfo(id);
    this.getRelatedStocks(id);
    this.getRelatedNews(id);
  },
  watch: {
    productId(newId) {
      this.getProductInfo(newId);
      this.getRelatedStocks(newId);
      this.getRelatedNews(newId);
    },
  },
};
</script>
