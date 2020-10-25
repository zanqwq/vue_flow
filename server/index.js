/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const app = express();

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const config = require("config-lite")(__dirname);

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const FlowModel = require("./model");
const jsonParser = require("body-parser").json();

try {
  mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false
  });
} catch (e) {
  console.log(e.message);
}

app.use(
  session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: config.session.maxAge
    },
    // 存储 session 到 mongodb
    store: new MongoStore({
      url: config.mongodb
    })
  })
);

// 跨域设置
app.all("*", (req, res, nxt) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  nxt();
});

// 获取所有 flow ()
app.get("/flows", (req, res) => {
  FlowModel.getFlows().then(
    flows => {
      res.json(flows);
    },
    e => {
      res.status(404).send(e.message);
    }
  );
});

// 创建一个 flow
app.post("/flow/create", jsonParser, (req, res) => {
  const flow = req.body;
  FlowModel.createFlow(flow).then(
    flow => {
      res.json(flow._id);
    },
    e => {
      res.status(500).send(e.message);
    }
  );
});

// 更新 (保存) 指定 flow
app.put("/flow/:id", jsonParser, (req, res) => {
  const id = new ObjectId(req.params.id);
  const flow = req.body;
  FlowModel.updateFlowById(id, flow).then(
    () => {
      res.status(200).end();
    },
    e => {
      res.status(500).end(e.message);
    }
  );
});

// 删除指定 flow
app.delete("/flow/:id", (req, res) => {
  // TODO parse req.body
  const id = new ObjectId(req.params.id);
  FlowModel.deleteFlowById(id).then(
    () => {
      res.status(200).end();
    },
    e => {
      res.status(500).end(e.message);
    }
  );
  res.end(`deleting flow ${id} ......`);
});

app.listen(3000, () => {
  console.log(`server listening on port ${config.port}`);
});
