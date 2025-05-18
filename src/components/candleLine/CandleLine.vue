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

    <!-- 국가 토글 -->
    <div class="country-selector">
      <ToggleSwitch
        v-model="selectedCountry"
        :options="countryOptions"
        @change="onChangeCountry"
      />
    </div>
  </div>

  <!-- 차트 -->
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
      selectedCountry: "kr",

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
            opposite: false,
          },
          {
            title: { text: "Line 값" },
            opposite: true,
          },
        ],
        tooltip: {
          shared: true,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            if (seriesIndex === 0) {
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
              const val = w.globals.series[seriesIndex][dataPointIndex];
              return `<div>${val}</div>`;
            }
          },
        },
        legend: {
          show: true,
          position: "bottom",
        },
      },
    };
  },
  methods: {
    async getChartData() {
      try {
        this.series = [
          {
            name: "주가 캔들 차트",
            type: "candlestick",
            data: [],
            yAxisIndex: 0,
          },
        ];

        const stockId = this.$route.params.stockId;
        const res = await getStockChartAPI(
          stockId,
          this.chartType,
          this.selectedCountry
        );

        const stock = res.data.data[0].stock;
        const relatedProducts = res.data.data[0].relatedProducts || [];

        this.series[0].data = stock.prices.map((p) => ({
          x: new Date(
            p.date.slice(0, 4),
            Number(p.date.slice(4, 6)) - 1,
            p.date.slice(6, 8) || "01"
          ).getTime(),
          y: [p.open_price, p.high_price, p.low_price, p.close_price],
        }));

        relatedProducts.forEach((prod) => {
          const countryData = prod[this.selectedCountry] || [];

          this.series.push({
            name: `${prod.hscode}번 품목 - 수출`,
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

          this.series.push({
            name: `${prod.hscode}번 품목 - 수입`,
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

.chart-controls button.active {
  background: #2d7aff;
  color: white;
}

.country-selector {
  display: flex;
  align-items: center;
  margin-left: auto;

}
::v-deep .apexcharts-legend {

  gap: 40px; /* 모든 그룹 사이에 간격 적용됨 */
}
::v-deep .apexcharts-legend-group-1.apexcharts-legend-group-vertical {
  margin-top: 10px;
  margin-bottom: 0;
  display: grid !important;
  grid-template-rows: repeat(2, auto);
  grid-auto-flow: column;
  gap: 3px 40px;
  justify-content: start;
}

</style>
