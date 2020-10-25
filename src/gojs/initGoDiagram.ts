import * as go from "gojs";

const gmake = go.GraphObject.make;

function initDiagram(id: string): go.Diagram {
  const G = gmake(go.Diagram, id, {
    "undoManager.isEnabled": true,
    nodeSelectionAdornmentTemplate: gmake(
      go.Adornment,
      "Auto",
      gmake(go.Shape, "Rectangle", {
        fill: null,
        stroke: "#409EFF",
        strokeWidth: 1,
      }),
      gmake(go.Placeholder)
    ),
  });

  G.model = new go.GraphLinksModel();
  G.linkTemplate = gmake(
    go.Link,
    // 双击修改链接类型
    {
      doubleClick(e, link) {
        if ((link as go.Link).curve === go.Link.Bezier) {
          (link as go.Link).curve = go.Link.Default;
        } else {
          (link as go.Link).curve = go.Link.Bezier;
        }
      },
    },
    new go.Binding("curve", "curve").makeTwoWay(),
    gmake(go.Shape, {
      stroke: "#bbbbcc",
    }),
    // 双击修改节点 label
    gmake(
      go.TextBlock,
      { text: "label", editable: true, font: "15px Georgia" },
      new go.Binding("text", "text").makeTwoWay()
    )
  );
  return G;
}

export default initDiagram;
