---
name: embodied-ai-daily-news-v1-3-paper-date-strict
description: 通过 cc-send-safe 每日 12:00 推送具身智能行业+论文混编，论文必须 14 天内（HuggingFace daily 优先，arXiv ID YYMM 粗筛+abstract 精校），不解释用户已熟概念
trigger_keywords: ["具身智能 每日", "embodied daily", "VLA 推送", "人形机器人 cron"]
source: date=2026-05-20
version: 1
updated_at: 2026-05-21T03:31:51
---

# 具身智能每日新闻 v1.3（论文 14 天硬校验 + 已熟概念不解释）

## 步骤

### Step 1: 搜索 + 归档
1. 搜过去 24h 行业（融资/量产/政策/合作/人事，覆盖宇树/智元/银河通用/星海图/Figure/1X/Apptronik/Boston Dynamics/Tesla Optimus/小鹏 IRON 等）
2. 搜论文（HuggingFace daily 优先 → arXiv cs.RO/cs.AI/cs.CV 最近一周 trending）
3. **论文日期硬校验**：arXiv ID 前 4 位 = YYMM；只引用最近 14 天内提交的；ID 粗筛后必须再读 abstract 页 `[Submitted on]` 精校
4. 搜不到 14 天内新论文，宁可只放 4 条行业放弃论文项，绝不把老论文包装成"今日新发"
5. 完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`

### Step 2: 撰写规则（关键差异点）
6. 每条必带公司/产品 1 句背景（谁创立/什么估值/什么规模）
7. **概念解释严格 gating**：以下用户已熟，绝不解释 → VLA / WAM / VLM / Sim2Real / Teleoperation / Diffusion Policy / Imitation Learning / RL / Behavior Cloning / Foundation Model / Whole-body Control / ZMP / MPC / locomotion / dexterous manipulation / 四足 / 人形
8. 只在出现真正新生术语（论文内部命名如 GR00T-Mimic / Helix / DreamZero、新 benchmark / dataset 名）时才 1 句带过
9. 标准：谷歌一搜有 wiki 条目的概念不解释

### Step 3: 两段推送（各 ≤800 字符）
10. 第 1 段头条快报："今日具身智能主线" + 5-6 条要点（4-5 行业 + 1-2 论文），每条 【行业/论文】标题+数据+背景
11. 第 2 段深度展开：挑 1-2 item，论文 deep dive 要 模型架构/训练数据/benchmark/对标 SOTA/能否落地，直接用术语

### Step 4: 配图 + 发送
12. 1 张代表图（机器人/CEO/demo/论文 architecture）→ `/tmp/embodied_daily.jpg`，压到 ≤80KB
13. `cc-send-safe -m <段1>` → `sleep 30` → `cc-send-safe -m <段2>` → `sleep 30` → `cc-send-safe --image /tmp/embodied_daily.jpg`（失败不重试）
14. 全程静默，不发状态消息

## 绝对禁止
- 不能把超过 14 天前的论文标记为"今日论文"
- 不能解释 VLA/WAM/Sim2Real 等用户已熟概念（违背简洁宗旨）
- 不能完全照抄前一天内容
- 不能发 ≥2 张图、不能图片失败后再发文字、不能省略 sleep 30
- 不能发"已推送/任务完成"等状态消息
