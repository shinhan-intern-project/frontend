<script>
import { reactive, ref } from "vue";
import * as vNG from "v-network-graph";

import { ForceLayout } from "v-network-graph/lib/force-layout";
import { getStockNetworkAPI } from "@/apis/stock";

export default {
  name: "NetworkGraph",
  props: {
    stockId: {
      type: String,
      required: true,
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
                if (node.id === "node0") return "#F04452";
                if (node.type === "품목") return "rgba(103, 138, 196, 0.58)";
                if (node.type === "품목") return "rgba(103, 138, 196, 0.58)";
                if (node.type === "국내") return "rgba(232, 83, 87, 0.53)";
                if (node.type === "해외") return "rgba(31, 9, 140, 0.22)";
                return "#CCCCCC";
              },
            },
            label: {
              visible: (node) => node.id === "node0",
              direction: "south",
              directionAutoAdjustment: true,
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
      const link = this.nodes[node].hscode;
      window.location.href = "/hscode/" + link;
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
        const res = await getStockNetworkAPI(this.stockId);
        const data = res.data;

        Object.assign(this.nodes, data?.nodes);
        Object.assign(this.edges, data?.edges);
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
      :zoom-level="1"
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
