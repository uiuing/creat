# 将 Creat 做为基架 🛠

**以Creat做基架进行产品开发**

::: info
 我们想带来的当然不止是一个白板应用，而是更期待去做saas (😝)
:::


我们的核心内容抽离为两大模块:
- creat-loader
- quick-server

我们将核心的canvas内容绘制抽离为 `creat-loader` 模块，所有人都可以像前端框架使用vue和react框架一样，在白板内容领域，您可以直接将我们抽离的 `creat-loader` 模块作为第三方SDK来使用

<br />

::: tip 重点
例如您可以这样，直接将我们的 `creat-loader` 模块作为第三方SDK来使用
```bash
npm install @uiuing/creat-loader
```

<br />

那么如果您需要开发一个有白板相关业务的产品，您可以直接使用我们的 `creat-loader` 模块，它将负责白板的绘制，您只需要关注业务逻辑即可
:::

此外，我们将负责同步数据的后台服务也抽离为了 `quick-server` 模块，您可以直接部署您自己的服务器上，根据需求定制您的后台需求。



<br />
