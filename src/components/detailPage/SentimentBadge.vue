<template>
  <div :class="['badge', `badge--${topSentiment}`]">
    <span>{{ topSentiment }}</span>

    <div class="tooltip-wrapper">
      <img src="@/assets/images/icons/caution.png" />

      <div class="tooltip">
        최근 2개월 동안의 뉴스<br />분석 기반의 결과입니다.
        <div class="tooltip-value">
          <span class="tooltip-positive">호재 ({{ sentiment.호재 }})</span>
          <span class="tooltip-negative">악재 ({{ sentiment.악재 }})</span>
          <span class="tooltip-neutral">중립 ({{ sentiment.중립 }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SentimentBadge",
  props: {
    sentiment: {
      type: Object,
      required: true,
      default: () => ({ 호재: 0, 악재: 0, 중립: 0 }),
    },
  },
  computed: {
    // 호재, 악재, 중립 판단 함수
    topSentiment() {
      const { 호재 = 0, 악재 = 0 } = this.sentiment || {};
      if (호재 > 악재) return "호재";
      if (악재 > 호재) return "악재";
      return "중립";
    },
  },
};
</script>

<style scoped>
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 8px 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  gap: 4px;
  width: fit-content;
  position: relative;
}

/* 호재: 빨강, 악재: 파랑, 중립: 회색 */
.badge--호재 {
  background: #f04452;
}
.badge--악재 {
  background: #3182f6;
}
.badge--중립 {
  background: #9f9f9f;
}

.badge img {
  width: 16px;
  height: 16px;
  display: flex;
  cursor: pointer;
}

/* 툴팁 */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  top: 32px;
  left: 32px;
  transform: translateX(-50%);
  background: #fff;

  color: #665b5b;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;

  padding: 12px 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: none;
  z-index: 10;

  width: 162px;
  height: 124px;
}

.tooltip-wrapper:hover .tooltip {
  display: block;
}

.tooltip-value {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.tooltip-positive {
  color: #f04452;
  font-weight: 700;
}
.tooltip-negative {
  color: #3182f6;
  font-weight: 700;
}
.tooltip-neutral {
  color: #9f9f9f;
  font-weight: 700;
}
</style>
