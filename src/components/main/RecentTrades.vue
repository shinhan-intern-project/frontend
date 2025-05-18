<template>
  <div class="recent-trades">
    <div class="header-section">
      <h2>무역 품목 최근 수출입량</h2>
      <div class="toggle-container">
        <ToggleSwitch
          v-model="localCountry"
          :options="[
            { value: 'KR', label: '국내' },
            { value: 'US', label: '미국' },
          ]"
          @change="handleCountryChange"
        />
      </div>
      <div class="sort-direction" @click="toggleSortDirection">
        <span>{{ sortLabel }}</span>
        <img
          src="@/assets/images/icons/vuesax/linear/arrow-3.png"
          alt="정렬 방향"
          class="sort-arrow"
        />
      </div>
    </div>

    <div class="trades-table">
      <div class="trades-header">
        <div class="header-item header-product">품목</div>
        <div class="header-item header-import">수입</div>
        <div class="header-item header-export">수출</div>
      </div>

      <div v-if="effectiveIsLoading" class="loading-indicator">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>

      <div v-else-if="effectiveTradeItems.length === 0" class="empty-state">
        <img src="@/assets/images/icons/caution_navy.png" alt="정보" />
        <p>데이터가 없습니다</p>
      </div>

      <div v-else class="trades-items">
        <div
          v-for="(item, index) in effectiveTradeItems"
          :key="`trade-${index}`"
          :class="['trade-item', index % 2 === 0 ? 'even-row' : '']"
          @click="goToProductDetail(item.hsCodeId)"
        >
          <div class="item-name">
            <div class="item-name-content">
              <span class="hs-name" :title="item.hsName">{{
                truncateText(item.hsName, 25)
              }}</span>
              <span class="hs-code">{{ item.hsCode }}</span>
            </div>
          </div>
          <div class="item-values">
            <div class="item-value">{{ formatCurrency(item.importValue) }}</div>
          </div>
          <div class="item-values">
            <div class="item-value">{{ formatCurrency(item.exportValue) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTradeRankAPI } from "@/apis/product";
import ToggleSwitch from "@/components/toggle/ToggleSwitch.vue";

export default {
  name: "RecentTrades",
  components: {
    ToggleSwitch,
  },
  props: {
    tradeItems: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      default: "KR",
    },
  },
  data() {
    return {
      sortDirection: "import", // 'import' 또는 'export'
      localTradeItems: [],
      localIsLoading: false,
      localCountry: this.country || "KR",
    };
  },
  computed: {
    sortLabel() {
      return this.sortDirection === "import" ? "수입 금액순" : "수출 금액순";
    },
    effectiveTradeItems() {
      return this.tradeItems.length > 0
        ? this.tradeItems
        : this.localTradeItems;
    },
    effectiveIsLoading() {
      return this.isLoading !== undefined
        ? this.isLoading
        : this.localIsLoading;
    },
  },
  methods: {
    formatNumber(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatCurrency(value) {
      // 값이 1,000,000 이상이면 백만 단위로 표시
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}백만`;
      }
      // 값이 1,000 이상이면 천 단위로 표시
      else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}천`;
      }
      return this.formatNumber(value);
    },
    toggleSortDirection() {
      this.sortDirection =
        this.sortDirection === "import" ? "export" : "import";
      this.fetchTradeData();
      this.$emit("direction-change", this.sortDirection);
    },
    handleCountryChange(value) {
      this.fetchTradeData();
      this.$emit("country-change", value);
    },
    async fetchTradeData() {
      this.localIsLoading = true;
      try {
        const response = await getTradeRankAPI(
          this.localCountry,
          this.sortDirection,
          10
        );

        if (response && response.status === "OK") {
          this.localTradeItems = response.data.items;
        } else {
          this.localTradeItems = [];
        }
      } catch (error) {
        console.error(
          "무역 품목 데이터를 가져오는 중 오류가 발생했습니다:",
          error
        );
        this.localTradeItems = [];
      } finally {
        this.localIsLoading = false;
      }
    },
    goToProductDetail(hsCodeId) {
      if (hsCodeId) {
        this.$router.push(`/product/${hsCodeId}`);
      }
    },
    truncateText(text, maxLength) {
      if (!text) return "";
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    },
  },
  mounted() {
    if (this.country) {
      this.localCountry = this.country;
    }
    if (this.tradeItems.length === 0) {
      this.fetchTradeData();
    }
  },
  watch: {
    country(newVal) {
      if (newVal && newVal !== this.localCountry) {
        this.localCountry = newVal;
        this.fetchTradeData();
      }
    },
  },
};
</script>

<style scoped>
.recent-trades {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  min-width: 400px;

  box-shadow: 0px 4px 20px #cfdef1;
  margin-top: 20px;
  box-sizing: border-box;
}
.toggle-container {
  margin-left: 145px;
}
.header-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 15px 20px;
  margin-bottom: 0;
}
.header-import,
.header-export {
  text-align: right;
  padding-right: 30px;
}
.header-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #000c37;
  margin: 0;
}

.sort-direction {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.sort-arrow {
  width: 16px;
  height: 16px;
  margin-left: 5px;
}

.trades-table {
  overflow: hidden;
}

.trades-header {
  display: flex;
  padding: 10px 20px;
  background-color: white;
  font-weight: 400;
  color: #888;
  font-size: 13px;
  border-bottom: 1px solid #f1f3f5;
  margin-top: 0;
}

.header-item {
  flex: 1;
}

.header-item:first-child {
  flex: 1.5;
}

.trades-items {
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
}

.trade-item {
  display: flex;
  height: 40px;
  padding: 14px 15px;
  align-items: center;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.trade-item:hover {
  background-color: #f2f7ff;
}

.even-row {
  background-color: #f9fafb;
}

.even-row:hover {
  background-color: #f2f7ff;
}

.item-name {
  flex: 1.5;
  font-size: 14px;
  color: #333;
  overflow: hidden;
}

.item-name-content {
  display: flex;
  flex-direction: column;
}

.hs-name {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: #000c37;
}

.hs-code {
  font-size: 12px;
  color: #888;
}

.item-values {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.item-value {
  font-size: 14px;
  color: #000c37;
  margin-bottom: 4px;
  font-weight: 500;
}

.item-change {
  font-size: 13px;
}

.positive-change {
  color: #f03e3e;
}

.negative-change {
  color: #1971c2;
}

/* 로딩 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background-color: white;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2d7aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background-color: white;
}

.empty-state img {
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
}

.empty-state p {
  font-size: 16px;
  color: #000c37;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.trades-items::-webkit-scrollbar {
  width: 8px;
}

.trades-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.trades-items::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.trades-items::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

@media (max-width: 768px) {
  .item-name,
  .item-value {
    font-size: 13px;
  }

  .item-change {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .trades-header,
  .trade-item {
    font-size: 12px;
  }

  .sort-direction {
    display: none;
  }
}
</style>
