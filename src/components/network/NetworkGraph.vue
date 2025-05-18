<template>
  <div>
    <!-- Depth 조절 슬라이더 -->
    <div class="network-tool" :class="{ 'all-mode': isAll }">
      <div class="slider-container">
        <div v-if="type !== 'all'" class="slider-wrapper">
          <span class="slider-label">깊이</span>
          <input
            type="range"
            v-model="depth"
            :min="1"
            :max="22"
            :step="1"
            class="slider-range"
            @change="fetchData"
            :style="{ '--percent': ((depth - 1) / (22 - 1)) * 100 + '%' }"
          />
          <span class="slider-value">{{ depth }}</span>
        </div>

        <!-- Degree 조절 슬라이더 -->
        <div v-if="type !== 'all'" class="slider-wrapper">
          <span class="slider-label">차수</span>
          <input
            type="range"
            v-model="degree"
            :min="1"
            :max="353"
            :step="1"
            class="slider-range"
            @change="fetchData"
            :style="{ '--percent': ((degree - 1) / (353 - 1)) * 100 + '%' }"
          />
          <span class="slider-value">{{ degree }}</span>
        </div>

        <!-- 메인 - Degree 조절 슬라이더 -->
        <div v-if="type == 'all'" class="slider-wrapper">
          <span class="slider-label" :class="{ 'all-mode': isAll }">차수</span>
          <input
            type="range"
            v-model="allDegree"
            :min="1"
            :max="353"
            :step="1"
            class="slider-range"
            @change="fetchData"
            :style="{ '--percent': ((allDegree - 1) / (353 - 1)) * 100 + '%' }"
          />
          <span class="slider-value">{{ allDegree }}</span>
        </div>
      </div>
      <!-- 왼쪽 2개 -->
      <div class="network-tool-color">
        <div class="network-tool-color-item-col" :class="{ 'all-mode': isAll }">
          <div class="network-tool-color-item">
            <div class="network-tool-color-circle"></div>
            <div class="network-tool-color-text">국내 종목</div>
          </div>

          <div class="network-tool-color-item">
            <div class="network-tool-color-circle"></div>
            <div class="network-tool-color-text">해외 종목</div>
          </div>
        </div>
        <!-- 오른쪽 2개 -->
        <div class="network-tool-color-item-col" :class="{ 'all-mode': isAll }">
          <div class="network-tool-color-item">
            <div class="network-tool-color-circle"></div>
            <div class="network-tool-color-text">품목</div>
          </div>
          <div class="network-tool-color-item">
            <div class="network-tool-color-circle"></div>
            <div class="network-tool-color-text">현재 노드</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 그래프 + 스피너 래퍼 -->
    <div class="graph-wrapper" :class="{ 'all-mode': isAll }">
      <!-- 로딩 중일 때 보여줄 스피너 -->
      <div v-if="loading" class="spinner-overlay">
        <div class="spinner"></div>
        <!-- <span>그래프를 그리고 있습니다</span> -->
      </div>

      <!-- Canvas 그래프 컨테이너 -->
      <div class="graph-container" ref="graphContainer"></div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import ForceGraph2D from "force-graph";
import { getStockNetworkAPI, getAllNetworkAPI } from "@/apis/stock.js";
import { getProductNetworkAPI } from "@/apis/product";
import { forceLink, forceManyBody } from "d3-force";

export default {
  name: "NetworkGraphCanvas",
  props: {
    stockId: { type: String, default: "" },
    productId: { type: String, default: "" },
    type: {
      type: String,
      validator: (v) => ["stock", "product", "all"].includes(v),
      required: true,
    },
  },
  setup(props) {
    const depth = ref(5); // 1 ~ 22
    const degree = ref(25); // 1 ~ 353
    const allDegree = ref(3); // 1 ~ 353
    const rawNodes = reactive({});
    const rawEdges = reactive({});
    const graphContainer = ref(null);
    const loading = ref(false);
    let fgInstance = null;
    const isAll = props.type === "all";

    const fetchData = async () => {
      // 이전 호출 중이면 새 호출 무시
      if (loading.value) return;
      loading.value = true;
      // 초기화
      Object.keys(rawNodes).forEach((k) => delete rawNodes[k]);
      Object.keys(rawEdges).forEach((k) => delete rawEdges[k]);

      // API 호출
      let res;
      if (props.type === "all") {
        res = await getAllNetworkAPI(allDegree.value);
      } else if (props.type === "stock") {
        res = await getStockNetworkAPI(
          props.stockId,
          depth.value,
          degree.value
        );
      } else {
        res = await getProductNetworkAPI(
          props.productId,
          depth.value,
          degree.value
        );
      }

      const data = res.data || {};
      Object.assign(rawNodes, data.nodes || {});
      Object.assign(rawEdges, data.edges || {});

      // BFS로 depthMap 계산
      const rootId =
        props.type === "all" ? Object.keys(rawNodes)[0] || "node0" : "node0";
      const depthMap = { [rootId]: 0 };
      const queue = [{ id: rootId, depth: 0 }];

      while (queue.length) {
        const { id, depth: d } = queue.shift();
        Object.values(rawEdges).forEach((e) => {
          const nbr =
            e.source === id ? e.target : e.target === id ? e.source : null;
          if (nbr && depthMap[nbr] == null) {
            depthMap[nbr] = d + 1;
            queue.push({ id: nbr, depth: d + 1 });
          }
        });
      }

      // 모든 노드 허용 (개수 제한 없음)
      const allowed = Object.keys(depthMap).sort(
        (a, b) => depthMap[a] - depthMap[b]
      );

      // Canvas용 nodes & links 배열 생성
      const nodesArray = allowed.map((id) => ({
        ...rawNodes[id],
        id,
        depth: depthMap[id] || 0,
      }));
      console.table(nodesArray.slice(0, 5)); // 최소 1개 있나?

      const linksArray = Object.values(rawEdges)
        .filter((e) => allowed.includes(e.source) && allowed.includes(e.target))
        .map((e) => ({
          source: e.source,
          target: e.target,
        }));

      // 그래프 갱신
      if (fgInstance)
        fgInstance.graphData({ nodes: nodesArray, links: linksArray });
      loading.value = false;
    };
    onMounted(() => {
      // const isAll = props.type === "all";

      fgInstance = ForceGraph2D()(graphContainer.value)
        .width(graphContainer.value.offsetWidth)
        .height(graphContainer.value.offsetHeight) // 링크와 충돌 힘 재설정하여 간격 조절
        .d3Force(
          "link",
          forceLink()
            .id((d) => d.id)
            .distance(40)
            .strength(1)
        )
        .d3Force("charge", forceManyBody().strength(-100))

        .nodeRelSize(8)
        .nodeCanvasObject((node, ctx) => {
          if (isAll) {
            // === 화려한 네온 글로우 ===
            const rgbMap = {
              품목: [0, 60, 255],
              국내: [255, 0, 7],
              해외: [88, 166, 92],
            };
            const [r, g, b] = rgbMap[node.type] || [136, 136, 136];
            const t = Date.now() * 0.005;
            const pulse = 1 + 0.1 * Math.sin(t + (node.depth || 0));
            const baseR = node.id === "node0" ? 32 : 16;
            const R = baseR * pulse;

            // 라디얼 그라디언트
            const grad = ctx.createRadialGradient(
              node.x,
              node.y,
              R * 0.2,
              node.x,
              node.y,
              R
            );
            grad.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.shadowColor = `rgba(${r},${g},${b},0.7)`;
            ctx.shadowBlur = 15;

            // 글로우
            ctx.beginPath();
            ctx.arc(node.x, node.y, R, 0, 2 * Math.PI);
            ctx.fillStyle = grad;
            ctx.fill();

            // 중심 원
            ctx.beginPath();
            ctx.arc(node.x, node.y, R * 0.6, 0, 2 * Math.PI);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fill();

            ctx.shadowBlur = 0;
            if (node.id === "node0") {
              ctx.lineWidth = 3;
              ctx.strokeStyle = "#fff";
              ctx.stroke();
            }
          } else {
            // === 기존 단순 원 스타일 ===
            const isRoot = node.id === "node0";
            const radius = isRoot ? 24 : 8;
            const rgbMap = {
              품목: [0, 60, 255],
              국내: [255, 0, 7],
              해외: [88, 166, 92],
            };
            const [r, g, b] = rgbMap[node.type] || [136, 136, 136];
            const alpha = Math.max(0.2, 1 - (node.depth || 0) * 0.1);
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fill();
            ctx.globalAlpha = 1;
            if (isRoot) {
              ctx.lineWidth = 2;
              ctx.strokeStyle = "#000";
              ctx.stroke();
            }
          }
        })

        // 점선 엣지 렌더링
        .linkCanvasObject((link, ctx) => {
          const sx = link.source.x;
          const sy = link.source.y;
          const tx = link.target.x;
          const ty = link.target.y;
          ctx.beginPath();
          ctx.setLineDash([4, 6]);
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#B8C8FC";
          ctx.stroke();
          ctx.setLineDash([]);
        })
        .onNodeClick((node) => {
          const link = node.link_id;
          if (node.type === "국내" || node.type === "해외") {
            window.location.href = `/stock/${link}`;
          } else {
            window.location.href = `/product/${link}`;
          }
        });

      fetchData();
    });
    watch(
      () => [
        props.type,
        props.stockId,
        props.productId,
        depth.value,
        degree.value,
        allDegree.value,
      ],
      () => {
        if (
          (props.type === "stock" && !props.stockId) ||
          (props.type === "product" && !props.productId)
        )
          return;
        fetchData();
      }
    );

    onBeforeUnmount(() => {
      if (fgInstance) fgInstance._destructor();
    });

    return {
      depth,
      degree,
      allDegree,
      graphContainer,
      loading,
      fetchData,
      isAll,
    };
  },
};
</script>

<style scoped>
/* 슬라이더 */
.slider-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 슬라이더 라벨 */
.slider-label {
  width: 3rem;
  text-align: right;
  font-weight: 500;
}

.slider-label.all-mode {
  width: fit-content;
}

.slider-range {
  width: 250px;
  height: 6px;
}

.slider-range {
  -webkit-appearance: none;
  appearance: none;
  width: 300px;
  height: 8px;
  border-radius: 6px;
  background: linear-gradient(
    to right,
    #0088ff 0%,
    #0088ff var(--percent),
    #d7e1fb var(--percent),
    #d7e1fb 100%
  );
  outline: none;
}

.slider-value {
  width: 2rem;
  text-align: center;
}

.graph-wrapper {
  position: relative;
}

.graph-wrapper.all-mode {
  /* background: radial-gradient(circle, #1a1a2e, #0d0d1f);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7); */
}

/* Canvas 그래프 */
.graph-container {
  width: 100%;
  height: 500px;
  cursor: grab;
}
.graph-container:active {
  cursor: grabbing;
}

/* 스피너 오버레이 */
.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #0088ff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 네트워크 툴 */
.network-tool {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.network-tool.all-mode {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.network-tool-color {
  display: flex;
  gap: 20px;
  margin-right: 20px;
}

.network-tool-color-item-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.network-tool-color-item-col.all-mode {
  gap: 12px;
}

.network-tool-color-item {
  display: flex;
  gap: 4px;
}

.network-tool-color-circle {
  display: flex;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

/* 왼쪽 첫 번째 컬럼, 첫 번째 아이템(국내 종목) */
.network-tool-color-item-col:first-child
  .network-tool-color-item:nth-child(1)
  .network-tool-color-circle {
  background-color: #ff3b30;
}

/* 왼쪽 첫 번째 컬럼, 두 번째 아이템(해외 종목) */
.network-tool-color-item-col:first-child
  .network-tool-color-item:nth-child(2)
  .network-tool-color-circle {
  background-color: #58a65c;
}

/* 오른쪽 컬럼, 첫 번째 아이템(품목) */
.network-tool-color-item-col:last-child
  .network-tool-color-item:nth-child(1)
  .network-tool-color-circle {
  background-color: #007aff;
}

/* 오른쪽 컬럼, 두 번째 아이템(현재 노드) */
.network-tool-color-item-col:last-child
  .network-tool-color-item:nth-child(2)
  .network-tool-color-circle {
  background-color: transparent;
  width: 12px;
  height: 12px;
  border: 2px solid #000;
}
</style>
