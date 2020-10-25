import * as go from "gojs";
const gmake = go.GraphObject.make;

function initPalette(id: string): go.Palette {
  const P = gmake(go.Palette, id);

  P.nodeTemplate = gmake(
    go.Node,
    "Auto",
    { resizable: true },
    new go.Binding("desiredSize", "desiredSize").makeTwoWay(),
    new go.Binding("location", "location").makeTwoWay(),
    // 设置节点 shape
    gmake(
      go.Shape,
      "RoundedRectangle",
      {
        fill: "white",
        portId: "",
        fromLinkable: true,
        toLinkable: true,
        stroke: "gray",
        strokeWidth: 0.4,
      },
      new go.Binding("fill", "color")
    ),
    // 设置节点文本
    gmake(
      go.TextBlock,
      { font: "20px Georgia", editable: true, margin: 10 },
      new go.Binding("text", "name").makeTwoWay()
    )
  );

  P.model.nodeDataArray = [
    { key: "0", color: "#ffb3b3", name: "开始节点" },
    { key: "1", color: "lightcyan", name: "结束节点" },
    { key: "2", color: "aquamarine", name: "数据接入" },
    { key: "3", color: "turquoise", name: "接口调用" },
    { key: "4", color: "powderblue", name: "数据清理" }
  ];

  return P;
}

export default initPalette;
