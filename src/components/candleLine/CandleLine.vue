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

    <!-- 국가 토글 - ToggleSwitch 컴포넌트 사용 -->
    <div class="country-selector">
      <span class="selector-label"></span>
      <ToggleSwitch
        v-model="selectedCountry"
        :options="countryOptions"
        @change="onChangeCountry"
      />
    </div>
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
import { getStockChartAPI } from "@/apis/stock.js";
import ToggleSwitch from "../toggle/ToggleSwitch.vue";
export default {
  name: "CandleLine",
  components: {
    ToggleSwitch,
  },
  data() {
    return {
      chartType: "month",
      selectedCountry: "kr", // 기본값은 한국

      periodOptions: [
        { label: "일", value: "day" },
        { label: "주", value: "week" },
        { label: "월", value: "month" },
        { label: "분기", value: "quarter" },
        { label: "년", value: "year" },
      ],
      countryOptions: [
        { label: "한국", value: "kr" },
        { label: "미국", value: "us" },
      ],
      series: [
        {
          name: "Candle",
          type: "candlestick",
          data: [],
          yAxisIndex: 0,
        },
      ],
      chartOptions: {
        chart: {
          type: "candlestick",
          height: 400,
          toolbar: { show: true },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#E74142",
              downward: "#2D7AFF",
            },
            wick: {
              useFillColor: true,
            },
            barWidth: 150,
          },
        },
        stroke: {
          width: [1],
        },
        xaxis: {
          type: "datetime",
          labels: { datetimeUTC: false },
        },
        yaxis: [
          {
            title: { text: "Candle 값" },
            opposite: false, // primary 축
            min: undefined, // 자동 스케일
            max: undefined,
          },
          {
            title: { text: "Line 값" },
            opposite: true, // secondary 축
            min: undefined,
            max: undefined,
          },
        ],
        tooltip: {
          shared: true,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            if (seriesIndex === 0) {
              // 캔들 툴팁
              const o = w.globals.seriesCandleO[0][dataPointIndex];
              const h = w.globals.seriesCandleH[0][dataPointIndex];
              const l = w.globals.seriesCandleL[0][dataPointIndex];
              const c = w.globals.seriesCandleC[0][dataPointIndex];
              return `
        <div class="apexcharts-tooltip-candlestick">
          <div>Open : ${o}</div>
          <div>High : ${h}</div>
          <div>Low  : ${l}</div>
          <div>Close: ${c}</div>
        </div>`;
            } else {
              // 라인 툴팁 (종가 등)
              const val = w.globals.series[seriesIndex][dataPointIndex];
              return `<div>${val}</div>`;
            }
          },
        },

        legend: { position: "bottom" },
      },
    };
  },
  methods: {
    async getChartData() {
      try {
        this.series = [
          {
            name: "Candle",
            type: "candlestick",
            data: [],
            yAxisIndex: 0,
          },
        ];

        // 1) 경로에서 stockId 꺼내기
        const stockId = this.$route.params.stockId;
        // 2) API 호출
        const res = await getStockChartAPI(
          stockId,
          this.chartType,
          this.selectedCountry
        );
        // 3) 값 저장
        const stock = res.data.data[0].stock;
        const relatedProducts = res.data.data[0].relatedProducts || [];
        // 4) 캔들 시리즈에 매핑
        this.series[0].data = stock.prices.map((p) => ({
          // 날짜 문자열을 timestamp 로 변환
          x: new Date(
            p.date.slice(0, 4),
            Number(p.date.slice(4, 6)) - 1,
            p.date.slice(6, 8) || "01"
          ).getTime(),
          y: [p.open_price, p.high_price, p.low_price, p.close_price],
        }));

        // 5) 수출입량 라인 그래프
        relatedProducts.forEach((prod) => {
          // 선택된 국가의 데이터 사용
          const countryData = prod[this.selectedCountry] || [];
          // 5-1) 수출 라인
          this.series.push({
            name: `수출: ${prod.hscodeId}`,
            type: "line",
            data: countryData.map((item) => ({
              x: new Date(
                +item.date.slice(0, 4),
                +item.date.slice(4, 6) - 1
              ).getTime(),
              y: item.exportValue,
            })),
            yAxisIndex: 1,
          });
          // 5-2) 수입 라인
          this.series.push({
            name: ` 수입: ${prod.hscodeId}`,
            type: "line",
            data: countryData.map((item) => ({
              x: new Date(
                +item.date.slice(0, 4),
                +item.date.slice(4, 6) - 1
              ).getTime(),
              y: item.importValue,
            })),
            yAxisIndex: 1,
          });
        });
      } catch (e) {
        console.error(e);
      }
    },
    onChangeType(type) {
      if (this.chartType === type) return;
      this.chartType = type;
      this.getChartData();
    },
    // 국가 변경 메서드
    onChangeCountry() {
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
  justify-content: space-between;
  align-items: center;
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
.country-selector {
  display: flex;
  align-items: center;
  margin-left: auto; /* 오른쪽으로 밀기 */
}

.chart-controls button.active {
  background: #2d7aff;
  color: white;
}
</style>
