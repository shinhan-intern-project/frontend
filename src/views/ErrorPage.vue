<template>
    <div class="error-page">
      <main class="main-content">
        <div class="error-container">
          <div class="warning-icon">⚠</div>
          <h1 class="error-title">올바르지 않은 접근입니다</h1>
          <p class="error-message">요청하신 페이지 접근이 거부되었습니다.</p>
          <p class="error-message">입력하신 페이지 주소가 정확한지 다시 한번 확인해주시기 바랍니다.</p>
          <button class="main-button" @click="goToMainPage">메인 페이지로 이동</button>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ErrorPage',
    methods: {
      goToMainPage() {
        // Navigate to main page
        window.location.href = '/'
      }
    }
  }
  </script>
  
  <style scoped>
  .error-page {
    background-color: #f9fafb;
    color: black;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .header {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo-section {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .logo {
    font-weight: bold;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .snowflake {
    color: #3b82f6;
  }
  
  .nav {
    display: flex;
    gap: 1.5rem;
  }
  
  .nav-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.875rem;
  }
  
  .nav-link:hover {
    color: white;
  }
  
  .user-button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 4rem);
    padding: 2rem;
  }
  
  .error-container {
    text-align: center;
    max-width: 500px;
  }
  
  .warning-icon {
    font-size: 2.5rem;
    color: #fbbf24;
    margin-bottom: 1.5rem;
  }
  
  .error-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }
  
  .error-message {
    color: black;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .main-button {
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    margin-top: 2rem;
    transition: background-color 0.2s;
  }
  
  .main-button:hover {
    background-color: #2563eb;
  }
  </style>