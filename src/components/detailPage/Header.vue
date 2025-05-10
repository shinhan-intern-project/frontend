<template>
  <header class="header">
    <img
      src="@/assets/images/icons/back.png"
      alt="뒤로가기 아이콘"
      class="back-icon"
      @click="goBack"
    />
    <span class="back-text">돌아가기</span>
  </header>
</template>

<script>
export default {
  name: "DetailHeader",
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.back-text {
  color: #000c37;
  font-size: 30px;
  font-weight: 700;
}
</style>
