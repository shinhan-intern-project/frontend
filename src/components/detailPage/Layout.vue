<template>
  <div class="detail-layout-container">
    <div class="detail-layout-content">
      <DetailHeader />
      <div class="detail-layout-content-container">
        <DetailFloating />
        <div class="test">dd</div>
      </div>
    </div>
  </div>
</template>

<script>
import DetailHeader from "./Header.vue";
import DetailFloating from "./Floating.vue";

export default {
  name: "DetailLayout",
  components: {
    DetailHeader,
    DetailFloating,
  },
};
</script>

<style scoped>
.detail-layout-container {
  padding: 100px 0px;
  width: 100%;
  box-sizing: border-box;
}

.detail-layout-content {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-layout-content-container {
  display: flex;
  margin-top: 100px;
}

.test {
  height: 2000px;
}
</style>
