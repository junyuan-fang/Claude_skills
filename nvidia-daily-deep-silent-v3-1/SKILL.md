---
name: nvidia-daily-deep-silent-v3-1
description: 每日推送 NVIDIA 24h 重要新闻：归档深度版 + 头条快报 + 深度展开 + 1 张配图四段式，全程静默不发任何中间/收尾状态消息，规避节流锁死
trigger_keywords: ["NVIDIA 新闻", "英伟达 每日", "nvidia daily", "深度新闻 静默", "NVIDIA 推送"]
source: date=2026-06-25
version: 1
updated_at: 2026-06-26T03:30:36
---

# NVIDIA 每日深度新闻静默推送 v3.1

## 步骤

### Step 1: 搜索 + 撰写完整归档
1. 搜 NVIDIA 最近 24h 重要新闻（新品/合作/技术/财报/股价/地缘），优先源：nvidianews.nvidia.com、blogs.nvidia.com、Bloomberg、CNBC、Stocktitan、TechCrunch。
2. 每条做尽调式扩展（标准：让不熟领域的人 30s 掌握 why-it-matters）：
   - 公司/产品背景：1 句说清楚是谁、做什么、市值/位置
   - 技术细节：参数量、训练数据、benchmark、推理延迟、硬件平台（GB300/Rubin/Blackwell/DGX Spark）、光互连规格
   - 数据/财务：合作金额、产能（GW/产线/倍数）、岗位、ROI、目标价、股价反应
   - 业内意义：vs AMD/Broadcom/华为昇腾/SK 海力士，产业链位置
3. 完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md`，不限字数，越详细越好。

### Step 2: 准备两段推送文字
4. **第 1 段 — 头条快报 (≤700 字符)**：
   - 开头 1 句"今日 NVIDIA 主线"
   - 5 条要点：标题 + 1 句关键数据 + 1 句"是什么/为什么"（含 1 句公司/产品背景）
   - 末尾标注 "(深度细节见第 2 段)"
5. **第 2 段 — 深度展开 (≤700 字符)**：
   - 挑 1-2 个最具信息量 item 做 deep dive
   - 必带：公司是什么 / 技术怎么做 / 数字（金额、产能、参数量、目标价）/ 一句业内对比
   - 附 2-3 个权威源链接
6. 两段都口语化，少用并列符，多用"x 倍、y 万、z 亿"具体数字。

### Step 3: 准备 1 张配图
7. 抓最具代表性 1 张图 → `/tmp/nvidia_daily.jpg`
8. `file /tmp/nvidia_daily.jpg` 确认是图片；>100KB 用 convert 压到 ≤80KB JPEG
9. **只准备 1 张**（第 3 张必触发节流锁死）

### Step 4: 严格顺序推送（共 3 次，每次间隔 30s）
10. `cc-send-safe -m "<头条快报全文>"`
11. `sleep 30`
12. `cc-send-safe -m "<深度展开全文>"`
13. `sleep 30`
14. `cc-send-safe --image /tmp/nvidia_daily.jpg`（失败一次即放弃，绝不重试）

### Step 5: 静默收尾
15. **不发任何状态消息**（不发"已推送…"、"任务完成"、归档路径）
16. 本地确认：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3`（仅 stdout，不发飞书）

## 绝对禁止

- 不能发 ≥2 张图片
- 图片失败后不能重试图片
- 图片失败后不能再发任何文字（会升级节流）
- 不能省略 sleep 30
- 文字不能只列关键词（每条至少含 背景/数据/对比 中的 2 项）
- 不能发"段 X 已发"、"任务完成"、"已推送…"等任何中间/收尾状态消息
