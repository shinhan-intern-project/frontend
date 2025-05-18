<template>
  <DetailLayout
    v-if="stockInfo"
    :relatedNews="relatedNews"
    :stockInfo="stockInfo"
    type="stock"
    :stockId="stockId"
    :sentiment="sentiment"
  />
</template>

<script>
import DetailLayout from "@/components/detailPage/Layout.vue";
import { getStockAPI } from "@/apis/stock.js";
import {
  getStockRelatedNewsAPI,
  getStockSentimentAPI,
} from "@/apis/news.js";

export default {
  name: "StockPage",
  components: {
    DetailLayout,
  },
  data() {
    return {
      relatedNews: [],
      stockInfo: null,
      sentiment: { 호재: 0, 악재: 0, 중립: 0 },
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
        if (!res?.data || !res.data.companyName) {
          this.$router.push({ name: "NotFound" });
          return;
        }
        this.stockInfo = res.data;
      } catch (e) {
        console.error("종목 조회 실패:", e);
        this.$router.push({ name: "NotFound" });
      } finally {
        this.isStockInfoLoading = false;
      }
    },
    async getRelatedNews(id) {
      try {
        const res = await getStockRelatedNewsAPI(id);
        const newsList = res.data;

        this.relatedNews = newsList.map((news) => ({
          id: news.newsId,
          tag: news.sentiment,
          tagColor: this.getTagColor(news.sentiment),
          image: news.imageOriginLink || "", // 비어 있는 경우는 NewsItem.vue에서 처리됨
          url: news.newsOriginLink || "#",
          title: news.title,
          publisher: news.officeName,
          date: this.formatDate(news.datetime),
        }));
      } catch (e) {
        console.error("관련 뉴스 호출 실패:", e);
      }
    },
    async getSentiment(id) {
      try {
        const res = await getStockSentimentAPI(id);
        if (res.data && res.status === "OK") {
          this.sentiment = res.data;
        }
      } catch (e) {
        console.error("감정 지표 호출 실패:", e);
        this.sentiment = { 호재: 0, 악재: 0, 중립: 0 };
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
      if (!datetime || datetime.length < 8) return datetime;
      const year = datetime.slice(0, 4);
      const month = datetime.slice(4, 6);
      const day = datetime.slice(6, 8);
      return `${year}-${month}-${day}`;
    },
  },
  mounted() {
    const id = this.stockId;
    this.getStockInfo(id);
    this.getRelatedNews(id);
    this.getSentiment(id);
  },
  watch: {
    stockId(newId) {
      this.getStockInfo(newId);
      this.getRelatedNews(newId);
      this.getSentiment(newId);
    },
  },
};
</script>
