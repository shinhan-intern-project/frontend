<template>
  <div class="detail-layout-container">
    <div class="detail-layout-content-container">
      <DetailHeader />
      <div class="detail-layout-content">
        <DetailFloating
          :active-index="activeSection"
          @navigate="scrollToSection"
        />
        <div class="detail-layout-content-items" ref="container">
          <div class="detail-layout-content-item" ref="section0">
            <div class="info">
              <div class="info-left">
                <img src="@/assets/images/stocks/samsung.png" />
                <div class="info-left-summary">
                  <div class="sector">반도체</div>
                  <span class="title">삼성전자</span>
                  <div class="market-ticker">
                    <span>KOSPI</span>
                    <span>005930</span>
                  </div>
                </div>
              </div>
              <div class="info-right">
                <div class="badge">
                  <span>호재</span>

                  <div class="tooltip-wrapper">
                    <img src="@/assets/images/icons/caution.png" />

                    <div class="tooltip">
                      최근 2개월 동안의 뉴스 <br />분석 기반의 결과입니다.
                      <div class="tooltip-value">
                        <span class="tooltip-positive">호재 (80)</span>
                        <span class="tooltip-negative">악재 (12)</span>
                        <span class="tooltip-neutral">중립 (0)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="price-container">
                  <div>
                    <div class="sub-title">현재가</div>
                    <span class="price">58,600원</span>
                  </div>
                  <div>
                    <span class="per">-2.4%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="content">
              한국 및 DX부문 해외 9개 지역총괄과 DS부문 해외 5개 지역총괄, SDC,
              Harman 등 229개의 종속기업으로 구성된 글로벌 전자기업임. 한국 및
              DX부문 해외 9개 지역총괄과 DS부문 해외 5개 지역총괄, SDC, Harman
              등 229개의 종속기업으로 구성된 글로
            </div>
            <div class="indicator">
              <div class="indicator-item">
                <span class="sub-title">시가총액</span>
                <span class="value">393.32조</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">eps</span>
                <span class="value">4,359원</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">pbr</span>
                <span class="value">1.01배</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">bps</span>
                <span class="value">44,359원</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">배당수익률</span>
                <span class="value">2.47%</span>
              </div>
            </div>
          </div>
          <div class="detail-layout-content-item" ref="section1">
            <span class="header">네트워크 그래프</span>
            <!-- 임시 -->
            <div style="height: 300px"></div>
          </div>
          <div class="detail-layout-content-item" ref="section2">
            <span class="header">관련 품목</span>
            <div class="relation">
              <div class="relation-item">
                <img src="@/assets/images/icons/1.png" />
                <span class="relation-title"
                  >품목명 어쩌구 저쩌구 아무거나</span
                >
                <span class="relation-code">2320</span>
                <span class="relation-content"
                  >왜 이 종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이
                  종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이 종목이랑
                  관련이 있냐면... GPT가 설명해줄거야</span
                >
              </div>

              <div class="relation-item">
                <img src="@/assets/images/icons/2.png" />
                <span class="relation-title"
                  >품목명 어쩌구 저쩌구 아무거나</span
                >
                <span class="relation-code">2320</span>
                <span class="relation-content"
                  >왜 이 종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이
                  종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이 종목이랑
                  관련이 있냐면... GPT가 설명해줄거야</span
                >
              </div>

              <div class="relation-item">
                <img src="@/assets/images/icons/3.png" />
                <span class="relation-title"
                  >품목명 어쩌구 저쩌구 아무거나</span
                >
                <span class="relation-code">2320</span>
                <span class="relation-content"
                  >왜 이 종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이
                  종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이 종목이랑
                  관련이 있냐면... GPT가 설명해줄거야</span
                >
              </div>
            </div>
          </div>
          <div class="detail-layout-content-item" ref="section3">
            <span class="header">캔들 차트</span>
            <!-- 임시 -->
            <div style="height: 300px"></div>
          </div>
          <div class="detail-layout-content-item" ref="section4">
            <span class="header">관련 뉴스</span>
            <div class="news-container">
              <NewsItem
                :isBadge="true"
                v-for="news in relatedNews"
                :key="news.id"
                :news="news"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DetailHeader from "./Header.vue";
import DetailFloating from "./Floating.vue";
import NewsItem from "../news/NewsItem.vue";

export default {
  name: "DetailLayout",
  components: {
    DetailHeader,
    DetailFloating,
    NewsItem,
  },
  props: {
    relatedNews: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeSection: 0,
    };
  },
  methods: {
    scrollToSection(idx) {
      const el = this.$refs[`section${idx}`];
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    onScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const visibleHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      if (scrollY + visibleHeight >= totalHeight - 5) {
        // 바닥에 거의 닿았으면 무조건 마지막(4)로
        this.activeSection = 4;
        return;
      }

      // 페이지 상단에서 얼마나 스크롤됐는지 기준선 설정
      const baseline = 150;
      // 각 섹션의 화면 위치(top) 배열로 구하기
      const tops = [0, 1, 2, 3, 4].map((i) => {
        const el = this.$refs[`section${i}`];
        return el ? el.getBoundingClientRect().top : Infinity;
      });
      // baseline 보다 크면서 가장 작은 top 의 인덱스 찾기
      const idx = tops.reduce((best, cur, i) => {
        // cur ≤ baseline에 가까운(=큰) 값 선택
        if (cur <= baseline && cur > tops[best]) {
          return i;
        }
        return best;
      }, 0);
      this.activeSection = idx;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
    // 초기 한번 실행
    this.onScroll();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>

<style scoped>
.detail-layout-container {
  padding: 100px 0px;
  width: 100%;
  box-sizing: border-box;
}

.detail-layout-content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-layout-content {
  display: flex;
  justify-content: space-between;
  margin-top: 100px;
}

.detail-layout-content-items {
  width: 920px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.detail-layout-content-item {
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 4px 20px #cfdef1;
  border-radius: 12px;
  padding: 48px;
  box-sizing: border-box;
}

.detail-layout-content-item .header {
  color: #000c37;
  font-size: 20px;
  font-weight: 700;
}

/* 주식 개요 */
.detail-layout-content-item .info {
  display: flex;
  justify-content: space-between;
}

/* 주식 개요 - 왼쪽 */
.detail-layout-content-item .info-left {
  display: flex;
  gap: 28px;
}

.detail-layout-content-item .info-left img {
  width: 120px;
  height: 120px;
  border-radius: 20px;
}

.detail-layout-content-item .info-left-summary {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.detail-layout-content-item .info-left-summary .sector {
  width: fit-content;
  border-radius: 4px;
  background: #000c37;
  color: #fff;
  font-size: 14px;
  padding: 4px 18px;
}

.detail-layout-content-item .info-left-summary .title {
  color: #000c37;
  font-size: 36px;
  font-weight: 700;
}

.detail-layout-content-item .info-left-summary .market-ticker {
  display: flex;
  gap: 16px;
  color: #000c37;
  font-size: 16px;
  font-weight: 400;
}

/* 주식 개요 - 오른쪽 */
.detail-layout-content-item .info-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}
.detail-layout-content-item .info-right .badge {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #f04452;
  padding: 8px 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  gap: 4px;
  width: fit-content;
  position: relative;
}

.detail-layout-content-item .info-right .badge img {
  width: 16px;
  height: 16px;
  display: flex;
  cursor: pointer;
}

/* 툴팁 */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  top: 32px;
  left: 32px;
  transform: translateX(-50%);
  background: #fff;

  color: #665b5b;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;

  padding: 12px 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: none;
  z-index: 10;

  width: 162px;
  height: 124px;
}

.tooltip-wrapper:hover .tooltip {
  display: block;
}

.tooltip-value {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.tooltip-positive {
  color: #f04452;
  font-weight: 700;
}
.tooltip-negative {
  color: #3182f6;
  font-weight: 700;
}
.tooltip-neutral {
  color: #868686;
  font-weight: 700;
}

.detail-layout-content-item .info-right .price-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.sub-title {
  color: #c8c9cb;
  font-size: 12px;
}

.detail-layout-content-item .info-right .price {
  display: flex;
  margin-top: 8px;
  color: #000c37;
  font-size: 28px;
  font-weight: 700;
}

.detail-layout-content-item .info-right .per {
  color: #2d7aff;
  font-size: 20px;
  font-weight: 700;
}

/* 주식 개요 - 회사 설명 */
.detail-layout-content-item .content {
  margin: 40px 0px;
  color: #000c37;
  font-size: 16px;
  line-height: 28px;
}

/* 주식 개요 - 지표 */
.detail-layout-content-item .indicator {
  display: flex;
  gap: 32px;
}

.detail-layout-content-item .indicator-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.indicator .value {
  color: #000c37;
  font-size: 16px;
}

/* 관련 품목 및 종목 */
.relation {
  display: flex;
  gap: 60px;
  justify-content: space-around;
  margin-top: 40px;
}

.relation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 220px;
}

.relation-item img {
  width: 45px;
  height: 60px;
  margin-bottom: 40px;
}

.relation-title {
  color: #000c37;
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
}
.relation-code {
  color: #ababab;
  font-size: 14px;
  font-weight: 700;
}
.relation-content {
  color: #000c37;
  font-size: 14px;
  line-height: 20px;
}

/* 관련 뉴스 */
.news-container {
  display: flex;
  width: 100%;
  margin-top: 24px;
  gap: 20px;

  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  /* scrollbar-width: thin; */
  /* scrollbar-color: #ccc transparent; */
}

.news-container::-webkit-scrollbar {
  display: none;
}
</style>
