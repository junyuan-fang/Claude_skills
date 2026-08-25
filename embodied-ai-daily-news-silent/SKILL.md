---
name: embodied-ai-daily-news-silent
description: 每日搜索具身智能行业动态 + 近 14 天新论文，写深度归档（论文必带 Project 行），再三段式静默推送；跳过用户已熟概念的解释。
trigger_keywords: ["具身智能每日新闻", "embodied AI 新闻", "人形机器人日报", "深度版 v1.3", "news_archive embodied"]
source: date=2026-08-25
version: 1
updated_at: 2026-08-26T03:31:43
---

# 具身智能每日深度新闻静默推送（v1.3）

## 适用场景

每日推送具身智能（人形机器人 / 物理 AI / VLA / 世界模型）行业 + 论文混编摘要到 cc-connect 通道。

## 步骤

### Step 1: 搜索 + 撰写归档

1. 搜过去 24 小时：
   - **行业**：融资（轮次/估值/领投）、量产（出货/交付/产线）、政策（中美欧、产业园补贴）、合作（车企/工厂/物流落地）、人事。
     - 信源：36氪、晚点、IT 之家、TechCrunch、The Information、雷锋网、机器之心、量子位、新智元
     - 中国端重点公司：宇树、智元、银河通用、星海图、星动纪元、UBTech、星尘智能、自变量；海外：Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON
   - **论文**：arXiv cs.RO/cs.AI/cs.CV、HuggingFace daily papers、CoRL/RSS/ICRA/NeurIPS/ICLR。主题：VLA / WAM / 世界模型 / Diffusion Policy / RL for robotics / Sim2Real / dexterous manipulation / locomotion / teleoperation。

2. **论文日期硬校验（14 天窗口）** —— 这是本 skill 最关键的一步：
   - HuggingFace daily papers (https://huggingface.co/papers) 优先，它是每日 curated
   - arXiv ID 前 4 位 YYMM 只做**粗筛**，不能替代真实 submission date
   - 精校：`curl https://arxiv.org/abs/<id>` 读 `<meta name="citation_date">` 或页面 `[Submitted on YYYY-MM-DD]`
   - 超过 14 天的论文必须在标题旁标真实日期（例："HEX（2026-04-09 旧作，已超 14 天）"），且只能放在归档的「延伸阅读」，不进头条和 deep dive
   - **搜不到 14 天内新论文时，宁可只放 4-5 条行业、彻底放弃论文项**，绝不把老论文包装成「今日新发」

3. 每条做尽调式扩展：
   - **公司/产品背景（必含）**：公司是谁、做什么、谁创立、什么估值/规模
   - **概念解释严格 gating**：以下概念用户已熟，**不要解释** —— VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、人形、灵巧手、locomotion。判据：谷歌一搜就有 Wikipedia 条目的，不解释。只有真正新生/小众的内部命名（"DreamZero"、"Helix"、"GR00T-Mimic"）、新 method/dataset/benchmark 名（"RoboArena"）才 1 句带过。
   - **数字**：融资金额、估值、产能、出货量、参数量、训练数据小时数、benchmark
   - **业内意义**：国内 vs 美国节奏、技术路线之争、谁吃红利

4. 完整深度版写入 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`，不限字数。

5. **每篇论文归档时必须在来源行之后加一行 `- Project: <url>`**，优先级：项目主页（*.github.io / *.netlify.app / *.vercel.app / 学校主页）> GitHub repo > demo 站；找不到写 `- Project: N/A`。**绝不省略**——这一行被下游 awesome-physical-ai 自动 ingest 抽取。

### Step 2: 两段推送文字

6. **第 1 段 头条快报（≤800 字符）**：开头 1 句「今日具身智能主线」+ 5-6 条要点（4-5 条行业 + 1-2 条论文）。每条：【行业/论文】标题 + 1 句数据 + 1 句「是什么/为什么」（含公司背景，不塞已熟概念解释）。末尾 `(深度细节见第 2 段)`。
7. **第 2 段 深度展开（≤800 字符）**：1-2 个 item deep dive。必带：是什么 / 怎么做 / 数字 / 业内对比。论文 deep dive 结构：模型架构 1 句、训练数据 1 句、benchmark 1 句、对标 SOTA 1 句、能否落地 1 句 —— 直接用术语。末尾 2-3 个权威源链接。
8. 口语化，多用具体数字。

### Step 3: 1 张配图

9. 抓 1 张代表图（机器人产品图/CEO 照/demo 截图/论文 architecture 图），存 `/tmp/embodied_daily.jpg`；`file` 确认；`>100KB` 用 `convert` 压到 ≤80KB。只 1 张。

### Step 4: 严格顺序发送

```bash
cc-send-safe -m "<头条快报全文>"
sleep 30
cc-send-safe -m "<深度展开全文>"
sleep 30
cc-send-safe --image /tmp/embodied_daily.jpg   # 一次性，失败即放弃
```

### Step 5: 静默收尾

10. 不发任何状态消息。本地确认：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5`。

## 绝对禁止

- 发 2 张及以上图片；图片失败后重试或再发文字
- 省略 `sleep 30`
- 解释 VLA/WAM/Sim2Real/Teleoperation/Diffusion Policy/VLM/RL/Imitation Learning 等已熟概念
- 发「段X已发」「任务完成」「已推送」等状态消息
- 照抄前一天内容（每日重新搜索、去重）
- 把 >14 天的论文标为「今日论文」
