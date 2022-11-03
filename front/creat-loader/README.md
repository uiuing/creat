<br />

## 使用 👌

首先link `creat-loader`

```shell
cd creat-loader && npm link
```

然后在需要使用的项目中link

```shell
cd your-project && npm link creat-loader
```

这样使用

```typescript
import createLoader from 'creat-loader';

const state = {
  // Content configuration, please see `type` for details.
}

// Same parameters as document.querySelector, and you can also put in HTMLElement objects directly.
const el = '#app'

const app = createLoader(state).mount(el)
```

<br />
<br />


## 设计与实现 ☁️

### `creat-loader` 模块目录结构设计 🤔


![creat-loader模块目录结构设计](https://user-images.githubusercontent.com/73827386/198849631-9878c832-5040-4f30-86cd-04dcb7d62a8a.jpg)

- `support` 提供渲染等**基础渲染/需要高复用的 function**，类似通用模版。

- `components` 负责提供需要的图形组件，对 **图形负责**，例如文字、矩形。

- `classFile` 它的核心需求就是对**事件与操作负责**，例如鼠标事件监听、历史操作、渲染操作。

- `common` 包括负责 `通用计算与基本数据` ， 例如坐标计算、键位存储、数据diff计算。

- `API` 将所有内容封装成一个 `class` ，里面需要不少代码，相当于一个对所有代码进行集合，对外提供**操作/挂载/消息发布与订阅接口**

- `index` 配合 `type` 对所有接口进行类型规范，类似Vue的 `createApp(app).mount('#app')`，React的 `ReactDOM.createPortal(child, container)`。

<br />

### `creat-loader` 模块内部实现设计 ✨

![creat-loader模块内部实现设计](https://user-images.githubusercontent.com/73827386/198849921-cc0bf94f-b4ec-4890-b1a2-fa7e4770f166.jpg)


<br />

### `creat-loader` 模块协作下数据同步设计 ✏️

![creat-loader模块协作下数据同步设计](https://user-images.githubusercontent.com/73827386/198849655-e2e405ab-84c9-4da3-911f-bc224f9ed322.jpg)

