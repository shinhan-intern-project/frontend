<template>
  <!-- 기간 토글 버튼 -->
  <div class="chart-controls">
    <button
      v-for="opt in periodOptions"
      :key="opt.value"
      :class="{ active: chartType === opt.value }"
      @click="onChangeType(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>

  <div id="chart">
    <apexchart
      ref="chart"
      :options="chartOptions"
      :series="series"
      type="candlestick"
    />
  </div>
</template>

<script>
import { getProductTradeAPI, getTradeStatsGraph } from "@/apis/product.js";

export default {
  name: "LineGraph",
  props: {
    apiMode: {
      type: String,
      default: "product",
      validator: (v) => ["product", "all"].includes(v),
    },
    country: {
      type: String,
      default: "KR",
    },
  },

  data() {
    return {
      chartType: "month",
      series: [
        {
          name: "수출",
          type: "line",
          data: [],
        },
        {
          name: "수입",
          type: "line",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "line",
          height: 400,
          toolbar: { show: true },
        },
        stroke: {
          width: [2, 2],
        },
        xaxis: {
          type: "datetime",
          labels: { datetimeUTC: false },
        },
        yaxis: [
          {
            title: { text: "수출입량" },
          },
        ],
        tooltip: {
          shared: true,
        },
        legend: { position: "bottom" },
      },
    };
  },

  watch: {
    country: {
      immediate: true,
      handler() {
        this.getChartData();
      },
    },
  },

  methods: {
    async getChartData() {
      try {
        const productId = this.$route.params.productId;
        let res;

        if (this.apiMode === "all") {
          res = await getTradeStatsGraph({ country: this.country }); // 메인용
        } else {
          res = await getProductTradeAPI(productId); // 개별품목
        }

        // 3) 값 저장
        const prod = res.data || [];
        const countryKey = this.country.toLowerCase();
        // 4) 수출입량 라인 그래프
        // 4) 수출입량 라인 그래프
        if (prod[countryKey] && prod[countryKey].length > 0) {
          // 값이 0인 데이터 필터링하기 (exportValue와 importValue 모두 0인 경우 제외)
          const filteredData = prod[countryKey].filter(
            (item) => item.exportValue !== 0 || item.importValue !== 0
          );

          // 수출 데이터
          this.series[0].data = filteredData.map((item) => ({
            x: new Date(
              +item.date.slice(0, 4),
              +item.date.slice(4, 6) - 1
            ).getTime(),
            y: item.exportValue,
          }));

          // 수입 데이터
          this.series[1].data = filteredData.map((item) => ({
            x: new Date(
              +item.date.slice(0, 4),
              +item.date.slice(4, 6) - 1
            ).getTime(),
            y: item.importValue,
          }));
        } else {
          // 데이터가 없을 경우 빈 배열로 초기화
          this.series[0].data = [];
          this.series[1].data = [];
        }
      } catch (e) {
        console.error(e);
        this.series[0].data = [];
        this.series[1].data = [];
      }
    },
    onChangeType(type) {
      if (this.chartType === type) return;
      this.chartType = type;
      this.getChartData();
    },
  },
  async mounted() {
    await this.getChartData();
  },
};
</script>

<style scoped>
#chart {
  width: -webkit-fill-available;
  margin: 0 auto;
}

.chart-controls {
  display: flex;
  gap: 10px;
  margin: 12px 0;
}

.chart-controls button {
  padding: 4px 16px;
  border: none;
  background: #eee;
  cursor: pointer;
  border-radius: 4px;
}

.chart-controls button.active {
  background: #2d7aff;
  color: white;
}
</style>
