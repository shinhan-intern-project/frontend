import LandingPage from "@/views/LandingPage.vue";
import { createRouter, createWebHistory } from "vue-router";

// 페이지 컴포넌트 - 상대 경로 사용
const MainPage = () => import("../views/MainPage.vue");
const StockPage = () => import("../views/StockPage.vue");
const ProductPage = () => import("../views/ProductPage.vue");
const ErrorPage = () => import("../views/ErrorPage.vue"); 

// 라우트 정의
const routes = [
  {
    path: "/landing",
    name: "landing",
    component: LandingPage,

  },
  {
    path: "/",
    name: "main",
    component: MainPage,
  },
  {
    path: "/stock/:stockId",
    name: "stock",
    component: StockPage,
    props: true,
  },
  {
    path: "/product/:productId",
    name: "product",
    component: ProductPage,
  },
  {
    path: "/not-found", // 👈 명시적인 경로
    name: "NotFound",
    component: ErrorPage,
    props: {
      title: "페이지를 찾을 수 없습니다",
      message1: "요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.",
      message2: "입력하신 페이지 주소가 정확한지 다시 한번 확인해주시기 바랍니다.",
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/not-found",
  }
];

// 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
