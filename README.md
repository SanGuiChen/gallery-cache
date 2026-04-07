# Gallery Cache

一个基于 Tauri 2 + React 19 + TypeScript 的本地图片整理工具，支持：

- 初始化本地数据目录
- 拖拽、粘贴、URL / CDN 导入图片
- 多级标签管理
- 瀑布流 / 网格视图
- 本地桌面打包

这个仓库已经整理成适合新手和 code agent 协作的 harness 结构。即使接手的人没有开发经验，也可以按下面的顺序推进。

## 给非开发同学

把任务交给任何 code agent 时，直接说这三件事：

1. 先看 [`AGENTS.md`](./AGENTS.md)
2. 先运行 `npm run doctor`
3. 改代码前后都运行 `npm run verify`

推荐你给 agent 的一句话模板：

```text
请先阅读仓库根目录的 AGENTS.md，再运行 npm run doctor。完成修改后必须运行 npm run verify，并告诉我你改了什么、验证了什么、还有什么风险。
```

## 本地开发

环境要求：

- Node.js 20+
- npm 10+
- Rust stable
- Cargo

前端 / UI 约束：

- React + TypeScript
- Tailwind 4
- Zustand
- 不额外引入大型 UI 框架，优先延续现有组件和主题变量
- 视觉方向以“桌面图片工作台”为主，不要改成后台模板或营销站

开始前建议先跑：

```bash
npm run doctor
```

安装依赖：

```bash
npm install
```

启动前端开发环境：

```bash
npm run dev
```

启动 Tauri 桌面开发：

```bash
npm run tauri dev
```

## Harness 命令

环境自检：

```bash
npm run doctor
```

标准验证：

```bash
npm run verify
```

打桌面包：

```bash
npm run package:desktop
```

## Windows 一键配置

如果接手的人是 Windows 用户，而且几乎没有开发经验，可以直接运行：

- [`scripts/setup-windows.cmd`](./scripts/setup-windows.cmd)
- 或 [`scripts/setup-windows.ps1`](./scripts/setup-windows.ps1)

这个脚本会尽量自动完成：

- 检查并安装 Node.js LTS
- 检查并安装 Rust / Cargo
- 执行 `npm install`
- 执行 `npm run doctor`
- 执行 `npm run verify`

说明：

- 自动安装依赖时需要 Windows 自带 `winget`
- 如果系统限制脚本执行，优先双击 `setup-windows.cmd`
- 如果只想检查不想自动安装，可以手动运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1 -SkipInstall
```

`verify` 会执行：

- `npm run build`
- `cargo test`

`package:desktop` 会在此基础上继续执行：

- `npm run tauri build`

## GitHub 自动打包

仓库现在已经带了 GitHub Actions：

- [`ci.yml`](./.github/workflows/ci.yml)
  - 在 `push / pull_request / 手动触发` 时运行
  - 自动执行 `npm run doctor` 和 `npm run verify`

- [`desktop-bundle.yml`](./.github/workflows/desktop-bundle.yml)
  - 在 `workflow_dispatch` 或 `v*` tag push 时运行
  - 自动构建 macOS 和 Windows 桌面包
  - macOS 产出 `.app + zip`，避免 GitHub Runner 上不稳定的 `.dmg` 打包步骤
  - 手动触发时上传构建产物到 GitHub Actions Artifacts
  - 推送 `v*` tag 时自动创建 GitHub Release 并挂载构建产物

使用方式：

手动试跑：

1. 把仓库推到 GitHub
2. 打开 `Actions`
3. 手动运行 `Desktop Bundle`
4. 在运行结果里下载 artifacts

自动发布 Release：

1. 本地创建版本 tag，例如 `v0.1.1`
2. 推送 tag：

```bash
git tag v0.1.1
git push origin v0.1.1
```

3. GitHub Actions 会自动：
   - 构建 macOS 和 Windows 包
   - 创建或更新同名 Release
   - 把产物挂到 Release Assets

## 项目结构

前端：

- [`src/App.tsx`](./src/App.tsx)
- [`src/components`](./src/components)
- [`src/stores/appStore.ts`](./src/stores/appStore.ts)

桌面端 / Rust：

- [`src-tauri/src/lib.rs`](./src-tauri/src/lib.rs)
- [`src-tauri/tauri.conf.json`](./src-tauri/tauri.conf.json)

需求文档：

- [`PRD.md`](./PRD.md)
- [`SPEC.md`](./SPEC.md)

## 跨平台说明

仓库当前重点支持 macOS 和 Windows。

- 本地图片展示依赖 Tauri `assetProtocol`
- Windows 目录不再限制在用户主目录下
- 打包图标同时包含 `icon.icns` 和 `icon.ico`

## 交付要求

任何 agent 在提交结果前，都应该至少汇报：

- 改了哪些文件
- 跑了哪些验证命令
- 是否打包成功
- 还剩哪些未验证风险
