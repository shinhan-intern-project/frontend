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
        <img
          src="@/assets/images/SearchButton.svg"
          alt="검색"
          @click="handleSearch"
        />
      </button>
    </div>
    <NetworkGraphCanvas :type="'all'" />

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
            @click="goToStockPage(item)"
          >
            <div class="company-info">
              <img
                class="company-logo"
                :src="`https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${item.code}.png`"
                alt="종목 아이콘"
                @error="
                  (e) =>
                    (e.target.src =
                      'https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                "
              />

              <div class="company-details">
                <span class="company-name">{{ item.name }}</span>
                <span class="company-code">{{ item.code }}</span>
              </div>
            </div>
            <!-- 관련 품목 보기 버튼 추가 -->

            <div class="price-info">
              <div class="current-price">
                {{
                  item.marketType === "NASDAQ"
                    ? Number(item.price).toLocaleString()
                    : Math.floor(item.price).toLocaleString()
                }}
                {{ item.marketType === "NASDAQ" ? "USD" : "원" }}
              </div>
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
            <button
              class="related-items-btn"
              @click.stop="handleStockSelect(item, index)"
            >
              관련 품목 보기
            </button>
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
            :class="{ active: selectedProductIndex === index }"
            @click="goToProductPage(item)"
            style="cursor: pointer"
          >
            <div class="related-item-name">{{ item.name }}</div>
            <div class="related-item-code">{{ item.stockName }}</div>
            <div class="related-item-code">{{ item.code }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NetworkGraphCanvas from "@/components/network/NetworkGraph.vue";

export default {
  name: "StockSearchAndInfo",
  components: {
    NetworkGraphCanvas,
  },
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
      this.relatedItemsForStock = null;
    },
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchInput);
    },
    handleStockSelect(stock, index) {
      this.$emit("select-stock", stock, index);
    },
    goToStockPage(item) {
      this.$router.push({ name: "stock", params: { stockId: item.stockId } });
    },
    goToProductPage(stock) {
      this.$router.push({
        name: "product",
        params: { productId: stock.hscodeId },
      });
    },
  },
};
</script>

<style scoped>
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

/* 검색창 스타일 */
.search-container {
  box-shadow: 0px 4px 20px #cfdef1;

  display: flex;
  margin-bottom: 30px;
  border-radius: 13px;
  overflow: hidden;
}
.search-input::placeholder {
  color: #b8b8b8; /* 원하는 색상으로 변경 */
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
  box-shadow: 0px 4px 20px #cfdef1;
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

.stock-info-content {
  display: flex;
  flex-direction: row;
}

/* 종목 리스트 스타일 */
.stock-list {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  border-right: 1px solid #eee;
}
.related-items-list {
  height: 400px;
  flex: 1;
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
  height: 40px;
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
}

.related-item:hover {
  background-color: #f2f7ff;
}
.related-item.active {
  background-color: #e9f2ff;
}
.stock-item:hover {
  background-color: #f2f7ff;
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
  gap: 6px;
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
  margin-right: 8px;
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
  height: 46px;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}

.related-item-name {
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #374151;
}

.related-item-code {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
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
