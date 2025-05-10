<template>
  <div class="floating-container">
    <div class="floating-item active">주식 개요</div>
    <div class="floating-item">네트워크 그래프</div>
    <div class="floating-item">관련 품목</div>
    <div class="floating-item">캔들 차트</div>
    <div class="floating-item">관련 뉴스</div>
  </div>
</template>

<script>
export default {
  name: "DetailFloating",
};
</script>

<style scoped>
.floating-container {
  position: sticky;
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
}

.floating-item.active {
  color: #000c37;
}
</style>
