# 《入戏》Demo 任务清单（Day 1 - Day 6）

> 工期：2026-04-30 至 2026-05-05（开发），2026-05-06（提交）  
> 优先级标记：`[P0]` 必做 / `[P1]` 必做但可降级 / `[P2]` backlog  
> 时长颗粒度：15min / 30min / 1h / 2h

---

## Day 1（4/30）M0 + M1

- **[P0][1h] 初始化 Next.js 14 + TS strict 工程**
  - 产出物：`package.json`、`tsconfig.json`、`next.config.js`
  - 验收标准：`npm run dev` 正常启动，TypeScript 严格模式开启
- **[P0][1h] 建立分层目录骨架**
  - 产出物：`src/engines/`、`src/services/`、`src/components/brand/`、`src/components/theme/santi/`、`src/contexts/`、`src/themes/`
  - 验收标准：目录结构与 `integration-plan.md` 一致
- **[P0][30min] 建立双层样式基础变量**
  - 产出物：`src/styles/brand.css`、`src/themes/santi/theme.css`
  - 验收标准：切换 `data-theme` 后颜色变量有明显差异
- **[P0][1h] 建立核心数据类型**
  - 产出物：`src/lib/types.ts`
  - 验收标准：存在 `InterventionNode.episodeNumber/triggerTimestamp/triggerTimecode` 强制字段
- **[P0][1h] 建立 santi 节点/身份/主题配置**
  - 产出物：`src/themes/santi/nodes.ts`、`src/themes/santi/identities.ts`、`src/themes/santi/config.ts`
  - 验收标准：可读取 `yes-button-1971` 节点与 3 张身份卡配置
- **[P0][30min] 建立视频映射表**
  - 产出物：`src/data/video-mapping.ts`
  - 验收标准：包含键名 `santi/yes-button-1971/main` 及 branch 映射
- **[P1][30min] 建立其他剧主题占位配置**
  - 产出物：`src/themes/long-xiang-si/theme.css`、`src/themes/qing-yu-nian/theme.css`、`src/themes/fanhua/theme.css`
  - 验收标准：3 个目录可被主题注册中心读取
- **[P1][1h] 建立 santi knowledge 基础事实集**
  - 产出物：`src/themes/santi/knowledge/characters/ye-wenjie.ts`、`src/themes/santi/knowledge/characters/listener-1379.ts`、`src/themes/santi/knowledge/aired-events-before-yes.ts`
  - 验收标准：仅包含 YES 节点前事实；judge prompt 在 Day 4 可直接 import；每条事实标注来源类型（原著 / 剧版 / 通用常识）
- **[P1][1h] 用 Claude Design 生成 3 部剧 wireframe**
  - 产出物：`02_ui-screenshots/long-xiang-si-compose.png`、`02_ui-screenshots/long-xiang-si-judge.png`、`02_ui-screenshots/qing-yu-nian-compose.png`、`02_ui-screenshots/qing-yu-nian-judge.png`、`02_ui-screenshots/fanhua-compose.png`、`02_ui-screenshots/fanhua-judge.png`
  - 验收标准：每剧 2 张关键页（compose + judge），视觉风格符合各主题层 DNA

---

## Day 2（5/1）M2 + M3(启动)

- **[P0][1h] 创建 watch 路由与页面骨架**
  - 产出物：`src/app/watch/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：访问 watch 路由可渲染主题层页面
- **[P0][1h] 实现节点临近提示与触发条件**
  - 产出物：`src/services/watch-service.ts`
  - 验收标准：到达 `triggerTimestamp` 时触发暂停逻辑
- **[P0][30min] 实现 pausedAt 存储（sessionStorage）**
  - 产出物：`src/lib/watch-runtime.ts`
  - 验收标准：写入键 `ruxi:v1:watch:santi:yes-button-1971:pausedAt`
- **[P0][30min] 实现 watch -> activate 路由跳转**
  - 产出物：`src/app/watch/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：触发点出现后可跳转到 `/activate/santi/yes-button-1971`
- **[P0][30min] 实现 VideoSource 抽象接口与本地实现**
  - 产出物：`src/lib/abstractions.ts`、`src/lib/implementations/local-video-source.ts`
  - 验收标准：watch 页通过 VideoSource 接口控制视频，不直接操作 video 元素
- **[P0][1h] 创建 activate 独立路由页面（首版）**
  - 产出物：`src/app/activate/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：页面可渲染身份徽章与 2 个决策按钮
- **[P1][30min] watch 进度条与节点 marker 视觉完善**
  - 产出物：`src/components/theme/santi/WatchTimeline.tsx`
  - 验收标准：至少 1 个可见节点标记，临近状态可辨识

---

## Day 3（5/2）M3(收尾) + M4 + M5(启动)

- **[P0][1h] 完成 activate 入场动画与防循环护栏**
  - 产出物：`src/components/transitions/ActivateTransition.tsx`
  - 验收标准：动画只触发一次，无 useEffect 循环
- **[P0][30min] 实现“继续旁观”返回并恢复播放**
  - 产出物：`src/app/activate/[dramaId]/[nodeId]/page.tsx`、`src/app/watch/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：`router.back()` 回 watch 后从 pausedAt 继续，状态为 `resumed-after-decline`
- **[P0][1h] 创建 compose 路由页面**
  - 产出物：`src/app/compose/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：可输入文本并显示左右终端布局
- **[P0][30min] 实现字数校验与单次发送锁定**
  - 产出物：`src/services/compose-service.ts`
  - 验收标准：低于20字不能提交，提交后按钮禁用
- **[P0][1h] 创建 judge 路由页面骨架**
  - 产出物：`src/app/judge/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：从 compose 可跳转到 judge 页面
- **[P1][30min] 添加评分页 debug 抽屉壳**
  - 产出物：`src/components/shared/DebugDrawer.tsx`
  - 验收标准：可展开/收起，预留 `knowledgeSourceCheck` 显示位

---

## Day 4（5/3）M5(完成) + M6(启动)

- **[P0][1h] 实现 Claude 调用封装（超时+重试）**
  - 产出物：`src/lib/claude.ts`
  - 验收标准：调用失败会自动重试 1 次并有日志
- **[P0][1h] 实现 `/api/judge` 接口**
  - 产出物：`src/app/api/judge/route.ts`
  - 验收标准：POST 后可返回结构化评分 JSON
- **[P0][1h] 实现 judgment engine + judge service**
  - 产出物：`src/engines/judgment.ts`、`src/services/judge-service.ts`
  - 验收标准：UI 通过 service 获取评分；UI 不直连 LLM
- **[P0][30min] 实现 fallback 策略与透明提示文案**
  - 产出物：`src/services/judge-service.ts`、`src/app/judge/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：失败时回退到 65/medium，并显示“信号不稳。这次先按预设影响力计算。”
- **[P0][1h] 创建 branch 路由页面骨架**
  - 产出物：`src/app/branch/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：judge 页面可跳转至 branch 并读取 branch 参数
- **[P1][30min] judge 页面增加“重新评分”按钮（可选）**
  - 产出物：`src/app/judge/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：点击后重新请求评分接口

---

## Day 5（5/4）M6(完成) + M7(启动) + M8(完成)

- **[P0][1h] 实现 memory engine 与记录写入**
  - 产出物：`src/engines/memory.ts`
  - 验收标准：branch 结束后自动生成并写入 intervention record
- **[P0][1h] 实现 InterventionStorage(LocalStorage)**
  - 产出物：`src/lib/implementations/local-storage-intervention.ts`
  - 验收标准：key 前缀统一 `ruxi:v1:*`，可 `save/list/upsert`
- **[P0][1h] 创建 archive 路由页面并读取档案**
  - 产出物：`src/app/archive/page.tsx`
  - 验收标准：能看到本次介入记录（含分数、分支、文案）
- **[P0][1h] 接入 ThemeProvider 与主题切换策略**
  - 产出物：`src/contexts/ThemeProvider.tsx`、`src/app/layout.tsx`
  - 验收标准：主题路由间切换无 brand 闪烁；品牌页进入时恢复 brand
- **[P0][20min] 实现 UserSession 抽象接口与匿名实现**
  - 产出物：`src/lib/implementations/anonymous-session.ts`
  - 验收标准：`getUserId()` 返回 sessionStorage 中匿名 UUID，刷新后保持一致
- **[P0][1h] 完成首页与剧目详情页**
  - 产出物：`src/app/page.tsx`、`src/app/drama/[dramaId]/page.tsx`
  - 验收标准：首页可进入详情，详情可进入 watch
- **[P1][30min] 完成三身份卡灰态展示**
  - 产出物：`src/components/brand/IdentityCards.tsx`
  - 验收标准：仅 1379 可点击，其余 2 张显示“敬请期待”
- **[P1][30min] 档案页显示 `knowledgeSourceCheck`**
  - 产出物：`src/app/archive/page.tsx`
  - 验收标准：回顾视图可见 verified/has-ooc-risk
- **[P0][30min] 录屏彩排（提前）**
  - 产出物：`deliverables/raw/` 下至少 1 个彩排样片
  - 验收标准：可完整走通一次 8 路由流程，识别主要卡点

---

## Day 6（5/5）M7(收尾) + M9(封板)

- **[P0][1h] 路由关键转场稳定化**
  - 产出物：`src/components/transitions/RouteTransition.tsx`
  - 验收标准：`detail->watch`、`watch->activate`、`branch->archive` 过渡连贯
- **[P0][1h] GSAP 范围收敛与检查**
  - 产出物：`src/components/transitions/*`、`src/app/activate/[dramaId]/[nodeId]/page.tsx`
  - 验收标准：GSAP 仅存在于 transitions 与 activate；其他动画为 CSS keyframes
- **[P0][1h] 8 路由 E2E 回归（含异常链路）**
  - 产出物：`docs/bugs.md`（回归记录）
  - 验收标准：正常链路与 fallback 链路都能从 `/` 跑到 `/archive`
- **[P0][1h] Vercel 部署与构建校验**
  - 产出物：Vercel 预览链接（记录在 `docs/PRD-engineering.md` 或提交说明）
  - 验收标准：线上可访问，核心流程无阻塞错误
- **[P1][15min] 整理 wireframe 到 `src/themes/*/preview.md`**
  - 产出物：`src/themes/long-xiang-si/preview.md`、`src/themes/qing-yu-nian/preview.md`、`src/themes/fanhua/preview.md`
  - 验收标准：每个 preview 文档均关联对应 2 张截图并说明主题层视觉要点
- **[P0][2h] 录屏彩排 + 正式录制**
  - 产出物：多个候选录屏 raw 文件（建议 >= 3 个）
  - 验收标准：至少 3 个完整版本可供选择，均覆盖核心闭环

---

## 提交日（5/6）

- **[P0][1h] 最终录屏剪辑 + 导出**
  - 产出物：`deliverables/demo.mp4`（3 分钟以内，16:9，无水印）
  - 验收标准：符合比赛提交规范
- **[P0][30min] 最终材料核对**
  - 产出物：文档与链接清单（PRD、计划、任务、演示链接）
  - 验收标准：比赛提交包一次性齐全，无缺漏项

---

## P2 Backlog（本期不做）

- **[P2][backlog] 多剧真实运行（非静态预览）**
- **[P2][backlog] 多身份真实可点击并分流**
- **[P2][backlog] 视频实时生成**
- **[P2][backlog] 跨用户社交能力**
- **[P2][backlog] 移动端深度优化**