---
name: embodied-ai-daily-news-v1-3-silent-paper-14d
description: 每日 12:00 通过 cc-send-safe 推送具身智能行业+论文混编摘要，论文必须 14 天内（HuggingFace daily 优先 + arXiv ID YYMM 粗筛 + abstract submission date 精校），跳过 VLA/WAM/Sim2Real 等用户已熟概念解释，三段式全程静默
trigger_keywords: ["具身智能 每日", "具身智能新闻", "embodied ai daily", "人形机器人 推送", "人形机器人日报", "VLA 新闻", "VLA 每日", "机器人新闻推送"]
source: date=2026-06-24
version: 2.1
updated_at: 2026-07-03T00:00:00
---

# 具身智能每日新闻 v1.3（静默 + 已熟概念跳过 + 论文 14 天硬校验）

每日 12:00 通过 cc-send-safe 推送具身智能行业+论文混编摘要，三段式（头条快报 + 深度展开 + 1 张配图），全程静默不发中间状态消息。

## 步骤

### Step 1: 搜索 + 撰写归档

1. 搜过去 24 小时具身智能相关：
   - **行业**（融资/量产/政策/合作/人事）：36氪、晚点、IT之家、TechCrunch、The Information、雷锋网、机器之心、量子位、新智元
   - **公司重点**：宇树、智元、银河通用、星海图、星动纪元、星尘智能、自变量、Figure、1X、Apptronik、Agility、BD、Tesla Optimus、小鹏 IRON、Unitree、UBTech
   - **论文**：arXiv cs.RO/cs.AI/cs.CV + HuggingFace daily papers + CoRL/RSS/ICRA/NeurIPS/ICLR；主题 VLA/WAM/世界模型/Diffusion Policy/RL/Sim2Real/dexterous/locomotion/teleoperation

### 【论文日期硬校验 — 14 天窗口】

- arXiv ID 前 4 位 = YYMM 粗筛，**不能替代真实校验**
- 精校顺序：
  1. HuggingFace daily papers 当周精选（最优先，天然 curated）
  2. arXiv abstract 页 `[Submitted on YYYY-MM-DD]` / `<meta name="citation_date">`（可用 `curl https://arxiv.org/abs/<id>` 抓取）
- 超过 14 天的论文必须在标题旁标注真实日期，且只能放归档的"延伸阅读"
- **搜不到 14 天内新论文，宁可彻底放弃论文项，只放 4-5 条行业**
- 绝不把老论文包装成"今日新发"或"最新"

### 每条尽调式扩展

2. 必含：
   - **公司/产品背景**（公司是谁、谁创立、估值/规模、做什么）
   - **数字**（融资、估值、产能、出货、参数量、训练小时数）
   - **业内意义**（国内 vs 美国节奏、路线之争）

3. **概念解释严格 gating**：
   - 用户已熟，**不解释**：VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning (BC)、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、humanoid、dexterous manipulation、locomotion
   - 只在真正新生/学术冷门术语出现时 1 句带过（如新论文内部命名 DreamZero/Helix/GR00T-Mimic、新 benchmark 名 MolmoSpaces/RoboArena）
   - 标准：谷歌一搜有 Wikipedia 条目的，不解释

4. 完整深度版归档到 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`

5. **每篇论文归档必须额外一行 `- Project: <url>`**（项目主页 *.github.io/*.netlify.app/学校主页 > GitHub repo > demo 站；找不到写 `- Project: N/A`，绝不省略）；下游 awesome-physical-ai 自动 ingest 抽取这一行

### Step 2: 两段推送文字

6. **第 1 段 头条快报 ≤800 字符**：开头 1 句"今日具身智能主线" + 5-6 条（4-5 行业 + 1-2 论文），每条【行业/论文】前缀 + 标题 + 数据 + 公司背景 1 句，末尾"(深度细节见第 2 段)"

7. **第 2 段 深度展开 ≤800 字符**：1-2 个 item deep dive；论文 deep dive 必带「架构 / 训练数据 / benchmark / 对标 SOTA / 能否落地」各 1 句，**直接用术语不重复解释**

8. 末尾 2-3 个权威源链接

### Step 3: 1 张配图

9. 抓 1 张最具代表性图到 `/tmp/embodied_daily.jpg`，`file` 命令校验格式，>100KB 用 `convert` 压到 ≤80KB

### Step 4: 严格顺序发送（每次间隔 30s）

10. `cc-send-safe -m "<头条快报>"` → `sleep 30` → `cc-send-safe -m "<深度展开>"` → `sleep 30` → `cc-send-safe --image /tmp/embodied_daily.jpg`（失败不重试）

### Step 5: 静默收尾

11. 不发任何状态消息
12. 本地 `ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5`（仅 stdout，不推送）

## 绝对禁止

- 解释 VLA/WAM/Sim2Real/Teleoperation/Diffusion Policy/VLM/RL/Imitation Learning/BC/Foundation Model 等用户已熟概念
- 把超过 14 天前的论文标记为"今日/最新/今日新发"
- 省略归档里每篇论文的 `- Project:` 行
- 发 2 张及以上图片
- 图片失败后重试或再发任何文字
- 省略 sleep 30
- 发任何中间/收尾状态消息
- 照抄前一天内容
