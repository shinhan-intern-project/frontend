<!-- src/components/CombinedLanding.vue -->
<template>
  <div class="landing-page">
    <!-- ===== 첫 번째 페이지 섹션들 ===== -->
    <!-- 오버뷰 섹션 -->
    <section class="overview">
      <div class="container">
        <Transition appear name="fade-down">
          <h2 class="section-title text-primary">Overview</h2>
        </Transition>
        <Transition appear name="fade-up" delay="200">
          <div class="headline">
            <h3>복잡한 무역 정보를 <span class="highlight">한눈에</span> 볼 수는 없을까?</h3>
          </div>
        </Transition>
        <Transition appear name="fade-up" delay="400">
          <p class="description">
            StockPort는 종목과 품목을 연결하고,<br />
            HS코드 기반 수출입 데이터를 통해 무역 통계와 주식 간의 관계를 분석하는 서비스입니다.
          </p>
        </Transition>
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </section>

    <!-- 서비스 한계 섹션 -->
    <section class="limitations">
      <div class="container">
        <Transition appear name="fade-up">
          <h2 class="section-title">기존 서비스의 한계</h2>
        </Transition>
        <Transition appear name="fade-up" delay="200">
          <p class="sub-description">
            종목의 어떤 품목을 수출하는지 파악하기 어렵고, 주요 제품의 수출입량을 확인하기 어렵다.
          </p>
        </Transition>
        <div class="cards">
          <Transition appear name="slide-left" delay="300">
            <div class="card">
              <h4>무역 통계 (KOTRA, 관세청)</h4>
              <p>수출입품목을 HSCode로 제공</p>
            </div>
          </Transition>
          <Transition appear name="slide-up" delay="500">
            <div class="card">
              <h4>종목 정보 (DART, KIND 등)</h4>
              <p>종목의 주요 제품은 제품명만으로 제공</p>
            </div>
          </Transition>
          <Transition appear name="slide-right" delay="700">
            <div class="card">
              <h4>종목 - 품목 연결의 어려움</h4>
              <p>HSCode와 제품명 간 정확한 매칭이 어렵다</p>
            </div>
          </Transition>
        </div>
        <div class="dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </section>

    <!-- 플랫폼 섹션 -->
    <section class="platform">
      <div class="container">
        <Transition appear name="fade-up">
          <p class="platform-intro">데이터간의 단절을 연결하는 플랫폼</p>
        </Transition>
        <Transition appear name="scale-up" delay="300">
          <img src="@/assets/images/logo/logo.png" alt="로고 이미지" class="logo" />
        </Transition>
        <Transition appear name="fade-up" delay="500">
          <p class="tagline">주식이 모이는 무역항 : 투자로 떠나는 항해</p>
        </Transition>
        <Transition appear name="fade-up" delay="700">
          <div class="mockup">
            <img :src="LandingImage" alt="StockPort 인터페이스" class="mockup-image" />
          </div>
        </Transition>
      </div>
    </section>

    <!-- ===== 두 번째 페이지(StockPortIntro.vue) ===== -->
    <div class="stock-port-container">
      <h1 class="main-title">흩어진 무역 정보를 한 곳에</h1>
      <p class="sub-title">
        무역 통계, 증권 정보, HS코드까지 따로따로 보지 마세요.<br />
        하나의 플랫폼에서 종목과 품목, 수출입 데이터를 연결해 확인할 수 있습니다.
      </p>

      <div class="tab-container">
        <button
          v-for="(tab, i) in tabs"
          :key="i"
          :class="['tab-button', { active: activeTab === i }]"
          @click="onTabClick(i)"
        >
          {{ tab }}
        </button>
      </div>

      <div class="swiper-container">
        <Swiper
          :modules="[SwiperPagination]"
          :pagination="{ el: '.swiper-pagination', clickable: true }"
          :loop="false"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <SwiperSlide v-for="(slide, i) in slides" :key="i">
            <div class="slide-content">
              <div class="image-frame">
                <img :src="slide.image" :alt="slide.title" class="slide-image" />
              </div>
              <div class="speech-bubble" :class="{ active: currentSlide === i }">
                {{ slide.description }}
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="swiper-pagination"></div>
      </div>

      <button class="start-button" @click="goMain">
        StockPort 시작하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LandingImage from '@/assets/images/landing.svg';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination as SwiperPagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// slide 이미지
import keywordSearch from '@/assets/images/keyword-search.png';
import chart1 from '@/assets/images/chart1.png';
import chart3 from '@/assets/images/chart3.png';
import barChart from '@/assets/images/bar-chart.png';
import { useRouter } from 'vue-router';

const tabs = [
  '키워드 검색',
  '네트워크 그래프',
  '수출입 통계 그래프',
  '무역 품목 수출입량'
];

const slides = [
  { title: '키워드 검색', image: keywordSearch, description: '키워드를 입력하면 관련된 종목과 품목이 등장합니다' },
  { title: '네트워크 그래프', image: chart3, description: '데이터 간의 연결 관계를 시각화합니다' },
  { title: '수출입 통계 그래프', image: chart1, description: '수출입 통계 현황을 한눈에 확인하세요' },
  { title: '무역 품목 수출입량', image: barChart, description: '품목별 수출입량을 비교 분석합니다' },
];

const activeTab = ref(0);
const currentSlide = ref(0);
const swiperInstance = ref(null);
const router = useRouter();

function goMain() {
  // 메인 페이지 경로로 이동
  router.push('/');
}
function onSwiper(swiper) {
  swiperInstance.value = swiper;
}

function onSlideChange() {
  const idx = swiperInstance.value.activeIndex;
  currentSlide.value = idx;
  activeTab.value = idx;
}

function onTabClick(idx) {
  activeTab.value = idx;
  swiperInstance.value?.slideTo(idx);
}

let observer;
onMounted(() => {
  currentSlide.value = 0;
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
  }, { threshold: 0.1 });
  document.querySelectorAll('section').forEach(sec => observer.observe(sec));
});
onUnmounted(() => {
  observer.disconnect();
});
</script>

<style scoped>
/* ---------- 첫 번째 페이지 스타일 ---------- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.landing-page {
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  color: #333;
  background: linear-gradient(180deg, #f0f8ff 0%, #ffffff 100%);
  overflow-x: hidden;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
section {
  padding: 200px 0 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s, transform 0.8s;
}
section.visible {
  opacity: 1;
  transform: translateY(0);
}
.section-title {
  font-size: 27px;
  text-align: center;
  font-weight: 450;
  margin-bottom: 17px;
}
.text-primary { color: #0088FF; }
.overview {
    text-align: center;
  }
.overview .headline { 
  font-size: 30px; margin-bottom: 20px; line-height: 1.4; font-weight: 550; letter-spacing: 1.5px;
}
.highlight { background-color: #0088FF; color: white; padding: 1px 7px; }
.description {
  font-size: 19px; line-height: 1.6; color: #7D7D7D; margin-bottom: 40px;
}
.dots { display: flex; flex-direction: column; align-items: center; margin: 40px auto; gap: 8px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; }
.dot:nth-child(1){ opacity:0.3;} .dot:nth-child(2){ opacity:0.6;} .dot:nth-child(3){ opacity:1;}
.limitations { background: #f8fafc; }
.sub-description {
  text-align: center; font-size: 19px; margin-bottom: 40px; line-height: 1.6; color: #7D7D7D;
}
.cards { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 40px; }
.card {
  background: white; border-radius:12px; padding:24px;
  box-shadow:0 4px 12px rgba(0,0,0,0.05);
  transition: transform .3s, box-shadow .3s;
}
.card:hover { transform:translateY(-5px); box-shadow:0 8px 24px rgba(0,0,0,0.1); }
.card h4 { font-size:19px; margin-bottom:12px; color:#0088FF; font-weight:500; text-align:center; }
.card p { font-size:17px; color:#666; line-height:1.5; text-align:center; }
.platform { text-align:center; }
.platform-intro { font-size:19px; color:#666; margin-bottom:20px; }
.logo { width:300px; height:auto; margin-bottom:20px; }
.tagline { font-size:20px; color:#0088FF; margin-bottom:40px; font-weight:550; letter-spacing:1px; }
.mockup { max-width:800px; margin:0 auto; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1); }
.mockup-image { width:100%; display:block; }
.fade-down-enter-active, .fade-up-enter-active,
.slide-left-enter-active, .slide-right-enter-active,
.slide-up-enter-active, .scale-up-enter-active { transition: all .8s ease; }
.fade-down-enter-from { opacity:0; transform:translateY(-30px); }
.fade-up-enter-from { opacity:0; transform:translateY(30px); }
.slide-left-enter-from { opacity:0; transform:translateX(-50px); }
.slide-right-enter-from { opacity:0; transform:translateX(50px); }
.slide-up-enter-from { opacity:0; transform:translateY(30px); }
.scale-up-enter-from { opacity:0; transform:scale(0.8); }

/* ---------- 두 번째 페이지(슬라이더) 스타일 ---------- */
.stock-port-container {
  max-width: 1200px; margin: 80px auto; padding: 20px; text-align:center;
}
.main-title { font-size:32px; font-weight:700; margin-bottom:16px; }
.sub-title { font-size:16px; color:#666; line-height:1.6; margin-bottom:40px; }
.tab-container { display:flex; justify-content:center; gap:10px; margin-bottom:30px; }
.tab-button {
  padding:10px 20px; border-radius:20px; border:1px solid #e0e0e0;
  background:white; font-size:14px; cursor:pointer; transition:all .3s;
}
.tab-button.active { background:#f0f8ff; border-color:#2196f3; color:#2196f3; }
.swiper-container { position:relative; margin-bottom:40px; }
.slide-content { position:relative; display:flex; flex-direction:column; align-items:center; padding:20px; }
.image-frame {
  width:700px; height:500px; background:#fff; border:6px solid #fff;
  border-radius:16px; box-shadow:0 8px 24px rgba(0,0,0,0.12);
  display:flex; justify-content:center; align-items:center; overflow:hidden; margin-bottom:20px;
}
.slide-image { max-width:100%; max-height:100%; object-fit:contain; }
.speech-bubble {
  position:absolute; top:-60px; right:10%; background:#2196f3; color:white;
  padding:12px 20px; border-radius:20px; font-size:14px; opacity:0;
  transform:translateY(20px); transition:all .5s; max-width:300px; z-index:10;
}
.speech-bubble::after {
  content:''; position:absolute; bottom:-10px; right:30px;
  border-width:10px 10px 0; border-style:solid; border-color:#2196f3 transparent;
}
.speech-bubble.active { opacity:1; transform:translateY(0); }
.swiper-pagination { margin-top:20px; }
:deep(.swiper-pagination-bullet) { width:10px; height:10px; background:#ccc; opacity:1; }
:deep(.swiper-pagination-bullet-active) { background:#2196f3; }
.start-button {
  display:inline-block; background:#2196f3; color:white; font-size:18px;
  font-weight:500; padding:12px 40px; border-radius:30px; text-decoration:none;
  transition:background-color .3s, box-shadow .3s;
  box-shadow:0 6px 20px rgba(0,0,0,0.18);
}
.start-button:hover {
  background:#0d8aee; box-shadow:0 8px 28px rgba(0,0,0,0.25);
}
.landing-page {
  /* 전체 높이를 뷰포트 높이로, 스크롤 스냅을 세로 방향으로 강제 */
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

/* 섹션(및 슬라이더 컨테이너)을 뷰포트 높이만큼, 스냅 위치로 설정 */
section,
.stock-port-container {
  scroll-snap-align: start;
  min-height: 100vh;
}
.stock-port-container{
  scroll-snap-align: start;
  min-height: 100vh;
}
.start-button{
  border: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
}

/* 반응형 */
@media (max-width: 768px) {
  .landing-page { scroll-snap-type: none; }
  .container { padding: 0 10px; }
  section { padding: 60px 0; }
  .headline h3 { font-size: 22px; }
  .description, .sub-description { font-size: 15px; }
  .tab-container { overflow-x: auto; white-space: nowrap; padding: 0 10px; }
  .tab-button { display: inline-block; margin-right: 8px; }
  .swiper-container { margin-bottom: 20px; }
  .image-frame { width: 100%; max-width: 300px; height: auto; }
  .mockup { width: 100%; }
  .mockup-image { width: 100%; }
  .cards { flex-direction: column; gap: 16px; }
  .stock-port-container { padding: 20px 10px; margin: 40px auto; }
}
@media (max-width: 480px) {
  .section-title { font-size: 22px; }
  .main-title { font-size: 28px; }
  .sub-title { font-size: 14px; }
  .start-button { padding: 10px 20px; font-size: 16px; }
}
</style>
