<template>
  <div class="product-search-and-info">
    <!-- 검색창 영역 -->
    <div
      class="search-container"
      :class="{ 'is-detail-page': isDetailPage }"
      ref="searchContainer"
    >
      <input
        type="text"
        v-model="searchInput"
        placeholder="검색어를 입력해주세요"
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-button">
        <img
          src="@/assets/images/SearchButton.svg"
          alt="검색"
          @click="handleSearch"
        />
      </button>
    </div>

    <div class="on-off">
      <NetworkGraphCanvas v-if="!hideNetworkGraph" :type="'all'" />
      <div
        class="on-off-search"
        v-if="hasSearched && searchInput"
        ref="panel"
        @click.stop
      >
        <!-- 품목 정보 영역 -->
        <div class="product-info-card">
          <!-- 로딩 표시 -->
          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <span class="loading-text">검색 결과를 불러오고 있어요...</span>
          </div>

          <div v-else>
            <div class="product-info-header">
              <div class="header-left">품목</div>
              <div class="header-center">품목과 관련된 종목</div>
              <div class="header-right"></div>
            </div>
            <div class="product-info-content">
              <!-- 왼쪽: 품목 리스트 -->
              <div class="product-list">
                <div v-if="productItems.length === 0" class="no-results">
                  <span>검색 결과가 없습니다</span>
                </div>
                <div
                  v-else
                  v-for="(item, index) in productItems"
                  :key="`prod-${index}`"
                  class="product-item"
                  :class="{ active: selectedProductIndex === index }"
                  @click="goToProductPage(item)"
                  style="cursor: pointer"
                >
                  <div class="product-info">
                    <div class="product-details">
                      <div class="product-name">
                        {{ item.hsName }}
                      </div>
                      <div class="product-code">
                        {{ item.hsCode }}
                      </div>
                    </div>
                    <!-- 관련 종목 보기 버튼 추가 -->
                    <button
                      class="related-items-btn"
                      v-if="!isDetailPage"
                      @click.stop="handleProductSelect(item, index)"
                    >
                      관련 종목 보기
                    </button>
                  </div>
                </div>
              </div>
              <!-- 오른쪽: 관련 종목 -->
              <div class="related-stocks-list">
                <div
                  v-if="!hasRelatedStocks && !isLoading"
                  class="no-related-stocks"
                >
                  <span>관련 종목이 없습니다</span>
                </div>
                <div
                  v-else-if="selectedProductIndex === -1 && hasRelatedStocks"
                >
                  <div
                    v-for="(item, itemIdx) in productItemsWithStocks"
                    :key="`item-${itemIdx}`"
                    class="related-stock-group"
                  >
                    <div
                      v-for="(stock, stockIdx) in item.relatedStocks"
                      :key="`stock-${itemIdx}-${stockIdx}`"
                      class="related-stock"
                      @click="goToStockPage(stock)"
                      style="cursor: pointer"
                    >
                      <div class="related-stock-header">
                        <img
                          class="related-stock-logo"
                          :src="`https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stock.ticker}.png`"
                          alt="종목 아이콘"
                          @error="
                            (e) =>
                              (e.target.src =
                                'https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                          "
                        />
                        <div class="related-stock-name">
                          {{ stock.companyName }}
                        </div>
                      </div>
                      <div class="related-stock-code">
                        {{ stock.ticker }} |
                        {{
                          (console.log(stock),
                          stock.marketType == "NASDAQ"
                            ? stock.currentPrice
                            : Math.floor(stock.currentPrice))
                        }}
                        {{ stock.marketType === "NASDAQ" ? "USD" : "원" }}
                        |
                        <span :class="getChangeClass(stock.changeRate)">
                          {{ displayChangeRate(stock.changeRate) }}
                        </span>
                        |
                        {{ stock.relationType === "EXPORT" ? "수출" : "수입" }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="selectedProductIndex !== -1">
                  <div
                    v-if="
                      selectedProduct.relatedStocks &&
                      selectedProduct.relatedStocks.length > 0
                    "
                  >
                    <div
                      v-for="(stock, idx) in selectedProduct.relatedStocks"
                      :key="idx"
                      class="related-stock"
                    >
                      <div class="related-stock-header">
                        <img
                          class="related-stock-logo"
                          :src="`https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stock.ticker}.png`"
                          alt="종목 아이콘"
                          @error="
                            (e) =>
                              (e.target.src =
                                'https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                          "
                        />
                        <div class="related-stock-name">
                          {{ stock.companyName }}
                        </div>
                      </div>
                      <div class="related-stock-code">
                        {{ stock.ticker }} |
                        {{ formatPrice(stock.currentPrice) }}원 |
                        <span :class="getChangeClass(stock.changeRate)">
                          {{ displayChangeRate(stock.changeRate) }}
                        </span>
                        |
                        {{ stock.relationType === "EXPORT" ? "수출" : "수입" }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="no-related-stocks">
                    <span>관련 종목이 없습니다</span>
                  </div>
                </div>
              </div>
              <!-- 오른쪽: 관련 종목
                        <div class="related-stocks-list">
                          <div
                            v-if="!hasRelatedStocks && !isLoading"
                            class="no-related-stocks"
                          >
                            <span>관련 종목이 없습니다</span>
                          </div>
                          <div
                            v-else-if="
                              selectedProductIndex === -1 && hasRelatedStocks
                            "
                          >
                            <div
                              v-for="(item, itemIdx) in productItemsWithStocks"
                              :key="`item-${itemIdx}`"
                              class="related-stock-group"
                            >
                              <div
                                v-for="(stock, stockIdx) in item.relatedStocks"
                                :key="`stock-${itemIdx}-${stockIdx}`"
                                class="related-stock"
                              >
                                <div class="related-stock-header">
                                  <img
                                    class="related-stock-logo"
                                    :src="`https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stock.ticker}.png`"
                                    alt="종목 아이콘"
                                    @error="
                                      (e) =>
                                        (e.target.src =
                                          'https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                                    "
                                  />
                                  <div class="related-stock-name">
                                    {{ stock.companyName }}
                                  </div>
                                </div>
                                <div class="related-stock-code">
                                  {{ stock.ticker }} |
                                  {{
                                    (console.log(stock),
                                    stock.marketType == "NASDAQ"
                                      ? stock.currentPrice
                                      : Math.floor(stock.currentPrice))
                                  }}
                                  {{
                                    stock.marketType === "NASDAQ" ? "USD" : "원"
                                  }}
                                  |
                                  <span
                                    :class="getChangeClass(stock.changeRate)"
                                  >
                                    {{ displayChangeRate(stock.changeRate) }}
                                  </span>
                                  |
                                  {{
                                    stock.relationType === "EXPORT"
                                      ? "수출"
                                      : "수입"
                                  }}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else-if="selectedProductIndex !== -1">
                            <div
                              v-if="
                                selectedProduct.relatedStocks &&
                                selectedProduct.relatedStocks.length > 0
                              "
                            >
                              <div
                                v-for="(
                                  stock, idx
                                ) in selectedProduct.relatedStocks"
                                :key="idx"
                                class="related-stock"
                              >
                                <div class="related-stock-header">
                                  <img
                                    class="related-stock-logo"
                                    :src="`https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stock.ticker}.png`"
                                    alt="종목 아이콘"
                                    @error="
                                      (e) =>
                                        (e.target.src =
                                          'https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                                    "
                                  />
                                  <div class="related-stock-name">
                                    {{ stock.companyName }}
                                  </div>
                                </div>
                                <div class="related-stock-code">
                                  {{ stock.ticker }} |
                                  {{ formatPrice(stock.currentPrice) }}원 |
                                  <span
                                    :class="getChangeClass(stock.changeRate)"
                                  >
                                    {{ displayChangeRate(stock.changeRate) }}
                                  </span>
                                  |
                                  {{
                                    stock.relationType === "EXPORT"
                                      ? "수출"
                                      : "수입"
                                  }}
                                </div>
                              </div>
                            </div>
                            <div v-else class="no-related-stocks">
                              <span>관련 종목이 없습니다</span>
                            </div>
                          </div>
                        </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkGraphCanvas from "@/components/network/NetworkGraph.vue";

export default {
  name: "ProductSearchAndInfo",
  components: {
    NetworkGraphCanvas,
  },
  props: {
    isDetailPage: {
      type: Boolean,
      default: false, // 기본은 메인 페이지로 간주
    },
    formatPrice: {
      type: Function,
      required: true,
    },
    formatChangeRate: {
      type: Function,
      required: true,
    },
    getChangeClass: {
      type: Function,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    productItems: {
      type: Array,
      default: () => [],
    },
    selectedProductIndex: {
      type: Number,
      default: -1,
    },
    searchKeyword: {
      type: String,
      default: "",
    },
    selectedProduct: {
      type: Object,
      default: () => ({}),
    },
    hideNetworkGraph: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchInput: this.searchKeyword,
      hasSearched: false, // 검색 시점 플래그
    };
  },
  mounted() {
    document.addEventListener("click", this.onClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onClickOutside);
  },
  watch: {
    searchKeyword(newVal) {
      this.searchInput = newVal;
    },
  },
  methods: {
    showNetworkGraph: {
      type: Boolean,
      default: true,
    },
    handleSearch() {
      this.$emit("search", this.searchInput);
      this.hasSearched = true;
    },
    handleProductSelect(product, index) {
      this.$emit("select-product", product, index);
    },
    displayChangeRate(rate) {
      // 문자열로 변환하고 %로 표시
      const numRate = parseFloat(rate);
      return numRate > 0 ? `+${numRate.toFixed(2)}%` : `${numRate.toFixed(2)}%`;
    },
    goToProductPage(product) {
      this.$router.push({
        name: "product",
        params: { productId: product.hsCodeId },
      });
    },

    goToStockPage(item) {
      this.$router.push({ name: "stock", params: { stockId: item.stockId } });
    },
    onClickOutside(event) {
      // 검색창 영역이나 결과 패널 내부를 클릭한 게 아니면 닫기
      const sc = this.$refs.searchContainer;
      const panel = this.$refs.panel;
      if (
        this.hasSearched &&
        sc &&
        panel &&
        !sc.contains(event.target) &&
        !panel.contains(event.target)
      ) {
        this.hasSearched = false;
      }
    },
  },
  computed: {
    productItemsWithStocks() {
      return this.productItems.filter(
        (item) => item.relatedStocks && item.relatedStocks.length > 0
      );
    },
    hasRelatedStocks() {
      return this.productItemsWithStocks.length > 0;
    },
  },
};
</script>

<style scoped>
.loading-indicator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background-color: white;
  border-radius: 10px;
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); */
  color: #333;
  min-height: 200px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #3182f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.product-search-and-info {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
/* .on-off-search {
  position: absolute;
  top: 0px;
  width: 1200px;
  z-index: 1000;
} */
.related-items-btn {
  background: #3182f6;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 8px 0 rgba(49, 130, 246, 0.08);
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  margin-left: 12px;
}

.related-items-btn:hover,
.related-items-btn:focus {
  background: #1563c7;
  box-shadow: 0 4px 16px 0 rgba(49, 130, 246, 0.16);
}

.related-stock-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.related-stock-logo {
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
  font-size: 12px;
}

/* 검색창 스타일 */
.search-container {
  box-shadow: 0px 4px 20px #cfdef1;

  display: flex;
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
  /* width: 600px; */

  max-width: 100%;
}
.search-container.is-detail-page {
  width: 600px;
  max-width: none;
}
.search-input::placeholder {
  color: #b8b8b8;
  font-size: 14px;
}

.search-input {
  box-shadow: 0px 4px 20px #cfdef1;
  flex: 1;
  padding: 16px 25px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  width: 50px;
  background-color: white;
  border: none;
  cursor: pointer;
}
.search-button img {
  height: 35px;
  margin-top: 3px;
}

/* 로딩 인디케이터 */
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  flex: 1;

  background-color: white;
  border-radius: 10px;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  margin-bottom: 30px;
  color: #888;
}

/* 품목 정보 카드 스타일 */
.product-info-card {
  min-height: 447px;
  box-shadow: 0px 4px 20px #cfdef1;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
  position: relative;
  z-index: 9999;
}

.product-info-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.header-left {
  text-align: left;
  font-weight: 700;
  font-family: "Pretendard Bold" !important;
}
.header-center {
  margin-left: 120px;
  text-align: center;
  font-weight: 700;
  font-family: "Pretendard Bold" !important;
}

.header-right {
  text-align: right;
}

.product-info-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

/* 품목 리스트 스타일 */
.product-list,
.related-stocks-list {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  border-right: 1px solid #eee;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.product-list::-webkit-scrollbar,
.related-stocks-list::-webkit-scrollbar {
  width: 6px;
}

.product-list::-webkit-scrollbar-track,
.related-stocks-list::-webkit-scrollbar-track {
  background: transparent;
}

.product-list::-webkit-scrollbar-thumb,
.related-stocks-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.related-stocks-list {
  border-right: none;
}

.no-results,
.no-related-stocks {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
  color: #888;
  font-size: 16px;
  text-align: center;
}

/* 품목 항목 스타일 */
.product-item {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
}

.product-item:hover {
  background-color: #f8f9fa;
}

.product-item.active {
  background-color: #e9f2ff;
}

.product-info {
  display: flex;
  align-items: center;
  flex: 2;
  min-width: 0;
}

.product-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #034ea2;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.product-details {
  flex: 1;
  overflow: hidden;
}

.product-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.product-code {
  color: #888;
  font-size: 14px;
}

.product-stats {
  text-align: right;
  min-width: 100px;
}

.product-stat {
  font-size: 14px;
  color: #888;
}

/* 관련 종목 스타일 */
.related-stock {
  display: flex;
  flex-direction: column;
  padding: 5px 20px;
  border-bottom: 1px solid #eee;
}

.related-stock-name {
  font-weight: 500;
  /* margin-bottom: 8px; */
  width: 100%;
  white-space: normal;
  line-height: 1.4;
  max-height: 4.2em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.related-stock-code {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.related-stock-code::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #034ea2;
  margin-right: 6px;
}

.positive-change {
  color: #f03e3e;
}

.negative-change {
  color: #1971c2;
}

.zero-change {
  color: #333;
}

@media (max-width: 992px) {
  .product-info-content {
    flex-direction: column;
  }

  .product-list,
  .related-stocks-list {
    border-right: none;
    border-bottom: 1px solid #eee;
    max-height: 300px;
  }
  .header-center {
    display: none;
  }
}

@media (max-width: 576px) {
  .product-item {
    padding: 12px 15px;
  }

  .product-logo {
    width: 30px;
    height: 30px;
    font-size: 10px;
  }

  .product-stats {
    min-width: 80px;
  }
}
.on-off {
  position: relative;
}
.on-off-search {
  position: relative;
  /* display: flex; */
  position: absolute;
  top: 0px;
  width: 100%;

  right: 0px;
}
</style>
