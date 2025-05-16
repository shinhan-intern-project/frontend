import { createApp } from "vue";
import App from "./App.vue";
import router from "./routers/router";
import VueApexCharts from "vue3-apexcharts";
import VNetworkGraph from "v-network-graph";

const app = createApp(App);
app.use(router);
app.use(VueApexCharts);
app.use(VNetworkGraph);
app.mount("#app");
