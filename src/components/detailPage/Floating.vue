<template>
  <div class="floating-container">
    <div
      class="floating-item"
      :class="{ active: activeIndex === 0 }"
      @click="$emit('navigate', 0)"
    >
      {{ type === "stock" ? "주식 개요" : "품목 개요" }}
    </div>
    <div
      class="floating-item"
      :class="{ active: activeIndex === 1 }"
      @click="$emit('navigate', 1)"
    >
      네트워크 그래프
    </div>
    <div
      class="floating-item"
      :class="{ active: activeIndex === 2 }"
      @click="$emit('navigate', 2)"
    >
      {{ type === "stock" ? "관련 품목" : "관련 종목" }}
    </div>
    <div
      class="floating-item"
      :class="{ active: activeIndex === 3 }"
      @click="$emit('navigate', 3)"
    >
      {{ type === "stock" ? "캔들 차트" : "수출입량 통계" }}
    </div>
    <div
      class="floating-item"
      :class="{ active: activeIndex === 4 }"
      @click="$emit('navigate', 4)"
    >
      관련 뉴스
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailFloating",
  props: {
    type: {
      type: String,
      validator: (v) => ["stock", "product"].includes(v),
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.floating-container {
  position: static;
  top: 120px;
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: flex-start;
}

.floating-item {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 160px;
  height: 40px;
  box-sizing: border-box;
  padding: 0px 20px;
  border-radius: 30px;
  background: #fff;
  box-shadow: 0px 4px 15px 0px rgba(58, 112, 191, 0.1);
  color: rgba(0, 12, 55, 0.3);
  font-weight: 700;
  cursor: pointer;
}

.floating-item.active {
  color: #000c37;
}
</style>
