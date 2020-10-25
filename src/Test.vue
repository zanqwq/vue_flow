<template>
  <el-container>
    <el-aside>
      <div id="palette"></div>
    </el-aside>
    <el-main>
      <div id="diagram"></div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import * as go from "gojs";
const gmake = go.GraphObject.make;

export default Vue.extend({
  mounted() {
    const diagram = gmake(go.Diagram, "diagram");

    diagram.nodeTemplate = gmake(
      go.Node,
      "Auto",
      gmake(
        go.Shape,
        "RoundedRectangle",
        { strokeWidth: 0 },
        new go.Binding("fill", "color")
      ),
      gmake(
        go.TextBlock,
        {
          editable: true,
          margin: 8,
          choices: ["Alpha", "Beta", "Gamma", "Delta"]
        },
        new go.Binding("text")
      )
    );

    diagram.model = new go.GraphLinksModel([
      { text: "Alpha", color: "lightblue" },
      { text: "Beta", color: "orange" },
      { text: "Gamma", color: "lightgreen" },
      { text: "Delta", color: "pink" }
    ]);

    // Create an HTMLInfo and dynamically create some HTML to show/hide
    const customEditor = new go.HTMLInfo();
    const customSelectBox = document.createElement("select");

    customEditor.show = function(textBlock, diagram, tool) {
      if (!(textBlock instanceof go.TextBlock)) return;

      // Populate the select box:
      customSelectBox.innerHTML = "";

      // this sample assumes textBlock.choices is not null
      const list: string[] = textBlock.choices as string[];
      for (let i = 0; i < list.length; i++) {
        const op = document.createElement("option");
        op.text = list[i];
        op.value = list[i];
        customSelectBox.add(op, null);
      }

      // After the list is populated, set the value:
      customSelectBox.value = textBlock.text;

      // Do a few different things when a user presses a key
      customSelectBox.addEventListener(
        "keydown",
        function(e) {
          const keynum = e.which;
          if (keynum == 13) {
            // Accept on Enter
            (tool as go.TextEditingTool).acceptText(go.TextEditingTool.Enter);
            return;
          } else if (keynum == 9) {
            // Accept on Tab
            (tool as go.TextEditingTool).acceptText(go.TextEditingTool.Tab);
            e.preventDefault();
            return false;
          } else if (keynum === 27) {
            // Cancel on Esc
            tool.doCancel();
            if (tool.diagram) tool.diagram.focus();
          }
        },
        false
      );

      const loc = textBlock.getDocumentPoint(go.Spot.TopLeft);
      const pos = diagram.transformDocToView(loc);
      customSelectBox.style.left = pos.x + "px";
      customSelectBox.style.top = pos.y + "px";
      customSelectBox.style.position = "absolute";
      customSelectBox.style.zIndex = "100"; // place it in front of the Diagram

      (diagram.div as any).appendChild(customSelectBox);
    };

    customEditor.hide = function(diagram, tool) {
      (diagram.div as any).removeChild(customSelectBox);
    };

    // This is necessary for HTMLInfo instances that are used as text editors
    customEditor.valueFunction = function() {
      return customSelectBox.value;
    };

    // Set the HTMLInfo:
    diagram.toolManager.textEditingTool.defaultTextEditor = customEditor;
  }
});
</script>

<style>
#diagram {
  width: 500px;
  height: 500px;
  border: 1px solid gray;
}
</style>
