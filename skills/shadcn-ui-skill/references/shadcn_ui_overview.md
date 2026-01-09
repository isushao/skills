# shadcn/ui 概述

`shadcn/ui` 是一个精美设计、可访问的组件集合和代码分发平台。它使用 TypeScript、Tailwind CSS 和 Radix UI 原语构建。它支持多种框架，包括 Next.js、Vite、Remix、Astro 等。开源、开放代码、AI 就绪。它还带有一个命令行工具，用于安装和管理组件以及一个发布和分发代码的注册表系统。

## 核心原则

`shadcn/ui` 的设计围绕以下核心原则：

*   **开放代码（Open Code）**：组件代码的顶层是开放的，可供修改。这意味着你可以完全控制组件，并根据需要进行定制和扩展。
*   **组合性（Composition）**：每个组件都使用一个通用的、可组合的接口，使其具有可预测性。这使得团队和 LLM 都能更容易地理解和使用。
*   **分发（Distribution）**：一个扁平文件模式和命令行工具使得分发组件变得容易。你可以使用此模式将组件分发到其他项目，或者让 AI 根据现有模式生成全新的组件。
*   **美观默认值（Beautiful Defaults）**：精心选择的默认样式，让你开箱即用就能获得出色的设计。你的 UI 将拥有简洁、最小化的外观，无需额外工作。
*   **AI 就绪（AI-Ready）**：开放代码使得 LLM 能够读取、理解甚至改进组件。AI 模型可以学习组件的工作方式，并提出改进建议或创建与现有设计集成的全新组件。

## 安装指南

`shadcn/ui` 的安装通常涉及使用其 CLI 工具。以下是针对不同框架的安装文档链接：

*   [Next.js 安装](https://ui.shadcn.com/docs/installation/next)
*   [Vite 安装](https://ui.shadcn.com/docs/installation/vite)
*   [Remix 安装](https://ui.shadcn.com/docs/installation/remix)
*   [Astro 安装](https://ui.shadcn.com/docs/installation/astro)
*   [Laravel 安装](https://ui.shadcn.com/docs/installation/laravel)
*   [Gatsby 安装](https://ui.shadcn.com/docs/installation/gatsby)
*   [React Router 安装](https://ui.shadcn.com/docs/installation/react-router)
*   [TanStack Router 安装](https://ui.shadcn.com/docs/installation/tanstack-router)
*   [TanStack Start 安装](https://ui.shadcn.com/docs/installation/tanstack)
*   [手动安装](https://ui.shadcn.com/docs/installation/manual)

## 组件分类

`shadcn/ui` 提供了广泛的组件，涵盖了构建现代 Web 应用程序的各种需求。以下是一些主要分类及其示例组件：

### 表单与输入 (Form & Input)

*   [Form](https://ui.shadcn.com/docs/components/form): 使用 React Hook Form 和 Zod 验证构建表单。
*   [Field](https://ui.shadcn.com/docs/components/field): 带有标签和错误消息的表单输入字段组件。
*   [Button](https://ui.shadcn.com/docs/components/button): 具有多种变体的按钮组件。
*   [Input](https://ui.shadcn.com/docs/components/input): 文本输入组件。
*   [Checkbox](https://ui.shadcn.com/docs/components/checkbox): 复选框输入组件。
*   [Radio Group](https://ui.shadcn.com/docs/components/radio-group): 单选按钮组组件。
*   [Select](https://ui.shadcn.com/docs/components/select): 选择下拉组件。
*   [Switch](https://ui.shadcn.com/docs/components/switch): 切换开关组件。
*   [Calendar](https://ui.shadcn.com/docs/components/calendar): 日期选择器组件。

### 布局与导航 (Layout & Navigation)

*   [Accordion](https://ui.shadcn.com/docs/components/accordion): 可折叠手风琴组件。
*   [Breadcrumb](https://ui.shadcn.com/docs/components/breadcrumb): 面包屑导航组件。
*   [Navigation Menu](https://ui.shadcn.com/docs/components/navigation-menu): 带有下拉菜单的可访问导航菜单。
*   [Sidebar](https://ui.shadcn.com/docs/components/sidebar): 可折叠侧边栏组件。
*   [Tabs](https://ui.shadcn.com/docs/components/tabs): 选项卡界面组件。
*   [Scroll Area](https://ui.shadcn.com/docs/components/scroll-area): 带有样式滚动条的自定义可滚动区域。

### 覆盖层与对话框 (Overlays & Dialogs)

*   [Dialog](https://ui.shadcn.com/docs/components/dialog): 模态对话框组件。
*   [Alert Dialog](https://ui.shadcn.com/docs/components/alert-dialog): 用于确认提示的警报对话框。
*   [Sheet](https://ui.shadcn.com/docs/components/sheet): 滑出面板组件（抽屉）。
*   [Popover](https://ui.shadcn.com/docs/components/popover): 浮动弹出框组件。
*   [Tooltip](https://ui.shadcn.com/docs/components/tooltip): 用于提供额外上下文的工具提示组件。

### 反馈与状态 (Feedback & Status)

*   [Alert](https://ui.shadcn.com/docs/components/alert): 用于消息和通知的警报组件。
*   [Toast](https://ui.shadcn.com/docs/components/toast): Toast 通知组件。
*   [Progress](https://ui.shadcn.com/docs/components/progress): 进度条组件。
*   [Spinner](https://ui.shadcn.com/docs/components/spinner): 加载指示器组件。
*   [Skeleton](https://ui.shadcn.com/docs/components/skeleton): 骨架加载占位符。

### 显示与媒体 (Display & Media)

*   [Avatar](https://ui.shadcn.com/docs/components/avatar): 用户头像组件。
*   [Card](https://ui.shadcn.com/docs/components/card): 卡片容器组件。
*   [Table](https://ui.shadcn.com/docs/components/table): 用于显示数据的表格组件。
*   [Data Table](https://ui.shadcn.com/docs/components/data-table): 带有排序、过滤和分页的高级数据表格。
*   [Chart](https://ui.shadcn.com/docs/components/chart): 使用 Recharts 的图表组件。

更多组件及其详细用法请参考 [shadcn/ui 官方文档](https://ui.shadcn.com/docs/components)。
