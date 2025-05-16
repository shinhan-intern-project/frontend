<template>
  <div class="stock-search-and-info">
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

    <!-- 종목 정보 영역 -->
    <div v-else class="stock-info-card">
      <div class="stock-info-header">
        <div class="header-left">종목</div>
        <div class="header-center">종목과 관련된 품목</div>
        <div class="header-right"></div>
      </div>

      <div class="stock-info-content">
        <!-- 왼쪽: 종목 리스트 -->
        <div class="stock-list">
          <div v-if="stockItems.length === 0" class="no-results">
            <span>검색 결과가 없습니다</span>
          </div>
          <div
            v-else
            v-for="(item, index) in stockItems"
            :key="`top-${index}`"
            class="stock-item"
            :class="{ active: selectedStockIndex === index }"
            @click="handleStockSelect(item, index)"
          >
            <div class="company-info">
              <div class="company-logo">
                <span>{{ item.name.charAt(0) }}</span>
              </div>
              <div class="company-details">
                <div class="company-name">{{ item.name }}</div>
                <div class="company-code">{{ item.code }}</div>
              </div>
            </div>
            <div class="price-info">
              <div class="current-price">{{ item.price }}</div>
              <div
                class="price-change"
                :class="{
                  'zero-change': item.changePercent === '0.0%',
                  'positive-change': parseFloat(item.changePercent) > 0,
                  'negative-change': parseFloat(item.changePercent) < 0,
                }"
              >
                {{ item.changePercent }}
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 관련 품목 -->
        <div class="related-items-list">
          <div v-if="relatedItems.length === 0" class="no-related-items">
            <span>관련 품목이 없습니다</span>
          </div>
          <div
            v-else
            v-for="(item, index) in relatedItems"
            :key="`related-${index}`"
            class="related-item"
          >
            <div class="related-item-name">{{ item.name }}</div>
            <div class="related-item-code">{{ item.stockName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StockSearchAndInfo",
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    stockItems: {
      type: Array,
      default: () => [],
    },
    relatedItems: {
      type: Array,
      default: () => [],
    },
    selectedStockIndex: {
      type: Number,
      default: -1,
    },
    searchKeyword: {
      type: String,
      default: "",
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
    handleStockSelect(stock, index) {
      this.$emit("select-stock", stock, index);
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

/* 종목 정보 카드 스타일 */
.stock-info-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.stock-info-header {
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

.stock-info-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

/* 종목 리스트 스타일 */
.stock-list,
.related-items-list {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  border-right: 1px solid #eee;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.stock-list::-webkit-scrollbar,
.related-items-list::-webkit-scrollbar {
  width: 6px;
}

.stock-list::-webkit-scrollbar-track,
.related-items-list::-webkit-scrollbar-track {
  background: transparent;
}

.stock-list::-webkit-scrollbar-thumb,
.related-items-list::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.related-items-list {
  border-right: none;
}

.no-results,
.no-related-items {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
  color: #888;
  font-size: 16px;
  text-align: center;
}

/* 종목 항목 스타일 */
.stock-item {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
}

.stock-item:hover {
  background-color: #f8f9fa;
}

.stock-item.active {
  background-color: #e9f2ff;
}

.company-info {
  display: flex;
  align-items: center;
  flex: 2;
  min-width: 0;
}

.company-logo {
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

.company-details {
  flex: 1;
  overflow: hidden;
}

.company-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.company-code {
  color: #888;
  font-size: 14px;
}

.price-info {
  text-align: right;
  min-width: 100px;
}

.current-price {
  font-weight: 500;
}

.price-change {
  font-size: 14px;
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

/* 관련 품목 스타일 */
.related-item {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.related-item-name {
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

.related-item-code {
  color: #666;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.related-item-code::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #034ea2;
  margin-right: 6px;
}

@media (max-width: 992px) {
  .stock-info-content {
    flex-direction: column;
  }

  .stock-list,
  .related-items-list {
    border-right: none;
    border-bottom: 1px solid #eee;
    max-height: 300px;
  }
}

@media (max-width: 576px) {
  .stock-item {
    padding: 12px 15px;
  }

  .company-logo {
    width: 30px;
    height: 30px;
    font-size: 10px;
  }

  .price-info {
    min-width: 80px;
  }
}
</style>
