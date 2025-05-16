<template>
  <div class="detail-layout-container">
    <div class="detail-layout-content-container">
      <DetailHeader />
      <div class="detail-layout-content">
        <DetailFloating
          :active-index="activeSection"
          @navigate="scrollToSection"
          :type="type"
        />
        <div class="detail-layout-content-items" ref="container">
          <!-- 개별 주식 페이지인 경우 -->
          <div
            v-if="type === 'stock'"
            class="detail-layout-content-item"
            ref="section0"
          >
            <div class="info">
              <div class="info-left">
                <img src="@/assets/images/stocks/samsung.png" />
                <div class="info-left-summary">
                  <div class="sector">{{ stockInfo?.sector }}</div>
                  <span class="title">{{ stockInfo?.companyName }}</span>
                  <div class="market-ticker">
                    <span>{{ stockInfo?.marketType }}</span>
                    <span>{{ stockInfo?.ticker }}</span>
                  </div>
                </div>
              </div>
              <div class="info-right">
                <SentimentBadge :sentiment="stockInfo?.sentiment" />
                <div class="price-container">
                  <div>
                    <div class="sub-title">현재가</div>
                    <span class="price">
                      <!-- {{ Math.floor(stockInfo?.currentPrice) }} -->
                      {{ stockInfo?.currentPrice }}

                      원</span
                    >
                  </div>
                  <div>
                    <span class="per">
                      {{
                        stockInfo?.changeRate != null
                          ? Number(stockInfo.changeRate).toFixed(2)
                          : "0.00"
                      }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="content">
              {{ stockInfo?.companyOverview }}
            </div>
            <div class="indicator">
              <div class="indicator-item">
                <span class="sub-title">시가총액</span>
                <span class="value">{{ stockInfo?.marketCap }}조</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">eps</span>
                <span class="value">{{ stockInfo?.eps }}원</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">pbr</span>
                <span class="value">{{ stockInfo?.pbr }}배</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">bps</span>
                <span class="value">{{ stockInfo?.bps }}원</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">배당수익률</span>
                <span class="value"
                  >{{
                    stockInfo?.dividendYield
                      ? stockInfo?.dividendYield
                      : "0.00"
                  }}%</span
                >
              </div>
            </div>
          </div>
          <!-- 개별 주식 페이지인 경우 -->

          <!-- 개별 품목 페이지인 경우 -->
          <div
            v-if="type === 'product'"
            class="detail-layout-content-item"
            ref="section0"
          >
            <div class="product">
              <div class="product-header">
                <div class="product-hscode">
                  <div class="product-hscode-wrapper">HS코드</div>
                  <span>7312</span>
                </div>
                <SentimentBadge :sentiment="stockInfo?.sentiment" />
              </div>
              <span class="product-title">철강로프</span>
              <span class="product-description"
                >와이어로프 형태의 철강 제품으로, 건설·해양·중장비 산업에 사용됨
                와이어로프 형태의 철강 제품으로, 건설·해양·중장비
                산업에와이어로프 형태의 철강 제품으로, 건설·해양·중장비 산업에
                사용됨 와이어로프 형태의 철강 제품으로, 건설·해양·중장비 산업에
                사용됨 사용됨</span
              >
            </div>
          </div>
          <!-- 개별 품목 페이지인 경우 -->

          <div class="detail-layout-content-item" ref="section1">
            <span class="header">네트워크 그래프</span>
            <!-- 임시 -->
            <div style="height: 300px"></div>
          </div>
          <div class="detail-layout-content-item" ref="section2">
            <span class="header">
              {{ type === "stock" ? "관련 품목" : "관련 종목" }}</span
            >

            <!-- 개별 종목 페이지 - 관련 품목 -->
            <template v-if="type === 'stock'">
              <div class="relation" v-if="stockInfo?.relatedProducts.length">
                <div
                  class="relation-item"
                  v-for="(prod, i) in stockInfo?.relatedProducts"
                  :key="prod.hscode"
                >
                  <img :src="icons[i]" alt="icon" />
                  <span class="relation-title">{{ prod?.hscodeName }}</span>
                  <span class="relation-code">{{ prod?.hscode }}</span>
                  <span class="relation-content">
                    {{ prod?.hscodeDescription }}
                    왜 이 종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이
                    종목이랑 관련이 있냐면... GPT가 설명해줄거야 왜 이 종목이랑
                    관련이 있냐면... GPT가 설명해줄거야</span
                  >
                </div>
              </div>
              <!-- 관련 품목이 없거나 빈 배열일 때 -->
              <div class="no-relation" v-else>
                <img src="@/assets/images/icons/caution_navy.png" alt="정보" />
                <p>관련된 품목이 없습니다.</p>
              </div>
            </template>

            <!-- 개별 품목 페이지 - 관련 종목 -->
            <template v-if="type === 'product'">
              <div
                class="relation-stocks-container"
                v-if="relatedStocks?.kr?.length"
              >
                <div class="relation-stocks-title">국내</div>
                <div class="relation-stocks">
                  <div
                    class="relation-item"
                    v-for="stock in relatedStocks?.kr"
                    :key="stock.stockId"
                  >
                    <!-- <img :src="icons[i]" alt="icon" /> -->
                    <span class="relation-title">{{ stock?.name }}</span>
                    <span class="relation-code">{{ stock?.ticker }}</span>
                    <span class="relation-content">{{
                      stock?.companyOverview
                    }}</span>
                  </div>
                </div>
              </div>

              <div
                class="relation-stocks-container"
                v-if="relatedStocks?.us?.length"
              >
                <div class="relation-stocks-title">미국</div>
                <div class="relation-stocks">
                  <div
                    class="relation-item"
                    v-for="stock in relatedStocks?.us"
                    :key="stock.stockId"
                  >
                    <!-- <img :src="icons[i]" alt="icon" /> -->
                    <span class="relation-title">{{ stock?.name }}</span>
                    <span class="relation-code">{{ stock?.ticker }}</span>
                    <span class="relation-content">{{
                      stock?.companyOverview
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- 관련 품목이 없거나 빈 배열일 때 -->
              <div class="no-relation" v-else>
                <img src="@/assets/images/icons/caution_navy.png" alt="정보" />
                <p>관련된 종목이 없습니다.</p>
              </div>
            </template>
          </div>

          <!-- 개별 주식 페이지 - 캔들차트 -->
          <div
            v-if="type === 'stock'"
            class="detail-layout-content-item"
            ref="section3"
          >
            <span class="header">캔들 차트</span>
            <div class="candle-line-wrppaer">
              <CandleLine />
            </div>
          </div>
          <!-- 개별 주식 페이지 - 캔들차트 -->

          <!-- 개별 품목 페이지 - 수출입량 통계 -->
          <div
            v-if="type === 'product'"
            class="detail-layout-content-item"
            ref="section3"
          >
            <span class="header">수출입량 통계</span>
            <!-- 임시 -->
            <div style="height: 300px"></div>
          </div>
          <!-- 개별 품목 페이지 - 수출입량 통계 -->
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
import SentimentBadge from "./SentimentBadge.vue";
import CandleLine from "../candleLine/CandleLine.vue";

// 관련 품목 숫자 아이콘
export const icons = [
  require("@/assets/images/icons/1.png"),
  require("@/assets/images/icons/2.png"),
  require("@/assets/images/icons/3.png"),
];

export default {
  name: "DetailLayout",
  components: {
    DetailHeader,
    DetailFloating,
    NewsItem,
    SentimentBadge,
    CandleLine,
  },
  props: {
    type: {
      type: String,
      validator: (v) => ["stock", "product"].includes(v),
    },
    relatedNews: {
      type: Array,
      required: true,
    },
    stockInfo: {
      type: Object,
      required: true,
    },
    relatedStocks: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeSection: 0,
      icons,
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

    // 호재, 악재, 중립 판단 함수
    topSentiment() {
      const s = this.stockInfo && this.stockInfo.sentiment;
      if (!s || Object.keys(s).length === 0) {
        return "";
      }
      const entries = Object.entries(s);
      entries.sort(([, a], [, b]) => b - a);
      return entries[0][0];
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

/* ----- 개별 품목 페이지 > 관련 종목 ----- */
.relation-stocks-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
  justify-content: space-around;
}

.relation-stocks-title {
  width: fit-content;
  padding: 8px 20px;
  border-radius: 12px;
  background: #000c37;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  margin-top: 40px;
}

.relation-stocks {
  display: flex;
  justify-content: flex-start;
  gap: 40px;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100%;
}

.relation-stocks::-webkit-scrollbar {
  display: none;
}

.relation-stocks .relation-item {
  flex: 0 0 auto;
  width: 220px;
}
/* -------------------------------- */

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
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

  display: -webkit-box;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.no-relation {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.no-relation img {
  width: 58px;
  height: 58px;
}

.no-relation p {
  color: #000c37;
  font-size: 18px;
  font-weight: 700;
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

/* 품목 페이지 */
/* 품목 개요 */
.product {
  display: flex;
  flex-direction: column;
}

.product-header {
  display: flex;
  justify-content: space-between;
}

.product-hscode {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-hscode span {
  color: #000c37;
  font-size: 16px;
  font-weight: 400;
}

.product-hscode-wrapper {
  width: fit-content;
  height: fit-content;
  border-radius: 4px;
  background: #000c37;
  color: #fff;
  font-size: 14px;
  padding: 4px 18px;
}

.product-title {
  color: #000c37;
  font-size: 36px;
  font-weight: 700;
  margin: 28px 0;
}

.product-description {
  color: #000c37;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
}
</style>
