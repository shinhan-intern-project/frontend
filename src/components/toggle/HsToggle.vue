<!-- HsToggle.vue -->
<template>
  <div class="hs-control">
    <button
      v-for="option in options"
      :key="option.value"
      class="hs-button"
      :class="{ active: modelValue === option.value }"
      @click="switchTab(option.value)"
      type="button"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "HsToggle",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
      validator: (options) => {
        return options.every(
          (option) =>
            typeof option === "object" && "value" in option && "label" in option
        );
      },
    },
  },
  emits: ["update:modelValue", "change"],
  methods: {
    switchTab(value) {
      this.$emit("update:modelValue", value);
      this.$emit("change", value);
    },
  },
};
</script>

<style scoped>
.hs-control {
  display: inline-flex;
  background-color: #f2f2f2;
  border-radius: 30px;
  padding: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  user-select: none;
  overflow: hidden;
  width: auto;
}

.hs-button {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 28px;
  color: #999999;
  outline: none;
  position: relative;
  overflow: hidden;
  text-align: center;
  letter-spacing: -0.2px;
  min-width: 60px;
}

.hs-button.active {
  background-color: #000c37;
  color: white;
  font-weight: 600;
}

.hs-button:hover:not(.active) {
  color: #b0b0b0;
}

.hs-button:focus {
  outline: none;
}
</style>
