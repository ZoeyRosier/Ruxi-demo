# 《入戏》原型整合方案（integration-plan）

## 1. 文档目标

本方案用于把 `03_claude-prototypes` 的现有原型代码整合进 Next.js 14 工程，并在不重写产品体验的前提下，完成可维护、可扩展、可演示的 Demo 架构。

核心目标：

- 保留现有原型的视觉与交互爆点（尤其 `activate` 仪式页）
- 落地双层架构（Brand + Theme）
- 落地抽象层接口（VideoSource / UserSession / InterventionStorage）
- 建立 `engines/* + services/* + UI` 清晰分层

---

## 2. 源原型到 Next.js 的拆解映射

### 2.1 现有原型拆分现状

当前不是单一 `full-prototype.tsx`，而是拆分文件：

- `app.jsx`：路由状态控制
- `core.jsx`：通用 hook/转场/header
- `themes.js`：主题配置
- `page-home/detail/watch/compose/archive.jsx`：页面实现

### 2.2 目标工程目录（落地版）

```txt
src/
  app/
    page.tsx
    drama/[dramaId]/page.tsx
    watch/[dramaId]/[nodeId]/page.tsx
    activate/[dramaId]/[nodeId]/page.tsx
    compose/[dramaId]/[nodeId]/page.tsx
    judge/[dramaId]/[nodeId]/page.tsx
    branch/[dramaId]/[nodeId]/page.tsx
    archive/page.tsx
    api/judge/route.ts
  components/
    brand/*
    theme/santi/*
    transitions/*
    shared/*
  contexts/
    ThemeProvider.tsx
    ServiceProvider.tsx
  engines/*
  services/*
  themes/
    santi/{config.ts,nodes.ts,identities.ts,theme.css,knowledge/*}
    long-xiang-si/{theme.css,preview.md}
    qing-yu-nian/{theme.css,preview.md}
    fanhua/{theme.css,preview.md}
  lib/
    abstractions.ts
    implementations/*
    claude.ts
    types.ts
  data/
    video-mapping.ts
```

---

## 3. 分层架构与调用关系（重点）

## 3.1 engines / services / UI 边界

- `engines/*`：纯逻辑能力层
  - 不关心页面、路由、React 生命周期
  - 输入输出为类型化数据
- `services/*`：业务编排层
  - 组合多个 engine
  - 封装给 UI 的友好接口（含状态、fallback 标识）
- `UI pages/components`：
  - 只调用 services
  - 不直接访问 `engines/*`、LLM SDK、LocalStorage

### 3.2 依赖方向（单向）

`UI -> services -> engines -> lib/implementations`

禁止反向依赖，防止页面与 AI/存储强耦合。

---

## 4. 视频抽象层落地与 mapping 规范（重点）

## 4.1 `video-mapping.ts` 设计原则

- 只维护“语义键 -> 资源路径”映射
- 页面与 service 不关心真实文件名
- 后续替换真实素材只改映射文件

## 4.2 键命名规范（强制）

格式：

`<dramaId>/<nodeId>/<slot>`

示例：

- `santi/yes-button-1971/main`
- `santi/yes-button-1971/branch-high`
- `santi/yes-button-1971/branch-medium`
- `santi/yes-button-1971/branch-low`
- `santi/yes-button-1971/placeholder-loop`

## 4.3 `src/data/video-mapping.ts` 建议结构

```ts
export type VideoMappingKey =
  | "santi/yes-button-1971/main"
  | "santi/yes-button-1971/branch-high"
  | "santi/yes-button-1971/branch-medium"
  | "santi/yes-button-1971/branch-low"
  | "santi/yes-button-1971/placeholder-loop";

export interface VideoMappingEntry {
  src: string;
  kind: "main" | "branch" | "placeholder";
  durationHintSec?: number;
  description?: string;
}

export const VIDEO_MAPPING: Record<VideoMappingKey, VideoMappingEntry> = {
  "santi/yes-button-1971/main": {
    src: "/videos/santi/yes-main.mp4",
    kind: "main",
    durationHintSec: 180
  },
  "santi/yes-button-1971/branch-high": {
    src: "/videos/santi/yes-branch-high.mp4",
    kind: "branch"
  },
  "santi/yes-button-1971/branch-medium": {
    src: "/videos/santi/yes-branch-medium.mp4",
    kind: "branch"
  },
  "santi/yes-button-1971/branch-low": {
    src: "/videos/santi/yes-branch-low.mp4",
    kind: "branch"
  },
  "santi/yes-button-1971/placeholder-loop": {
    src: "/videos/placeholders/scanline-loop.mp4",
    kind: "placeholder"
  }
};
```

---

## 5. 双层视觉架构落地

## 5.1 CSS Variables 策略

- 品牌层默认值：`src/styles/brand.css`
- 主题层覆盖：`src/themes/santi/theme.css`
- 主题激活方式：`html[data-theme="santi"]`

### 5.2 CRT 扫描线与胶片颗粒实现（重点）

推荐实现：

- 扫描线：`repeating-linear-gradient` 叠加层
- 颗粒：`noise texture png/svg` 或轻量 data-uri
- opacity 用 CSS Variables 控制，便于按层级与页面微调

示例变量：

```css
:root {
  --texture-scanline-opacity: 0;
  --texture-grain-opacity: 0.06;
}

[data-theme="santi"] {
  --texture-scanline-opacity: 0.05;
  --texture-grain-opacity: 0.10;
}
```

示例叠加层：

```css
.scanline-overlay {
  opacity: var(--texture-scanline-opacity);
}

.grain-overlay {
  opacity: var(--texture-grain-opacity);
}
```

---

## 6. ThemeProvider 设计与防循环规范（重点）

## 6.1 设计原则

- `setTheme` 只能在 `useEffect` 中调用
- 页面级初次设置使用空依赖数组 `[]`
- 不允许在 render 期间调用 `setTheme`（避免循环与闪烁）

## 6.2 调用时机约束（强制）

- `/`、`/archive`：进入后设为 `brand`
- `/drama/santi`：可保持 `brand`（混合页用局部主题元素）
- `/watch|activate|compose|judge|branch/santi/*`：进入后设为 `santi`
- 从主题路由离开时在 cleanup 中恢复 `brand`（或在目标页单独设定）

### 6.3 页面范式（示例）

```ts
useEffect(() => {
  setTheme("santi");
  return () => setTheme("brand");
}, []);
```

---

## 7. 路由转场与主题切换

## 7.1 路由级转场原则

- 路由变化负责“空间切换感”
- 主题切换负责“视觉语义变化”
- 两者一起构成仪式感

## 7.2 关键转场

- `detail -> watch`：淡入黑场后进入主题层
- `watch -> activate`：Glitch 爆发（主仪式）
- `activate -> compose`：短淡入（延续已进入剧内状态）
- `branch -> archive`：主题退场，回归品牌

可选实现：

- 页面级 `TransitionOverlay` 组件 + route push 回调
- 或利用 layout + client transition store 统一管理

---

## 8. GSAP 与 CSS keyframes 分工（重点）

## 8.1 使用原则

- 高频、可重复、简单动画：优先 CSS keyframes
- 需要时间轴编排、多阶段序列、可控回调：用 GSAP

## 8.2 页面级建议

- 纯 CSS（默认）：
  - 首页淡入、打字机、按钮 hover、扫描线移动
  - compose 数据流点阵
- GSAP（限定范围）：
  - `activate` 入场仪式（glitch -> badge -> text -> CTA）
  - 跨路由关键转场（watch->activate、branch->archive）

## 8.3 约束

- GSAP 仅用于 `components/transitions/*` 与 `activate` 页面
- 其他页面禁止滥用 GSAP，减少复杂度与循环风险

---

## 9. 状态管理方案（含补充状态）

## 9.1 Watch 状态机（修订版）

状态：

- `idle`
- `playing`
- `near-node`
- `paused-at-node`
- `navigating-activate`
- `resumed-after-decline`  ← 新增（用户在 activate 选“继续旁观”后返回）

关键逻辑：

1. `playing` 到达 `triggerTimestamp` -> `paused-at-node`
2. push `/activate/...` -> `navigating-activate`
3. 若 `activate` 选择继续旁观：
  - `router.back()` 回 `/watch/...`
  - 从暂停位置恢复播放
  - 状态设为 `resumed-after-decline`

## 9.2 Compose/Judge/Branch 状态

- Compose：`editing -> validating -> submitting -> locked`
- Judge：`loading -> success|fallback -> ready`
- Branch：`playing -> ending -> persist -> done`

---

## 10. AI 判断链路整合

## 10.1 调用链

- UI: `judge-service.submit()`
- Service: 参数校验 + 调用 `judgmentEngine`
- Engine: 组装 prompt + 调用 `/api/judge`
- API: Claude wrapper（超时 + 1 次重试 + fallback）

## 10.2 fallback 与 UI 透明性

- 第 1 次失败自动重试（无感）
- 重试失败返回 fallback：
  - `total = 65`
  - `branch = medium`
- Judge 页显示小字：
  - “由于网络原因,本次使用兜底评分”
- 可选按钮：`重新评分`

OOC 标记显示策略（按对齐）：

- 主流程不展示
- 在 Judge 页右下可折叠 debug 抽屉展示
- Archive 页回顾视图可展示

---

## 11. 原型已知问题修复落地

## 11.1 Activate 循环 bug

处理方案：

- 使用 `useRef(hasStarted)` 防二次启动
- 动画初始化放 `useEffect(() => {}, [])`
- 所有 timeout/timeline 在 cleanup 清理
- 禁止 render 中触发 `setTheme`/`setState`

## 11.2 静态 reasoning 替换

- 移除硬编码文案
- 评分页读取 service 返回的真实 `reasoning`
- fallback 文案单独标识，不混淆为真实判断

## 11.3 多身份策略（Demo 版）

- 展示 3 张身份卡：
  - 监听员1379号（可用）
  - ETO渗透者（灰态 + 敬请期待）
  - 红岸基地技术员（灰态 + 敬请期待）
- 仅 `listener-1379` 进入可运行闭环

---

## 12. 接入其他剧的展示性 wireframe（P1）

范围（非真实运行）：

- 《长相思》《庆余年》《繁花》各 2 张关键页图
  - 消息撰写页
  - AI 评分页
- 代码层仅保留主题配置与预览内容
- 进入详情时显示“敬请期待 + 主题预览”

---

## 13. 集成实施顺序（建议）

1. 建立目录骨架与路由（8 路由）
2. 迁移 ThemeProvider + CSS Variables
3. 落地 `video-mapping.ts` 与 VideoSource 实现
4. 落地 engines/services 分层
5. 接入 `/api/judge` + Claude wrapper + fallback
6. 完成 watch/activate/compose/judge/branch 闭环
7. 完成 archive 持久化与回放
8. 加入 P1 展示能力（灰态身份卡 + 其他剧 wireframe）

---

## 14. 验收清单（integration 视角）

- 原型视觉风格在 Next.js 中可复现（尤其 activate）
- UI 未直接调用 engines/LLM/LocalStorage
- `video-mapping` 改动可无痛替换素材
- ThemeProvider 无循环，setTheme 均在 `useEffect` 触发
- `watch -> activate -> compose` 路由链稳定
- `继续旁观` 能返回 watch 并从暂停点恢复（`resumed-after-decline`）
- judge 失败场景可自动兜底并继续流程

