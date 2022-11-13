<div align="center" style="display:flex;flex-direction:column;">
  <a href="https://creat.uiuing.com">
    <img width="540" src="./front/creat-render/src/routes/Home/components/FixedBanner/banner.png" alt="Excalidraw logo: Sketch handrawn like diagrams." />
  </a>
  <h3>为思维发散与协同讨论孕育而生<br>2022年七牛云1024创作节作品</br>
  </h3>
  <p> 欢迎大家提出问题 <a target="_blank" href="https://github.com/uiuing/creat/issues">https://github.com/uiuing/creat/issues</a>.</p>
</div>

## 快速体验

文档：[https://docs-creat.uiuing.com](https://docs-creat.uiuing.com)

DEMO视频演示：[https://docs-creat.uiuing.com/demo](https://docs-creat.uiuing.com/demo)

在线体验: [https://creat.uiuing.com](https://creat.uiuing.com)

查看更新: [https://github.com/uiuing/creat](https://github.com/uiuing/creat)

<br />


## 以Creat做基架进行产品开发

我们想带来的当然不止是一个白板应用，更期待去做saas (😝)

我们的核心内容抽离为：两大模块
- creat-loader
- quick-server

我们将核心的canvas内容绘制抽离为 creat-loader 模块，所有人都可以像前端框架使用vue和react框架一样，在白板内容领域，您可以直接将我们抽离的 creat-loader模块作为第三方SDK来使用

此外，我们将负责同步数据的后台服务也抽离为了 quick-server 模块，您可以直接部署您自己的服务器上，根据需求定制您的后台需求

从用户的角度来说，把我们比作一个协作白板，不如把我们比作一个白板领域的wps，我们可以通过对白板数据的多种管理，我们不仅仅要做的是一个白板远程协作工具，还要做好个人的发散思维记录工具，



<br />

## 定位

### 第二大脑
将我们视为一个协作白板，不如将我们视为第二大脑, 在白板中你可以任意表达自己的想法.

### 场景扩展

我们不受传统的文档编辑器的限制，我们可以在任意位置新建图形，文字，甚至是代码.

### 社区插件

通过将素材库的添加暴露，我们可以将白板按照自己的需求进行扩展,每一个人都可以定制化不同于别人的应用.

### 会议协同

通过在线参加会议的形式，我们可以将白板的内容进行分享，无论你身处何方.

## 主要功能

* 白板管理（进入、删除、重命名、最近打开）
* 创建白板/加入会议/创建会议
* 图形选择菜单
* 图形配置菜单
* 白板状态菜单
* 右键菜单
* 会议状态管理
* 协作鼠标同步（后续加入）
* 素材库（后续加入）
