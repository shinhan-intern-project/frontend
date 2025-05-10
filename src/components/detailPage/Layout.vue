<template>
  <div class="detail-layout-container">
    <div class="detail-layout-content">
      <DetailHeader />
    </div>
  </div>
</template>

<script>
import DetailHeader from "./Header.vue";

export default {
  name: "DetailLayout",
  components: {
    DetailHeader,
  },
};
</script>

<style scoped>
.detail-layout-container {
  margin: 100px 0px;
  width: 100%;
  height: 100vh;
}

.detail-layout-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
