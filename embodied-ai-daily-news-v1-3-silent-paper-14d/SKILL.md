---
name: embodied-ai-daily-news-v1-3-silent-paper-14d
description: 每日推送具身智能行业+论文混编摘要，论文必须 14 天内（arXiv ID YYMM 粗筛 + abstract submission date 精校），跳过 VLA/WAM/Sim2Real 等用户已熟概念解释，三段式推送，全程静默
trigger_keywords: ["具身智能 每日", "embodied ai daily", "人形机器人 推送", "VLA 新闻"]
source: date=2026-06-24
version: 1
updated_at: 2026-06-25T03:30:57
---

# 具身智能每日新闻 v1.3（静默 + 已熟概念跳过 + 论文 14 天硬校验）

## 步骤

### Step 1: 搜索 + 撰写归档
1. 搜过去 24 小时：**行业**（融资/量产/政策/合作/人事）信源 36氪/晚点/IT之家/TechCrunch/The Information/雷锋网/机器之心/量子位/新智元；公司重点 宇树/智元/银河通用/星海图/星动纪元/Figure/1X/Apptronik/Agility/BD/Tesla Optimus/小鹏 IRON/Unitree/UBTech
2. **论文**：arXiv cs.RO/AI/CV + HuggingFace daily papers + CoRL/RSS/ICRA/NeurIPS/ICLR；主题 VLA/WAM/世界模型/Diffusion Policy/RL/Sim2Real/dexterous/locomotion/teleoperation
3. **【论文 14 天硬校验】**：arXiv ID 前 4 位 YYMM 粗筛 → 再用 `curl https://arxiv.org/abs/<id>` 读 `<meta name="citation_date">` 或页面 submission date 精校；HuggingFace daily papers 当周精选最优先；老论文必须标真实日期且只能放"延伸阅读"；搜不到 14 天内新论文宁可彻底不放论文项
4. 每条尽调式扩展：**公司背景必含**（谁创立/估值/做什么） + **概念解释 gating**：VLA/WAM/VLM/Sim2Real/Teleoperation/Diffusion Policy/Imitation Learning/RL/BC/Foundation Model/Whole-body Control/ZMP/MPC/CMA-ES/四足/humanoid/dexterous/locomotion 都**不解释**；只在真正小众术语（论文内部命名如 DreamZero/Helix/GR00T-Mimic、新 benchmark 名）才 1 句带过
5. 完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`
6. **每篇论文归档必须加一行 `- Project: <url>`**（项目主页 *.github.io/*.netlify.app/学校主页 > GitHub repo > demo 站；找不到写 `- Project: N/A`），下游 awesome-physical-ai 会 ingest 这一行

### Step 2: 两段推送文字
7. **第 1 段 头条快报 ≤800 字符**：开头"今日具身智能主线" + 5-6 条（4-5 行业 + 1-2 论文），每条【行业/论文】标题 + 数据 + 公司背景 1 句
8. **第 2 段 深度展开 ≤800 字符**：1-2 个 deep dive；论文 deep dive 必带「架构 / 训练数据 / benchmark / 对标 SOTA / 能否落地」各 1 句，**直接用术语不解释**
9. 末尾 2-3 个权威源链接

### Step 3-4: 1 张图 + 严格顺序推送（同 NVIDIA v3.1）
10. 抓 1 张代表图到 `/tmp/embodied_daily.jpg`，file 确认，>100KB 压到 ≤80KB
11. `cc-send-safe -m "<头条>"` → sleep 30 → `cc-send-safe -m "<深度>"` → sleep 30 → `cc-send-safe --image /tmp/embodied_daily.jpg`（失败不重试）

### Step 5: 静默收尾
12. 不发任何状态消息；`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5` 仅 stdout

## 绝对禁止
- 解释 VLA/WAM/Sim2Real/Teleoperation/Diffusion Policy/VLM/RL/Imitation Learning 等已熟概念
- 把 >14 天的论文标记为"今日/最新"
- 省略归档里的 `- Project:` 行
- 2 张图、图片失败重试、省略 sleep 30、发任何中间状态消息
- 照抄前一天内容
