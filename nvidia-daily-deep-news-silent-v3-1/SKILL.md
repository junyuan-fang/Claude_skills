---
name: nvidia-daily-deep-news-silent-v3-1
description: 每日搜索 NVIDIA 24 小时重要新闻，写完整深度归档后按头条快报+深度展开+1 张配图三段式经 cc-send-safe 推送，全程静默不发任何中间/收尾状态消息，规避 ret=-2 节流
trigger_keywords: ["NVIDIA 新闻", "每日 NVIDIA", "英伟达日报", "nvidia daily", "深度新闻推送"]
source: date=2026-07-23
version: 1
updated_at: 2026-07-24T03:30:26
---

# NVIDIA 每日深度新闻推送（v3.1 静默版）

## 步骤

### Step 1: 搜索 + 撰写归档
1. 搜索 NVIDIA 最近 24 小时重要新闻（新品/合作/技术/财报/股价/地缘），优先来源：nvidianews.nvidia.com、blogs.nvidia.com、Bloomberg、CNBC、Stocktitan、TechCrunch。
2. 每条新闻做尽调式扩展（标准：让不熟悉该领域的人 30 秒掌握 why-it-matters），必须覆盖：
   - 公司/产品背景（1 句话介绍是谁/做什么/市值规模）
   - 技术细节（参数量、训练数据、benchmark、硬件平台如 GB300/Rubin/Blackwell、网络光互连规格）
   - 数据/财务指标（合作金额、产能 GW/倍数、目标价变动、股价反应）
   - 业内意义（vs AMD/Broadcom/华为昇腾/SK 海力士等竞争对比、产业链位置）
3. 完整深度版（全部细节+引用）写入 `/home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md`，不限字数。

### Step 2: 准备两段推送文字
4. 第 1 段 — 头条快报（≤700 字符）：开头 1 句“今日 NVIDIA 主线”，5 条要点，每条 = 标题 + 1 句关键数据 + 1 句“是什么/为什么”（含公司/产品 1 句背景），末尾标注“(深度细节见第 2 段)”。
5. 第 2 段 — 深度展开（≤700 字符）：挑最具信息量的 1-2 个 item deep dive，必带公司背景/技术做法/具体数字/一句业内对比，末尾附 2-3 个权威源链接。
6. 两段口语化，少堆并列关键词，多用“x 倍、y 万、z 亿”具体数字。

### Step 3: 准备 1 张配图
7. 抓当日最具代表性的 1 张图（产品图/CEO 照/发布会/新闻封面）下载到 `/tmp/nvidia_daily.jpg`。
8. `file /tmp/nvidia_daily.jpg` 确认是图片；>100KB 时用 convert 压到 ≤80KB JPEG。
9. 只准备 1 张，绝不多张（第 3 张必触发节流锁死）。

### Step 4: 严格顺序发送（3 次推送，每次间隔 30s）
10. `cc-send-safe -m "<头条快报全文>"`
11. `sleep 30`
12. `cc-send-safe -m "<深度展开全文>"`
13. `sleep 30`
14. `cc-send-safe --image /tmp/nvidia_daily.jpg`（一次性尝试，失败即放弃，绝不重试；失败也不发任何状态消息）。

### Step 5: 静默收尾
15. 不发任何状态消息（不发“已推送”“任务完成”、不发归档路径）。
16. 本地确认归档：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3`（仅 stdout 日志）。

## 注意

绝对禁止：
- 发 2 张及以上图片
- 图片失败后重试图片，或失败后再发任何文字（会触发节流升级）
- 省略 sleep 30（连发触发短窗口节流）
- 文字里只列关键词（每条必须带背景/数据/对比中至少 2 项）
- 发“段X已发”“任务完成”“已推送...”等任何中间/收尾状态消息（只发实际新闻内容）
