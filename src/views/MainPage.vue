<template>
  <div class="stock-app">
    <!-- 헤더 영역 -->
    <header>
      <img
        src="@/assets/logo/image.png"
        alt="STOCKPORT 로고"
        class="logo-image"
      />
    </header>

    <!-- 탭 영역 -->
    <div class="tab-section">
      <div class="tab-container">
        <button class="tab-button active">종목</button>
      </div>
    </div>

    <!-- 검색창 영역 -->
    <div class="search-container">
      <input
        type="text"
        placeholder="검색어를 입력해주세요"
        class="search-input"
      />
      <button class="search-button">
        <i class="fas fa-search"></i>
      </button>
    </div>

    <!-- 종목 정보 영역 -->
    <div class="stock-info-card">
      <div class="stock-info-header">
        <div class="header-left">종목</div>
        <div class="header-right">종목과 관련된 품목</div>
      </div>

      <div class="stock-info-content">
        <!-- 왼쪽: 종목 리스트 -->
        <div class="stock-list">
          <div
            v-for="(item, index) in stockItems"
            :key="`top-${index}`"
            class="stock-item"
          >
            <div class="company-info">
              <div class="company-logo"></div>
              <div class="company-details">
                <div class="company-name">{{ item.name }}</div>
                <div class="company-code">{{ item.code }}</div>
              </div>
            </div>
            <div class="price-info">
              <div class="current-price">{{ item.price }}원</div>
              <div
                class="price-change"
                :class="{ 'zero-change': item.changePercent === '0.0%' }"
              >
                {{ item.changePercent }}
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 관련 품목 -->
        <div class="related-items-list">
          <div
            v-for="(item, index) in relatedItems"
            :key="`related-${index}`"
            class="related-item"
          >
            <div class="related-item-name">{{ item.name }}</div>
            <div class="related-item-code">{{ item.code }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 중앙 화살표 -->
    <div class="center-arrow">
      <img
        src="@/assets/images/icons/arrow.png"
        alt="arrow"
        class="arrow-image"
      />
      <i class="fas fa-chevron-down"></i>
    </div>

    <!-- 종목 거래량 섹션 -->
    <div class="volume-section">
      <div class="section-header">
        <h2>종목 거래량 Top 10</h2>
      </div>

      <div class="volume-table-header">
        <div class="col-header">번호</div>
        <div class="col-header">종목명</div>
        <div class="col-header">현재가</div>
        <div class="col-header">등락률</div>
        <div class="col-header">거래량</div>
      </div>

      <div class="volume-table">
        <div
          v-for="(item, index) in topStocks"
          :key="`volume-${index}`"
          class="volume-item"
        >
          <div class="item-rank">{{ index + 1 }}</div>
          <div class="item-company">
            <div class="company-logo-small"></div>
            <div class="company-details-small">
              <div class="company-name-small">{{ item.name }}</div>
              <div class="company-code-small">{{ item.code }}</div>
            </div>
          </div>
          <div class="item-price">{{ item.price }}원</div>
          <div
            class="item-change"
            :class="{ 'zero-change': item.changePercent === '0.0%' }"
          >
            {{ item.changePercent }}
          </div>
          <div class="item-volume">{{ item.volume }}주</div>
        </div>
      </div>
    </div>

    <!-- 수출입 통계 섹션 -->
    <div class="export-import-section">
      <h2>수출입 통계 그래프</h2>

      <div class="statistics-table">
        <div class="stats-header">
          <div>품목</div>
          <div>수입</div>
          <div>수출 금액</div>
          <div>수출 증감</div>
        </div>

        <div
          v-for="(stat, index) in exportStats"
          :key="`stat-${index}`"
          class="stat-item"
        >
          <div class="stat-name">{{ stat.name }}</div>
          <div class="stat-import">{{ stat.importValue }}</div>
          <div class="stat-export">{{ stat.exportValue }}</div>
          <div
            class="stat-change"
            :class="stat.change > 0 ? 'positive-change' : 'negative-change'"
          >
            {{ stat.change > 0 ? "+" : "" }}{{ stat.change }}
          </div>
        </div>
      </div>
      <!-- 뉴스 섹션 -->
      <div class="content-card">
        <h2>관련 뉴스</h2>
        <div class="news-container">
          <div v-for="news in newsItems" :key="news.id" class="news-item">
            <div class="news-image-placeholder"></div>
            <div class="news-tag" :style="{ backgroundColor: news.tagColor }">
              {{ news.tag }}
            </div>
            <h3 class="news-title">{{ news.title }}</h3>
            <div class="news-footer">
              <span class="news-publisher">{{ news.publisher }}</span>
              <span class="news-date">{{ news.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainPage",

  data() {
    return {
      stockItems: [
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
        },
      ],
      relatedItems: [
        { name: "한국정보통신서비스", code: "9967" },
        { name: "한국정보통신서비스", code: "9967" },
        { name: "한국정보통신서비스", code: "9967" },
        { name: "한국정보통신서비스", code: "9967" },
        { name: "한국정보통신서비스", code: "9967" },
        { name: "한국정보통신서비스", code: "9967" },
      ],
      topStocks: [
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
        {
          name: "삼성전자",
          code: "005930",
          price: "55,700",
          changePercent: "0.0%",
          volume: "93,000",
        },
      ],
      exportStats: [
        {
          name: "한국정보통신서비스",
          importValue: "8,327,139",
          exportValue: "8,327,139",
          change: 3.6,
        },
        {
          name: "한국정보통신서비스",
          importValue: "8,327,139",
          exportValue: "8,327,139",
          change: 3.6,
        },
        {
          name: "한국정보통신서비스",
          importValue: "8,327,139",
          exportValue: "8,327,139",
          change: 3.6,
        },
        {
          name: "한국정보통신서비스",
          importValue: "8,327,139",
          exportValue: "8,327,139",
          change: 3.6,
        },
        {
          name: "한국정보통신서비스",
          importValue: "8,327,139",
          exportValue: "8,327,139",
          change: 3.6,
        },
      ], // 뉴스 데이터 추가
      newsItems: [
        {
          id: 1,
          tag: "호재",
          tagColor: "#E5484D", // 빨강
          url: "https://google.com",
          title:
            "신한투자증권, 금융 IT 인재 키운다 '프로디지털아카데미' 6기 모집",
          publisher: "조선 미디어",
          date: "3일 전",
        },
        {
          id: 2,
          tag: "악재",
          tagColor: "#3D8BFF", // 파랑
          url: "https://google.com",
          title:
            "신한투자증권, 금융 IT 인재 키운다 '프로디지털아카데미' 6기 모집",
          publisher: "조선 미디어",
          date: "3일 전",
        },
        {
          id: 3,
          tag: "중립",
          tagColor: "#A5A5A5", // 회색
          title:
            "신한투자증권, 금융 IT 인재 키운다 '프로디지털아카데미' 6기 모집",
          publisher: "조선 미디어",
          date: "3일 전",
        },
        {
          id: 4,
          tag: "호재",
          tagColor: "#E5484D",
          url: "https://google.com",
          title:
            "신한투자증권, 금융 IT 인재 키운다 '프로디지털아카데미' 6기 모집",
          publisher: "조선 미디어",
          date: "3일 전",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* 전체 앱 스타일 */
.logo-image {
  max-width: 300px;
  height: auto;
  width: 100%;
}
.arrow-image {
  max-width: 50px;
  height: auto;
  /* width: 30%; */
}
.stock-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  position: relative;
}

.stock-app::before {
  content: "";
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at top right,
    rgba(200, 220, 255, 0.1),
    transparent 70%
  );
  z-index: -1;
}

/* 헤더 스타일 */
header {
  margin-top: 10%;
  margin-bottom: 30px;
}

.logo {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
}

.slogan {
  color: #4e8df5;
  font-size: 16px;
  margin-top: 0;
}

/* 탭 섹션 스타일 */
.tab-section {
  margin-bottom: 20px;
}

.tab-container {
  display: flex;
  gap: 10px;
}

.tab-button {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  font-weight: 500;
}

.tab-button.active {
  background-color: #101c42;
  color: white;
}

/* 검색창 스타일 */
.search-container {
  display: flex;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-button {
  width: 50px;
  background-color: #101c42;
  color: white;
  border: none;
  cursor: pointer;
}

/* 종목 정보 카드 스타일 */
.stock-info-card {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.stock-info-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  /* background-color: #f8f9fa; */
  border-bottom: 1px solid #eee;
}

/* 왼쪽, 오른쪽 컨텐츠 컨테이너 */
.stock-info-content {
  display: flex;
}

.stock-list,
.related-items-list {
  flex: 1;
  max-height: 400px;
  /* overflow-y: auto; */
  border-right: 1px solid #eee;
}

.related-items-list {
  border-right: none;
}

.stock-item,
.related-item {
  display: flex;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.company-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.company-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #034ea2;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.company-logo::after {
  content: "삼성";
  font-size: 11px;
}

.company-logo-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #034ea2;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.company-logo-small::after {
  content: "삼성";
  font-size: 9px;
}

.company-details {
  flex: 1;
}

.company-name,
.company-name-small {
  font-weight: 500;
}

.company-code,
.company-code-small {
  color: #888;
  font-size: 14px;
}

.price-info {
  text-align: right;
  min-width: 100px;
}

.current-price {
  font-weight: 500;
}

.price-change {
  font-size: 14px;
  color: #f03e3e; /* 상승 */
}

.zero-change {
  color: #333; /* 변동 없음 */
}

/* 관련 품목 스타일 */
.related-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.related-item-name {
  font-weight: 500;
}

.related-item-code {
  color: #888;
  font-size: 14px;
}

/* 중앙 화살표 스타일 */
.center-arrow {
  text-align: center;
  margin: 20px 0;
  font-size: 24px;
  color: #888;
}

/* 종목 거래량 섹션 스타일 */
.volume-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  margin: 0;
}

.tab-buttons.small {
  display: flex;
}

.tab-button-small {
  padding: 5px 15px;
  border-radius: 15px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
}

.tab-button-small.active {
  background-color: #101c42;
  color: white;
  border-color: #101c42;
}

.volume-table-header {
  display: flex;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 5px 5px 0 0;
  border: 1px solid #eee;
  border-bottom: none;
}

.col-header {
  flex: 1;
  font-size: 14px;
  color: #666;
}

.volume-table {
  border: 1px solid #eee;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
}

.volume-item {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.volume-item:last-child {
  border-bottom: none;
}

.item-rank {
  flex: 0.5;
  font-weight: bold;
}

.item-company {
  flex: 2;
  display: flex;
  align-items: center;
}

.company-details-small {
  margin-left: 10px;
}

.item-price,
.item-change,
.item-volume {
  flex: 1;
  text-align: right;
}

/* 수출입 통계 섹션 스타일 */
.export-import-section {
  margin-bottom: 40px;
}

.export-import-section h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.statistics-table {
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
}

.stats-header {
  display: flex;
  padding: 12px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.stats-header div {
  flex: 1;
}

.stat-item {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name,
.stat-import,
.stat-export,
.stat-change {
  flex: 1;
}

.positive-change {
  color: #f03e3e;
}

.negative-change {
  color: #1971c2;
}

/* 뉴스 섹션 스타일 */
.news-section {
  margin-bottom: 40px;
}

.news-section h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.news-container {
  display: flex;
  width: 100%;
  margin-top: 24px;
  gap: 20px;

  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.news-container::-webkit-scrollbar {
  display: none;
}

.news-item {
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.news-image-placeholder {
  height: 150px;
  background-color: #e9ecef;
}

/* 뉴스 태그 스타일 추가 */
.news-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}

.news-title {
  padding: 10px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* 뉴스 footer 스타일 추가 */
.news-footer {
  display: flex;
  justify-content: space-between;
  padding: 0 10px 10px;
  font-size: 12px;
  color: #888;
}

.news-publisher {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

/* 반응형 스타일 */
@media (max-width: 992px) {
  .stock-info-content {
    flex-direction: column;
  }

  .stock-list,
  .related-items-list {
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .news-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .news-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .volume-table-header,
  .volume-item {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .news-container {
    grid-template-columns: 1fr;
  }

  .company-details-small {
    display: none;
  }

  .item-volume {
    display: none;
  }
}
.stock-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.main-content-items {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 30px;
}

.content-card {
  margin-top: 40px !important;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 4px 20px #cfdef1;
  border-radius: 12px;
  padding: 30px;
  box-sizing: border-box;
}

.card-header {
  color: #000c37;
  font-size: 20px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 24px;
}
</style>
