---
name: embodied-ai-daily-news-v1-3-silent-strict
description: 每日 12:00 通过 cc-send-safe 推送具身智能行业+论文混编摘要：三段式（头条快报+深度展开+1张配图），论文必须 14 天内（HuggingFace daily 优先 + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校），跳过用户已熟概念，全程静默不发状态消息
trigger_keywords: ["具身智能新闻", "embodied AI daily", "人形机器人日报", "VLA 推送", "每日具身智能", "具身智能每日新闻", "embodied daily", "人形机器人推送", "VLA 论文推送", "embodied 静默"]
source: date=2026-05-22
version: 2.3
updated_at: 2026-05-24T00:00:00
---

# 具身智能每日新闻推送 v1.3（静默+14天论文硬校验+已熟概念跳过）

## 适用场景

每天 12:00 通过 cc-connect 微信通道推送具身智能（人形机器人 / VLA / 世界模型 / Diffusion Policy）的行业 + 论文混编摘要。

## 步骤

### Step 1 — 搜索 + 归档

1. 搜过去 24 小时：
   - 行业：融资 / 量产 / 政策 / 合作 / 人事；信源 36氪、晚点、IT 之家、TechCrunch、The Information、机器之心、量子位、新智元等。重点公司：宇树、智元、银河通用、星海图、星动纪元、Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON、Unitree、UBTech、星尘智能、自变量。
   - 论文：arXiv cs.RO / cs.AI / cs.CV、HuggingFace daily papers、CoRL / RSS / ICRA / NeurIPS / ICLR。主题 VLA / WAM / 世界模型 / Diffusion Policy / RL for robotics / Sim2Real / dexterous manipulation / locomotion / teleoperation。
   - 每条做尽调式扩展（公司背景 / 数字 / 业内意义）。
2. **论文日期硬校验（14 天窗口）**：
   - 优先 HuggingFace daily papers（https://huggingface.co/papers）当周精选
   - arXiv ID 前 4 位 YYMM 仅做粗筛，**不能**替代真实 submission date
   - 精校：`curl https://arxiv.org/abs/<id>` 抓 `<meta name="citation_date">` 或 abstract 页 `[Submitted on YYYY-MM-DD]`
   - 超 14 天的论文要在标题旁标注真实日期（如 `HEX（2026-04-09 旧作，已超 14 天）`），且只能放归档的"延伸阅读"，**不进**头条快报和 deep dive
   - 若搜不到 14 天内新论文，宁可只放 4-5 条行业、彻底放弃论文项
3. 把完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`（归档不限字数）

### Step 2 — 第 1 段：头条快报（≤800 字符）

4. 开头 1 句"今日具身智能主线"
5. 5-6 条要点：4-5 条行业 + 1-2 条论文
6. 每条格式：【行业/论文】标题 + 1 句数据 + 1 句"是什么/为什么"（含 1 句公司背景，不解释已熟概念）
7. 末尾 `(深度细节见第 2 段)`

### Step 3 — 第 2 段：深度展开（≤800 字符）

8. 挑 1-2 个 item deep dive，必带 是什么 / 怎么做 / 数字 / 业内对比
9. 论文 deep dive 必带：架构 / 训练数据 / benchmark / 对标 SOTA / 能否落地
10. **直接使用术语，不解释 VLA / Diffusion Policy 等已熟概念**
11. 末尾 2-3 个权威源链接

### Step 4 — 配图

12. 抓 1 张代表性图（机器人产品图 / CEO 照 / demo 截图 / 论文 architecture 图）→ `/tmp/embodied_daily.jpg`
13. `file /tmp/embodied_daily.jpg` 确认是图片；>100KB 用 `convert` 压到 ≤80KB JPEG
14. **只准备 1 张**

### Step 5 — 严格顺序发送（3 次推送，每次间隔 30s）

```bash
cc-send-safe -m "<头条快报全文>"
sleep 30
cc-send-safe -m "<深度展开全文>"
sleep 30
cc-send-safe --image /tmp/embodied_daily.jpg   # 失败一次就放弃
```

### Step 6 — 静默收尾

15. **不发任何 reply 状态消息**（不发"已推送""任务完成""归档路径"）
16. `ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5` 仅在 stdout 本地确认归档

## 已熟概念跳过名单（不要解释）

VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、人形 humanoid、灵巧手 dexterous manipulation、locomotion。

**只解释**真正新生/小众术语（新论文内部命名如 DreamZero / Helix / GR00T-Mimic、新 benchmark/dataset 如 MolmoSpaces / RoboArena 等）。判定标准：谷歌一搜有 Wikipedia 条目的，不解释。

## 绝对禁止

- 不能发 2 张及以上图片
- 图片失败不重试、不再发任何文字
- 不能省略 sleep 30
- 每条新闻不能只列关键词（每条要带背景或数据中至少 2 项）
- 不能解释已熟概念清单中的术语
- 不能发"段X已发""任务完成""已推送"等状态消息
- 不能完全照抄前一天内容（每日重新搜索去重）
- **不能把超过 14 天前的论文标记为"今日论文"或"最新"**
