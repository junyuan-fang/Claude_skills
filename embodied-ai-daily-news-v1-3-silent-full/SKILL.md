---
name: embodied-ai-daily-news-v1-3-silent-full
description: 每日推送具身智能行业+论文混编摘要：三段式静默推送，论文必须 14 天内（HF daily 优先 + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校），跳过用户已熟概念解释，归档每篇论文必带 Project 行供 awesome-physical-ai ingest
trigger_keywords: ["具身智能新闻", "embodied AI daily", "人形机器人日报", "具身日报"]
source: date=2026-07-24
version: 1
updated_at: 2026-07-25T03:32:15
---

# 具身智能每日新闻静默推送 (v1.3：14 天论文硬校验 + Project URL)

## 步骤

1. **搜索**：过去 24h 具身智能（embodied AI/人形机器人/VLA/世界模型）内容：行业（融资/量产/政策/合作/人事，信源 36氪、晚点、机器之心、量子位、TechCrunch 等；重点公司宇树、智元、银河通用、Figure、1X、Tesla Optimus 等）+ 论文（arXiv cs.RO/cs.AI/cs.CV、HuggingFace daily papers、CoRL/RSS/ICRA）。
2. **论文 14 天硬校验**：a) HuggingFace daily papers 当周精选最优先；b) `curl https://arxiv.org/abs/<id>` 抓 `citation_date`/submission date 精校；c) arXiv ID 前 4 位 YYMM 仅粗筛。超 14 天论文须标注真实日期且只能进归档"延伸阅读"；搜不到 14 天内新论文就宁可只放 4-5 条行业、彻底放弃论文项，绝不把老论文包装成"今日新发"。
3. **尽调式扩展**：每条含公司背景 + 数字（融资/估值/参数量/benchmark）+ 业内意义。概念解释严格 gating：VLA/WAM/VLM/Sim2Real/Teleoperation/Diffusion Policy/RL/Imitation Learning/humanoid/dexterous manipulation 等已熟概念**不解释**；只对真正新生小众术语（新 method/dataset/代号名）1 句带过。谷歌一搜有 Wikipedia 条目的概念不解释。
4. **归档**：完整深度版写入 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`。**每篇论文来源行之后必加一行 `- Project: <url>`**（项目主页 > GitHub repo > demo 站，找不到写 `- Project: N/A`，绝不省略——下游 awesome-physical-ai 自动 ingest 依赖此行）。
5. **第 1 段头条快报（≤800 字符）**：1 句今日主线 + 5-6 条要点（4-5 行业 + 1-2 论文），格式【行业/论文】标题 + 1 句数据 + 1 句是什么/为什么，末尾标 "(深度细节见第 2 段)"。
6. **第 2 段深度展开（≤800 字符）**：1-2 个 item deep dive（论文版：架构/训练数据/benchmark/对标 SOTA/落地各 1 句，直接用术语），末尾 2-3 个权威源链接。
7. **配图**：1 张代表图到 `/tmp/embodied_daily.jpg`，>100KB 压到 ≤80KB JPEG，只准备 1 张。
8. **顺序发送**：`cc-send-safe -m "<第1段>"` → `sleep 30` → `cc-send-safe -m "<第2段>"` → `sleep 30` → `cc-send-safe --image /tmp/embodied_daily.jpg`（失败绝不重试、不发状态消息）。
9. **静默收尾**：不发任何状态消息，仅本地 `ls -la .../news_archive/ | tail -5` 确认。

## 注意

- 绝不发 2 张及以上图片；图片失败后不重试也不再发文字
- 不能省略 sleep 30
- 不能解释用户已熟概念
- 不能照抄前一天内容，每日重新搜索去重
- 不能把超 14 天前的论文标为"今日论文"
