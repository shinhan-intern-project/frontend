<template>
  <div class="volume-ranking">
    <div class="header-section">
      <h2>종목 거래량 Top 10</h2>

      <ToggleSwitch
        v-model="marketType"
        :options="[
          { value: 'domestic', label: '국내' },
          { value: 'overseas', label: '미국' },
        ]"
        @change="onMarketTypeChange"
      />
    </div>

    <div class="volume-table-header">
      <div class="col-header rank">순위</div>
      <div class="col-header stock-name">종목명</div>
      <div class="col-header price">현재가</div>
      <div class="col-header change-rate">등락률</div>
      <div class="col-header volume">거래량</div>
    </div>

    <div v-if="isLoading" class="loading-indicator">
      <div class="spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>

    <div v-else class="volume-table">
      <div
        v-for="(item, index) in stocks"
        :key="`volume-${index}`"
        :class="['volume-item', index % 2 === 0 ? 'even-row' : '']"
      >
        <div class="item-rank">{{ index + 1 }}</div>
        <div class="item-company">
          <div class="company-logo">
            <img
              class="company-logo"
              :src="`https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${item.ticker}.png`"
              alt="종목 아이콘"
              @error="
                (e) =>
                  (e.target.src =
                    'https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
              "
            />
          </div>
          <div class="company-details">
            <div class="company-name">{{ item.companyName }}</div>
            <div class="company-code">{{ item.ticker }}</div>
          </div>
        </div>
        <div class="item-price">{{ formatPrice(item.currentPrice) }}원</div>
        <div
          class="item-change"
          :class="{
            'positive-change': parseFloat(item.changeRate) > 0,
            'negative-change': parseFloat(item.changeRate) < 0,
            'zero-change': parseFloat(item.changeRate) == 0,
          }"
        >
          {{ formatChangeRate(item.changeRate) }}
        </div>
        <div class="item-volume">{{ formatCompactVolume(item.volume) }}주</div>
      </div>
    </div>
  </div>
</template>

<script>
import ToggleSwitch from "../toggle/ToggleSwitch.vue";

export default {
  name: "TopVolumeRanking",
  components: {
    ToggleSwitch,
  },
  props: {
    stocks: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      marketType: "domestic", // 기본값 '국내' (해외 추가해야됨)
    };
  },
  methods: {
    // 시장 유형 변경 시 이벤트 처리
    onMarketTypeChange(value) {
      console.log("시장 유형 변경:", value);
      this.$emit("market-change", value);
    },

    // 첫 글자 가져오기 (로고용)
    getFirstChar(name) {
      if (!name) return "?";
      return name.substring(0, 1);
    },

    // 가격 포맷 함수
    formatPrice(price) {
      return parseFloat(price).toLocaleString();
    },

    // 거래량 포맷 함수 (콤팩트 형식)
    formatCompactVolume(volume) {
      const num = parseInt(volume);
      if (isNaN(num)) return "0";

      // 백만 단위 이상일 경우 축약
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      }

      // 천 단위 이상일 경우 축약
      if (num >= 1000) {
        return (num / 1000).toFixed(0) + "K";
      }

      return num.toLocaleString();
    },

    formatVolume(volume) {
      return parseInt(volume).toLocaleString();
    },

    formatChangeRate(rate) {
      const value = parseFloat(rate);
      if (isNaN(value)) return "0.0%";

      const formattedValue = Math.abs(value) < 1 ? value * 100 : value;

      return `${value > 0 ? "+" : ""}${formattedValue.toFixed(1)}%`;
    },
  },
};
</script>

<style scoped>
.volume-ranking {
  box-shadow: 0px 4px 20px #cfdef1 !important;

  background-color: #f9fafb;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
}

.header-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 20px 20px 15px 20px;
}

.header-section h2 {
  font-size: 18px;

  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-section :deep(.segmented-control) {
  margin-left: 20px;
  width: 130px;
}

.header-section :deep(.segmented-control) {
  width: 130px;
}

.volume-table-header {
  display: flex;
  padding: 10px 15px;
  background-color: white;
  font-weight: 400;
  color: #888;
  font-size: 13px;
  border-bottom: 1px solid #f1f3f5;
  margin-top: 0;
}

.col-header {
  text-align: center;
}

.col-header.rank {
  flex: 0.8;
  text-align: center;
}

.col-header.stock-name {
  flex: 3;
  text-align: left;
  padding-left: 8px;
}

.col-header.price,
.col-header.change-rate,
.col-header.volume {
  flex: 1.5;
  text-align: right;
}

.volume-table {
  overflow: hidden;
}

.volume-item {
  display: flex;
  padding: 14px 15px;
  align-items: center;
  background-color: white;
}

.even-row {
  background-color: #f9fafb;
}

.item-rank {
  flex: 0.8;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  color: #333;
}

.item-company {
  flex: 3;
  display: flex;
  align-items: center;
}

.company-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #034ea2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 13px;
  border-style: none;
}

.company-details {
  margin-left: 10px;
}

.company-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.company-code {
  color: #888;
  font-size: 12px;
  margin-top: 2px;
}

.item-price,
.item-change,
.item-volume {
  flex: 1.5;
  text-align: right;
  font-size: 14px;
}

.item-price {
  color: #333;
}

.positive-change {
  color: #f03e3e;
}

.negative-change {
  color: #1971c2;
}

.zero-change {
  color: #495057;
}

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
  .item-volume {
    font-size: 13px;
  }

  .company-name {
    font-size: 13px;
  }

  .company-code {
    font-size: 11px;
  }
}

@media (max-width: 576px) {
  .company-details {
    display: none;
  }

  .item-volume,
  .col-header.volume {
    display: none;
  }
}
</style>
