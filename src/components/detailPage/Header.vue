<template>
  <nav>
    <img
      src="@/assets/images/logo/logo.png"
      alt="로고 이미지"
      class="logo"
      @click="goMain"
    />

    <div class="search-wrapper">
      <div class="custom-search-container">
        <div class="search-type-toggle">
          <ToggleSwitch
            v-model="searchType"
            :options="[
              { value: 'stock', label: '종목' },
              { value: 'product', label: '품목' },
            ]"
            @change="handleSearchTypeChange"
          />
        </div>
        <StockSearchAndInfo
          v-if="searchType === 'stock'"
          :is-loading="isStockLoading"
          :stock-items="stockItems"
          :related-items="relatedItems"
          :selected-stock-index="selectedStockIndex"
          :search-keyword="stockSearchKeyword"
          :show-network-graph="!isDetailPage"
          :hide-network-graph="isDetailPage"
          @search="handleStockSearch"
          @select-stock="selectStock"
          :is-detail-page="true"
        />

        <ProductSearchAndInfo
          v-else
          :is-loading="isProductLoading"
          :product-items="productItems"
          :selected-product-index="selectedProductIndex"
          :selected-product="selectedProduct"
          :search-keyword="productSearchKeyword"
          :show-network-graph="!isDetailPage"
          :hide-network-graph="isDetailPage"
          :format-price="formatPrice"
          :format-change-rate="formatChangeRate"
          :get-change-class="getChangeClass"
          @search="handleProductSearch"
          @select-product="selectProduct"
        />
      </div>
    </div>
  </nav>
  <header class="header">
    <img
      src="@/assets/images/icons/back.png"
      alt="뒤로가기 아이콘"
      class="back-icon"
      @click="goBack"
    />
    <span class="back-text">돌아가기</span>
  </header>
</template>

<script>
import StockSearchAndInfo from "../search/StockSearchAndInfo.vue";
import ProductSearchAndInfo from "../search/ProductSearchAndInfo.vue";
import { getSearchAPI } from "@/apis/stock";
import { getSearchProductAPI } from "@/apis/product";
import ToggleSwitch from "../toggle/ToggleSwitch.vue";
export default {
  name: "DetailHeader",
  components: {
    StockSearchAndInfo,
    ProductSearchAndInfo,
    ToggleSwitch,
  },
  props: {
    stockId: { type: String, default: "" },
    productId: { type: String, default: "" },
  },
  data() {
    return {
      isDetailPage: !!this.stockId || !!this.productId, // stockId나 productId가 있으면 상세 페이지로 간주
      activeSection: 0,

      searchType: "stock",
      // 종목 검색 관련 데이터
      stockSearchKeyword: "",
      isStockLoading: false,
      stockItems: [],
      relatedItems: [],
      selectedStockIndex: -1,

      // 품목 검색 관련 데이터
      productSearchKeyword: "",
      isProductLoading: false,
      productItems: [],
      selectedProductIndex: -1,
      selectedProduct: null,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    goMain() {
      this.$router.push(`/`);
    },

    // 검색 관련 메서드 추가
    handleSearchTypeChange(value) {
      this.searchType = value;
    },

    // 종목 검색 관련 메서드
    async handleStockSearch(keyword) {
      this.stockSearchKeyword = keyword;
      this.isStockLoading = true;

      try {
        const response = await getSearchAPI(keyword);
        if (response && response.status === "OK") {
          this.stockItems = response.data.map((item) => ({
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
        this.relatedItems = [];
      } finally {
        this.isStockLoading = false;
      }
    },

    selectStock(stock, index) {
      this.selectedStockIndex = index;

      if (stock.relatedProducts && stock.relatedProducts.length > 0) {
        const uniqueHscodes = new Set();

        this.relatedItems = stock.relatedProducts
          .filter(
            (product) =>
              !uniqueHscodes.has(product.hscode) &&
              uniqueHscodes.add(product.hscode)
          )
          .map((product) => ({
            name: product.hscodeName,
            code: product.hscode,
            stockName: stock.name,
            hscodeId: product.hscodeId,
          }));
      } else {
        this.relatedItems = [];
      }
    },

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

    // 품목 검색 관련 메서드
    async handleProductSearch(keyword) {
      this.productSearchKeyword = keyword;
      this.isProductLoading = true;

      try {
        const response = await getSearchProductAPI(keyword);
        if (response && response.status === "OK") {
          this.productItems = response.data;
        }
      } catch (error) {
        console.error("품목 검색 오류:", error);
        this.productItems = [];
      } finally {
        this.isProductLoading = false;
      }
    },

    selectProduct(product, index) {
      this.selectedProduct = product;
      this.selectedProductIndex = index;
    },

    // 포맷 관련 메서드
    formatPrice(price) {
      return parseFloat(price).toLocaleString();
    },

    formatChangeRate(rate) {
      const value = parseFloat(rate) * 100;
      return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
    },

    getChangeClass(rate) {
      const value = parseFloat(rate);
      if (value > 0) return "positive-change";
      if (value < 0) return "negative-change";
      return "zero-change";
    },

    scrollToSection(idx) {
      const el = this.$refs[`section${idx}`];
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    formatMarketCap(value) {
      if (!value && value !== 0) return "";
      const num = Number(value);
      if (num >= 1_0000) {
        // 1조 이상
        return (
          Math.floor(num / 1_0000).toLocaleString() +
          "조 " +
          Math.floor(num % 1_0000).toLocaleString() +
          "억 원"
        );
      } else if (num >= 1) {
        // 1억 이상
        return Math.floor(num / 1).toLocaleString() + "억";
      } else {
        // 억 미만
        return num.toLocaleString() + "억 원";
      }
    },
    onScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const visibleHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      if (scrollY + visibleHeight >= totalHeight - 5) {
        this.activeSection = 4;
        return;
      }

      // 페이지 상단에서 얼마나 스크롤됐는지 기준선 설정
      const baseline = 150;
      // 각 섹션의 화면 위치(top) 배열로 구하기
      const tops = [0, 1, 2, 3, 4].map((i) => {
        const el = this.$refs[`section${i}`];
        return el ? el.getBoundingClientRect().top : Infinity;
      });
      // baseline 보다 크면서 가장 작은 top 의 인덱스 찾기
      const idx = tops.reduce((best, cur, i) => {
        // cur ≤ baseline에 가까운(=큰) 값 선택
        if (cur <= baseline && cur > tops[best]) {
          return i;
        }
        return best;
      }, 0);
      this.activeSection = idx;
    },

    // 호재, 악재, 중립 판단 함수
    topSentiment() {
      const s = this.stockInfo && this.stockInfo.sentiment;
      if (!s || Object.keys(s).length === 0) {
        return "";
      }
      const entries = Object.entries(s);
      entries.sort(([, a], [, b]) => b - a);
      return entries[0][0];
    },

    // 관련 품목 내용 요약 추출
    extractDescription(desc) {
      // 이거 앞부분까지만 추출
      const exampleMarker = "🧾 대표 품목 예시";
      const useMarkerMd = "### 🍽️ 대표 품목별 용도";

      // 1) “용도” 마커 앞까지 자르기
      const beforeUse = desc.includes(useMarkerMd)
        ? desc.split(useMarkerMd)[0]
        : desc;

      // 2) #, --- 제거, 나머지 줄바꿈을 스페이스로 합치기
      let clean = beforeUse
        .replace(/#/g, "")
        .replace(/-{3,}/g, "")
        .replace(/\r?\n/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();

      // 3) “🧾 대표 품목 예시” 기준으로 헤더/예시 분리
      let header = clean;
      let examples = "";
      if (clean.includes(exampleMarker)) {
        [header, examples] = clean.split(exampleMarker);
        examples = examples.trim(); // "- 폴리에스터..." 등
      }

      // 4) 예시 줄 조합
      const exampleLine = examples
        ? `${exampleMarker} ${examples}`
        : exampleMarker;

      // 5) 헤더와 예시만 반환 (이제 용도 마커는 제외)
      return `${header}\n${exampleLine}`;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
    // 초기 한번 실행
    this.onScroll();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.logo {
  width: 199px;
  height: 22.37px;
  margin-top: 10px;
  cursor: pointer;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.back-text {
  color: #000c37;
  font-size: 24px;
  font-weight: 700;
}
.header-search-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 32px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-type-toggle {
  flex: none;
}

.custom-search-container {
  flex: none;
  width: 500px;
  max-width: 100%;
}

.custom-search-container .search-container {
  max-width: 500px;
  width: 100%;
  margin-bottom: 0;
}

.custom-search-container .search-input {
  padding: 12px 16px;
  font-size: 14px;
  border-radius: 8px;
  flex: none;
}

.custom-search-container .search-button {
  width: 40px;
}

.custom-search-container .search-button img {
  height: 24px;
}
@media (max-width: 576px) {
  nav {
    flex-direction: column;
    gap: 16px;
    align-items: stretch; /* 로고, 검색 박스 등 전부 좌측 정렬로 */
  }

  .search-wrapper {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .custom-search-container {
    width: 100%;
  }

  .custom-search-container .search-container {
    width: 100%;
  }

  .custom-search-container .search-input {
    width: 100%;
    font-size: 13px;
  }

  .custom-search-container .search-button {
    align-self: flex-end;
  }

  .search-type-toggle {
    width: 100%;
  }
}
</style>
