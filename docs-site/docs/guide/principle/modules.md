# 模块拆分 🌟

## 主要负责人

[@JavaTang](https://github.com/JavanTang)

[@uiuing](https://github.com/uiuing)

<br />

## 为什么要拆分模块
我们知道一个庞大的项目，如果不进行模块拆分，那么项目的可维护性就会大大降低，因为项目的代码量会越来越大，而且代码的耦合度也会越来越高，这样就会导致项目的可维护性大大降低，所以我们需要对项目进行模块拆分，将项目拆分成多个模块，这样就可以降低模块间的耦合，提高模块的独立性，提高模块的可维护性。

尽管这耽误了我们不少的开发时间，但这是必要的，因为这样可以让我们的项目更加健壮，更加易于维护，并且拆分业务模块也可以让我们的项目更加清晰，更加易于理解。

除此之外，我们想做的不只是一个白板应用，而是一套第三方SDK，毕竟业务都大相径庭，但在实际中，降本提效可能更为重要。因此，我们将独立技术模块分离出来，以方便复用，产出技术组件，以及方便团队协作。

<br />

## 前端 Module

主要由 [@uiuing](https://github.com/uiuing) 负责

> - 资料：[https://bytedance.feishu.cn/wiki/wikcnOVYexosCS1Rmvb5qCsWT1f](https://bytedance.feishu.cn/wiki/wikcnOVYexosCS1Rmvb5qCsWT1f)
>
> 参考抖音前端 `Semi ui` 框架 `F/A`方案

- `creat-loader`  内容渲染模块（Foundation）
    - 用于实现绘制与操作，对客户端渲染提供api
    - `creat-loader` 包含creat的相关操作API，包括数据导入导出等逻辑，它并不直接与渲染框架联系，给予 `creat-render` API。

::: tip 重点
例如您可以这样，直接将我们的 `creat-loader` 模块作为第三方SDK来使用
```bash
npm install @uiuing/creat-loader
```

<br />

那么如果您需要开发一个有白板相关业务的产品，您可以直接使用我们的 `creat-loader` 模块，它将负责白板的绘制，您只需要关注业务逻辑即可
:::

<br />


- `creat-render` 客户端渲染模块 （Adapter）
    - 基于 `creat-loader` 进行界面渲染
    - `creat-render` 负责调用 `creat-loader` API 构建产品页面

<br />

- `creat-desktop` 桌面端模块
    - 对 `creat-render` 进行迁移，使其能在桌面端渲染

## 后端 Module

主要由 [@JavaTang](https://github.com/JavanTang) 负责

-  `service` 服务端模块
    - 用于实现服务端的业务逻辑，对客户端提供api
    - `service` 包含 `creat` 的相关操作API，包括数据同步房间管理，数据缓存等逻辑。
        - creat-data 数据管理
        - creat-room 房间管理
        - creat-transfer 数据中转

<br />

- `quick-server` 微型服务端模块
    - 基于 `service` 模块，对逻辑进行简化，以边定制化服务端逻辑
    - 对通信模块进行拆分，以便于更好的定制化
    - 拿来即用，快速搭建服务端

<br />
<br />

::: tip
后续只针对 `creat-loader` 和 `service` 模块进行详细介绍，因为相较而言其更为核心
:::
