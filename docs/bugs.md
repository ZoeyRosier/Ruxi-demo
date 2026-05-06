# 8 路由 E2E 回归记录（Day6）

日期：2026-05-06  
环境：`next dev -p 3001`（本地）  
范围：正常链路 + 异常（fallback）链路，从 `/` 到 `/archive`

---

## 1) 正常链路回归

目标链路：
`/` → `/drama/santi` → `/watch/santi/yes-button-1971` → `/activate/santi/yes-button-1971` → `/compose/santi/yes-button-1971` → `/judge/santi/yes-button-1971` → `/branch/santi/yes-button-1971` → `/archive`

结果（按路由可达性）：

- [x] `/` 首页可访问
- [x] `/drama/santi` 可访问
- [x] `/watch/santi/yes-button-1971?mode=node` 可访问
- [x] `/activate/santi/yes-button-1971` 可访问
- [x] `/compose/santi/yes-button-1971` 可输入并提交
- [x] `/judge/santi/yes-button-1971` 可完成评分页渲染并出现“查看结局”
- [x] `/branch/santi/yes-button-1971` 可访问并可继续
- [x] `/archive` 可访问并显示“我的印记”

补充：
- `compose -> judge` 通过“发送 / TRANSMIT”按钮跳转验证通过
- `judge -> branch` 通过“查看结局”按钮跳转验证通过
- `branch -> archive` 通过“查看我的印记”按钮跳转验证通过

---

## 2) 异常链路（fallback）回归

目标：验证 fallback 情况下仍可从 `judge` 继续到 `branch`、`archive`。

结果：

- [x] 在 `/judge/santi/yes-button-1971` **自然出现** fallback 提示：`信号不稳。这次先按预设影响力计算。`
- [x] 无需 sessionStorage 注入，直接点击“查看结局”可进入 `/branch/santi/yes-button-1971`
- [x] 从 `/branch/santi/yes-button-1971` 点击“查看我的印记”可进入 `/archive`

结论：
- fallback 链路闭环通过（`judge(fallback)` → `branch` → `archive`）

---

## 3) 回归发现 / 待处理

### [P1] Judge 在本次环境下稳定走 fallback，未覆盖到“非 fallback”评分链路

- 现象：`/judge` 页面持续显示“信号不稳。这次先按预设影响力计算。”
- 影响：本次 E2E 无法覆盖“模型正常返回评分（isFallback=false）”分支
- 建议排查：
  1. 检查 `.env.local` 中模型调用所需配置
  2. 检查 `/api/judge` 的 `callClaude` 调用链路可用性
  3. 在 debug 抽屉中补充 fallback reason 的更直观展示，便于验收时快速定位

---

## 4) 验收结论（本轮）

- 正常链路：路由可达性通过，主闭环可跑通到 `/archive`
- 异常链路：fallback 自然触发并可继续到 `/archive`，通过
- 残余风险：未覆盖“非 fallback”在线模型评分路径

