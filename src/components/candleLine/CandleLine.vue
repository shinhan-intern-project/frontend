<template>
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

export default {
  name: "CandleLine",
  data() {
    return {
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
  async mounted() {
    try {
      // 1) 경로에서 stockId 꺼내기
      const stockId = this.$route.params.stockId;
      // 2) API 호출
      const res = await getStockChartAPI(stockId, "day");
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
        // 5-1) 수출 라인
        this.series.push({
          name: `수출: ${prod.hscodeId}`, // 혹은 prod.hscodeId
          type: "line",
          data: prod.kr.map((item) => ({
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
          data: prod.kr.map((item) => ({
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
};
</script>

<style scoped>
#chart {
  width: -webkit-fill-available;
  margin: 0 auto;
}
</style>
