<template>
  <el-menu :default-active="activeIndex" mode="horizontal">
    <el-menu-item index="1">{{ flowName }}</el-menu-item>

    <el-button-group>
      <el-menu-item
        index="2"
        class="el-icon-plus"
        @click="onAdd"
      ></el-menu-item>

      <el-menu-item
        index="3"
        class="el-icon-s-order"
        @click="onSave"
      ></el-menu-item>

      <el-menu-item
        index="4"
        class="el-icon-delete"
        @click="onDelete"
      ></el-menu-item>
    </el-button-group>

    <el-menu-item
      index="5"
      class="el-icon-question question-icon"
      @click="onQuestionClick"
    >
    </el-menu-item>

    <el-menu-item index="6" class="flow-selector-container">
      <el-dropdown trigger="click">
        <span>切换流程<i class="el-icon-arrow-down el-icon--right"></i> </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-show="flows.length === 0" :disabled="true"
            >空</el-dropdown-item
          >
          <el-dropdown-item
            v-for="(flow, index) of flows"
            :key="flow.id"
            @click.native="onFlowSelect(index)"
          >
            {{ flow.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>

    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      @submit.native.prevent
      @close="onDialogClose"
    >
      <div slot="title">
        <span v-if="dialogType === 'addFlow'">流程创建</span>
        <span v-else-if="dialogType === 'deleteFlow'" style="color: red;"
          >流程删除
        </span>
        <span v-else-if="dialogType === 'question'">帮助</span>
      </div>

      <div v-if="dialogType === 'addFlow'">
        <el-form :model="form">
          <el-form-item label="流程名称">
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="请输入流程名称"
              @keydown.enter.native="onAddConfirm"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="dialogType === 'question'">
        <el-tabs tab-position="left">
          <el-tab-pane label="如何连线">
            在节点文本域以外的区域按下并拖动
          </el-tab-pane>

          <el-tab-pane label="如何改变连线上的说明字"
            >双击连线上的说明字即可</el-tab-pane
          >
          <el-tab-pane label="如何改变连线样式"
            >双击连线即可让连线在直线和贝塞尔曲线间切换</el-tab-pane
          >

          <el-tab-pane label="如何改变节点文本">双击节点文本域</el-tab-pane>

          <el-tab-pane label="如何删除节点/连线">
            左键选中, 并按下 <kbd>delete</kbd> 键
          </el-tab-pane>

          <el-tab-pane label="选择框">
            在流图中长按左键并拖动
          </el-tab-pane>

          <el-tab-pane label="快捷键">
            <ul>
              <li>
                undo : Ctrl + z
              </li>
              <li>
                redo : Ctrl + y
              </li>
              <li>
                全选 : Ctrl + a
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取 消
        </el-button>

        <el-button
          type="primary"
          @click="onAddConfirm"
          v-if="dialogType === 'addFlow'"
        >
          确 定
        </el-button>

        <el-button
          type="danger"
          @click="onDeleteConfirm"
          v-if="dialogType === 'deleteFlow'"
        >
          删 除
        </el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  data() {
    return {
      activeIndex: "1",
      dialogVisible: false,
      dialogType: "",
      form: {
        name: ""
      }
    };
  },

  computed: {
    ...mapState(["flows"]),
    curFlowIndex: {
      get() {
        return this.$store.state.curFlowIndex;
      },

      set(index) {
        this.$store.commit("updateCurFlowIndex", index);
      }
    },
    flowName() {
      const curFlowIndex = this.curFlowIndex;
      const name =
        curFlowIndex == undefined
          ? "Welcome to Vue-Flow"
          : this.flows[curFlowIndex].name;
      return name;
    }
  },

  methods: {
    onAdd() {
      this.dialogType = "addFlow";
      this.dialogVisible = true;
    },

    onAddConfirm() {
      this.dialogVisible = false;
      const name = this.form.name;

      if (name === "") return;

      this.$store.dispatch("addFlow", { name });

      this.$message({
        message: "添加成功",
        type: "success"
      });
    },

    onSave() {
      if (this.curFlowIndex === undefined) return;
      this.$store.dispatch("saveFlow", this.curFlowIndex);

      this.$message({
        message: "保存成功",
        type: "success"
      });
    },

    onDelete() {
      if (this.curFlowIndex === undefined) return;
      console.log("on delete");
      this.dialogType = "deleteFlow";
      this.dialogVisible = true;
    },

    onDeleteConfirm() {
      this.dialogVisible = false;
      this.$store.dispatch("deleteFlow", this.curFlowIndex);

      this.$message({
        message: "删除成功",
        type: "success"
      });
    },

    onQuestionClick() {
      this.dialogVisible = true;
      this.dialogType = "question";
    },

    onFlowSelect(index) {
      if (this.curFlowIndex === index) return;
      this.curFlowIndex = index;
      this.$store.commit("updateModel");

      this.$message({
        message: `切换到 ${this.flowName}`,
        type: "success"
      });
    },

    onDialogClose() {
      this.form.name = "";
    }
  }
});
</script>

<style>
.question-icon {
  float: right !important;
  margin-right: 50px !important;
}

.flow-selector-container {
  float: right !important;
}
</style>
