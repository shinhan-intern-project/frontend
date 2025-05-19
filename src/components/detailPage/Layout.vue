<template>
  <div class="detail-layout-container">
    <div class="detail-layout-content-container">
      <!-- 선택된 검색 타입에 따라 검색 컴포넌트 표시 -->

      <DetailHeader :stockId="stockId" :productId="productId" />

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
                <img
                  :src="`https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stockInfo?.ticker}.png`"
                  alt="종목 아이콘"
                  @error="
                    (e) =>
                      (e.target.src =
                        'https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                  "
                />
                <div class="info-left-summary">
                  <div class="sector">
                    {{
                      stockInfo?.stockType === "IMPORT"
                        ? "수입형"
                        : stockInfo?.stockType === "EXPORT"
                        ? "수출형"
                        : stockInfo?.stockType === "COMPLEX"
                        ? "혼합형"
                        : stockInfo?.stockType === "DOMESTIC"
                        ? "내수형"
                        : stockInfo?.stockType
                    }}
                  </div>
                  <span class="title">{{ stockInfo?.companyName }}</span>
                  <div class="market-ticker">
                    <span>{{ stockInfo?.marketType }}</span>
                    <span>{{ stockInfo?.ticker }}</span>
                    <span>{{ stockInfo?.sector }}</span>
                  </div>
                </div>
              </div>
              <div class="info-right">
                <SentimentBadge :sentiment="sentiment" />
                <div class="price-container">
                  <div>
                    <div class="sub-title">현재가</div>
                    <span class="price">
                      {{
                        stockInfo?.marketType === "NASDAQ"
                          ? stockInfo?.currentPrice
                          : Math.floor(stockInfo?.currentPrice)
                      }}
                      {{ stockInfo?.marketType === "NASDAQ" ? "USD" : "원" }}
                    </span>
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
                <span class="value">
                  {{
                    stockInfo?.marketType === "NASDAQ"
                      ? stockInfo?.marketCap
                      : formatMarketCap(stockInfo?.marketCap)
                  }}
                  {{ stockInfo?.marketType === "NASDAQ" ? "" : "" }}
                </span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">eps</span>
                <span class="value"
                  >{{ stockInfo?.eps
                  }}{{
                    stockInfo?.marketType === "NASDAQ" ? " USD" : " 원"
                  }}</span
                >
              </div>
              <div class="indicator-item">
                <span class="sub-title">pbr</span>
                <span class="value">{{ stockInfo?.pbr }}배</span>
              </div>
              <div class="indicator-item">
                <span class="sub-title">bps</span>
                <span class="value"
                  >{{ stockInfo?.bps
                  }}{{
                    stockInfo?.marketType === "NASDAQ" ? " USD" : " 원"
                  }}</span
                >
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
                  <span>{{ productInfo?.hsCode }}</span>
                </div>

                <SentimentBadge :sentiment="sentiment" />
              </div>
              <span class="product-title">{{ productInfo?.hsName }}</span>
              <div
                class="product-description markdown-body"
                v-html="md.render(productInfo?.description || '')"
              ></div>
            </div>
          </div>
          <!-- 개별 품목 페이지인 경우 -->

          <div class="detail-layout-content-item" ref="section1">
            <span class="header">네트워크 그래프</span>
            <!-- 임시 -->
            <div class="network-graph-wrapper">
              <NetworkGraph
                :stockId="stockId"
                :productId="productId"
                :type="type"
              />
            </div>
          </div>
          <div class="detail-layout-content-item" ref="section2">
            <span class="header">
              {{ type === "stock" ? "관련 품목" : "관련 종목" }}</span
            >

            <!-- 개별 종목 페이지 - 관련 품목 -->
            <template v-if="type === 'stock'">
              <div class="relation" v-if="stockInfo?.relatedProducts.length">
                <router-link
                  class="relation-item"
                  v-for="(prod, i) in stockInfo?.relatedProducts"
                  :key="prod.hscode"
                  :to="{
                    name: 'product',
                    params: { productId: prod.hscodeId },
                  }"
                >
                  <img :src="icons[i]" alt="icon" />
                  <router-link
                    class="relation-title"
                    :to="{
                      name: 'product',
                      params: { productId: prod.hscodeId },
                    }"
                  >
                    {{ prod.hscodeName }}
                  </router-link>
                  <span class="relation-code">{{ prod?.hscode }}</span>
                  <span class="relation-content">
                    {{ extractDescription(prod?.hscodeDescription) }}
                  </span>
                </router-link>
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
                  <router-link
                    class="relation-item"
                    v-for="stock in relatedStocks?.kr"
                    :key="stock.stockId"
                    :to="{
                      name: 'stock',
                      params: { stockId: stock?.stockId },
                    }"
                  >
                    <img
                      class="relation-icon"
                      :src="`https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stock?.ticker}.png`"
                      alt="종목 아이콘"
                      @error="
                        (e) =>
                          (e.target.src =
                            'https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                      "
                    />
                    <router-link
                      class="relation-title"
                      :to="{
                        name: 'stock',
                        params: { stockId: stock?.stockId },
                      }"
                    >
                      {{ stock?.name }}
                    </router-link>

                    <span class="relation-code">{{ stock?.ticker }}</span>
                    <span class="relation-content">{{
                      stock?.companyOverview
                    }}</span>
                  </router-link>
                </div>
              </div>

              <div
                class="relation-stocks-container"
                v-if="relatedStocks?.us?.length"
              >
                <div class="relation-stocks-title">미국</div>
                <div class="relation-stocks">
                  <router-link
                    class="relation-item"
                    v-for="stock in relatedStocks?.us"
                    :key="stock.stockId"
                    :to="{
                      name: 'stock',
                      params: { stockId: stock?.stockId },
                    }"
                  >
                    <img
                      class="relation-icon"
                      :src="`https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stock?.ticker}.png`"
                      alt="종목 아이콘"
                      @error="
                        (e) =>
                          (e.target.src =
                            'https://thumb.tossinvest.com/image/resized/300x0/https%3A%2F%2Fstatic.toss.im%2Fassets%2Ficon%2Fsecurities%2Ficn-isic-454010.png')
                      "
                    />

                    <router-link
                      class="relation-title"
                      :to="{
                        name: 'stock',
                        params: { stockId: stock?.stockId },
                      }"
                    >
                      {{ stock?.name }}
                    </router-link>

                    <span class="relation-code">{{ stock?.ticker }}</span>
                    <span class="relation-content">{{
                      stock?.companyOverview
                    }}</span>
                  </router-link>
                </div>
              </div>

              <!-- 관련 품목이 없거나 빈 배열일 때 -->
              <div
                class="no-relation"
                v-if="!relatedStocks?.kr?.length && !relatedStocks?.us?.length"
              >
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
            <div class="line-graph-header">
              <span class="header">수출입량 통계</span>

              <LineGraph api-mode="product" />
            </div>
          </div>

          <!-- 개별 품목 페이지 - 수출입량 통계 -->
          <div class="detail-layout-content-item" ref="section4">
            <span class="header">관련 뉴스</span>

            <template v-if="relatedNews?.length">
              <div class="news-wrapper">
                <button class="scroll-btn left" @click="scrollPrev">‹</button>
                <div class="news-container" ref="newsContainer">
                  <NewsItem
                    :isBadge="true"
                    v-for="news in relatedNews"
                    :key="news.id"
                    :news="news"
                  />
                </div>
                <button class="scroll-btn right" @click="scrollNext">›</button>
              </div>
            </template>

            <!-- 🔔 관련 뉴스가 없을 경우 -->
            <div class="no-relation" v-else>
              <img src="@/assets/images/icons/caution_navy.png" alt="정보" />
              <p>관련된 뉴스가 없습니다.</p>
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
import NetworkGraph from "../network/NetworkGraph.vue";
import MarkdownIt from "markdown-it";
import LineGraph from "../line/LineGraph.vue";
// import StockSearchAndInfo from "../search/StockSearchAndInfo.vue";
// import ToggleSwitch from "../toggle/ToggleSwitch.vue";
import { getSearchAPI } from "@/apis/stock";
import { getSearchProductAPI } from "@/apis/product";
// import ProductSearchAndInfo from "../search/ProductSearchAndInfo.vue";
// import HeaderSearch from "../search/HeaderSearch.vue";
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
    NetworkGraph,
    LineGraph,
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
    productInfo: {
      type: Object,
      required: true,
    },
    relatedStocks: {
      type: Object,
      required: true,
    },
    stockId: {
      type: String,
      // required: true,
    },
    productId: {
      type: String,
      //   required: true,
    },
    sentiment: {
      type: Object,
    },
  },
  data() {
    return {
      isDetailPage: !!this.stockId || !!this.productId, // stockId나 productId가 있으면 상세 페이지로 간주
      activeSection: 0,
      icons,
      md: new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
      }),
      searchType: "stock",
      // 종목 검색 관련 데이터
      stockSearchKeyword: "",
      isStockLoading: false,
      stockItems: [],
      relatedItems: [],
      selectedStockIndex: -1,

      // 품목 검색 관련 데이터
      productSearchKeyword: "",
      isProductLoading: false,
      productItems: [],
      selectedProductIndex: -1,
      selectedProduct: null,
    };
  },
  methods: {
    scrollNext() {
      const container = this.$refs.newsContainer
      if (!container) return
      container.scrollBy({ left: container.clientWidth, behavior: 'smooth' })
    },
    scrollPrev() {
      const container = this.$refs.newsContainer
      if (!container) return
      container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' })
    },
    // 검색 관련 메서드 추가
    handleSearchTypeChange(value) {
      this.searchType = value;
    },

    // 종목 검색 관련 메서드
    async handleStockSearch(keyword) {
      this.stockSearchKeyword = keyword;
      this.isStockLoading = true;

      try {
        const response = await getSearchAPI(keyword);
        if (response && response.status === "OK") {
          this.stockItems = response.data.map((item) => ({
            name: item.companyName,
            code: item.ticker,
            price:
              item.marketType === "NASDAQ"
                ? parseFloat(item.currentPrice)
                : parseInt(item.currentPrice, 10),
            changePercent: `${(parseFloat(item.changeRate) * 100).toFixed(1)}%`,
            stockId: item.stockId,
            relatedProducts: item.relatedProducts || [],
            marketType: item.marketType,
          }));

          this.showAllRelatedProducts();
        }
      } catch (error) {
        console.error("종목 검색 오류:", error);
        this.stockItems = [];
        this.relatedItems = [];
      } finally {
        this.isStockLoading = false;
      }
    },

    selectStock(stock, index) {
      this.selectedStockIndex = index;

      if (stock.relatedProducts && stock.relatedProducts.length > 0) {
        const uniqueHscodes = new Set();

        this.relatedItems = stock.relatedProducts
          .filter(
            (product) =>
              !uniqueHscodes.has(product.hscode) &&
              uniqueHscodes.add(product.hscode)
          )
          .map((product) => ({
            name: product.hscodeName,
            code: product.hscode,
            stockName: stock.name,
            hscodeId: product.hscodeId,
          }));
      } else {
        this.relatedItems = [];
      }
    },

    showAllRelatedProducts() {
      const allRelatedProducts = [];
      const uniqueHscodes = new Set();

      this.stockItems.forEach((stock) => {
        if (stock.relatedProducts && stock.relatedProducts.length > 0) {
          stock.relatedProducts.forEach((product) => {
            if (!uniqueHscodes.has(product.hscode)) {
              uniqueHscodes.add(product.hscode);
              allRelatedProducts.push({
                name: product.hscodeName,
                code: product.hscode,
                stockName: stock.name,
                hscodeId: product.hscodeId,
              });
            }
          });
        }
      });

      this.relatedItems = allRelatedProducts;
      this.selectedStockIndex = -1;
    },

    // 품목 검색 관련 메서드
    async handleProductSearch(keyword) {
      this.productSearchKeyword = keyword;
      this.isProductLoading = true;

      try {
        const response = await getSearchProductAPI(keyword);
        if (response && response.status === "OK") {
          this.productItems = response.data;
        }
      } catch (error) {
        console.error("품목 검색 오류:", error);
        this.productItems = [];
      } finally {
        this.isProductLoading = false;
      }
    },

    selectProduct(product, index) {
      this.selectedProduct = product;
      this.selectedProductIndex = index;
    },

    // 포맷 관련 메서드
    formatPrice(price) {
      return parseFloat(price).toLocaleString();
    },

    formatChangeRate(rate) {
      const value = parseFloat(rate) * 100;
      return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
    },

    getChangeClass(rate) {
      const value = parseFloat(rate);
      if (value > 0) return "positive-change";
      if (value < 0) return "negative-change";
      return "zero-change";
    },

    scrollToSection(idx) {
      const el = this.$refs[`section${idx}`];
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    formatMarketCap(value) {
      if (!value && value !== 0) return "";
      const num = Number(value);
      if (num >= 1_0000) {
        // 1조 이상
        return (
          Math.floor(num / 1_0000).toLocaleString() +
          "조 " +
          Math.floor(num % 1_0000).toLocaleString() +
          "억 원"
        );
      } else if (num >= 1) {
        // 1억 이상
        return Math.floor(num / 1).toLocaleString() + "억";
      } else {
        // 억 미만
        return num.toLocaleString() + "억 원";
      }
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

    // 관련 품목 내용 요약 추출
    extractDescription(desc) {
      // 이거 앞부분까지만 추출
      const exampleMarker = "🧾 대표 품목 예시";
      const useMarkerMd = "### 🍽️ 대표 품목별 용도";

      // 1) “용도” 마커 앞까지 자르기
      const beforeUse = desc.includes(useMarkerMd)
        ? desc.split(useMarkerMd)[0]
        : desc;

      // 2) #, --- 제거, 나머지 줄바꿈을 스페이스로 합치기
      let clean = beforeUse
        .replace(/#/g, "")
        .replace(/-{3,}/g, "")
        .replace(/\r?\n/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();

      // 3) “🧾 대표 품목 예시” 기준으로 헤더/예시 분리
      let header = clean;
      let examples = "";
      if (clean.includes(exampleMarker)) {
        [header, examples] = clean.split(exampleMarker);
        examples = examples.trim(); // "- 폴리에스터..." 등
      }

      // 4) 예시 줄 조합
      const exampleLine = examples
        ? `${exampleMarker} ${examples}`
        : exampleMarker;

      // 5) 헤더와 예시만 반환 (이제 용도 마커는 제외)
      return `${header}\n${exampleLine}`;
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
.search-type-toggle,
.stock-search-and-info,
.product-search-and-info {
  position: relative;
  z-index: 1000;
}
.line-graph-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

@import "github-markdown-css/github-markdown.css";

.relation-icon {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  background: #f5f6fa;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  display: block;
}

.detail-layout-container {
  padding: 60px 0px 100px 0px;
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
  margin-top: 32px;
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
  gap: 46px;
  justify-content: flex-start;
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
  gap: 46px;
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
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  padding: 24px 12px;
  border-radius: 12px;
}
/* Hover 상태 */
.relation-item:hover {
  background-color: #f3f4f5;
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
  text-decoration: none;
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
  white-space: pre-wrap;
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
  align-items: flex-start;
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

.news-container > * {
  flex: 0 0 215px;
  max-width: 215px;
}

.news-container > * .news-item__title,
.news-container > * .news-item-title,
.news-container > * .title {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  height: calc(1.4em * 2); /* 2줄 높이 고정 */
}

/* ─── 품목 페이지 ─── */
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
  font-size: 16px;
  padding: 8px 18px;
}

.product-title {
  color: #000c37;
  font-size: 36px;
  font-weight: 700;
  margin: 28px 0;
  line-height: 48px;

  /* 한 단어 붙이고 싶을 때 */
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: auto;
}

.product-description {
  color: #000c37;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
}

/* 네트워크 그래프 */
.network-graph-wrapper {
  margin-top: 28px;
}

/* 1) wrapper 포지션 설정 */
.news-wrapper {
  position: relative;
}

/* 2) 화살표 버튼 공통 스타일 */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(255, 255, 255, 0.8);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 3) 좌/우 위치 */
.scroll-btn.left {
  left: 8px;
}
.scroll-btn.right {
  right: 8px;
}

.news-wrapper:hover .scroll-btn {
  /* hover 시에만 나타내고 싶다면 */
  opacity: 1;
}
.scroll-btn {
  opacity: 0;
  transition: opacity 0.2s;
}
</style>
