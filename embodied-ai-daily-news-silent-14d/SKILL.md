---
name: embodied-ai-daily-news-silent-14d
title: 每日具身智能新闻静默推送（v1.3，论文 14 天硬校验）
description: 每日推送具身智能行业动态 + 重点论文混编摘要：三段式静默推送，论文必须 14 天内（HF daily 优先 + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校），跳过用户已熟概念解释，归档每篇论文必带 Project 行供下游 awesome-physical-ai ingest
keywords: ['具身智能 新闻', 'embodied AI 每日', '人形机器人 推送', 'VLA 论文推送', 'embodied 归档', 'cc-send-safe']
trigger_keywords: ["具身智能新闻", "具身智能日报", "embodied AI daily", "embodied AI 日报", "人形机器人新闻", "深度版 v1.3"]
source: date=2026-08-07
version: 3
updated_at: 2026-08-18T00:00:00
---

# 具身智能每日摘要（静默 + 论文 14 天硬校验 + Project 行）

## 适用场景 / 用途

每日推送具身智能（embodied AI / 人形机器人 / 物理 AI / VLA / 世界模型）摘要：行业动态 + 重点论文混编，三段式静默推送到微信（cc-send-safe），完整深度版落归档文件。

## 步骤

### Step 1: 搜索 + 撰写归档

1. 搜过去 24 小时相关内容：
   - **行业**：融资（轮次、估值、领投）、量产（出货、交付、产线）、政策（中美欧、地方产业园补贴）、合作（车企/工厂/物流落地）、人事（高管流动、明星创业）。
     - 信源：36氪、晚点、IT 之家、TechCrunch、The Information、雷锋网、机器之心、量子位、新智元。
     - 重点公司：宇树、智元、银河通用、星海图、星动纪元、自变量、星尘智能、UBTech、Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON。
   - **论文**：arXiv cs.RO / cs.AI / cs.CV、HuggingFace daily papers（首选，每日 curated）、CoRL / RSS / ICRA / NeurIPS / ICLR。主题：VLA / WAM / 世界模型 / Diffusion Policy / RL for robotics / Sim2Real / dexterous manipulation / locomotion / teleoperation。

2. **【论文日期硬校验 — 14 天窗口】** 只引用最近 14 天内提交的论文作为「今日论文」，按以下优先级核验：
   - a) HuggingFace daily papers (https://huggingface.co/papers) 当周精选 —— **最优先**，因为是每日 curated。
   - b) arXiv abstract 页精校：`curl https://arxiv.org/abs/<id>` 抓 `<meta name="citation_date">` 或页面 `[Submitted on YYYY-MM-DD]`。
   - c) arXiv ID 前 4 位 = YYMM，**仅做粗筛，不能替代真实 submission date 校验**。
   - 只有 14 天内提交的论文能进头条快报与 deep dive。更老的论文必须在标题旁标注真实日期（例：`HEX（2026-04-09 旧作，已超 14 天）`），且只能放归档的「延伸阅读」，不进头条/deep dive。
   - **若搜不到 14 天内新论文，宁可只放 4-5 条行业、彻底放弃论文项**，绝不把老论文包装成「今日新发/最新」。

3. 每条做尽调式扩展（让读者 30 秒掌握 why-it-matters）：
   - **公司/产品背景（必含 1 句）**：公司是谁、做什么、谁创立、什么估值/规模。
   - **概念解释严格 gating**：用户已熟以下概念，**禁止再解释** —— VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、人形 humanoid、灵巧手、locomotion。只在出现真正新生/小众术语（新论文内部命名如 "DreamZero"、"Helix"，新 method / dataset / 冷门 benchmark 名如 "RoboArena"）时 1 句带过。判定标准：谷歌一搜就有维基条目的概念，一律不解释。
   - **数字**：融资金额、估值、产能、出货量、参数量、训练数据小时数、benchmark 分数。
   - **业内意义**：国内 vs 美国节奏、技术路线之争、谁吃到红利。

4. 完整深度版写到归档文件，不限字数：
   ```bash
   /home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md
   ```

5. **每篇论文归档时必须在来源行之后加一行**：
   ```
   - Project: <url>
   ```
   优先级：论文项目主页（*.github.io / *.netlify.app / *.vercel.app / 学校主页）> GitHub repo > demo 站；找不到写 `- Project: N/A`。**绝不省略这一行**——下游 awesome-physical-ai 自动 ingest 靠它抽取。

### Step 2: 准备两段推送文字

6. **第 1 段 — 头条快报（≤800 字符）**：开头 1 句「今日具身智能主线」；5-6 条要点（4-5 条行业 + 1-2 条论文）；每条 = 【行业/论文】标题 + 1 句数据 + 1 句「是什么 / 为什么」（含 1 句公司背景，不塞已熟概念解释）；末尾 `(深度细节见第 2 段)`。
7. **第 2 段 — 深度展开（≤800 字符）**：挑 1-2 个最有信息量的 item 做 deep dive，必带「是什么 / 怎么做 / 数字 / 业内对比」。论文 deep dive 写：模型架构 1 句、训练数据 1 句、benchmark 1 句、对标 SOTA 1 句、能否落地 1 句，直接用术语。末尾附 2-3 个权威源链接。
8. 两段口语化，多用「x 倍、y 亿」这类具体数字。

### Step 3: 准备 1 张配图

9. 抓最具代表性的 1 张图（机器人产品图 / CEO 照 / demo 截图 / 论文 architecture 图）到 `/tmp/embodied_daily.jpg`。
10. `file /tmp/embodied_daily.jpg` 确认格式；>100KB 用 `convert` 压到 ≤80KB JPEG。**只准备 1 张**。

### Step 4: 严格顺序发送

```bash
cc-send-safe -m "<头条快报全文>"
sleep 30
cc-send-safe -m "<深度展开全文>"
sleep 30
cc-send-safe --image /tmp/embodied_daily.jpg   # 一次性，失败即放弃，不重试、不再发任何文字
```

### Step 5: 静默收尾

11. 不发任何 reply / 状态消息。
12. 本地确认归档：
    ```bash
    ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5
    ```

## 绝对禁止

- 把超过 14 天前的论文标记为「今日论文」或包装成「今日新发/最新」。
- 用 arXiv ID 的 YYMM 代替 abstract 页 submission date 做最终判定。
- 归档里省略论文的 `- Project:` 行。
- 发 2 张及以上图片；图片失败后重试或再发文字。
- 省略 `sleep 30`。
- 文字里只列关键词（每条至少带背景 / 数据两项中的 2 项）。
- 解释 VLA / WAM / VLM / Sim2Real / Teleoperation / Diffusion Policy / RL / Imitation Learning 等用户已熟概念。
- 发「段X已发」「任务完成」「已推送…」等状态消息。
- 完全照抄前一天内容（每日重新搜索、去重）。
