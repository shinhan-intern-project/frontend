<template>
  <div class="recent-trades">
    <div class="header-section">
      <h2>무역 품목 최근 수출입량</h2>
      <div class="sort-direction">
        <span>수출 금액순</span>
        <i class="fas fa-arrow-down"></i>
      </div>
    </div>

    <div class="trades-table">
      <div class="trades-header">
        <div class="header-item">품목</div>
        <div class="header-item">수입</div>
        <div class="header-item">수출</div>
      </div>

      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>

      <div v-else class="trades-items">
        <div
          v-for="(item, index) in tradeItems"
          :key="`trade-${index}`"
          :class="['trade-item', index % 2 === 0 ? 'even-row' : '']"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-values">
            <div class="item-value">{{ formatNumber(item.importValue) }}</div>
            <div
              class="item-change"
              :class="{
                'positive-change': item.importChange > 0,
                'negative-change': item.importChange < 0,
              }"
            >
              {{ formatPercentage(item.importChange) }}
            </div>
          </div>
          <div class="item-values">
            <div class="item-value">{{ formatNumber(item.exportValue) }}</div>
            <div
              class="item-change"
              :class="{
                'positive-change': item.exportChange > 0,
                'negative-change': item.exportChange < 0,
              }"
            >
              {{ formatPercentage(item.exportChange) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecentTrades",
  props: {
    tradeItems: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatNumber(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatPercentage(value) {
      return `${value > 0 ? "+" : ""}${value}%`;
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 15px 20px;
  margin-bottom: 0;
}

.header-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.sort-direction {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
}

.sort-direction i {
  margin-left: 5px;
}

.trades-table {
  overflow: hidden;
}

.trades-header {
  display: flex;
  padding: 10px 15px;
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
}

.trade-item {
  display: flex;
  padding: 14px 15px;
  align-items: center;
  background-color: white;
}

.even-row {
  background-color: #f9fafb;
}

.item-name {
  flex: 1.5;
  font-size: 14px;
  color: #333;
}

.item-values {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-value {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
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

/* 로딩 인디케이터 */
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
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 반응형 스타일 */
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
