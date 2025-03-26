# Changelog

本文档记录 Package Arrangement 项目的所有显著变更。

## [0.1.0] - 2023-08-25

### 组件集成与优化

- **引入 shadcn-vue 组件库**
  - 集成了 Button、Card、Input 等基础 UI 组件
  - 保留了 Apple Design 风格的视觉设计
  - 优化了组件的文档注释，添加了 JSDoc 规范的注释

### 代码质量与规范

- **类型安全优化**
  - 将 `any` 类型替换为更具体的 `unknown` 或精确类型
  - 优化了 `valueUpdater` 函数的类型签名，提高类型安全性
  - 修复了 `env.d.ts` 中的空对象类型问题，使用 `Record<string, unknown>` 替代

- **组件命名规范**
  - 为所有组件添加了 `defineOptions({ name: 'AppXxx' })` 配置
  - 使用多词组件名称，符合 Vue 风格指南
  - 统一了组件的命名方式，提高代码可维护性

- **移除冗余代码**
  - 清理了未使用的导入和变量
  - 移除了 `useDarkMode.ts` 中的无用主题变量
  - 优化了组件的引用关系，减少了不必要的依赖

### 性能优化

- **算法优化**
  - 改进了 `calculator.ts` 中的数组构造方式，使用 `Array.from` 代替 `new Array()`
  - 优化了 `debounce` 函数实现，提高了性能和类型安全性

### 样式与用户体验

- **Apple 风格增强**
  - 添加了 `appleTransition` 和 `appleShadow` 工具函数
  - 优化了夜间模式的过渡效果
  - 规范了 CSS 类命名，使用 Tailwind 约定

### 工具链与配置

- **修复 Tailwind 配置**
  - 解决了 `tailwind.config.js` 中的重复插件问题
  - 优化了颜色变量的定义格式，使用引号包裹数字键
  - 标准化了配置文件的格式，提高可读性

### 开发体验

- **代码格式化与检查**
  - 完善了 ESLint 配置，修复了所有 lint 错误
  - 使用 JSDoc 注释增强代码文档
  - 保持了组件命名与文件路径的一致性

## 后续计划

- [ ] 添加更多 shadcn-vue 组件，如 Select、Dialog、Toast 等
- [ ] 完善组件测试，提高代码覆盖率
- [ ] 进一步优化移动端响应式布局
- [ ] 优化构建流程，提高编译速度和减小打包体积
- [ ] 添加国际化支持，提供多语言界面
- [ ] 实现主题定制功能，允许用户自定义主题颜色
