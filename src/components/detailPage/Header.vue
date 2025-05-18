<template>
  <nav>
    <img
      src="@/assets/images/logo/logo.png"
      alt="로고 이미지"
      class="logo"
      @click="goMain"
    />
    <div class="search-wrapper">여기에 검색창 넣으면 됩니다</div>
  </nav>
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
    goMain() {
      this.$router.push(`/`);
    },
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 100px;
}

.logo {
  width: 199px;
  cursor: pointer;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.back-text {
  color: #000c37;
  font-size: 24px;
  font-weight: 700;
}
</style>
