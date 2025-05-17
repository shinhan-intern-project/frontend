<template>
  <DetailLayout
    :relatedNews="relatedNews"
    :productInfo="productInfo"
    type="product"
    :relatedStocks="relatedStocks"
    :productId="productId"
    :sentiment="sentiment"
  />
</template>

<script>
import DetailLayout from "@/components/detailPage/Layout.vue";
import { getRelatedStocksAPI } from "@/apis/product";
import { getProductAPI } from "@/apis/product.js";
import { getProductSentimentAPI } from "@/apis/news.js";

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
  name: "ProductPage",
  components: {
    DetailLayout,
  },
  data() {
    return {
      productInfo: null,
      relatedNews,
      isProductInfoLoading: false,
      isRelatedStocksLoading: false,
      relatedStocks: null,
    };
  },
  computed: {
    productId() {
      return this.$route.params.productId;
    },
  },
  methods: {
    async getProductInfo(id) {
      console.log("id", id);

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
    async getSentiment(id) {
      try {
        const res = await getProductSentimentAPI(id);
        if (res.data && res.status === "OK") {
          this.sentiment = res.data;
        }
      } catch (e) {
        this.sentiment = { 호재: 0, 악재: 0, 중립: 0 };
      }
    },
  },
  mounted() {
    this.getRelatedStocks(this.$route.params.productId);
    this.getProductInfo(this.$route.params.productId);
    this.getSentiment(this.$route.params.productId);
  },
  watch: {
    productId(newId) {
      this.getRelatedStocks(newId);
      this.getSentiment(newId);
    },
  },
};
</script>
