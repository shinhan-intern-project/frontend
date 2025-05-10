<template>
  <div class="detail-layout-container">
    <div class="detail-layout-content-container">
      <DetailHeader />
      <div class="detail-layout-content">
        <DetailFloating />
        <div class="detail-layout-content-items">
          <div class="detail-layout-content-item">
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
                  <img src="@/assets/images/icons/caution.png" />
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
          <div class="detail-layout-content-item">
            <span class="header">네트워크 그래프</span>
          </div>
          <div class="detail-layout-content-item">
            <span class="header">관련 품목</span>
          </div>
          <div class="detail-layout-content-item">
            <span class="header">캔들 차트</span>
          </div>
          <div class="detail-layout-content-item">
            <span class="header">관련 뉴스</span>
          </div>
        </div>
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
}

.detail-layout-content-item .info-right .badge img {
  width: 16px;
  height: 16px;
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
</style>
