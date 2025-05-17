<template>
  <DetailLayout
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
import { getStockSentimentAPI } from "@/apis/news.js";

const relatedNews = [
  {
    id: 1,
    tag: "호재",
    tagColor: "#E5484D", // 빨강
    image: "https://via.placeholder.com/300x180?text=뉴스1",
    url: "https://google.com",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미조선 미디어조선 미디선 미디어조선 미디어디어",
    date: "3일 전",
  },
  {
    id: 2,
    tag: "악재",
    tagColor: "#3D8BFF", // 파랑
    image: "https://via.placeholder.com/300x180?text=뉴스2",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    url: "https://google.com",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 3,
    tag: "중립",
    tagColor: "#A5A5A5", // 회색
    image: "https://via.placeholder.com/300x180?text=뉴스3",
    title:
      "신한투자증권, 금자증권, 금융 IT 인재 키운다융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 4,
    tag: "호재",
    tagColor: "#E5484D",
    image: "https://via.placeholder.com/300x180?text=뉴스4",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 5,
    tag: "호재",
    tagColor: "#E5484D",
    image: "https://via.placeholder.com/300x180?text=뉴스4",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
  {
    id: 6,
    tag: "호재",
    tagColor: "#E5484D",
    image: "https://via.placeholder.com/300x180?text=뉴스4",
    title: "신한투자증권, 금융 IT 인재 키운다 ‘프로디지털아카데미’ 6기 모집",
    publisher: "조선 미디어",
    date: "3일 전",
  },
];

export default {
  name: "StockPage",
  components: {
    DetailLayout,
  },
  data() {
    return {
      relatedNews,
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
    async getSentiment(id) {
      try {
        const res = await getStockSentimentAPI(id)
        if (res.data && res.status === "OK") {
          this.sentiment = res.data;
        }
      } catch (e) {
        this.sentiment = { 호재: 0, 악재: 0, 중립: 0 };
      }
    },
  },
  mounted() {
    this.getStockInfo(this.$route.params.stockId);
    this.getSentiment(this.$route.params.stockId);
  },
  watch: {
    stockId(newId) {
      this.getStockInfo(newId);
      this.getSentiment(newId);
    },
  },
};
</script>
