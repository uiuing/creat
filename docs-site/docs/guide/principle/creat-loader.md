# creat-loader 核心设计 💘

<br />

## 在 `creat` 中的应用

- 用于实现绘制与操作，对客户端渲染提供api
- `creat-loader` 包含 `creat` 的相关操作API，包括数据导入导出等逻辑，它并不直接与渲染框架联系，给予 `creat-render API`。

---

> (图片较大，可能需要加载一会)

## 结构设计


![creat-loader模块目录结构设计](https://user-images.githubusercontent.com/73827386/198849631-9878c832-5040-4f30-86cd-04dcb7d62a8a.jpg)

- `support` 提供渲染等**基础渲染/需要高复用的 function**，类似通用模版。

- `components` 负责提供需要的的 `element` 对 **DOM与渲染负责**，例如文字、图形，当然还有一些 `base` 内容。

- `classFile` 它的核心需求就是对**事件与操作负责**，当然也包括了一些 `element` ，例如鼠标事件监听、历史操作、渲染操作。

- `common` 包括负责 `通用计算与基本数据` ， 例如坐标计算、键位存储、数据 Diff 计算。

- `API` 将所有内容封装成一个 `class` ，里面需要不少代码，相当于一个对所有代码进行集合，对外提供**操作/挂载/消息发布与订阅接口**，类似Vue的 `createApp(app).mount('#app')`，React的 `ReactDOM.createPortal(child, container)`。

<br />

### 内部实现设计

![creat-loader模块内部实现设计](https://user-images.githubusercontent.com/73827386/198849921-cc0bf94f-b4ec-4890-b1a2-fa7e4770f166.jpg)



<br />

## Diff 数据应用案例

![creat-loader模块协作下数据同步设计](https://user-images.githubusercontent.com/73827386/199678161-59a6f2d4-d39d-431e-97bf-62e3e45e84b4.jpg)


<br />

## 函数详细

::: tip
如果你需要将 `creat-loader` 模块做为第三方 SDK，以下内容您可能会需要

通过这样的方式下载 `creat-loader`
```bash
npm install @uiuing/creat-loader
```
:::

<br />

- ✅ zoom 缩放
- ✅ 图形缩放（上面是指这个页面的缩放，这里是单个图形的大小缩放）
- ✅ 样式设置（可以通过这里设置每个使用者不同的颜色）
- ✅ 多选
- ✅ 快捷键
- ✅ 权限：可编辑/只读
- ✅ 网格
- ✅ 重新定位（回到最中间）
- ✅ 删除（或者叫擦除更合适？🤔）
- ✅ 清空 （全部删掉）
- ✅ 撤回和撤回撤回🤣（即redo和undo）
- ✅ 旋转
- ✅ 拖动
- ✅ 自定义导出图片（例如要不要背景，或者是否全部导出之类的）
- ✅ 自动大小（想怎么画怎么画）
- ✅ 可以添加的图形：图片、三角形、圆形、线段、矩形、菱形、箭头、画笔（这里的图形都是参考别的平台，常见的一些图形，受时间限制，难度大的就先搁浅了）
- ✅ 导出/导入 专属数据文件
- ✅ 数据 Diff 计算
- ✅ TypeScript 完整类型支持
- ✅ 数据与视图分离

<br />
