---
name: embodied-ai-daily-news-silent-14d
description: 每日推送具身智能行业+论文混编摘要：三段式静默推送，论文必须 14 天内（HF daily 优先 + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校），跳过用户已熟概念解释，归档每篇论文必带 Project 行
trigger_keywords: ["具身智能新闻", "具身智能日报", "embodied AI daily", "人形机器人新闻"]
source: date=2026-08-07
version: 1
updated_at: 2026-08-08T03:33:42
---

# 具身智能每日摘要（静默+论文 14 天硬校验+Project 行）

## 步骤

### Step 1: 搜索 + 归档
1. 搜过去 24 小时具身智能内容：
   - 行业：融资/量产/政策/合作/人事。信源：36氪、晚点、IT之家、TechCrunch、The Information、机器之心、量子位、新智元等。重点公司：宇树、智元、银河通用、星海图、星动纪元、Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON、UBTech、星尘智能、自变量。
   - 论文：arXiv cs.RO/cs.AI/cs.CV、HuggingFace daily papers（首选，每日 curated）、CoRL/RSS/ICRA/NeurIPS/ICLR。
2. **论文日期硬校验（14 天窗口）**：
   - arXiv ID 前 4 位 = YYMM，仅做粗筛
   - 精校用 `curl https://arxiv.org/abs/<id>` 抓 `citation_date` / `[Submitted on YYYY-MM-DD]`
   - 只有 14 天内提交的论文能进头条与 deep dive；更老的必须标注真实日期且只能进归档"延伸阅读"
   - 搜不到 14 天内新论文时，宁可只发 4-5 条行业、彻底放弃论文项
3. 每条做尽调式扩展：公司背景 1 句（必含）、具体数字（融资额/估值/出货量/参数量/benchmark）、业内意义（中美节奏、技术路线之争）。
4. 完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`。
5. **每篇论文归档必须加一行 `- Project: <url>`**（项目主页 > GitHub repo > demo 站，找不到写 `- Project: N/A`，绝不省略）——供下游 awesome-physical-ai 自动 ingest。

### Step 2: 两段推送文字
6. 第 1 段头条快报（≤800 字符）：1 句主线 + 5-6 条（4-5 行业 + 1-2 论文），每条【行业/论文】标题 + 1 句数据 + 1 句是什么/为什么。
7. 第 2 段深度展开（≤800 字符）：1-2 个 item deep dive；论文的话架构/训练数据/benchmark/对标 SOTA/落地各 1 句；末尾附 2-3 个权威源链接。

### Step 3: 配图
8. 抓 1 张代表图到 `/tmp/embodied_daily.jpg`，`file` 确认，>100KB 压到 ≤80KB JPEG，只准备 1 张。

### Step 4: 顺序发送
9. `cc-send-safe -m "<第1段>"` → `sleep 30` → `cc-send-safe -m "<第2段>"` → `sleep 30` → `cc-send-safe --image /tmp/embodied_daily.jpg`（失败即放弃，不重试、不再发任何文字）。

### Step 5: 静默收尾
10. 不发任何状态消息；本地 `ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5` 确认归档。

## 注意

- **不要解释用户已熟概念**：VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、humanoid、灵巧手、locomotion。只在真正新生/小众术语（新方法名、新 benchmark 名）时 1 句带过；谷歌一搜有 Wikipedia 条目的概念一律不解释
- 不能把超过 14 天前的论文包装成"今日新发/最新"
- 不能发 2 张及以上图片；图片失败后不重试也不再发文字；不能省略 sleep 30
- 每日重新搜索去重，不能照抄前一天内容
