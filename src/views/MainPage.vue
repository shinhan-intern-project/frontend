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
        style="margin-bottom: 20px"
      />

      <!-- 선택된 타입에 따라 다른 내용 표시 -->
      <div class="content">
        <div v-if="type === 'stock'">
          <!-- 통합된 종목 검색 및 정보 컴포넌트 -->
          <StockSearchAndInfo
            :is-loading="isLoading"
            :stock-items="stockItems"
            :related-items="relatedItems"
            :selected-stock-index="selectedStockIndex"
            :search-keyword="searchKeyword"
            @search="handleSearch"
            @select-stock="selectStock"
          />
        </div>

        <div v-else>
          <!-- 품목 관련 내용 -->
          <!-- 품목 관련 컴포넌트들 -->
        </div>
      </div>

      <!-- 중앙 화살표 -->
      <div class="center-arrow">
        <img
          src="@/assets/images/icons/arrow.png"
          alt="arrow"
          class="arrow-image"
        />
        <i class="fas fa-chevron-down"></i>
      </div>

      <!-- 종목 거래량 / 수출입 통계 그래프  -->
      <div class="layout">
        <!-- 종목 거래량 섹션 -->
        <div class="volume-section">
          <!-- 새로운 컴포넌트 사용 -->
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
            :stats-items="exportStats"
            :is-loading="isExportStatsLoading"
          />

          <!-- 무역 품목 최근 수출입량 (바로 아래에 배치) -->
          <div class="recent-trades-wrapper">
            <RecentTrades
              :trade-items="tradeItems"
              :is-loading="isTradeItemsLoading"
            />
          </div>
        </div>
      </div>
      <!-- 뉴스 섹션 -->
      <div class="content-card">
        <h2>관련 뉴스</h2>
        <div class="news-container">
          <div v-for="news in newsItems" :key="news.id" class="news-item">
            <div class="news-image-placeholder"></div>
            <div class="news-tag" :style="{ backgroundColor: news.tagColor }">
              {{ news.tag }}
            </div>
            <h3 class="news-title">{{ news.title }}</h3>
            <div class="news-footer">
              <span class="news-publisher">{{ news.publisher }}</span>
              <span class="news-date">{{ news.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from "vue";
import Globe from "globe.gl";
import * as THREE from "three";
import ToggleSwitch from "@/components/toggle/ToggleSwitch.vue";
import BackgroundGlobe from "@/components/globe/BackgroundGlobe.vue";
import StockSearchAndInfo from "@/components/search/StockSearchAndInfo.vue";
import TopVolumeRanking from "@/components/main/TopVolumeRanking.vue";
import ExportImportStats from "@/components/main/ExportImportStats.vue";
import RecentTrades from "@/components/main/RecentTrades.vue";
import { getSearchAPI, getTopStocksAPI } from "@/apis/stock";

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
  },
  setup() {
    const backgroundGlobeContainer = ref(null);
    let backgroundGlobe = null;
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

        initGlobe();
      } catch (error) {
        console.error("국가 데이터를 불러오는 데 실패했습니다:", error);
        initGlobe();
      }

      window.addEventListener("resize", handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
      if (backgroundGlobe) {
        backgroundGlobe._destructor && backgroundGlobe._destructor();
      }
    });

    const initGlobe = () => {
      if (backgroundGlobeContainer.value) {
        backgroundGlobe = Globe()(backgroundGlobeContainer.value)
          .backgroundColor("rgba(240, 248, 255, 0)")
          .globeImageUrl(
            "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          )
          .bumpImageUrl(
            "//unpkg.com/three-globe/example/img/earth-topology.png"
          )
          .width(window.innerWidth * 0.5)
          .height(window.innerHeight * 0.8)
          .showGlobe(true)
          .showAtmosphere(true)
          .atmosphereColor("rgba(200, 219, 255, 0.3)")
          .atmosphereAltitude(0.15)
          .globeMaterial(
            new THREE.MeshPhongMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.9,
              shininess: 0.2,
              specular: 0x77bbff,
            })
          )
          .pointsData([
            { lat: 37.5665, lng: 126.978, value: 3.2, name: "서울" },
            { lat: 35.6762, lng: 139.6503, value: 1.8, name: "도쿄" },
            { lat: 40.7128, lng: -74.006, value: 2.5, name: "뉴욕" },
            { lat: 1.3521, lng: 103.8198, value: 1.5, name: "싱가포르" },
          ])
          .pointColor((d) => {
            const colors = {
              서울: "rgba(25, 118, 210, 0.8)",
              도쿄: "rgba(56, 142, 60, 0.8)",
              뉴욕: "rgba(245, 124, 0, 0.8)",
              싱가포르: "rgba(156, 39, 176, 0.8)",
            };
            return colors[d.name] || "rgba(255, 255, 255, 0.8)";
          })
          .pointRadius(0.4)
          .pointAltitude(0.02)
          .arcsData([
            {
              startLat: 37.5665,
              startLng: 126.978,
              endLat: 35.6762,
              endLng: 139.6503,
            },
            {
              startLat: 37.5665,
              startLng: 126.978,
              endLat: 40.7128,
              endLng: -74.006,
            },
            {
              startLat: 35.6762,
              startLng: 139.6503,
              endLat: 1.3521,
              endLng: 103.8198,
            },
          ])
          .arcColor(() => [
            "rgba(0, 127, 255, 0.5)",
            "rgba(44, 186, 0, 0.5)",
            "rgba(255, 197, 0, 0.5)",
          ])
          .arcDashLength(0.4)
          .arcDashGap(0.2)
          .arcDashAnimateTime(1500)
          .arcStroke(0.5);

        backgroundGlobe.controls().autoRotate = true;
        backgroundGlobe.controls().autoRotateSpeed = 0.3;
        backgroundGlobe.controls().enableZoom = false;
        backgroundGlobe.pointOfView({ lat: 25, lng: 120, altitude: 2.5 }, 1000);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        backgroundGlobe.scene().add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(1, 1, 1);
        backgroundGlobe.scene().add(directionalLight);
      }
    };

    const handleResize = () => {
      if (backgroundGlobe) {
        backgroundGlobe
          .width(window.innerWidth * 0.4)
          .height(window.innerHeight * 0.7);
      }
    };

    return {
      backgroundGlobeContainer,
      activePoints,
    };
  },

  data() {
    return {
      type: "stock",
      searchKeyword: "",
      isLoading: false,
      stockItems: [],
      relatedItems: [],
      selectedStock: null,
      selectedStockIndex: -1,
      topStocks: [
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        // 더 많은 주식 데이터...
      ],
      exportStats: [
        {
          name: "라인그래프",
          importValue: "라인그래프",
          exportValue: "라인그래프",
          change: 3.6,
        },
        // 더 많은 수출입 데이터...
      ],
      newsItems: [
        {
          id: 1,
          tag: "호재",
          tagColor: "#E5484D",
          url: "https://google.com",
          title:
            "신한투자증권, 금융 IT 인재 키운다 '프로디지털아카데미' 6기 모집",
          publisher: "조선 미디어",
          date: "3일 전",
        },
        // 더 많은 뉴스 데이터...
      ],
    };
  },
  methods: {
    // 거래량 상위 Top 10 데이터 가져오기
    async fetchTopStocks() {
      this.isTopStocksLoading = true;
      try {
        const responseData = await getTopStocksAPI("KR");
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
            price: `${parseInt(item.currentPrice).toLocaleString()}원`,
            changePercent: `${(parseFloat(item.changeRate) * 100).toFixed(1)}%`,
            stockId: item.stockId,
            relatedProducts: item.relatedProducts || [],
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

    loadInitialData() {
      console.log("초기 데이터 로드 시작");
      this.fetchTopStocks();
    },
  },
  mounted() {
    // 초기 데이터 로드
    this.loadInitialData();
  },
};
</script>

<style scoped>
/* 전체 앱 스타일 */
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
  padding: 20px;
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
  gap: 20px;
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
  background: radial-gradient(
    circle at top right,
    rgba(36, 40, 47, 0.1),
    transparent 70%
  );
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

/* 뉴스 섹션 스타일 */
.content-card {
  margin-top: 40px !important;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 4px 20px #cfdef1;
  border-radius: 12px;
  padding: 30px;
  box-sizing: border-box;
}

.content-card h2 {
  font-size: 18px;
  margin: 0 0 20px 0;
}

.news-container {
  display: flex;
  width: 100%;
  margin-top: 24px;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.news-container::-webkit-scrollbar {
  display: none;
}

.news-item {
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  min-width: 250px;
  max-width: 300px;
}

.news-image-placeholder {
  height: 150px;
  background-color: #e9ecef;
}

.news-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}

.news-title {
  padding: 10px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  padding: 0 10px 10px;
  font-size: 12px;
  color: #888;
}

.news-publisher {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
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
