<!-- SegmentedControl.vue -->
<template>
  <div class="segmented-control">
    <button
      class="segment-button"
      :class="{ active: modelValue === 'stock' }"
      @click="switchSegment('stock')"
      type="button"
    >
      종목
    </button>
    <button
      class="segment-button"
      :class="{ active: modelValue === 'product' }"
      @click="switchSegment('product')"
      type="button"
    >
      품목
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  modelValue: {
    type: String,
    default: "stock",
    validator: (value) => ["stock", "product"].includes(value),
  },
});
const emit = defineEmits(["update:modelValue", "change"]);

const switchSegment = (value) => {
  emit("update:modelValue", value);
  emit("change", value);
};
</script>

<style scoped>
.segmented-control {
  display: inline-flex;
  background-color: #f2f2f2;
  border-radius: 30px;
  padding: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  user-select: none;
  overflow: hidden;
  width: 130px;
  height: 30px;
}

.segment-button {
  flex: 1;
  background: none;
  border: none;
  padding: 4px 8px; /* 패딩 더 줄임 */
  font-size: 13px;
  font-weight: 500; /* 폰트 두께 조정 */
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 18px;
  color: #999999; /* 비활성화 색상 조정 */
  outline: none;
  position: relative;
  overflow: hidden;
  text-align: center;
  letter-spacing: -0.2px; /* 한글 자간 조정 */
}
.segment-button.active {
  background-color: #000c37; /* 짙은 남색 배경 */
  color: white;
  font-weight: 600;
}

.segment-button:hover:not(.active) {
  color: #b0b0b0;
}

.segment-button:focus {
  outline: none;
}
</style>
