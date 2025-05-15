import { createRouter, createWebHashHistory } from "vue-router";

// 페이지 컴포넌트 - 상대 경로 사용
const MainPage = () => import("../views/MainPage.vue");
const StockPage = () => import("../views/StockPage.vue");
const ProductPage = () => import("../views/ProductPage.vue");

// 라우트 정의
const routes = [
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
];

// 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
