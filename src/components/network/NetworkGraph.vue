<script>
import { reactive, ref } from "vue";
import * as vNG from "v-network-graph";

import { ForceLayout } from "v-network-graph/lib/force-layout";
import { getStockNetworkAPI } from "@/apis/stock";
import { getProductNetworkAPI } from "@/apis/product";

export default {
  name: "NetworkGraph",
  props: {
    stockId: {
      type: String,
      //   required: true,
    },
    productId: {
      type: String,
      //   required: true,
    },
    type: {
      type: String,
      validator: (v) => ["stock", "product"].includes(v),
    },
  },
  data() {
    return {
      // reactive 상태
      nodes: reactive({}),
      edges: reactive({}),

      // 고정 레이아웃
      layouts: ref({
        nodes: {
          node0: { x: 0, y: 0, fixed: true },
        },
      }),

      // 그래프 설정
      configs: reactive(
        vNG.defineConfigs({
          view: {
            layoutHandler: new ForceLayout({
              positionFixedByDrag: false,
              positionFixedByClickWithAltKey: true,
              createSimulation: (d3, nodes, edges) => {
                const forceLink = d3.forceLink(edges).id((d) => d.id);
                return d3
                  .forceSimulation(nodes)
                  .force("edge", forceLink.distance(60).strength(1.5))
                  .force("charge", d3.forceManyBody().strength(-1000))
                  .alphaMin(0.001);
              },
            }),
          },
          node: {
            normal: {
              radius: 16,
              color: (node) => {
                const base = {
                  품목: [0, 60, 255],
                  국내: [255, 0, 7],
                  해외: [88, 166, 92],
                }[node.type] || [204, 204, 204];
                // 깊이에 따른 알파
                const depth = node.depth || 0;
                const alpha = Math.max(0.2, 1 - depth * 0.2);
                return `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha})`;
              },
            },
            label: {
              visible: (node) => node.id === "node0",
              direction: "south",
              directionAutoAdjustment: true,
              text: (node) => {
                const name = node.name || "";
                return name.length > 20 ? name.slice(0, 20) + "…" : name;
              },
            },
            draggable: true,
          },
          edge: {
            normal: {
              color: "#B8C8FC",
              dasharray: "4 6",
            },
          },
        })
      ),
      targetNodeId: "",
      tooltipOpacity: 0,
      tooltipPos: { left: "0px", top: "0px" },
    };
  },
  computed: {
    eventHandlers() {
      return {
        "node:click": this.onNodeClick,
        "node:pointerover": this.onPointerOver,
        "node:pointerout": this.onPointerOut,
      };
    },
    targetNodePos() {
      return this.layouts.nodes[this.targetNodeId] || { x: 0, y: 0 };
    },
  },
  methods: {
    onNodeClick({ node }) {
      const link = this.nodes[node].link_id;
      const type = this.nodes[node].type;
      if (type === "국내" || type === "해외")
        window.location.href = "/stock/" + link;
      else {
        window.location.href = "/product/" + link;
      }
    },
    onPointerOver({ node }) {
      this.targetNodeId = node;
      this.tooltipOpacity = 1;

      // 툴팁 위치 계산
      const graph = this.$refs.graph;
      const tip = this.$refs.tooltip;
      const pos = this.layouts.nodes[node]; // 최신 레이아웃 좌표
      const dom = graph.translateFromSvgToDomCoordinates(pos);
      const x = dom.x - tip.offsetWidth / 2;
      const y = dom.y - tip.offsetHeight - 16 - 8;
      this.tooltipPos = { left: x + "px", top: y + "px" };
    },
    onPointerOut() {
      this.tooltipOpacity = 0;
    },

    async getGraphData() {
      // 이전 데이터 초기화
      Object.keys(this.nodes).forEach((k) => delete this.nodes[k]);
      Object.keys(this.edges).forEach((k) => delete this.edges[k]);

      try {
        let res = null;
        if (this.type === "stock") {
          res = await getStockNetworkAPI(this.stockId);
        } else {
          res = await getProductNetworkAPI(this.productId);
        }
        const data = res.data;

        Object.assign(this.nodes, data?.nodes);
        Object.assign(this.edges, data?.edges);

        // 깊이에 따른 색 표현
        // 1) 초기화
        const depthMap = {};
        const queue = [{ id: "node0", depth: 0 }];
        depthMap["node0"] = 0;

        // 2) BFS 루프 - 깊이 계산
        while (queue.length) {
          const { id, depth } = queue.shift();

          Object.values(this.edges).forEach((e) => {
            const neighbor =
              e.source === id ? e.target : e.target === id ? e.source : null;
            if (neighbor && depthMap[neighbor] == null) {
              depthMap[neighbor] = depth + 1;
              queue.push({ id: neighbor, depth: depth + 1 });
            }
          });
        }

        // 3) 노드 객체에 깊이 할당
        Object.keys(this.nodes).forEach((nid) => {
          this.nodes[nid].depth = depthMap[nid] ?? 0;
        });
      } catch (err) {
        console.error("Error loading graph data:", err);
      }
    },
  },

  mounted() {
    this.getGraphData();
  },

  watch: {
    stockId: {
      immediate: true,
      handler() {
        this.getGraphData();
      },
    },
  },
};
</script>

<template>
  <div class="tooltip-wrapper">
    <v-network-graph
      ref="graph"
      :zoom-level="0.2"
      :nodes="nodes"
      :edges="edges"
      v-model:layouts="layouts"
      :configs="configs"
      :event-handlers="eventHandlers"
      style="width: 100%; height: 600px"
    />
    <div
      ref="tooltip"
      class="tooltip"
      :style="{
        left: tooltipPos.left,
        top: tooltipPos.top,
        opacity: tooltipOpacity,
      }"
    >
      {{ nodes[targetNodeId]?.name || "" }}
    </div>
  </div>
</template>

<style scoped>
.tooltip-wrapper {
  position: relative;
}
.tooltip {
  top: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  width: 120px;
  height: 36px;
  display: grid;
  place-content: center;
  text-align: center;
  font-size: 12px;
  transition: opacity 0.2s linear;
  pointer-events: none;

  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
