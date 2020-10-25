module.exports = {
  port: 3000,
  session: {
    secret: "vueflow",
    key: "vueflow",
    maxAge: 2592000000
  },
  mongodb: "mongodb://localhost:27017/vueflow"
};
