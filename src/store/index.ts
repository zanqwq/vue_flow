import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import * as go from "gojs";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = " http://localhost:3000";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    flows: [],
    curFlowIndex: undefined,
    G: {},
  },
  mutations: {
    loadFlows(state, flows) {
      state.flows = flows;
    },

    addFlow(state, flow) {
      console.log("adding flow ......");
      state.flows.push(flow);
    },

    saveFlow() {
      console.log("saving flow ......");
    },

    deleteFlow(state, flowIndex) {
      console.log("deleting flow ......");
      state.flows.splice(flowIndex, 1);
    },

    setG(state, G) {
      state.G = G;
    },

    updateCurFlowIndex(state, index) {
      state.curFlowIndex = index;
    },

    updateModel(state) {
      if (state.curFlowIndex === undefined) {
        (state.G as any).model = new go.GraphLinksModel();
      } else {
        (state.G as any).model = state.flows[state.curFlowIndex].model;
      }
    },
  },
  actions: {
    loadFlows(ctx) {
      console.log("fetching flow data from server ......");
      axios.get("/flows").then(
        res => {
          // 将 json 格式的 model 解析成 go.Model 实例保存
          for (const flow of res.data)
            flow.model = go.Model.fromJson(flow.model);
          ctx.commit("loadFlows", res.data);
        },
        e => {
          console.log(e);
        }
      );
    },

    addFlow(ctx, flow) {
      console.log("posting flow to server ......");
      flow.model = new go.GraphLinksModel().toJson();
      axios.post("/flow/create", flow).then(
        res => {
          flow.model = go.Model.fromJson(flow.model);
          flow._id = res.data;
          ctx.commit("addFlow", flow);
          const index = ctx.state.curFlowIndex;
          (ctx.state.curFlowIndex as any) = index === undefined ? 0 : index + 1;
          ctx.commit("updateModel");
        },
        e => {
          console.log(e);
        }
      );
    },

    saveFlow(ctx, flowIndex) {
      console.log("saving flow to server ......");
      const id = ctx.state.flows[flowIndex]._id;
      axios.put(`/flow/${id}`, ctx.state.flows[flowIndex]).then(
        () => {
          ctx.commit("saveFlow");
        },
        e => {
          console.log(e.message);
        }
      );
    },

    deleteFlow(ctx, flowIndex) {
      console.log("deleting flow from server ......");
      const id = ctx.state.flows[flowIndex]._id;
      axios.delete(`/flow/${id}`).then(
        () => {
          ctx.commit("deleteFlow", flowIndex);
          (ctx.state.curFlowIndex as any) = undefined;
          ctx.commit("updateModel");
        },
        e => {
          console.log(e);
        }
      );
    },
  },
});
