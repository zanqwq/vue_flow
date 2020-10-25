# Vue-Flow

## 项目简介

一个以 `Vue`、`Element-UI` 作为前端框架, `gojs` 作为绘图框架, 以及 `express.js` 和 `MongoDB` 作为后端框架的在线流程绘图工具



## 需求分析

* 新建 | 修改 | 保存 | 删除流图
* 添加 | 编辑 | 删除流图中的节点
* 添加 | 编辑 | 删除节点间的连线





## 前端

### 技术栈

* Vue | Vuex
* element-ui
* gojs
* axios







## 后端

### 技术栈

* Node.js
* Express.js
* Typescript
* MongoDB | Mongoose



### 路由设计

* 获取所有流图 `GET /flows`
* 创建流图 `POST /flow/create`
* 更新指定流图 `PUT /flows/:id`
* 删除指定流图 `DELETE flow/:id`



## 安装

```
npm install

# 启动前端服务器
npm run serve

# 启动后端服务器
node ./server/index.js
```









## 参考资料

### gojs

https://gojs.net/latest/learn/index.html



https://gojs.net/latest/intro/dataBinding.html



https://gojs.net/latest/intro/tools.html



https://gojs.net/latest/intro/palette.html





### 参考网站

http://xiaoka2017.gitee.io/easy-flow/





