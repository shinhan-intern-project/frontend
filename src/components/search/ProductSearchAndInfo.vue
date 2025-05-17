<template>
  <div class="product-search-and-info">
    <!-- 검색창 영역 -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchInput"
        placeholder="검색어를 입력해주세요"
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="isLoading" class="loading-indicator">
      <span>검색 중...</span>
    </div>

    <!-- 품목 정보 영역 -->
    <div v-else class="product-info-card">
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
            @click="handleProductSelect(item, index)"
          >
            <div class="product-info">
              <div class="product-logo">
                <span>{{ item.hsName ? item.hsName.charAt(0) : "" }}</span>
              </div>
              <div class="product-details">
                <div class="product-name">{{ item.hsName }}</div>
                <div class="product-code">{{ item.hsCode }}</div>
              </div>
            </div>
            <div class="product-stats">
              <div class="product-stat">HS코드</div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 관련 종목 -->
        <div class="related-stocks-list">
          <div v-if="!hasRelatedStocks && !isLoading" class="no-related-stocks">
            <span>관련 종목이 없습니다</span>
          </div>
          <div v-else-if="selectedProductIndex === -1 && hasRelatedStocks">
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
                <div class="related-stock-name">{{ stock.companyName }}</div>
                <div class="related-stock-code">
                  {{ stock.ticker }} | {{ formatPrice(stock.currentPrice) }}원 |
                  <span :class="getChangeClass(stock.changeRate)">
                    {{ displayChangeRate(stock.changeRate) }}
                  </span>
                  | {{ stock.relationType === "EXPORT" ? "수출" : "수입" }}
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
                <div class="related-stock-name">{{ stock.companyName }}</div>
                <div class="related-stock-code">
                  {{ stock.ticker }} | {{ formatPrice(stock.currentPrice) }}원 |
                  <span :class="getChangeClass(stock.changeRate)">
                    {{ displayChangeRate(stock.changeRate) }}
                  </span>
                  | {{ stock.relationType === "EXPORT" ? "수출" : "수입" }}
                </div>
              </div>
            </div>
            <div v-else class="no-related-stocks">
              <span>관련 종목이 없습니다</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductSearchAndInfo",
  props: {
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
  },
  data() {
    return {
      searchInput: this.searchKeyword,
    };
  },
  watch: {
    searchKeyword(newVal) {
      this.searchInput = newVal;
    },
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchInput);
    },
    handleProductSelect(product, index) {
      this.$emit("select-product", product, index);
    },
    displayChangeRate(rate) {
      // 문자열로 변환하고 %로 표시
      const numRate = parseFloat(rate);
      return numRate > 0 ? `+${numRate.toFixed(2)}%` : `${numRate.toFixed(2)}%`;
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
/* 검색창 스타일 */
.search-container {
  display: flex;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  width: 50px;
  background-color: #101c42;
  color: white;
  border: none;
  cursor: pointer;
}

/* 로딩 인디케이터 */
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  color: #888;
}

/* 품목 정보 카드 스타일 */
.product-info-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
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
}

.header-center {
  text-align: center;
  font-weight: 500;
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
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.related-stock-name {
  font-weight: 500;
  margin-bottom: 8px;
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
</style>
