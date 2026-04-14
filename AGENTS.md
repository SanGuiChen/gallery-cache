# AGENTS Guide

这份文档是给任何 code agent 用的仓库操作说明。目标不是讲技术原理，而是让 agent 在最短时间内安全接手这个项目。

## Product Snapshot

- 产品名：Gallery Cache
- 类型：Tauri 桌面应用
- 目标用户：需要整理本地图片、贴标签、按专题归档的人
- 核心能力：本地目录初始化、图片导入、标签管理、瀑布流浏览、桌面打包

需求背景优先参考：

1. [`PRD.md`](./PRD.md)
2. [`SPEC.md`](./SPEC.md)

## Stack

- 前端：React 19 + TypeScript + Vite + Tailwind 4
- 状态管理：Zustand
- 桌面框架：Tauri 2
- 后端：Rust

## Environment Requirements

默认要求：

- Node.js 20+
- npm 10+
- Rust stable
- Cargo

推荐但非强制：

- VS Code
- rust-analyzer
- Tauri VS Code extension

平台说明：

- 开发机优先支持 macOS 和 Windows
- 打包产物以桌面端为主，不维护 Web 独立部署形态
- Windows 目录选择不能假设在用户主目录内

## UI Framework Requirements

前端实现约束：

- 使用 React + TypeScript 函数组件
- 样式以 Tailwind 4 为主
- 全局主题变量统一放在 [`src/App.css`](./src/App.css)
- 业务状态统一放在 [`src/stores/appStore.ts`](./src/stores/appStore.ts)
- 不要引入新的大型 UI 组件库，除非用户明确要求
- 不要把页面改成浏览器后台管理模板风格

视觉方向约束：

- 保持桌面工具气质，优先“工作台 / 素材整理”而不是“营销页”
- 瀑布流视图是主视图，网格视图是补充视图
- 图片应优先展示内容本身，卡片装饰不能压过图片
- 间距、层级、圆角和悬浮态要统一，不要局部风格漂移
- 新增 UI 时，先复用现有色板、圆角、阴影和交互语义

禁止事项：

- 不要引入与当前视觉冲突的亮色主题
- 不要随意改动导入、标签、配置这些主路径交互位置
- 不要为了“好看”牺牲图片可读性或信息密度
- 不要新增未经验证的第三方拖拽库或状态管理库

## First 5 Minutes

接手仓库后按这个顺序执行：

1. 阅读本文件
2. 运行 `npm run doctor`
3. 读需求文档和主要入口文件
4. 再开始改代码

建议优先查看：

- [`src/App.tsx`](./src/App.tsx)
- [`src/components/ImageGrid.tsx`](./src/components/ImageGrid.tsx)
- [`src/components/Sidebar.tsx`](./src/components/Sidebar.tsx)
- [`src/stores/appStore.ts`](./src/stores/appStore.ts)
- [`src-tauri/src/lib.rs`](./src-tauri/src/lib.rs)

## Required Commands

环境自检：

```bash
npm run doctor
```

修改前后都要跑：

```bash
npm run verify
```

需要交付打包产物时再跑：

```bash
npm run package:desktop
```

Windows 新手环境初始化：

- [`scripts/setup-windows.cmd`](./scripts/setup-windows.cmd)
- [`scripts/setup-windows.ps1`](./scripts/setup-windows.ps1)

如果用户几乎没有开发经验，优先让对方先运行 Windows 初始化脚本，再把任务交给 agent。

## GitHub Automation

仓库已经内置 GitHub Actions：

- [`ci.yml`](./.github/workflows/ci.yml)
- [`desktop-bundle.yml`](./.github/workflows/desktop-bundle.yml)

如果用户说“直接在 GitHub 上打包给我”，优先使用 `Desktop Bundle` 工作流，而不是要求用户本地打包。

<<<<<<< HEAD
发布约定：

- 手动触发 `Desktop Bundle`：只产出 Actions artifacts
- 推送 `v*` tag：自动创建或更新 GitHub Release，并上传产物

=======
>>>>>>> 57eddd3 (Initial commit)
## Standard Workflow

1. 先复述用户目标
2. 先定位相关文件
3. 小步修改，不要大面积重写
4. 完成后运行 `npm run verify`
5. 如果用户要试包，再运行 `npm run package:desktop`
6. 最后汇报改动、验证、风险

## Guardrails

- 不要擅自改需求，先看 [`PRD.md`](./PRD.md)
- 不要跳过验证
- 不要只改前端不检查 Rust 命令层
- 不要把图片导入、标签、配置读写看成纯 UI 问题，这些都跨前后端
- 不要把本地文件路径写死成 macOS 形式
- 不要只验证 `npm run build`，桌面应用至少也要看 `cargo test`

## Critical Areas

配置与初始化：

- [`src/stores/appStore.ts`](./src/stores/appStore.ts)
- [`src-tauri/src/lib.rs`](./src-tauri/src/lib.rs)

图片展示与交互：

- [`src/components/ImageGrid.tsx`](./src/components/ImageGrid.tsx)

标签管理：

- [`src/components/Sidebar.tsx`](./src/components/Sidebar.tsx)
- [`src/stores/appStore.ts`](./src/stores/appStore.ts)

桌面配置：

- [`src-tauri/tauri.conf.json`](./src-tauri/tauri.conf.json)
- [`src-tauri/capabilities/default.json`](./src-tauri/capabilities/default.json)

## Known Constraints

- `.dmg` 在当前这台机器上偶尔会卡在 `bundle_dmg.sh`
- macOS `.app` 和 `.zip` 是当前最稳定的交付产物
- Windows 兼容性已经做过代码级收口，但若要 100% 确认，仍需要真实 Windows 机器黑盒验证

<<<<<<< HEAD
GitHub 打包约束：

- CI / Release 工作流不要默认依赖 `.dmg`
- GitHub 上的 macOS 产物以 `.app + zip` 为主

=======
>>>>>>> 57eddd3 (Initial commit)
## Acceptance Checklist

改完后至少确认：

- 初始化目录是否可用
- 拖拽导入是否可用
- 图片粘贴是否可用
- URL / CDN 粘贴是否可用
- 当前选中标签下导入图片是否会自动归类
- 图片是否能正常显示
- 标签增删改排是否正常
- `npm run verify` 是否通过

## Expected Final Report

最终回复至少包含：

- 改动摘要
- 关键文件
- 验证命令和结果
- 未验证风险
