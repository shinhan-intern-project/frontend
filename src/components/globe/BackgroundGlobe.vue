<!-- src/components/globe/BackgroundGlobe.vue -->
<template>
  <div class="background-globe-container" ref="container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import Globe from "globe.gl";
import * as THREE from "three";

const container = ref(null);
let globeInstance = null;

const fetchCountries = async () => {
  try {
    const res = await fetch(
      "https://unpkg.com/world-atlas/countries-110m.json"
    );
    const data = await res.json();
    return data.features;
  } catch (e) {
    console.error("국가 데이터를 불러오는 데 실패했습니다:", e);
    return [];
  }
};

const initGlobe = async () => {
  const countries = await fetchCountries();
  if (!container.value) return;

  globeInstance = Globe()(container.value)
    .backgroundColor("rgba(240, 248, 255, 0)")
    .polygonsData(countries)

    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
    .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
    .width(window.innerWidth * 0.5)
    .height(window.innerHeight * 0.8)
    .showGlobe(true)
    .showAtmosphere(true)
    .atmosphereColor("rgba(200, 219, 255, 0.3)")
    .atmosphereAltitude(0.15)
    .globeMaterial(
      new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        shininess: 0.2,
        specular: 0x77bbff,
      })
    )
    .pointsData([
      { lat: 37.5665, lng: 126.978, value: 3.2, name: "서울" },
      { lat: 35.6762, lng: 139.6503, value: 1.8, name: "도쿄" },
      { lat: 40.7128, lng: -74.006, value: 2.5, name: "뉴욕" },
      { lat: 1.3521, lng: 103.8198, value: 1.5, name: "싱가포르" },
    ])
    .pointColor((d) => {
      const colors = {
        서울: "rgba(25, 118, 210, 0.8)",
        도쿄: "rgba(56, 142, 60, 0.8)",
        뉴욕: "rgba(245, 124, 0, 0.8)",
        싱가포르: "rgba(156, 39, 176, 0.8)",
      };
      return colors[d.name] || "rgba(255, 255, 255, 0.8)";
    })
    .pointRadius(0.4)
    .pointAltitude(0.02)
    .arcsData([
      {
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 35.6762,
        endLng: 139.6503,
      },
      {
        startLat: 37.5665,
        startLng: 126.978,
        endLat: 40.7128,
        endLng: -74.006,
      },
      {
        startLat: 35.6762,
        startLng: 139.6503,
        endLat: 1.3521,
        endLng: 103.8198,
      },
    ])
    .arcColor(() => [
      "rgba(0, 127, 255, 0.5)",
      "rgba(44, 186, 0, 0.5)",
      "rgba(255, 197, 0, 0.5)",
    ])
    .arcDashLength(0.4)
    .arcDashGap(0.2)
    .arcDashAnimateTime(1500)
    .arcStroke(0.5);

  globeInstance.controls().autoRotate = true;
  globeInstance.controls().autoRotateSpeed = 0.3;
  globeInstance.controls().enableZoom = false;
  globeInstance.pointOfView({ lat: 25, lng: 120, altitude: 2.5 }, 1000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  globeInstance.scene().add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(1, 1, 1);
  globeInstance.scene().add(directionalLight);
};

onMounted(() => {
  initGlobe();
  window.addEventListener("resize", () => {
    if (globeInstance) {
      globeInstance
        .width(window.innerWidth * 0.4)
        .height(window.innerHeight * 0.7);
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", () => {});
  if (globeInstance && globeInstance._destructor) {
    globeInstance._destructor();
  }
});
</script>

<style scoped>
.background-globe-container {
  position: absolute;
  top: 0;
  right: -100px;
  width: 70%;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

@media (max-width: 576px) {
  .background-globe-container {
    position: fixed;
    top: 0;
    /* 왼쪽을 0, 오른쪽은 auto로 바꿔서 */
    left: 0;
    right: auto;
    width: 100vw; /* 뷰포트 너비만큼 */
    height: 100vh; /* 뷰포트 높이만큼 */
    transform: none;
  }
  .toggle-container {
    margin-left: 10px;
  }

  .recent-trades-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .recent-trades table {
    min-width: 100%;
  }
  .recent-trades td,
  .recent-trades th {
    padding: 6px 4px;
    font-size: 14px;
  }
  .recent-trades td:first-child {
    width: 35%;
  }
  .company-details-small {
    display: none;
  }

  .item-volume {
    display: none;
  }

  .statistics-table {
    font-size: 12px;
  }
  .export-stats-section {
    padding: 0;
  }
}
</style>
