<template>
  <div class="stock-app">
    <div class="page-background"></div>

    <!-- 백그라운드 지구본 추가 -->
    <BackgroundGlobe />
    <div class="content-wrapper">
      <!-- 헤더 영역 -->
      <header>
        <img
          src="@/assets/logo/image.png"
          alt="STOCKPORT 로고"
          class="logo-image"
        />
      </header>

      <!-- 탭 영역 -->
      <ToggleSwitch
        v-model="type"
        :options="[
          { value: 'stock', label: '종목' },
          { value: 'product', label: '품목' },
        ]"
        @change="handleTypeChange"
        style="margin-bottom: 20px"
      />
      <!-- (2) 네트워크 그래프 -->

      <!-- 선택된 타입에 따라 다른 내용 표시 -->
      <div class="content">
        <div v-if="type === 'stock'">
          <!-- 종목 검색 -->
          <StockSearchAndInfo
            :is-loading="isLoading"
            :stock-items="stockItems"
            :related-items="relatedItems"
            :selected-stock-index="selectedStockIndex"
            :search-keyword="searchKeyword"
            @search="handleSearch"
            @select-stock="selectStock"
          />
          <!-- (2) 네트워크 그래프 -->
        </div>

        <div v-else-if="type === 'product'">
          <!-- 품목 검색 -->
          <ProductSearchAndInfo
            :is-loading="isProductLoading"
            :product-items="productItems"
            :selected-product-index="selectedProductIndex"
            :selected-product="selectedProduct"
            :search-keyword="productSearchKeyword"
            @search="handleProductSearch"
            @select-product="selectProduct"
            :format-price="formatPrice"
            :format-change-rate="formatChangeRate"
            :get-change-class="getChangeClass"
          />
        </div>
        <div v-else>
          <!-- HS 코드 검색-->
          <HSCodeSearchAndInfo
            :is-loading="isHSCodeLoading"
            :hscode-items="hscodeItems"
            :selected-hscode-index="selectedHSCodeIndex"
            :search-keyword="hscodeSearchKeyword"
            @search="handleHSCodeSearch"
            @select-hscode="selectHSCode"
          />
        </div>
      </div>

      <div class="center-arrow" @click="scrollToContent">
        <img
          src="@/assets/images/icons/arrow.png"
          alt="arrow"
          class="arrow-image"
        />
        <i class="fas fa-chevron-down"></i>
      </div>

      <!-- 종목 거래량 / 수출입 통계 그래프  -->
      <div class="layout" ref="statsSection">
        <div class="volume-section">
          <TopVolumeRanking
            :stocks="topStocks"
            :is-loading="isTopStocksLoading"
            @market-change="handleMarketChange"
          />
        </div>
        <!-- 오른쪽 영역: 수출입 통계와 무역 품목 최근 수출입량 -->
        <div class="export-stats-section">
          <!-- 수출입 통계 그래프 -->

          <ExportImportStats
            :country="exportCountryCode"
            :stats-items="exportStats"
            :is-loading="isExportStatsLoading"
          >
          </ExportImportStats>

          <!-- 무역 품목 최근 수출입량 -->
          <div class="recent-trades-wrapper">
            <RecentTrades
              :is-loading="isTradeItemsLoading"
              :country="selectedCountry"
              @direction-change="handleDirectionChange"
              @country-change="handleCountryChange"
            />
          </div>
        </div>
      </div>

      <!-- 뉴스 섹션 -->
      <div class="detail-layout-content-item" ref="section4">
        <span class="header">무역 관련 뉴스</span>
        <template v-if="newsItems.length">
          <div class="news-wrapper">
            <button class="scroll-btn left" @click="scrollPrev">‹</button>
            <div class="news-container" ref="newsContainer">
              <NewsItem
                :isBadge="true"
                v-for="news in newsItems"
                :key="news.id"
                :news="news"
              />
            </div>
            <button class="scroll-btn right" @click="scrollNext">›</button>
          </div>
        </template>
        <div class="no-relation" v-else>
          <img src="@/assets/images/icons/caution_navy.png" alt="정보" />
          <p>관련된 뉴스가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from "vue";

import ToggleSwitch from "@/components/toggle/ToggleSwitch.vue";
import BackgroundGlobe from "@/components/globe/BackgroundGlobe.vue";
import StockSearchAndInfo from "@/components/search/StockSearchAndInfo.vue";
import TopVolumeRanking from "@/components/main/TopVolumeRanking.vue";
import ExportImportStats from "@/components/main/ExportImportStats.vue";
import RecentTrades from "@/components/main/RecentTrades.vue";
import { getSearchAPI, getTopStocksAPI } from "@/apis/stock";
import NewsItem from "@/components/news/NewsItem.vue";
import { getLatestNewsAPI } from "@/apis/news";
import ProductSearchAndInfo from "@/components/search/ProductSearchAndInfo.vue";
import { getSearchProductAPI, getSearchHsCodeAPI } from "@/apis/product";
// import HsToggle from "@/components/toggle/HsToggle.vue";
import HSCodeSearchAndInfo from "@/components/search/HSCodeSearchAndInfo.vue";
const countries = {
  features: [],
};

const fetchCountries = async () => {
  try {
    const res = await fetch(
      "https://unpkg.com/world-atlas/countries-110m.json"
    );
    const data = await res.json();
    countries.features = data.features;
  } catch (error) {
    console.error("국가 데이터를 불러오는 데 실패했습니다:", error);
  }
};

export default {
  name: "MainPage",
  components: {
    ToggleSwitch,
    BackgroundGlobe,
    StockSearchAndInfo,
    TopVolumeRanking,
    ExportImportStats,
    RecentTrades,
    NewsItem,
    ProductSearchAndInfo,
    HSCodeSearchAndInfo,
  },
  setup() {
    const backgroundGlobeContainer = ref(null);
    // let backgroundGlobe = null;
    fetchCountries();
    const activePoints = ref([
      { city: "서울", country: "한국", value: 3.2 },
      { city: "도쿄", country: "일본", value: 1.8 },
      { city: "뉴욕", country: "미국", value: 2.5 },
    ]);

    onMounted(async () => {
      try {
        const res = await fetch(
          "https://unpkg.com/world-atlas/countries-110m.json"
        );
        const data = await res.json();
        countries.features = data.features;
      } catch (error) {
        console.error("국가 데이터를 불러오는 데 실패했습니다:", error);
      }
    });

    onBeforeUnmount(() => {});

    return {
      backgroundGlobeContainer,
      activePoints,
    };
  },

  data() {
    return {
      marketCode: "KR",
      type: "stock",
      searchKeyword: "",
      isLoading: false,
      stockItems: [],
      relatedItems: [],
      selectedStock: null,
      selectedStockIndex: -1,
      // 품목 검색 관련 데이터
      productSearchKeyword: "",
      isProductLoading: false,
      productItems: [],
      selectedProductIndex: -1,
      selectedProduct: null,
      relatedStocks: [],
      exportMarket: "domestic",
      exportCountryCode: "KR",
      isExportStatsLoading: false,
      // HS 코드 관련
      hscodeSearchKeyword: "",
      isHSCodeLoading: false,
      hscodeItems: [],
      selectedHSCodeIndex: -1,
      selectedHSCode: null,
      topStocks: [],

      newsItems: [],
    };
  },
  methods: {
    scrollNext() {
      const c = this.$refs.newsContainer;
      if (!c) return;
      c.scrollBy({ left: c.clientWidth, behavior: "smooth" });
    },
    scrollPrev() {
      const c = this.$refs.newsContainer;
      if (!c) return;
      c.scrollBy({ left: -c.clientWidth, behavior: "smooth" });
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
    async fetchLatestNews() {
      try {
        const res = await getLatestNewsAPI();
        const newsList = res.data;
        this.newsItems = newsList.map((news) => ({
          id: news.newsId,
          tag: news.sentiment,
          tagColor: this.getTagColor(news.sentiment),
          image: news.imageOriginLink,
          url: news.newsOriginLink || "#",
          title: news.title,
          publisher: news.officeName,
          date: this.formatDate(news.datetime),
        }));
      } catch (e) {
        console.error("뉴스 가져오기 실패:", e);
      }
    },

    handleExportMarketChange(val) {
      this.exportCountryCode = val === "domestic" ? "KR" : "US";
      // console.log("바뀐 국가 코드 →", this.exportCountryCode);
    },
    // 타입 변경 핸들러
    handleTypeChange(value) {
      // console.log(`타입 변경: ${value}`);
    },
    // 품목 검색 핸들러
    handleProductSearch(keyword) {
      this.productSearchKeyword = keyword;
      this.searchProducts();
    },

    // 품목 검색 API 호출
    async searchProducts() {
      if (!this.productSearchKeyword) return;

      this.isProductLoading = true;
      try {
        const responseData = await getSearchProductAPI(
          this.productSearchKeyword
        );
        if (responseData && responseData.status === "OK") {
          this.productItems = responseData.data;
          // console.log(this.productItems);
        } else {
          console.error(
            "품목 API 응답 형식이 올바르지 않습니다.",
            responseData
          );
          this.productItems = [];
        }
      } catch (error) {
        console.error("품목 검색 오류:", error);
        this.productItems = [];
        this.selectedProduct = null;
      } finally {
        this.isProductLoading = false;
      }
    },

    // 품목 선택 핸들러
    selectProduct(product, index) {
      this.selectedProduct = product;
      this.selectedProductIndex = index;
      this.relatedStocks = product.relatedStocks || [];
    },

    // 거래량 상위 Top 10 데이터 가져오기
    async fetchTopStocks() {
      this.isTopStocksLoading = true;
      try {
        const responseData = await getTopStocksAPI(this.marketCode);
        if (responseData && responseData.status === "OK") {
          this.topStocks = responseData.data;
        } else {
          console.error("API 응답 형식이 올바르지 않습니다.", responseData);
        }
      } catch (error) {
        console.error(
          "거래량 상위 Top 10 데이터를 가져오는 중 오류가 발생했습니다:",
          error
        );
      } finally {
        this.isTopStocksLoading = false;
      }
    },
    handleMarketChange(value) {
      this.marketCode = value === "domestic" ? "KR" : "US";
      this.fetchTopStocks();
    },
    // 가격 포맷 함수
    formatPrice(price) {
      return parseFloat(price).toLocaleString();
    },

    // 거래량 포맷 함수
    formatVolume(volume) {
      return parseInt(volume).toLocaleString();
    },

    // 등락률 포맷 함수
    formatChangeRate(rate) {
      const value = parseFloat(rate) * 100;
      return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
    },

    // 등락률에 따른 클래스 반환
    getChangeClass(rate) {
      const value = parseFloat(rate);
      if (value > 0) return "positive-change";
      if (value < 0) return "negative-change";
      return "zero-change";
    },

    handleSearch(keyword) {
      this.searchKeyword = keyword;
      this.searchStocks();
    },

    handleCountryChange(country) {
      // console.log(`국가 변경: ${country}`);
      this.selectedCountry = country;
    },
    handleDirectionChange(direction) {
      // console.log(`정렬 방향 변경: ${direction}`);
      this.sortDirection = direction;
    },

    loadInitialData() {
      // console.log("초기 데이터 로드 시작");
      this.fetchTopStocks();
    },
    // 종목 검색 API 호출 함수
    async searchStocks() {
      if (!this.searchKeyword) return;

      this.isLoading = true;
      try {
        const responseData = await getSearchAPI(this.searchKeyword);
        if (responseData && responseData.status === "OK") {
          this.stockItems = responseData.data.map((item) => ({
            name: item.companyName,
            code: item.ticker,
            price:
              item.marketType === "NASDAQ"
                ? parseFloat(item.currentPrice)
                : parseInt(item.currentPrice, 10),
            changePercent: `${(parseFloat(item.changeRate) * 100).toFixed(1)}%`,
            stockId: item.stockId,
            relatedProducts: item.relatedProducts || [],
            marketType: item.marketType,
          }));

          this.showAllRelatedProducts();
        }
      } catch (error) {
        console.error("종목 검색 오류:", error);
        this.stockItems = [];
        this.selectedStock = null;
        this.relatedItems = [];
      } finally {
        this.isLoading = false;
      }
    },

    // 모든 관련 품목 표시
    showAllRelatedProducts() {
      const allRelatedProducts = [];
      const uniqueHscodes = new Set();

      this.stockItems.forEach((stock) => {
        if (stock.relatedProducts && stock.relatedProducts.length > 0) {
          stock.relatedProducts.forEach((product) => {
            if (!uniqueHscodes.has(product.hscode)) {
              uniqueHscodes.add(product.hscode);

              allRelatedProducts.push({
                name: product.hscodeName,
                code: product.hscode,
                stockName: stock.name,
                hscodeId: product.hscodeId,
              });
            }
          });
        }
      });

      this.relatedItems = allRelatedProducts;
      this.selectedStockIndex = -1;
    },

    selectStock(stock, index) {
      this.selectedStock = stock;
      this.selectedStockIndex = index;

      if (stock.relatedProducts && stock.relatedProducts.length > 0) {
        const uniqueHscodes = new Set();

        this.relatedItems = stock.relatedProducts
          .filter((product) => {
            if (uniqueHscodes.has(product.hscode)) {
              return false;
            }
            uniqueHscodes.add(product.hscode);
            return true;
          })
          .map((product) => ({
            name: product.hscodeName,
            code: product.hscode,
            stockName: stock.name,
          }));
      } else {
        this.relatedItems = [];
      }
    },
    // HS 코드 검색 핸들러
    handleHSCodeSearch(keyword) {
      this.hscodeSearchKeyword = keyword;
      this.searchHSCodes();
    },

    // HS 코드 검색 API 호출
    async searchHSCodes() {
      if (!this.hscodeSearchKeyword) return;

      this.isHSCodeLoading = true;
      try {
        const responseData = await getSearchHsCodeAPI(this.hscodeSearchKeyword);
        if (responseData && responseData.status === "OK") {
          this.hscodeItems = responseData.data;
        } else {
          console.error(
            "HS 코드 API 응답 형식이 올바르지 않습니다.",
            responseData
          );
          this.hscodeItems = [];
        }
      } catch (error) {
        console.error("HS 코드 검색 오류:", error);
        this.hscodeItems = [];
        this.selectedHSCode = null;
      } finally {
        this.isHSCodeLoading = false;
      }
    },

    // HS 코드 선택 핸들러
    selectHSCode(hsCode, index) {
      this.selectedHSCode = hsCode;
      this.selectedHSCodeIndex = index;
    },

    // 화살표 누르면 Content로 이동
    scrollToContent() {
      const el = this.$refs.statsSection;
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth" });
    },
  },
  mounted() {
    // 초기 데이터 로드
    this.loadInitialData();
    this.fetchLatestNews();
  },
};
</script>

<style scoped>
/* 전체 앱 스타일 */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 20px 20px 20px; /* 기존 값 유지 */
}
.logo-image {
  max-width: 300px;
  height: auto;
  width: 100%;
}

.arrow-image {
  max-width: 50px;
  height: auto;
}

.stock-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 60px;
  color: #333;
  position: relative;
}

.layout {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.volume-section,
.export-import-section {
  flex: 1;
  /* padding: 20px; */
  box-sizing: border-box;
}

.export-stats-section {
  flex: 1;
  padding: 0;
  box-sizing: border-box;
}

.export-stats-section {
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
}

.recent-trades-wrapper {
  margin-top: 0;
}

.background-globe-container {
  position: absolute;
  top: 0%;
  right: -100px;
  width: 70%;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.content-wrapper {
  position: relative;
  z-index: 3;
  max-width: 1200px;
}

.stock-app::before {
  content: "";
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* 헤더 스타일 */
header {
  margin-top: 5%;
  margin-bottom: 30px;
}

html body {
  font-family: Pretendard !important;
  height: 100vh;
}

.center-arrow {
  text-align: center;
  margin: 20px 0;
  font-size: 24px;
  color: #888;
}

.center-arrow img {
  cursor: pointer;
  animation: arrow-bounce 1.5s ease-in-out infinite;
}

@keyframes arrow-bounce {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -10px, 0);
  }
}

/* 종목 거래량 섹션 스타일 */
/* .volume-section {
  margin-bottom: 40px;
} */

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  margin: 0;
}

.volume-table-header {
  display: flex;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 5px 5px 0 0;
  border: 1px solid #eee;
  border-bottom: none;
}

.col-header {
  flex: 1;
  font-size: 14px;
  color: #666;
}

.volume-table {
  border: 1px solid #eee;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
}

.volume-item {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.volume-item:last-child {
  border-bottom: none;
}

.item-rank {
  flex: 0.5;
  font-weight: bold;
}

.item-company {
  flex: 2;
  display: flex;
  align-items: center;
}

.company-logo-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #034ea2;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.company-logo-small::after {
  content: "삼성";
  font-size: 9px;
}

.company-details-small {
  margin-left: 10px;
}

.company-name-small {
  font-weight: 500;
}

.company-code-small {
  color: #888;
  font-size: 14px;
}

.item-price,
.item-change,
.item-volume {
  flex: 1;
  text-align: right;
}

/* 수출입 통계 섹션 스타일 */
/* .export-import-section {
  margin-bottom: 40px;
} */

.export-import-section h2 {
  font-size: 18px;
  margin: 0 0 20px;
}

.statistics-table {
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
}

.stats-header {
  display: flex;
  padding: 12px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.stats-header div {
  flex: 1;
}

.stat-item {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name,
.stat-import,
.stat-export,
.stat-change {
  flex: 1;
}

.positive-change {
  color: #f03e3e;
}

.negative-change {
  color: #1971c2;
}

.detail-layout-content-item {
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 4px 20px #cfdef1;
  border-radius: 12px;
  padding: 48px;
  box-sizing: border-box;
  margin-top: 40px;
  margin-bottom: 40px;
}

.detail-layout-content-item .header {
  color: #000c37;
  font-size: 20px;
  font-weight: 700;
}

.news-wrapper {
  position: relative;
}

/* 2) arrows */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
}
.scroll-btn.left {
  left: 8px;
}
.scroll-btn.right {
  right: 8px;
}

/* show arrows on hover */
.news-wrapper:hover .scroll-btn {
  opacity: 1;
}

.news-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-top: 24px;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.news-container > * {
  flex: 0 0 215px;
  max-width: 215px;
}

.news-container::-webkit-scrollbar {
  display: none;
}

@media (max-width: 992px) {
  .layout {
    flex-direction: column;
  }

  .volume-section,
  .export-import-section {
    width: 100%;
  }

  .news-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .news-container {
    grid-template-columns: repeat(1, 1fr);
  }

  .volume-table-header,
  .volume-item {
    font-size: 14px;
  }

  .logo-image {
    max-width: 200px;
  }
}

@media (max-width: 576px) {
  .company-details-small {
    display: none;
  }

  .item-volume {
    display: none;
  }

  .statistics-table {
    font-size: 12px;
  }
}
</style>
