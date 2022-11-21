# 技术选型 🤔

::: tip 技术说明
按照各 modules 分类，列出技术选型
:::

## creat-loader 

- 代码规范：ESLint + Prettier
- 代码风格：Airbnb

<br />

- 编程语言：TypeScript
- 构建工具：Rollup
- 发布订阅：EventEmitter （3）
- 图形绘制：Canvas（原生）

<br />

[👉 GitHub源码](https://github.com/uiuing/creat/tree/main/front/creat-loader)

<br />

## creat-render

- 代码规范：ESLint + Prettier + StyleLint
- 代码风格：Airbnb + Standard

<br />

- 编程语言：TypeScript
- 渲染框架：React.js
- 本地缓存：IndexedDB | WebSQL | localStorage （根据兼容性来）
- 构建工具：Vite
- 发布订阅：PubSubJS
- css预处理：Sass

<br />

- 状态管理：Recoil
- UI 组件库：Semi Design UI
- Icon 图标库：Font Awesome

<br />

- 全双工通信协议：WebSocket
- 通信框架：Socket io

<p> </p>

- 单向通信协议：HTTP / HTTPS
- 通信框架：Axios

<br />

[👉 GitHub源码](https://github.com/uiuing/creat/tree/main/front/creat-render)

<br />

## creat-desktop

::: info
此模块的渲染内容来自 `creat-render` 模块，此模块主要为打包迁移成桌面应用
:::

- 跨平台：Electron
- 构建工具：Vite

<br />

[👉 GitHub源码](https://github.com/uiuing/creat/tree/main/front/creat-desktop)

<br />

## service

- 代码规范：Black
- 代码风格：Google

<br />

- 编程语言：Python
- 后台框架：FastAPI
- 服务器：Uvicorn
- asyncio 框架：Starlette
- 通信协议：WebSocket

<br />

[👉 GitHub源码](https://github.com/uiuing/creat/tree/main/service)

<br />

## quick-server

- 代码规范：ESLint + Prettier
- 代码风格：Airbnb

<br />

- 编程语言：JavaScript
- 后台框架：Express
- 服务器：Node.js
- 数据缓存：Redis

<br />

- 全双工通信协议：WebSocket
- 单向通信协议：HTTP / HTTPS

<br />

[👉 GitHub源码](https://github.com/uiuing/creat/tree/main/quick-server)
