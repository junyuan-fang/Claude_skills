---
name: embodied-ai-daily-news-silent-push
title: 具身智能每日新闻深度版静默推送 (v1.3)
description: 每日推送具身智能行业 + 论文混编摘要：三段式静默推送，论文必须 14 天内且经 submission date 精校，跳过用户已熟概念解释，归档每篇论文必带 Project 行供下游 awesome-physical-ai ingest。
trigger_keywords: ["具身智能 新闻", "具身智能新闻", "embodied AI daily", "embodied AI 日报", "人形机器人 推送", "人形机器人推送", "VLA 论文推送", "embodied-TODAY.md", "cc-send-safe"]
keywords: ['具身智能新闻', 'embodied AI 日报', '人形机器人推送', 'VLA 论文推送', 'v1.3', 'embodied-TODAY.md']
source: date=2026-08-14
version: 2.3
updated_at: 2026-08-15T03:31:08
---

# 具身智能每日新闻深度版静默推送 (v1.3)

## 适用场景

每日推送具身智能（embodied AI / 人形机器人 / 物理 AI / VLA / 世界模型）摘要，行业 + 论文混编，经 cc-connect 微信通道静默推送。

## 目标

覆盖行业动态 + 重点论文 + 必要概念解释。**不发任何中间态状态消息**，只发实际内容。

## 步骤

### Step 1: 搜索 + 撰写归档

1. 搜过去 24 小时具身智能（embodied AI / 人形机器人 / 物理 AI / VLA / 世界模型）相关内容：
   - **行业**：融资（轮次、估值、领投）、量产（出货、交付、产线）、政策（中美欧、地方产业园补贴）、合作（车企/工厂/物流落地）、人事（高管流动、明星创业）。
     - 信源：36氪、晚点、IT 之家、TechCrunch、The Information、雷锋网、机器之心、量子位、新智元。
     - 重点公司：宇树、智元、银河通用、星海图、星动纪元、自变量、星尘智能、UBTech、Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON。
   - **论文**：arXiv cs.RO / cs.AI / cs.CV、HuggingFace daily papers、CoRL / RSS / ICRA / NeurIPS / ICLR。主题：VLA / WAM / 世界模型 / Diffusion Policy / RL for robotics / Sim2Real / dexterous manipulation / locomotion / teleoperation。

2. **【日期硬校验 — 14 天窗口】**（最关键的一步）
   - 只引用**最近 14 天内**提交的论文作为「今日论文」。判断顺序：
     1. HuggingFace daily papers (https://huggingface.co/papers) 当周精选 —— **最优先**，因为是每日 curated。
     2. arXiv abstract 页 `[Submitted on YYYY-MM-DD]`：`curl https://arxiv.org/abs/<id>` 抓 `<meta name="citation_date">` 或页面 submission date。
     3. arXiv ID 前 4 位 = YYMM，**仅做粗筛，不能替代真实 submission date 校验**。
   - 引用更老的论文必须在标题旁标注真实日期（例：「HEX（2026-04-09 旧作，已超 14 天）」），且**不进头条快报和 deep dive**，只放归档的「延伸阅读」。
   - **搜不到 14 天内新论文，宁可只放 4-5 条行业、彻底放弃论文项**，绝不把老论文包装成「今日新发」。

3. 每条新闻做**尽调式扩展**（读者 30 秒掌握 why-it-matters）：
   - **公司/产品背景（必含）**：公司是谁、做什么、谁创立、什么估值/规模。例：「Figure 是美国创业公司主打通用人形机器人，Brett Adcock 创立」。
   - **概念解释（严格 gating）**：
     - 用户**已熟知、禁止解释**：VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、人形 humanoid、dexterous manipulation、locomotion。
     - 只在出现**真正新生/小众/学术冷门**术语时 1 句带过（如论文内部命名 DreamZero / Helix / GR00T-Mimic、新 method/dataset 名、特殊 benchmark 名 MolmoSpaces / RoboArena）。
     - 判定标准：**谷歌一搜就有 Wikipedia 条目的概念，不要解释**。
   - **数字**：融资金额、估值、产能、出货量、参数量、训练数据小时数、benchmark。
   - **业内意义**：国内 vs 美国节奏、技术路线之争、谁吃到红利。

4. 完整深度版写入 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`，不限字数。

5. **每篇论文归档时必须在来源行之后额外加一行**：
   ```
   - Project: <url>
   ```
   优先级：论文项目主页（*.github.io / *.netlify.app / *.vercel.app / 学校主页）> GitHub repo > demo 站。找不到写 `- Project: N/A`，**绝对不要省略这一行** —— 下游 awesome-physical-ai 自动 ingest 依赖它。

### Step 2: 准备两段推送文字

6. **第 1 段 — 头条快报（≤800 字符）**
   - 开头 1 句「今日具身智能主线」。
   - 5-6 条要点：4-5 条行业 + 1-2 条论文。
   - 每条：【行业/论文】标题 + 1 句数据 + 1 句「是什么/为什么」（含 1 句公司背景；不要塞已熟概念解释）。
   - 末尾标注「(深度细节见第 2 段)」。
7. **第 2 段 — 深度展开（≤800 字符）**
   - 挑 1-2 个最有信息量的 item deep dive（行业或论文均可）。
   - 必带：是什么 / 怎么做 / 数字 / 业内对比。
   - 论文 deep dive：模型架构 1 句、训练数据 1 句、benchmark 1 句、对标 SOTA 1 句、能否落地 1 句 —— 直接用术语。
   - 末尾附 2-3 个权威源链接。
8. 口语化，少用并列符堆词，多用「x 倍、y 亿」具体数字。

### Step 3: 准备 1 张配图

9. 抓最具代表性的 1 张图（机器人产品图 / CEO 照 / demo 截图 / 论文 architecture 图），下载到 `/tmp/embodied_daily.jpg`。
10. `file /tmp/embodied_daily.jpg` 确认；>100KB 用 `convert` 压到 ≤80KB JPEG。**只准备 1 张**。

### Step 4: 严格顺序发送

```bash
cc-send-safe -m "<头条快报全文>"
sleep 30
cc-send-safe -m "<深度展开全文>"
sleep 30
cc-send-safe --image /tmp/embodied_daily.jpg   # 一次性，失败即放弃
```

### Step 5: 静默收尾

11. 不发任何 reply 状态消息。
12. 本地确认：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5`（仅 stdout）。

## 绝对禁止

- 发 2 张及以上图片；图片失败后重试或再发任何文字
- 省略 `sleep 30`
- 文字里只列关键词（每条至少带背景或数据中 2 项）
- 解释 VLA / WAM / Sim2Real / Teleoperation / Diffusion Policy / VLM / RL / Imitation Learning 等已熟概念
- 发「段X已发」「任务完成」「已推送…」等状态消息
- 完全照抄前一天内容（每日重新搜索、去重）
- 把超过 14 天前的论文标记为「今日论文」或「最新」
