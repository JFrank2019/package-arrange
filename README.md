# Package Arrangement

基于 Vue 3 + TypeScript + Vite + Tailwind CSS 构建的现代化数字组合计算器，采用 Apple Design 风格设计。

## ✨ 特性

- 🧮 **强大的组合计算**：根据输入的数字和目标值，计算最优组合方案
- 🌓 **深色模式支持**：无缝切换明暗主题，兼容系统首选项
- 🎨 **Apple Design 风格**：遵循 Apple 设计语言，提供一致的用户体验
- 📱 **响应式布局**：完美适配各种设备，从移动端到桌面端
- 🚀 **高性能实现**：使用动态规划算法，高效处理复杂计算
- 🧩 **模块化架构**：基于组件化设计，代码结构清晰

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI 组件**: shadcn-vue
- **样式**: Tailwind CSS
- **类型检查**: TypeScript + ESLint
- **测试**: Vitest (计划中)

## 📦 项目结构

```
src/
├── assets/         # 静态资源
├── components/     # 组件
│   ├── ui/         # 基础 UI 组件
│   └── calculator/ # 计算器相关组件
├── composables/    # 可复用的组合式函数
├── lib/            # 工具函数库
├── router/         # 路由配置
├── stores/         # Pinia 状态管理
└── views/          # 页面视图
```

## 🚀 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

### 代码检查

```bash
pnpm lint
```

## 🔄 版本历史

详见 [CHANGELOG.md](./CHANGELOG.md) 文件。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 📝 License

MIT
