<template>
  <div>
    <!-- Depth 조절 슬라이더 -->
    <div class="slider-wrapper">
      <input
        type="range"
        v-model="depth"
        :min="1"
        :max="10"
        :step="1"
        class="slider-range"
        @change="fetchData"
      />
      <span class="slider-value">{{ depth }}</span>
    </div>

    <!-- 그래프 + 스피너 래퍼 -->
    <div class="graph-wrapper">
      <!-- 로딩 중일 때 보여줄 스피너 -->
      <div v-if="loading" class="spinner-overlay">
        <div class="spinner"></div>
      </div>

      <!-- Canvas 그래프 컨테이너 -->
      <div class="graph-container" ref="graphContainer"></div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import ForceGraph2D from "force-graph";
import { getStockNetworkAPI } from "@/apis/stock";
import { getProductNetworkAPI } from "@/apis/product";

export default {
  name: "NetworkGraphCanvas",
  props: {
    stockId: { type: String, default: "" },
    productId: { type: String, default: "" },
    type: {
      type: String,
      validator: (v) => ["stock", "product"].includes(v),
      required: true,
    },
  },
  setup(props) {
    const depth = ref(2);
    const rawNodes = reactive({});
    const rawEdges = reactive({});
    const graphContainer = ref(null);
    const loading = ref(false);
    let fgInstance = null;

    const fetchData = async () => {
      loading.value = true;
      // 초기화
      Object.keys(rawNodes).forEach((k) => delete rawNodes[k]);
      Object.keys(rawEdges).forEach((k) => delete rawEdges[k]);

      // API 호출
      let res;
      if (props.type === "stock") {
        res = await getStockNetworkAPI(props.stockId, depth.value);
      } else {
        res = await getProductNetworkAPI(props.productId, depth.value);
      }
      const data = res.data || {};
      Object.assign(rawNodes, data.nodes || {});
      Object.assign(rawEdges, data.edges || {});

      // BFS로 depthMap 계산
      const depthMap = { node0: 0 };
      const queue = [{ id: "node0", depth: 0 }];
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
      fgInstance = ForceGraph2D()(graphContainer.value)
        .width(graphContainer.value.offsetWidth)
        .height(graphContainer.value.offsetHeight)
        .nodeRelSize(8)
        .nodeCanvasObject((node, ctx) => {
          const isRoot = node.id === "node0";
          const radius = isRoot ? 12 : 8;
          // 노드 원 그리기
          // 색상 RGB 매핑
          const rgbMap = {
            품목: [0, 60, 255],
            국내: [255, 0, 7],
            해외: [88, 166, 92],
          };
          const [r, g, b] = rgbMap[node.type] || [136, 136, 136];
          // depth 작을수록 진한 표현 (alpha)
          const alpha = Math.max(0.2, 1 - (node.depth || 0) * 0.1);
          ctx.globalAlpha = alpha;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();
          ctx.globalAlpha = 1;
          if (isRoot) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#000";
            ctx.stroke();
            // node0 라벨 텍스트
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "#000";
            ctx.fillText(node.name, node.x, node.y - radius - 4);
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
      () => [props.stockId, props.productId, depth.value],
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
      graphContainer,
      loading,
      fetchData,
    };
  },
};
</script>

<style scoped>
/* 슬라이더 */
.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.slider-range {
  width: 250px;
  height: 6px;
}
.slider-value {
  width: 2rem;
  text-align: center;
}

.graph-wrapper {
  position: relative;
}

/* Canvas 그래프 */
.graph-container {
  width: 100%;
  height: 600px;
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
</style>
