<template>
  <div class="hscode-search-and-info">
    <!-- 검색창 영역 -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchInput"
        placeholder="HS 코드 또는 품명을 입력해주세요"
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

    <!-- HS코드 정보 영역 -->
    <div v-else class="hscode-info-card">
      <div class="hscode-info-header">
        <div class="header-left">HS 코드</div>
        <!-- <div class="header-center">HS 코드와 관련된 종목</div> -->
        <div class="header-right"></div>
      </div>

      <div class="hscode-info-content">
        <!-- 왼쪽: HS코드 리스트 -->
        <div class="hscode-list">
          <div v-if="hscodeItems.length === 0" class="no-results">
            <span>검색 결과가 없습니다</span>
          </div>
          <div
            v-else
            v-for="(item, index) in hscodeItems"
            :key="`hscode-${index}`"
            class="hscode-item"
            :class="{ active: selectedHscodeIndex === index }"
            @click="handleHscodeSelect(item, index)"
          >
            <div class="hscode-info">
              <div class="hscode-logo">
                <span>{{ item.hsName ? item.hsName.charAt(0) : "" }}</span>
              </div>
              <div class="hscode-details">
                <div class="hscode-name">{{ item.description }}</div>
                <div class="hscode-code">{{ item.hsCode }}</div>
              </div>
            </div>
            <!-- <div class="hscode-stats">
              <div class="hscode-stat">국제통일상품분류</div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HSCodeSearchAndInfo",
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
    hscodeItems: {
      type: Array,
      default: () => [],
    },
    selectedHscodeIndex: {
      type: Number,
      default: -1,
    },
    searchKeyword: {
      type: String,
      default: "",
    },
    selectedHscode: {
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
    handleHscodeSelect(hscode, index) {
      this.$emit("select-hscode", hscode, index);
    },
    displayChangeRate(rate) {
      // 문자열로 변환하고 %로 표시
      const numRate = parseFloat(rate);
      return numRate > 0 ? `+${numRate.toFixed(2)}%` : `${numRate.toFixed(2)}%`;
    },
  },
  computed: {
    hscodeItemsWithStocks() {
      return this.hscodeItems.filter(
        (item) => item.relatedStocks && item.relatedStocks.length > 0
      );
    },
    hasRelatedStocks() {
      return this.hscodeItemsWithStocks.length > 0;
    },
  },
};
</script>

<style scoped>
/* 검색창 스타일 */
.search-container {
  box-shadow: 0px 4px 20px #cfdef1;
  display: flex;
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
}

.search-input {
  box-shadow: 0px 4px 20px #cfdef1;
  flex: 1;
  padding: 15px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  box-shadow: 0px 4px 20px #cfdef1;
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

/* HS코드 정보 카드 스타일 */
.hscode-info-card {
  box-shadow: 0px 4px 20px #cfdef1;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
}

.hscode-info-header {
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

.hscode-info-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

/* HS코드 리스트 스타일 */
.hscode-list,
.related-stocks-list {
  flex: 1;
  max-height: 400px;
  overflow-y: auto;
  border-right: 1px solid #eee;
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

.hscode-list::-webkit-scrollbar,
.related-stocks-list::-webkit-scrollbar {
  width: 6px;
}

.hscode-list::-webkit-scrollbar-track,
.related-stocks-list::-webkit-scrollbar-track {
  background: transparent;
}

.hscode-list::-webkit-scrollbar-thumb,
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

/* HS코드 항목 스타일 */
.hscode-item {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;
}

.hscode-item:hover {
  background-color: #f8f9fa;
}

.hscode-item.active {
  background-color: #e9f2ff;
}

.hscode-info {
  display: flex;
  align-items: center;
  flex: 2;
  min-width: 0;
}

.hscode-logo {
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

.hscode-details {
  flex: 1;
  overflow: hidden;
}

.hscode-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.hscode-code {
  color: #888;
  font-size: 14px;
}

.hscode-stats {
  text-align: right;
  min-width: 100px;
}

.hscode-stat {
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
  .hscode-info-content {
    flex-direction: column;
  }

  .hscode-list,
  .related-stocks-list {
    border-right: none;
    border-bottom: 1px solid #eee;
    max-height: 300px;
  }
}

@media (max-width: 576px) {
  .hscode-item {
    padding: 12px 15px;
  }

  .hscode-logo {
    width: 30px;
    height: 30px;
    font-size: 10px;
  }

  .hscode-stats {
    min-width: 80px;
  }
}
</style>
