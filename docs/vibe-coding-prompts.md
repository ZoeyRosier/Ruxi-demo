# 《入戏》Vibe Coding 实践 · Prompt 合集

> 本文档收录《入戏》产品Demo开发全流程的可复用Prompt模板。
>
> **使用方式**:开发到对应阶段时,直接复制相应Prompt,粘贴到Claude/Cursor中使用。
>
> **配套文档**:
>
> - `入戏-PRD-v1.0.md`(比赛PRD,提交评委用)
> - `入戏-产品策划完整文档.md`(产品决策路径与定义记录)
>
> 文档版本:v1.0 · 创建日期:2026-04-25

---

## 目录

- [总体工作流概览](#总体工作流概览)
- [当前位置盘点](#当前位置盘点)
- [Step 1:收敛阶段](#step-1收敛阶段)
- [Step 2:UI设计阶段](#step-2ui设计阶段)
- [Step 3:开发前准备](#step-3开发前准备)
- [Step 4:正式开发](#step-4正式开发)
- [Step 5:收尾及发布](#step-5收尾及发布)
- [附录A:11天工期分配](#附录a11天工期分配)
- [附录B:Demo MVP取舍清单](#附录bdemo-mvp取舍清单)
- [附录C:文件目录结构建议](#附录c文件目录结构建议)
- [附录D:常见踩坑清单](#附录d常见踩坑清单)

---

## 总体工作流概览

```
Step 1 收敛阶段
  ├─ 1.1 找UI视觉风格参考
  ├─ 1.2 生成 Figma版PRD(视觉指令)
  └─ 1.3 生成 Cursor版PRD(逻辑指令)
        ↓
Step 2 UI设计阶段
  ├─ 2.1 Figma搭基础UI(8个核心页面)
  └─ 2.2 Cursor生成正式工程PRD
        ↓
Step 3 开发前准备
  ├─ 3.1 生成 开发计划 + 任务清单
  ├─ 3.2 定义 输出规范
  └─ 3.3 确认 测试方法
        ↓
Step 4 正式开发
  ├─ M0 项目初始化
  ├─ M1 数据模型与mock数据
  ├─ M2 剧集观看页
  ├─ M3 消息撰写页
  ├─ M4 AI判断引擎 ⭐
  ├─ M5 分支视频播放页 ⭐
  ├─ M6 印记档案页
  └─ M7 整体串联+录屏
        ↓
Step 5 收尾及发布
  ├─ 5.1 待办收敛 + 整体功能验收
  ├─ 5.2 UI细节统一
  └─ 5.3 部署上线 + 录屏
```

---

## 当前位置盘点

### 已完成

- ✅ 产品需求脑暴(多轮对话已完成)
- ✅ `入戏-PRD-v1.0.md`(比赛PRD,偏故事/概念)
- ✅ `入戏-产品策划完整文档.md`(决策路径记录)

### 待开始

- ❌ UI视觉风格参考收集
- ❌ Figma版PRD与Cursor版PRD的拆分
- ❌ Figma基础UI设计
- ❌ Cursor开发

### 关键认知

> **比赛PRD ≠ 工程PRD**
>
> 现有的`入戏-PRD-v1.0.md`是**面向评委**的(讲故事/概念/创新),不能直接喂Cursor。
> 接下来要在保留比赛PRD的基础上,**额外生成两份开发用的PRD**。

---

## Step 1:收敛阶段

### 1.1 找UI视觉风格参考

**操作**:

1. 打开 **小红书 / Dribbble / Pinterest**
2. 搜索关键词:
  - `沉浸式体验 UI`
  - `叙事互动 H5`
  - `游戏 UI 中国风` / `复古 CRT 终端 UI`
  - `电影感 网页`
  - `三体 视觉` / `科幻 终端 界面`
3. 收集 **5-8张参考图**,放进项目目录:`01_visual-references/`

**《入戏》风格建议**:

- **主调**:1971年红岸基地的复古CRT质感(深绿/琥珀色文字、扫描线、暗色背景)
- **现代感**:加入赛博朋克的霓虹光晕(蓝/紫渐变)
- **氛围词**:神秘 / 史诗 / 紧迫感 / 历史感

---

### 1.2 生成 Figma版PRD(视觉指令)

**用途**:在Figma里搭UI时使用。
**接收方**:Claude(用于生成内容)或直接给Figma AI

**Prompt模板**:

```
请基于已完成的《入戏》产品PRD-v1.0,生成一份「Figma版PRD」,
专门用于在Figma中设计UI界面。

【输出要求】
1. 这份PRD只关注视觉与交互层面,不涉及技术实现
2. 输出结构:
   - 视觉风格指南(配色/字体/质感/氛围词)
   - 核心页面清单(每个页面的目的+关键元素+交互动效描述)
   - 关键交互流程(用文字描述用户从一个页面到另一个页面的跳转)
   - UI组件清单(按钮/输入框/卡片/弹窗等的设计要点)
3. 每个页面用"用户站在这个页面看到什么、能做什么"的视角描述

【参考视觉风格】
[把你找的5-8张图发给我,或描述风格关键词]
- 主调:1971年红岸基地的复古CRT质感
- 关键词:深绿/琥珀色文字、扫描线、暗色背景
- 现代点缀:赛博朋克霓虹光晕(蓝/紫渐变)
- 氛围:神秘+史诗+紧迫感

【核心页面预估清单】
1. 首页(剧目选择)
2. 剧目详情页(《三体》介入身份选择)
3. 剧集观看页(主屏)
4. 介入UI唤起瞬间(从原片→游戏UI的过渡)
5. 消息撰写页(三体监听员1379的发送界面)
6. AI评分可视化页
7. 分支视频播放页
8. 印记档案页

请按上述结构输出Figma版PRD。
```

---

### 1.3 生成 Cursor版PRD(逻辑指令)

**用途**:在Cursor里开发时使用。
**接收方**:Claude生成 → 喂给Cursor

**Prompt模板**:

```
请基于已完成的《入戏》产品PRD-v1.0,生成一份「Cursor版PRD」,
专门用于喂给Cursor进行开发。

【输出要求】
1. 这份PRD只关注技术实现与逻辑结构,不涉及视觉风格
2. 输出结构:
   - 技术栈选型(前端/后端/AI能力/部署)
   - 数据模型(用户/剧目/介入节点/印记记录的schema)
   - 核心业务流程(用伪代码或时序图描述关键流程)
   - API接口设计(前后端通信契约)
   - AI能力调用方式(LLM prompt模板/视频生成API/TTS API)
   - 文件结构与模块划分

【11天工期约束】
- Demo级别,不需要完整产品功能
- 视频生成用预生成版本,不做实时
- 只实现《三体》监听员1379这一个核心节点的完整闭环
- 部署到Vercel,可分享H5链接

【已知技术栈倾向】
- 前端:React 18 + TypeScript + Tailwind + GSAP
- AI:Claude API(理解+判断)+ 可灵/即梦(预生成视频)+ Minimax TTS
- 后端:Next.js API Routes 或 简化为前端直连(Demo阶段)
- 数据存储:JSON文件Mock + LocalStorage(无需数据库)
- 部署:Vercel

请按上述结构输出Cursor版PRD。
```

---

## Step 2:UI设计阶段

### 2.1 Figma操作指南

**重要原则**:**不追求UI完美**,只为后续Cursor理解逻辑+风格。基础元素具备即可。

**操作流程**:

1. Figma新建文件:`入戏-UI-Demo.fig`
2. 创建画板(Frame):iPhone 14 Pro 或 Web 1440×900(根据Demo形态决定)
3. 把Figma版PRD粘贴到Figma的左侧文档区
4. 用Figma AI(或人工)按页面清单拉出 **8个核心页面**,每个页面 30-60分钟
5. 把1.1找到的视觉参考图放进Figma做"风格锚点"

**最低标准**:

- ✅ 每个页面布局清晰(标题/主区域/操作按钮位置正确)
- ✅ 配色风格统一
- ✅ 关键文案到位(不是Lorem Ipsum)
- ❌ 不需要:精细图标、完美阴影、动效demo

**导出**:8张UI图截图导出为PNG → 放进 `02_ui-screenshots/`

---

### 2.2 在Cursor中生成正式工程PRD

**前置准备**:

1. 打开Cursor,新建项目文件夹 `入戏-demo/`
2. 把 `Cursor版PRD` + `8张UI截图` 准备好
3. 在Cursor中开新对话(选择Claude Sonnet/Opus模型)

**Prompt模板**:

```
我要做一个名为《入戏》的Demo产品。
这是一个让用户作为《三体》监听员1379号介入剧情关键节点的AI叙事H5。

我会给你:
1. Cursor版PRD(粘贴在下方)
2. 8张UI设计截图(已上传)
3. 11天工期约束

请你帮我:
1. 阅读所有材料,提出疑问与改进建议
   (尤其是技术选型/MVP范围/可行性)
2. 与我讨论后,生成一份「正式PRD」存为 docs/PRD-engineering.md
3. 这份正式PRD需包含:
   - 时序图(用Mermaid):用户从打开H5到完成一次介入的完整流程
   - 核心业务流程图(用Mermaid):前后端+AI能力的协同
   - 数据模型(TypeScript interface 或 JSON schema)
   - API接口列表(/api/* 的入参出参)
   - 关键页面的状态机(页面间跳转条件)
   - AI能力的具体prompt模板与调用代码片段

【Cursor版PRD】
[此处粘贴上一步生成的Cursor版PRD全文]
```

**关键提示**:Cursor会问你很多问题,**逐个回答,不要跳过**。这个对话过程本身就是把模糊需求变清晰的过程。

---

## Step 3:开发前准备

### 3.1 生成 开发计划 + 任务清单

**Prompt模板**:

```
基于刚才确定的正式PRD,请帮我生成两份文档,存到docs/目录:

1. docs/dev-plan.md(开发计划,Markdown格式)
   - 按"先数据库 → 模块化开发 → 每模块先前端后后端"的逻辑
   - 列出所有模块及其依赖关系
   - 每个模块预估时长(基于11天工期反推)

2. docs/tasks.md(任务清单,Checkbox格式)
   - 每个任务可单独完成且有明确产出
   - 用 - [ ] 格式
   - 按时间顺序排列

【11天工期】
今天:[替换为今天日期]
截止:2026-05-06

【模块预估】
- M0:项目初始化(框架/Tailwind/部署pipeline)
- M1:数据模型与mock数据(三体节点配置/介入历史/分支结局)
- M2:剧集观看页(原片播放+UI唤起触发)
- M3:消息撰写页(自由文本输入)
- M4:AI判断引擎(Claude API调用+评分逻辑)
- M5:分支视频播放页(预生成视频展示)
- M6:印记档案页(用户介入记录展示)
- M7:整体串联+录屏

请输出dev-plan.md和tasks.md的完整内容。
```

---

### 3.2 定义 输出规范

**Prompt模板**:

```
我们接下来正式开发。请你严格遵循以下规范:

1. 【每次开发工作完成后】向我汇报:
   - 本次完成了什么(具体到文件名)
   - 影响了哪些文件/模块
   - 下一步建议

2. 【每项任务完成后】主动询问我"是否验收",
   未得到我明确回复"验收"前,不开展下一项工作

3. 【每项任务验收后】自动在 docs/tasks.md 对应任务前的 [ ] 改为 [x]

4. 【遇到歧义时】优先停下来问我,不要自行假设

5. 【代码风格】:
   - TypeScript严格模式
   - 关键函数加JSDoc注释
   - 复杂逻辑加中文行内注释

6. 【小需求即刻实现,大需求加入待办】:
   - 小需求(<30分钟)直接做
   - 大需求记入 docs/backlog.md 的待办区

请回复"已理解,准备开始M0",我们就启动开发。
```

---

### 3.3 确认 测试方法

**Demo产品的测试方法(简化版)**:


| 测试维度   | 方法                              |
| ------ | ------------------------------- |
| 功能测试   | 手动跑一遍核心路径                       |
| AI能力测试 | 调用5次,看成功率+延迟                    |
| 跨浏览器   | Chrome + Safari + iPhone Safari |
| 录屏前彩排  | 5月5日完整跑3遍核心流程                   |


**Prompt模板**(可选):

```
我们用最简化的测试方法。请帮我:
1. 在 test/ 目录下,为每个关键模块写1个smoke test
2. 测试只覆盖"happy path"(正常输入下能跑通)
3. 不写edge case的测试,Demo阶段不需要

每个模块完成后,我手动跑smoke test,你协助修bug。
```

---

## Step 4:正式开发

### 4.1 模块化开发的标准对话模式

**每个模块的标准4步对话**:

#### Step A:启动模块

```
现在开始M[X]:[模块名]
请阅读 docs/PRD-engineering.md 中的相关章节,
列出本模块的具体子任务,等我确认后开始
```

#### Step B:分子任务执行

```
开始第[N]个子任务:[具体任务]
完成后向我汇报变更与下一步建议
```

#### Step C:验收

- 你测试 → 反馈问题 → Cursor修正 → 再次验收
- 验收后告诉Cursor:"验收通过,更新tasks.md"

#### Step D:模块收尾

```
M[X]全部完成。请帮我更新:
1. docs/tasks.md 的checkbox
2. docs/PRD-engineering.md(如有变更的接口/逻辑)
3. README.md 的进度章节
```

---

### 4.2 各模块特殊Prompt

#### M0:项目初始化

```
开始M0:项目初始化

请帮我:
1. 初始化一个Next.js 14项目(App Router,TypeScript,Tailwind)
2. 安装必要依赖:
   - GSAP(动画)
   - shadcn/ui(组件库)
   - Anthropic SDK(@anthropic-ai/sdk)
   - lucide-react(图标)
3. 配置 .env.local(预留 ANTHROPIC_API_KEY 等)
4. 初始化 docs/ 目录,放入PRD/dev-plan/tasks
5. 初始化 git,做第一次commit:"chore: project init"
6. 验证 npm run dev 可启动
```

---

#### M1:数据模型与Mock数据

```
开始M1:数据模型与Mock数据

请基于 docs/PRD-engineering.md 中的数据模型章节,
在 src/lib/types.ts 中定义TypeScript接口:
- Drama(剧目)
- Identity(介入身份)
- InterventionNode(介入节点)
- UserInterventionRecord(用户介入记录)
- BranchResult(分支结局)
- ScoreBreakdown(评分细节)

然后在 src/data/mock.ts 中创建Mock数据:
- 1部剧:《三体》
- 1个身份:监听员1379号
- 1个节点:1971年深夜YES按钮
- 3种分支结局(高/中/低分版本)

最后在 src/lib/storage.ts 中实现LocalStorage的读写:
- saveIntervention(record): 保存介入记录
- getInterventions(): 读取所有记录
- clearInterventions(): 清空(开发用)
```

---

#### M2:剧集观看页(原片播放+UI唤起触发)

```
开始M2:剧集观看页

页面路径:/watch/[dramaId]/[nodeId]

需求:
1. 上半部分:HTML5 video播放器,播放预先准备的《三体》片段(约3分钟)
2. 视频播放到指定时间点(从node配置中读取triggerTimestamp),自动暂停
3. 暂停瞬间,触发"UI唤起动画":
   - 视频画面渐暗(GSAP fade,1.5秒)
   - 浮现介入提示卡片("你是三体监听员1379号...")
   - 提示卡片下方有"接受介入"按钮
4. 用户点击"接受介入" → 跳转到 /intervene/[dramaId]/[nodeId]

视觉参考:
- 暗色背景 + 琥珀色文字
- CRT扫描线效果(可用CSS animation实现)
- 字体用等宽字体(monospace)
```

---

#### M3:消息撰写页(自由文本输入)

```
开始M3:消息撰写页

页面路径:/intervene/[dramaId]/[nodeId]

需求:
1. 全屏暗色背景,模拟70年代CRT显示器界面
2. 顶部:身份卡(展示"三体监听员1379号"的人设描述)
3. 中部:左右分屏布局
   - 左侧:你的发送终端(可输入)
   - 右侧:叶文洁的接收终端(显示她的状态:等待/阅读)
4. 用户在左侧textarea输入消息,实时同步显示到右侧
5. 底部:"发送"按钮(只有一次发送机会)
6. 发送后:
   - 调用 /api/judge 接口
   - 显示"等待判断"动画
   - 收到结果后,跳转到 /branch/[dramaId]/[nodeId]?score=[total]&branch=[branch]

输入限制:
- 最少20字,最多300字
- 输入框有"剩余字数"提示
- 不能为空
```

---

#### M4:AI判断引擎 ⭐ 核心模块

```
开始M4:AI判断引擎(本Demo最核心模块)

请实现 /api/judge 接口:

1. 入参:
{
  "dramaId": "santi",
  "nodeId": "yes-button-1971",
  "userMessage": "用户的消息"
}

2. 接口逻辑:
- 从mock数据读取对应节点的judgmentPrompt模板
- 用userMessage填充模板
- 调用Anthropic Claude API(用 @anthropic-ai/sdk)
- 解析返回JSON,提取scores/total/reasoning/branch
- 返回给前端

3. 评分Prompt模板(写到 src/data/prompts/santi-yes-button.ts):

```

你是《三体》监听员1379的剧情判断引擎。

用户作为监听员1379向叶文洁发送了一条消息:
"{user_message}"

请评估这条消息对叶文洁决策的影响力,从以下维度打分:

1. 信息完整度(是否清晰传达"不要回答"的核心):0-30
2. 情感强度(是否触动叶文洁的人性深处):0-30
3. 人物动机匹配(是否切合叶文洁对人类失望、对命运抗争的内核):0-25
4. 剧情逻辑自洽(是否符合监听员1379"同情但克制"的人设):0-15

总分0-100。

- 总分>80:高分路径(branch=high)
- 总分50-80:中分路径(branch=medium)
- 总分<50:低分路径(branch=low)

输出JSON格式(严格遵循):
{
  "scores": {
    "completeness": 0,
    "emotion": 0,
    "motivation": 0,
    "consistency": 0
  },
  "total": 0,
  "reasoning": "中文解释",
  "branch": "high|medium|low"
}

```

4. 写一个测试脚本 test/judge.test.ts,
   用5条不同质量的消息测试评分稳定性:
   - 测试1:空消息(预期失败/低分)
   - 测试2:简单"不要回答"(预期中分)
   - 测试3:深度共情消息(预期高分)
   - 测试4:无关内容(预期低分)
   - 测试5:接近原作监听员1379的口吻(预期高分)

5. 把测试结果给我看,我们一起调优prompt
```

---

#### M5:分支视频播放页 ⭐ 核心模块

```
开始M5:分支视频播放页

页面路径:/branch/[dramaId]/[nodeId]
URL参数:?score=85&branch=high

需求:
1. 根据branch字段,加载对应预生成视频:
   - high → public/videos/santi-yes-high.mp4(叶文洁删除YES,5秒)
   - medium → public/videos/santi-yes-medium.mp4(犹豫后按下,5秒)
   - low → public/videos/santi-yes-low.mp4(直接按下,5秒)

2. 页面布局:
   - 上方:视频自动播放(全屏沉浸)
   - 视频播放完毕后,显示"分支结局"文字
     - high:"你拯救了一个时间线"
     - medium:"你试过了。在另一个时间线里,你成功了。"
     - low:"她没有听到你。但你来过。"
   - 底部:"查看我的印记"按钮 → 跳转到 /archive

3. 视频播放完毕,自动写入印记记录到LocalStorage

视频获取(我会自己生成,不需要你实现):
- 用可灵2.0生成3条5秒短片
- reference frame: 叶文洁红岸基地特写
- 提示词我会另外整理

请你先用占位视频或静态图代替,接口和逻辑跑通即可
```

---

#### M5b:可灵视频生成提示词(给用户自己生成视频用)

```
请帮我写3条可灵2.0的视频生成提示词,
分别对应高/中/低分支的5秒短片。

要求:
1. 保持叶文洁人物一致性(基于reference frame)
2. 1971年红岸基地场景
3. 70年代质感(胶片颗粒、冷色调、CRT显示器光)
4. 5秒,不超过

【高分版本】
画面:叶文洁手指悬在YES按钮上,屏幕显示用户消息,
她泪流满面,逐字删除YES。
镜头:特写到中景缓慢拉远。

【中分版本】
画面:叶文洁犹豫片刻,表情复杂,最终按下YES。
内心活动从镜头中可见。

【低分版本】
画面:叶文洁直接按下YES,无犹豫,但屏幕角落
短暂闪过用户消息(被她忽略)。

请输出可直接复制到可灵的提示词文本。
```

---

#### M6:印记档案页

```
开始M6:印记档案页

页面路径:/archive

需求:
1. 从LocalStorage读取所有介入记录
2. 时间倒序展示,每条记录包含:
   - 介入时间
   - 介入剧目+节点
   - 你发送的消息(完整)
   - AI评分细节(可视化:雷达图/进度条)
   - 分支结局快照
3. 顶部:整体统计
   - 介入次数
   - 平均影响力分数
   - 拯救的时间线数(高分次数)

视觉要点:
- 档案感(像档案柜/历史卷宗)
- 仍延续CRT复古质感
- 雷达图用 recharts 库实现

最后,实现"清空档案"按钮(开发测试用)
```

---

#### M7:整体串联 + 录屏

```
开始M7:整体串联 + 录屏前彩排

请帮我:
1. 完整跑一次主流程(/watch → /intervene → /branch → /archive),
   记录所有bug到 docs/bugs.md
2. 修复所有阻塞性bug
3. 在首页加一个"重新开始"按钮(清空LocalStorage并跳回/watch)
4. 检查所有页面在iPhone Safari上的兼容性

录屏准备:
- 关闭所有浏览器扩展
- 用Chrome全屏录制
- 推荐工具:OBS Studio / QuickTime
- 分辨率:1920×1080 (16:9)

录屏脚本(参考):
- 0:00-0:20 痛点开场
- 0:20-0:45 产品概念引入
- 0:45-2:30 核心演示(完整跑一遍)
- 2:30-2:50 通用架构展示
- 2:50-3:00 PCG战略价值收尾
```

---

## Step 5:收尾及发布

### 5.1 待办收敛 + 整体功能验收

```
所有模块开发完成。请帮我:
1. 对照 docs/tasks.md,列出所有未打勾项
2. 对照 docs/PRD-engineering.md,检查是否有功能漏实现
3. 整体跑一遍核心流程,记录所有bug到 docs/bugs.md
4. 按优先级排序bug:
   - P0(阻塞):必须修
   - P1(影响体验):尽量修
   - P2(锦上添花):时间允许才修
```

---

### 5.2 UI细节统一

```
功能验收完毕,现在统一打磨UI细节:

1. 全站字体大小/间距/颜色一致性检查
2. 按钮hover/active状态完善
3. 加载状态(Loading)的视觉反馈
4. 空状态(Empty State)的处理
5. 错误状态(Error)的友好提示
6. 关键过场动画(GSAP)
7. 移动端适配(至少iPhone Safari可用)

请按页面逐个检查并修复
```

---

### 5.3 部署上线

```
准备部署到Vercel。请教我:
1. 如何把项目push到GitHub(我没用过)
2. 如何在Vercel连接GitHub仓库
3. 环境变量怎么配(ANTHROPIC_API_KEY等)
4. 自定义域名怎么设置(可选)
5. 部署后的URL如何分享给评委

请一步一步教,我会跟着操作。
每完成一步,等我确认后再说下一步。
```

---

## 附录A:11天工期分配

> 假设今天是 2026-04-25,截止 2026-05-06,共11天


| 日期   | 阶段       | 主要任务                                | 关键产出         |
| ---- | -------- | ----------------------------------- | ------------ |
| 4/26 | Step 1   | 找UI参考 + 用户访谈Day1                    | 视觉素材包 + 访谈记录 |
| 4/27 | Step 1   | 生成Figma版PRD + Cursor版PRD + 用户访谈Day2 | 两份开发PRD      |
| 4/28 | Step 2   | Figma搭8个核心UI页面                      | UI截图         |
| 4/29 | Step 2-3 | Cursor生成正式PRD + 开发计划 + 任务清单         | 工程文档         |
| 4/30 | Step 4   | M0-M2(初始化+数据模型+剧集观看页)               | 第一个可访问页面     |
| 5/1  | Step 4   | M3+M4(消息撰写+AI判断引擎)                  | AI能力跑通       |
| 5/2  | Step 4   | M5+M6(分支视频+印记档案)                    | 完整闭环         |
| 5/3  | Step 4   | M7(整体串联) + 视频生成                     | 端到端可演示       |
| 5/4  | Step 5   | UI细节统一 + Demo部署                     | 在线H5链接       |
| 5/5  | Step 5   | 录屏 + PDF最终排版                        | MP4 + PDF    |
| 5/6  | 提交       | 三项材料检查并提交                           | 提交完成         |


---

## 附录B:Demo MVP取舍清单

### 必做 ✅

- ✅ 三体监听员1379完整流程
- ✅ Claude判断引擎(AI原生证明)
- ✅ 印记档案页(产品理念体现)
- ✅ 部署到Vercel(可分享链接)
- ✅ 录屏(MP4交付物)
- ✅ 至少3个分支视频(高/中/低)

### 可砍 ❌

- ❌ 其他剧目的真实跑通(用静态wireframe代替)
- ❌ 实时视频生成(用预生成版本)
- ❌ 用户系统/登录(用LocalStorage)
- ❌ 数据库(用JSON文件Mock)
- ❌ 完整测试覆盖
- ❌ 完美的UI(够用即可)
- ❌ 多语言(只做中文)
- ❌ 支付/付费功能

### 锦上添花 🎁

- 🎁 加载动画 / 过场动画
- 🎁 音效(CRT嗡鸣/打字声)
- 🎁 分享按钮(分享到社交)
- 🎁 评委专用Demo路径(预设最佳输入)

---

## 附录C:文件目录结构建议

```
入戏-demo/
├── 01_visual-references/        # UI视觉参考图
├── 02_ui-screenshots/           # Figma导出的UI截图
├── docs/                        # 项目文档
│   ├── PRD-figma.md             # Figma版PRD
│   ├── PRD-cursor.md            # Cursor版PRD
│   ├── PRD-engineering.md       # 正式工程PRD
│   ├── dev-plan.md              # 开发计划
│   ├── tasks.md                 # 任务清单(checkbox)
│   ├── backlog.md               # 大需求待办
│   ├── bugs.md                  # bug记录
│   └── deploy-steps.md          # 部署步骤记录
├── public/
│   ├── videos/                  # 预生成的分支视频
│   │   ├── santi-yes-high.mp4
│   │   ├── santi-yes-medium.mp4
│   │   └── santi-yes-low.mp4
│   └── images/                  # 静态图片
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # 首页
│   │   ├── watch/               # 剧集观看
│   │   ├── intervene/           # 消息撰写
│   │   ├── branch/              # 分支结局
│   │   ├── archive/             # 印记档案
│   │   └── api/
│   │       └── judge/           # AI判断接口
│   ├── components/              # React组件
│   ├── lib/                     # 工具函数
│   │   ├── types.ts             # TypeScript类型
│   │   ├── storage.ts           # LocalStorage封装
│   │   └── claude.ts            # Claude API封装
│   ├── data/                    # Mock数据
│   │   ├── mock.ts
│   │   └── prompts/             # AI prompts
│   └── styles/
├── test/                        # smoke tests
├── .env.local                   # 环境变量(不提交)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 附录D:常见踩坑清单

### 🪤 坑1:Claude API调用JSON返回不规范

**问题**:Claude有时会返回带有Markdown代码块的JSON,无法直接JSON.parse。

**解法**:在prompt中明确要求 + 解析时容错处理:

```typescript
function extractJSON(text: string) {
  const match = text.match(/```json\n([\s\S]*?)\n```/) ||
                text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? (match[1] || match[0]) : text);
}
```

---

### 🪤 坑2:视频生成质量不稳定

**问题**:可灵生成的视频有30%失败率,且演员一致性可能崩。

**解法**:

- 每个分支至少生成5个版本,挑最好的1个
- 录屏时用挑出来的最佳版本
- 演示中规避对白特写,用画外音/侧脸

---

### 🪤 坑3:LocalStorage数据丢失

**问题**:用户清缓存/换浏览器/隐私模式,数据丢失。

**解法**:

- Demo阶段不解决(写在已知限制里)
- 上线版本再考虑后端持久化

---

### 🪤 坑4:Cursor生成的代码不能跑

**问题**:Cursor偶尔生成的代码有import错误/类型不匹配。

**解法**:

- 每完成一个文件,立刻 `npm run dev` 看是否能跑
- 如果Cursor连续3次修不好,**自己读代码定位问题**(CS背景的优势就在这里)

---

### 🪤 坑5:部署Vercel时环境变量配置错误

**问题**:本地能跑,部署后API调用失败。

**解法**:

- Vercel Dashboard → Project Settings → Environment Variables
- 确保 `ANTHROPIC_API_KEY` 等关键变量配置正确
- 触发重新部署生效

---

### 🪤 坑6:GSAP动画在SSR下报错

**问题**:Next.js的SSR环境下,GSAP的window对象不存在。

**解法**:

- 用 `useEffect` 包裹GSAP代码
- 或用 `dynamic import` 配 `ssr: false`

```typescript
"use client";
import { useEffect } from 'react';
import gsap from 'gsap';

export default function Component() {
  useEffect(() => {
    gsap.to('.element', { opacity: 1 });
  }, []);
  return <div className="element" />;
}
```

---

## 文档变更记录


| 版本   | 日期         | 变更  |
| ---- | ---------- | --- |
| v1.0 | 2026-04-25 | 初版  |


---

> **End of Document**
>
> 本文档为《入戏》Demo开发的Prompt合集,可在开发过程中按阶段查阅。
> 如发现新踩坑或Prompt优化点,请更新到附录D。

