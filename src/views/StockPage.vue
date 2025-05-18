<template>
  <DetailLayout
    :relatedNews="relatedNews"
    :stockInfo="stockInfo"
    type="stock"
    :stockId="stockId"
  />
</template>

<script>
import DetailLayout from "@/components/detailPage/Layout.vue";
import { getStockAPI } from "@/apis/stock.js";
import { getStockRelatedNewsAPI } from "@/apis/news.js";

export default {
  name: "StockPage",
  components: {
    DetailLayout,
  },
  data() {
    return {
      relatedNews: [],
      stockInfo: null,
      isStockInfoLoading: false,
    };
  },
  computed: {
    stockId() {
      return this.$route.params.stockId;
    },
  },
  methods: {
    async getStockInfo(id) {
      this.isStockInfoLoading = true;
      try {
        const res = await getStockAPI(id);
        this.stockInfo = res.data;
      } catch (e) {
        this.error = e;
      } finally {
        this.isStockInfoLoading = false;
      }
    },
    async getRelatedNews(id) {
      try {
        const res = await getStockRelatedNewsAPI(id);
        const newsList = res.data; // ✅ 실제 뉴스 배열은 res.data.data 에 있음

        this.relatedNews = newsList.map(news => ({
          id: news.newsId,
          tag: news.sentiment,
          tagColor: this.getTagColor(news.sentiment),
          image: news.imageOriginLink,
          url: "#", // 실제 뉴스 URL이 없는 경우 대체
          title: news.title,
          publisher: news.officeName,
          date: this.formatDate(news.datetime),
        }));
      } catch (e) {
        console.error("관련 뉴스 호출 실패:", e);
      }
    },
    getTagColor(sentiment) {
      switch (sentiment) {
        case "호재":
          return "#E5484D";
        case "악재":
          return "#3D8BFF";
        case "중립":
        default:
          return "#A5A5A5";
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
    const id = this.stockId;
    this.getStockInfo(id);
    this.getRelatedNews(id);
  },
  watch: {
    stockId(newId) {
      this.getStockInfo(newId);
      this.getRelatedNews(newId);
    },
  },
};
</script>
