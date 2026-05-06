# 《入戏》Demo 开发计划（6天，M0-M9）

## 1. 计划目标与时间边界

- 开发窗口：2026-04-30 至 2026-05-05（6 天）
- 提交日：2026-05-06（仅收尾与提交，不做大改）
- 开发原则：先 P0 闭环，再补 P1 展示，P2 一律进入 backlog

---

## 2. 全局执行约束（开发期强规则）

## 2.1 主题切换防闪烁约束（新增）

为避免跨主题路由（`santi` 内部）切换出现 `brand -> santi` 闪烁，采用以下规范：

- 主题路由之间切换时，不在 cleanup 里 `setTheme("brand")`
- 只在进入品牌路由时主动 `setTheme("brand")`
  - `/`
  - `/archive`
- 主题路由（`watch/activate/compose/judge/branch`）进入时统一 `setTheme("santi")`

## 2.2 watch 暂停点恢复约束（新增）

- 在 watch 页记录 `pausedAt` 秒数
- 用户在 activate 页点“继续旁观”后返回 watch，必须从 `pausedAt` 恢复
- 推荐实现：`sessionStorage`（主）+ `WatchRuntimeContext`（辅）

建议键名：

- `ruxi:v1:watch:santi:yes-button-1971:pausedAt`

## 2.3 fallback 文案约束（新增）

默认文案从硬技术表述调整为更叙事化：

- 推荐文案：`信号不稳。这次先按预设影响力计算。`
- 备选文案：`AI 引擎暂时未能完成判断,本次使用预设评分。`

---

## 3. 模块总览（M0-M9）


| 模块  | 名称                  | 预估时长   | 依赖    | 产出重点                                       |
| --- | ------------------- | ------ | ----- | ------------------------------------------ |
| M0  | 项目初始化与目录骨架          | 0.5 天  | 无     | Next.js 工程骨架、分层目录、基础规范                     |
| M1  | 数据模型与静态配置           | 0.5 天  | M0    | types、theme 配置、node/identity、video-mapping |
| M2  | Watch 模块            | 0.75 天 | M1    | 看剧页、节点临近、暂停与触发                             |
| M3  | Activate 模块（独立）     | 0.5 天  | M2    | 激活仪式页、接受/继续旁观分流                            |
| M4  | Compose 模块          | 0.5 天  | M3    | 单次发送、字数约束、双终端 UI                           |
| M5  | Judge 引擎与评分页        | 1.0 天  | M1,M4 | `/api/judge`、Claude wrapper、fallback、评分页   |
| M6  | Branch + Archive 模块 | 0.75 天 | M5    | 分支播放、印记持久化、档案页                             |
| M7  | 双层架构与转场收敛           | 0.75 天 | M2-M6 | ThemeProvider、跨页转场、防闪烁治理                   |
| M8  | 首页/详情与身份展示          | 0.5 天  | M1    | 品牌层主页、详情页、3 身份卡灰态策略                        |
| M9  | 整体串联与演示封板           | 0.75 天 | All   | E2E 串联、其他剧 wireframe、录屏路线                  |


总计约 6.0 天。

---

## 4. 日程排布（4/30-5/5）

## Day 1（4/30）

- M0（0.5d）
- M1（0.5d）

目标：把“骨架 + 数据 + 约束”一次性定型，避免后续返工。

## Day 2（5/1）

- M2（0.75d）
- M3（0.25d，启动）

目标：打通 `watch -> activate` 前半链路，确保 `activate` 独立模块成立。

## Day 3（5/2）

- M3（0.25d，收尾）
- M4（0.5d）
- M5（0.25d，启动）

目标：打通 `activate -> compose -> judge(框架)`。

## Day 4（5/3）

- M5（0.75d，完成）
- M6（0.25d，启动）

目标：完成真实 judge + fallback + 评分页可运行。

## Day 5（5/4）

- M6（0.5d，完成）
- M7（0.25d，启动）
- M8（0.5d，完成）

目标：完成 `branch -> archive` 后半链路，并并行完成品牌层首页/详情模块。

## Day 6（5/5）

- M7（0.5d，完成）
- M9（0.5d，串联封板）

目标：全流程稳定、可录屏、可部署、可演示。

## 提交日（5/6）

- 仅做提交动作：部署检查、最终录屏、材料打包（不做结构改动）。

---

## 5. 每模块详细任务（含 P0/P1/P2）

## M0 项目初始化与目录骨架（0.5 天）

**P0**

- 初始化 Next.js 14 + TypeScript strict
- 建立目录边界：
  - `engines/`*
  - `services/`*
  - `components/brand/`*
  - `components/theme/santi/*`
  - `contexts/*`
  - `themes/*`
- 建立基础样式与品牌层变量

**P1**

- 增加开发调试开关（debug drawer 基础壳）

**P2**

- 无

---

## M1 数据模型与静态配置（0.5 天）

**P0**

- 落地 `lib/types.ts`（节点字段强制）
  - `episodeNumber`
  - `triggerTimestamp`
  - `triggerTimecode`
- 落地 `themes/santi` 配置（node/identity/prompt key）
- 落地 `src/data/video-mapping.ts`
  - 键规范：`santi/yes-button-1971/main` 等

**P1**

- 其他剧 theme 占位配置

**P2**

- 多节点动态配置工具（不做）

---

## M2 Watch 模块（0.75 天）

**P0**

- `watch` 路由页面实现
- 节点临近提示与到点自动暂停
- `router.push('/activate/...')`
- `pausedAt` 记录机制（sessionStorage + Context）

**P1**

- 更精细进度提示 UI

**P2**

- 多节点自动调度（不做）

---

## M3 Activate 模块（独立，0.5 天）

**P0**

- 独立路由：`/activate/santi/yes-button-1971`
- 激活动画（glitch + 徽章 + 打字机）
- 两个动作：
  - 接受介入 -> `/compose/...`
  - 继续旁观 -> `router.back()` 返回 watch
- 返回 watch 后进入 `resumed-after-decline` 并继续播放

**P1**

- 动画节奏微调（演示优先）

**P2**

- 音效增强（不做）

---

## M4 Compose 模块（0.5 天）

**P0**

- `compose` 路由页面
- 单次发送限制
- 字数约束（20-300）
- 左右终端写入体验

**P1**

- 非 1379 身份灰态说明（若入口存在）

**P2**

- 富文本或语音输入（不做）

---

## M5 Judge 引擎与评分页（1.0 天）

**P0**

- `lib/claude.ts` 封装
  - 超时
  - 1 次重试
  - JSON 解析与校验
- `/api/judge` 与 `engines/judgment.ts`
- `services/judge-service.ts`（UI 唯一入口）
- fallback 策略：
  - 自动重试 1 次
  - 失败后 fallback=65 / medium
  - UI 透明提示（采用新文案）

**P1**

- 评分页 debug 抽屉展示 `knowledgeSourceCheck`

**P2**

- 复杂重试策略与熔断（不做）

---

## M6 Branch + Archive 模块（0.75 天）

**P0**

- `branch` 路由（依据 branch 播放映射视频）
- `engines/memory.ts` 写入记录
- `InterventionStorage(LocalStorage)` 落地
- `archive` 路由读取与展示
- key 前缀统一：`ruxi:v1:`*

**P1**

- 档案页展示 `knowledgeSourceCheck`（回顾场景可见）

**P2**

- 跨用户共享档案（不做）

---

## M7 双层架构与转场收敛（0.75 天）

**P0**

- ThemeProvider 正式接入
- 执行“品牌路由设 brand、主题路由设 santi”策略
- 修复/规避主题闪烁
- 路由关键转场稳定化

**P1**

- GSAP 仅保留在：
  - `components/transitions/`*
  - `activate` 页面
- 其他页面动画尽量 CSS keyframes

**P2**

- 高级动效库扩展（不做）

---

## M8 首页/详情与身份展示（0.5 天）

**P0**

- 品牌层首页与剧目详情页可用
- 详情页 “进入观看” 进入闭环链路

**P1**

- 三身份卡展示策略：
  - 监听员1379（可点）
  - ETO渗透者（灰态 + 敬请期待）
  - 红岸基地技术员（灰态 + 敬请期待）
- 节点总数展示 8 个（但仅 YES 节点可运行）

**P2**

- 多身份真实分流（不做）

---

## M9 整体串联与演示封板（0.75 天）

**P0**

- 8 路由 E2E 全链路回归
- 异常路径回归（judge fallback、继续旁观返回）
- Vercel 构建部署校验
- 录屏路径排练（3 分钟）

**P1（必须含）**

- 其他剧 wireframe 展示任务（静态，不运行）：
  - 《长相思》《庆余年》《繁花》各 2 张关键页
    - 消息撰写页
    - AI 评分页
- 详情入口显示“敬请期待 + 主题预览”

**P2**

- 其他剧真实路由运行（不做）

---

## 6. 依赖关系图（简版）

说明：`M8` 仅依赖 `M1`，可与 `M2-M7` 主线并行推进，因此前置到 Day 5。

```txt
M0 -> M1
M1 -> M2 -> M3 -> M4 -> M5 -> M6
M2..M6 -> M7
M1 -> M8
M6 + M7 + M8 -> M9
```

---

## 7. 风险与缓冲

## 7.1 高风险点

- activate 动画循环 bug 回归
- judge 接口在弱网下卡住
- 主题切换闪烁影响录屏观感

## 7.2 缓冲策略

- Day 5 预留 0.25d 做稳定性修复
- Day 6 M9 半天专门做演示封板
- 5/6 不动结构代码，仅提交与录屏

---

## 8. 阶段验收门槛

- M3 验收门槛：`watch -> activate -> back to watch` 可恢复播放
- M5 验收门槛：judge 成功/失败均能继续到 branch
- M6 验收门槛：archive 可看到本次印记记录
- M9 验收门槛：全流程可一镜到底录屏

---

## 9. 最终优先级总览（对齐版）

### 🔴 P0（不做没产品）

- 单剧单节点完整闭环
- 双层架构代码
- 真实 Claude judge
- LocalStorage 档案
- Vercel 部署 + 录屏

### 🟡 P1（必做但可降级）

- 其他剧主题层 wireframe（静态展示）⭐
- 多节点/多身份 UI 展示（仅 1379 可点）
- 抽象层接口落地
- Story Grounding（YES 节点基础版）

### ⏸️ P2（放 backlog）

- 多剧真实运行
- UGC 自定义节点
- 多身份真实可点
- 视频实时生成
- 跨用户社交
- 移动端深度优化

