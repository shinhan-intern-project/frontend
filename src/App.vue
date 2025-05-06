<template>
  <div id="app">
    <!-- 네비게이션 메뉴 -->
    <nav>
      <router-link to="/">홈</router-link> |
      <router-link to="/stocks">종목</router-link> |
      <router-link to="/commodities">품목</router-link>
    </nav>
    
    <!-- 라우터 뷰 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>