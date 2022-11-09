`create-loader` is the underlying whiteboard content rendering module that serves [create](https://github.com/uiuing/creat) and can be used for third-party

<br />

## Use 👌

### npm

```shell
npm install @uiuing/creat-loader
```

### link

```shell
cd creat-loader && npm link
```

```shell
cd your-project && npm link creat-loader
```



Use this way

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


## Design and implementation ☁️

### `creat-loader` Module catalogue structure design 🤔


![creat-loader模块目录结构设计](https://user-images.githubusercontent.com/73827386/198849631-9878c832-5040-4f30-86cd-04dcb7d62a8a.jpg)

- `support` provides rendering etc. **basic rendering/ functions requiring high reuse**, similar to generic templates.

- `components` are responsible for providing the required graphic components and for **graphics**, e.g. text, rectangles.

- `classFile` Its core requirement is to be responsible for **events and operations**, such as mouse event listening, history operations, and rendering operations.

- `common` is responsible for `common calculations and basic data`, such as coordinate calculations, key storage, and data diff calculations.

- The `API` encapsulates everything into a `class` that requires a lot of code, equivalent to a collection of all code that provides an **operation/mount/message publish and subscribe interface** to the outside world

- `index` cooperates with `type` for type specification of all interfaces, similar to Vue's `createApp(app).mount('#app')` and React's `ReactDOM.createPortal(child, container)`.

<br />

### `creat-loader` Module internal implementation design ✨

![creat-loader Module internal implementation design](https://user-images.githubusercontent.com/73827386/198849921-cc0bf94f-b4ec-4890-b1a2-fa7e4770f166.jpg)


<br />

### `creat-loader` Data synchronisation design with modular collaboration ✏️

![creat-loader Data synchronisation design with modular collaboration](https://user-images.githubusercontent.com/73827386/199678312-7ca37278-9be4-46bf-ae23-ab09610f3ac1.jpg)


<br />
<br />


## Use of technology 📚

- Code Specification: ESLint + Prettier
- Code Standards: Airbnb


- Programming Languages: TypeScript
- Rendering method: Canvas
- Subscribe to publish: eventemitter3

- Module Packaging: Rollup
