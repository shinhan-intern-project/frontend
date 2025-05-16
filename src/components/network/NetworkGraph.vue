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
                if (node.type === "품목") return "rgba(103, 138, 196, 0.58)";
                if (node.type === "국내") return "rgba(232, 83, 87, 0.53)";
                if (node.type === "해외") return "rgba(31, 9, 140, 0.22)";
                return "#CCCCCC";
              },
            },
            label: {
              visible: false,
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
    };
  },
  methods: {
    onNodeClick({ node }) {
      const link = this.nodes[node].hscode;
      window.location.href = "/hscode/" + link;
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
  <div class="demo-control-panel">
    <Graph />
  </div>

  <v-network-graph
    :zoom-level="1"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
    style="width: 100%; height: 600px"
    :event-handlers="eventHandlers"
  />
</template>
