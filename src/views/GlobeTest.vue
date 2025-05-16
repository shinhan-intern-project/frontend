<template>
  <div ref="globeContainer" class="globe-container"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Globe from "globe.gl";

export default {
  name: "GlobeVisualization",
  setup() {
    const globeContainer = ref(null);
    let globe = null;

    onMounted(() => {
      // Globe 인스턴스 생성
      globe = Globe()(globeContainer.value)
        .width(globeContainer.value.clientWidth)
        .height(globeContainer.value.clientHeight)
        .backgroundColor("#1a1a1a")
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        )
        .pointsData([
          { lat: 37.5665, lng: 126.978, name: "Seoul" },
          { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
          { lat: 51.5074, lng: 0.1278, name: "London" },
        ])
        .pointLabel("name")
        .pointRadius(0.5)
        .pointColor(() => "yellow");

      // 자동 회전 설정
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;
    });

    onBeforeUnmount(() => {
      // 리소스 정리
      if (globe) {
        globe._destructor();
      }
    });

    return {
      globeContainer,
    };
  },
};
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 500px;
}
</style>
