<template>
  <el-container class="root-container">
    <el-header>
      <Header class="header-bar" />
    </el-header>

    <el-container>
      <el-aside class="aside-bar" id="palette"> </el-aside>

      <el-main
        class="main-content-container"
        id="diagram"
        v-show="!diagramDisabled"
      >
      </el-main>

      <el-main class="main-content-container" v-show="diagramDisabled">
        <el-alert
          title="没 有 当 前 流 程"
          type="info"
          description="请 创 建 或 切 换 到 指 定 流 程 以 拖 入 左 侧 节 点"
          :closable="false"
          show-icon
        >
        </el-alert>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "@/components/Header.vue";
import { mapState } from "vuex";
import initGoPalette from "@/gojs/initGoPalette";
import initGoDiagram from "@/gojs/initGoDiagram";

export default Vue.extend({
  mounted() {
    const P = initGoPalette("palette");
    const G = initGoDiagram("diagram");

    G.nodeTemplate = P.nodeTemplate;

    this.$store.commit("setG", G);
    this.$store.dispatch("loadFlows");
  },
  computed: {
    ...mapState(["curFlowIndex"]),
    diagramDisabled() {
      return this.curFlowIndex === undefined;
    }
  },
  components: {
    Header
  }
});
</script>

<style>
.header-bar {
  position: fixed !important;
  top: 0px;

  z-index: 100;
  width: 100%;
}

.aside-bar {
  position: fixed !important;
  border-right: 1px solid rgb(206, 206, 206);
  height: 100%;
  width: 300px;
}

.main-content-container {
  position: absolute;
  left: 350px;
  top: 65px;
  right: 0px;
  bottom: 0px;
}

.diagramDisabled {
  display: none !important;
}

/* 取消 outline */
#diagram *,
#palette * {
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); /* mobile webkit */
}
</style>
