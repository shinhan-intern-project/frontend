<template>
  <div class="export-import-stats">
    <!-- <div class="header-section"> -->
    <div class="header-section-inside">
      <h2>수출입 통계 그래프</h2>

      <!-- <slot name="extra"></slot> -->

      <!-- <div class="graph-section"> -->
      <LineGraph
        :country="country"
        @update:country="updateCountry"
        :apiMode="'all'"
      />
      <!-- </div> -->
      <!-- </div> -->
    </div>

    <div class="stats-table">
      <!-- <div class="stats-header">
        <div class="header-item">품목</div>
        <div class="header-item">수입</div>
        <div class="header-item">수출 금액</div>
        <div class="header-item">수출 증감</div>
      </div> -->

      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>

      <div v-else class="stats-items">
        <div
          v-for="(item, index) in statsItems"
          :key="`stat-${index}`"
          :class="['stat-item', index % 2 === 0 ? 'even-row' : '']"
        >
          <div class="item-name">{{ item.name }}</div>
          <div class="item-import">{{ formatNumber(item.importValue) }}</div>
          <div class="item-export">{{ formatNumber(item.exportValue) }}</div>
          <div
            class="item-change"
            :class="{
              'positive-change': item.change > 0,
              'negative-change': item.change < 0,
            }"
          >
            {{ item.change > 0 ? "+" : "" }}{{ item.change }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineGraph from "../line/LineGraph.vue";
export default {
  name: "ExportImportStats",
  props: {
    country: {
      type: String,
      default: "KR",
    },
    statsItems: {
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
  },
  components: {
    LineGraph,
  },
};
</script>

<style scoped>
.export-import-stats {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  box-shadow: 0px 4px 20px #cfdef1;
}

.header-section {
  /* display: flex; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px 20px 20px;
  margin-bottom: 0;
}

.header-section-inside {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 20px 20px 15px 20px;
  align-items: center;
  /* margin-top: 20px;
  margin-left: 15px;
  margin-right: 15px; */
  margin-bottom: 20px;
}
.header-section-inside h2 {
  font-size: 18px;
  font-weight: 600;
  color: #000c37;
  margin: 0;
}

.stats-table {
  overflow: hidden;
}

.stats-header {
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

.stats-items {
  overflow: hidden;
}

.stat-item {
  display: flex;
  padding: 14px 15px;
  align-items: center;
  background-color: white;
}

.even-row {
  background-color: #f9fafb;
}

.item-name,
.item-import,
.item-export,
.item-change {
  flex: 1;
  font-size: 14px;
}

.item-name {
  flex: 1.5;
  color: #333;
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
  .item-import,
  .item-export,
  .item-change {
    font-size: 13px;
  }
}

@media (max-width: 576px) {
  .stats-header,
  .stat-item {
    font-size: 12px;
  }
}
</style>
