# 项目功能描述文档

## 核心功能

### 1. 数字组合计算器

项目的核心功能是一个数字组合计算器，允许用户通过配置数字参数来计算达到目标值的最佳组合方案。主要特点包括：

- **数字配置**：用户可设置多个数字及其最大使用次数
- **目标值设定**：输入需要达到的目标数值
- **优先数字设置**：可指定优先使用的数字
- **智能计算**：系统自动计算最优数字组合方案
- **结果展示**：清晰展示计算结果、数字使用次数和优先级统计

实现文件：<mcfile name="Calculator.vue" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/components/Calculator.vue"></mcfile>、<mcfile name="calculator.ts" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/stores/calculator.ts"></mcfile>

### 2. 输入验证系统

内置实时输入验证机制，确保计算参数的有效性：

- 目标值不能为负数
- 数字配置必须大于1
- 数字最大使用次数必须大于0
- 检测重复数字配置
- 提供清晰的错误提示信息

## 界面与用户体验

### 1. 响应式设计

计算器界面完全响应式，适配不同屏幕尺寸：

- 桌面端优化布局
- 平板和移动设备自适应调整
- 按钮和输入区域大小随屏幕变化

### 2. 暗黑模式支持

实现了完整的明暗主题切换功能：

- 自动检测系统主题偏好
- 手动切换明暗模式
- 主题偏好本地存储
- 深色模式下的视觉优化效果

实现文件：<mcfile name="useDarkMode.ts" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/composables/useDarkMode.ts"></mcfile>

## 技术架构

### 1. 路由系统

使用Vue Router实现页面导航：

- 首页路由（/）：加载计算器组件
- 关于页路由（/about）：显示项目介绍

实现文件：<mcfile name="index.ts" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/router/index.ts"></mcfile>

### 2. 状态管理

采用Pinia进行状态管理：

- 计算器状态管理（calculator store）
- 简单计数器示例（counter store）

实现文件：<mcfile name="calculator.ts" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/stores/calculator.ts"></mcfile>、<mcfile name="counter.ts" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/stores/counter.ts"></mcfile>

## 页面组件

### 1. 首页（HomeView）

应用入口页面，当前加载欢迎组件。

实现文件：<mcfile name="HomeView.vue" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/views/HomeView.vue"></mcfile>

### 2. 关于页（AboutView）

项目介绍页面，提供应用相关信息。

实现文件：<mcfile name="AboutView.vue" path="/Users/frankyang/Desktop/workspace/package-arrangement/src/views/AboutView.vue"></mcfile>
