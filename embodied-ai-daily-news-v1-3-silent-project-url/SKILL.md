---
name: embodied-ai-daily-news-v1-3-silent-project-url
description: 每日推送具身智能行业+论文混编摘要：论文必须 14 天内（HF daily 优先 + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校），跳过用户已熟概念解释，归档中每篇论文必带 `- Project: <url>` 行供 awesome-physical-ai 自动 ingest，三段式静默推送
trigger_keywords: ["具身智能新闻", "embodied daily", "人形机器人新闻", "每日具身"]
source: date=2026-07-14
version: 1
updated_at: 2026-07-15T03:31:30
---

# 具身智能每日新闻推送（v1.3 静默 + 论文 14 天硬校验 + Project URL 归档行）

## 步骤

### Step 1: 搜索 + 撰写归档
1. 搜过去 24 小时具身智能（embodied AI/人形机器人/物理 AI/VLA/世界模型）：
   - 行业：融资/量产/政策/合作/人事。信源：36氪、晚点、IT之家、TechCrunch、The Information、机器之心、量子位、新智元等。重点公司：宇树、智元、银河通用、星海图、星动纪元、Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON、UBTech、星尘智能、自变量。
   - 论文：arXiv cs.RO/cs.AI/cs.CV、HuggingFace daily papers（首选，每日 curated）、CoRL/RSS/ICRA/NeurIPS/ICLR。
2. **论文日期硬校验（14 天窗口）**：
   - arXiv ID 前 4 位 = YYMM，仅做粗筛
   - 精校用 `curl https://arxiv.org/abs/<id>` 抓 `[Submitted on YYYY-MM-DD]` 或 `citation_date`
   - 只有 14 天内提交的论文可作"今日论文"进头条/deep dive；更老的必须标注真实日期且只能进归档"延伸阅读"
   - 搜不到 14 天内新论文时，宁可只放 4-5 条行业、彻底放弃论文项
3. 每条新闻尽调式扩展：公司背景（谁/做什么/谁创立/估值规模）+ 数字 + 业内意义。
4. **概念解释严格 gating**：VLA/WAM/VLM/Sim2Real/Teleoperation/Diffusion Policy/Imitation Learning/RL/Behavior Cloning/Foundation Model/Whole-body Control/ZMP/MPC/CMA-ES/四足/humanoid/dexterous manipulation/locomotion 等用户已熟概念**不解释**；只有真正新生/小众术语（新论文内部命名、新 method/dataset/benchmark 名）才 1 句带过。标准：谷歌一搜有 Wikipedia 条目的不解释。
5. 完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`。
6. **每篇论文归档时在来源行之后必须额外加一行 `- Project: <url>`**，优先级：项目主页（*.github.io/*.netlify.app/*.vercel.app/学校主页）> GitHub repo > demo 站；找不到写 `- Project: N/A`，绝不省略（下游 awesome-physical-ai 自动 ingest 依赖此行）。

### Step 2: 两段推送文字
- 第 1 段头条快报（≤800 字符）：1 句主线 + 5-6 条要点（4-5 行业 + 1-2 论文），每条【行业/论文】标题 + 1 句数据 + 1 句是什么/为什么，末尾"(深度细节见第 2 段)"。
- 第 2 段深度展开（≤800 字符）：1-2 个 item deep dive；论文 deep dive 含架构/训练数据/benchmark/对标 SOTA/落地各 1 句，直接用术语；末尾附 2-3 个权威源链接。

### Step 3: 配图
- 1 张代表图下载到 `/tmp/embodied_daily.jpg`，`file` 确认，>100KB 压到 ≤80KB JPEG，只准备 1 张。

### Step 4: 严格顺序发送
```
cc-send-safe -m "<第1段>"
sleep 30
cc-send-safe -m "<第2段>"
sleep 30
cc-send-safe --image /tmp/embodied_daily.jpg   # 失败一次即放弃，不重试，不发状态
```

### Step 5: 静默收尾
- 不发任何状态消息；本地 `ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5` 确认。

## 注意（绝对禁止）
- 不发 ≥2 张图片；图片失败后不重试、不再发文字
- 不省略 sleep 30
- 不解释用户已熟概念
- 不发任何中间/收尾状态消息
- 不把超过 14 天的论文标为"今日论文"
- 不照抄前一天内容（每日重新搜索去重）
- 归档中论文不得缺 `- Project:` 行
