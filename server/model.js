/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require("mongoose");

const flowSchema = new mongoose.Schema({
  name: String,
  // json 格式存储 model, 解析时用 go.Model.fromJson 解析
  model: String
});

const Flow = mongoose.model("Flow", flowSchema);

module.exports = {
  getFlows() {
    return Flow.find().exec();
  },

  createFlow(flow) {
    return Flow.create(flow);
  },

  updateFlowById(id, data) {
    return Flow.updateOne({ _id: id }, { $set: data }).exec();
  },

  deleteFlowById(id) {
    return Flow.deleteOne({ _id: id }).exec();
  }
};
