# 微信公众号推文排版工具 / WeChat Article Formatter

一款基于浏览器的微信公众号文章排版工具，使用 Markdown 编写内容，实时预览排版效果，一键复制富文本到微信公众号编辑器。

A browser-based formatting tool for WeChat Official Account articles. Write in Markdown, preview in real-time, and copy rich text directly to the WeChat editor.

## 功能特性 / Features

### 📝 Markdown 编辑器 / Markdown Editor

- 支持完整 Markdown 语法：标题、粗体、斜体、删除线、列表、引用、代码块、链接、图片、脚注
- 代码块语法高亮（highlight.js，支持 180+ 语言）
- 实时字符计数，超出限制自动提醒
- 拖拽图片直接插入编辑器

- Full Markdown syntax: headings, bold, italic, strikethrough, lists, blockquotes, code blocks, links, images, footnotes
- Code syntax highlighting (highlight.js, 180+ languages)
- Real-time character count with limit warning
- Drag & drop image insertion

### 👀 实时预览 / Live Preview

- 编辑内容 500ms 防抖自动预览
- 所有样式使用内联 CSS，确保微信公众号兼容性
- 支持 HTML 标签直接渲染

- 500ms debounced auto-preview on content change
- All styles use inline CSS for WeChat compatibility
- HTML tags rendered directly in preview

### 🎨 主题系统 / Theme System

- 内置多套预设主题（经典、现代、优雅、科技等）
- 可自定义：字体大小、行高、颜色、标题样式、引用块样式、代码块样式、链接颜色
- 支持首行缩进、段间距、字间距调节
- 切换主题即时生效

- Multiple built-in themes (Classic, Modern, Elegant, Tech, etc.)
- Customizable: font size, line height, colors, heading styles, blockquote styles, code block styles, link colors
- First-line indent, paragraph spacing, letter spacing controls
- Instant theme switching

### 📋 文章模板 / Article Templates

内置 8 套丰富的文章模板，包含图片占位、表格、装饰元素：

8 built-in rich article templates with image placeholders, tables, and decorative elements:

| 模板 / Template | 说明 / Description |
|---|---|
| 🔧 技术分享 | 代码示例 + 对比表格 / Tech sharing with code examples |
| 🚀 产品推广 | 产品展示 + 用户评价 / Product promotion with testimonials |
| 📝 日常随笔 | 文艺风格 + 配图 / Daily essay with literary style |
| 📰 新闻资讯 | 新闻格式 + 背景分析 / News report format |
| 📖 教程指南 | 分步骤教学 + 截图 / Step-by-step tutorial |
| 🎉 活动回顾 | 活动照片 + 数据统计 / Event recap with stats |
| 📋 盘点榜单 | Top 排名 + 对比表 / Ranking list format |
| 🎙️ 人物访谈 | Q&A 对话格式 / Interview Q&A format |

### 🖼️ 素材库 / Asset Library

侧边栏素材面板，四大分类素材一键插入：

Sidebar asset panel with 4 categories, click to insert:

- **图片 / Images**：7 个分类（科技、商务、自然、美食、城市、人物、抽象），42 张预置图片，来源 Lorem Picsum
- **分割线 / Dividers**：8 种装饰性分割线（虚线、波浪线、渐变线、星星、花朵、箭头、菱形、彩虹）
- **Emoji**：7 个分类（表情、手势、动物、食物、交通、物品、符号），84 个常用 Emoji
- **文字装饰块 / Text Blocks**：7 种预设样式块（信息提示、警告、成功、错误、编号步骤、高亮引用、标注框）

- **Images**: 7 categories (Tech, Business, Nature, Food, City, People, Abstract), 42 preset images from Lorem Picsum
- **Dividers**: 8 decorative divider styles (dotted, wave, gradient, star, flower, arrow, diamond, rainbow)
- **Emoji**: 7 categories (Faces, Gestures, Animals, Food, Travel, Objects, Symbols), 84 common emojis
- **Text Blocks**: 7 preset styled blocks (info, warning, success, error, numbered steps, highlighted quote, callout)

素材库支持关键词搜索过滤。

Asset library supports keyword search filtering.

### 📷 图片插入 / Image Insertion

- URL 输入插入
- 拖拽图片文件到编辑器（自动转 Base64）
- 素材库图片一键插入
- 光标位置精准插入

- Insert by URL input
- Drag & drop image files (auto Base64 conversion)
- One-click insert from asset library
- Precise cursor position insertion

### 💾 自动保存 / Auto Save

- 编辑内容、主题选择、自定义样式自动保存到 localStorage
- 刷新页面自动恢复上次编辑状态

- Content, theme, and custom styles auto-saved to localStorage
- Auto-restore on page refresh

### 📋 一键复制 / One-Click Copy

- 复制带内联样式的富文本 HTML
- 直接粘贴到微信公众号编辑器即可使用
- 复制成功/失败 Toast 提示

- Copy rich text HTML with inline styles
- Paste directly into WeChat Official Account editor
- Success/failure toast notification

## 技术栈 / Tech Stack

| 技术 / Technology | 用途 / Purpose |
|---|---|
| React 19 | UI 框架 / UI Framework |
| TypeScript 5.9 | 类型安全 / Type Safety |
| Vite 7 | 构建工具 / Build Tool |
| Zustand 5 | 状态管理 / State Management |
| markdown-it | Markdown 解析 / Markdown Parsing |
| highlight.js | 代码高亮 / Code Highlighting |
| Vitest | 单元测试 / Unit Testing |
| React Testing Library | 组件测试 / Component Testing |

## 快速开始 / Quick Start

### 环境要求 / Prerequisites

- Node.js >= 18
- npm >= 9

### 安装与运行 / Install & Run

```bash
# 克隆仓库 / Clone
git clone https://github.com/z125a/wechat-formatter.git
cd wechat-formatter

# 安装依赖 / Install dependencies
npm install

# 启动开发服务器 / Start dev server
npm run dev
```

浏览器打开 `http://localhost:5173` 即可使用。

Open `http://localhost:5173` in your browser.

### 构建生产版本 / Build for Production

```bash
npm run build
```

构建产物在 `dist/` 目录，可部署到任意静态服务器。

Output in `dist/` directory, deployable to any static server.

### 预览生产构建 / Preview Production Build

```bash
npm run preview
```

### 运行测试 / Run Tests

```bash
# 运行所有测试 / Run all tests
npm test

# 监听模式 / Watch mode
npm run test:watch
```

当前共 223 个测试，覆盖核心引擎、服务层、状态管理和 UI 组件。

223 tests covering core engine, services, state management, and UI components.

### 代码检查 / Lint

```bash
npm run lint
```

## 项目结构 / Project Structure

```
src/
├── components/          # React UI 组件 / React UI Components
│   ├── AssetPanel.tsx   # 素材库面板 / Asset library panel
│   ├── Editor.tsx       # Markdown 编辑器 / Markdown editor
│   ├── ImageDialog.tsx  # 图片插入对话框 / Image insert dialog
│   ├── Layout.tsx       # 页面布局 / Page layout
│   ├── Preview.tsx      # 实时预览 / Live preview
│   ├── StylePanel.tsx   # 样式自定义面板 / Style customization panel
│   ├── TemplateDialog.tsx # 模板选择对话框 / Template selection dialog
│   ├── ThemeSelector.tsx  # 主题选择器 / Theme selector
│   └── Toolbar.tsx      # 工具栏 / Toolbar
├── core/                # 核心引擎（纯函数）/ Core engine (pure functions)
│   ├── asset-data.ts    # 素材静态数据 / Asset static data
│   ├── asset-manager.ts # 素材管理逻辑 / Asset management logic
│   ├── formatter.ts     # 排版引擎 / Formatting engine
│   ├── image-inserter.ts # 图片插入逻辑 / Image insertion logic
│   ├── inline-styler.ts # 内联样式生成 / Inline style generation
│   ├── markdown-parser.ts # Markdown 解析器 / Markdown parser
│   ├── template-manager.ts # 模板管理 / Template management
│   └── theme-manager.ts # 主题管理 / Theme management
├── services/            # 服务层 / Service layer
│   ├── clipboard-service.ts # 剪贴板服务 / Clipboard service
│   └── storage-service.ts   # 本地存储服务 / Local storage service
├── store/               # 状态管理 / State management
│   └── app-store.ts     # Zustand 全局状态 / Zustand global store
├── types/               # TypeScript 类型定义 / Type definitions
│   └── index.ts
├── animations.css       # UI 动画样式 / UI animation styles
├── App.tsx              # 应用入口组件 / App entry component
└── main.tsx             # 应用启动入口 / Application entry point
```

## 使用流程 / Usage Workflow

1. **编写内容**：在左侧编辑器中使用 Markdown 语法编写文章
2. **选择主题**：从顶部主题选择器中选择喜欢的排版风格
3. **自定义样式**：通过样式面板微调字体、颜色、间距等
4. **插入素材**：点击"素材库"按钮，从图片、分割线、Emoji、文字块中选择插入
5. **使用模板**：点击"选择模板"快速套用预设文章结构
6. **预览效果**：右侧实时预览排版效果
7. **复制发布**：点击"复制"按钮，到微信公众号后台粘贴即可

1. **Write content**: Use Markdown syntax in the left editor
2. **Choose theme**: Select a formatting style from the theme selector
3. **Customize styles**: Fine-tune fonts, colors, spacing via the style panel
4. **Insert assets**: Click "素材库" to browse and insert images, dividers, emojis, text blocks
5. **Use templates**: Click "选择模板" to apply preset article structures
6. **Preview**: Real-time preview on the right side
7. **Copy & publish**: Click "复制", then paste into WeChat Official Account editor

## License

MIT
