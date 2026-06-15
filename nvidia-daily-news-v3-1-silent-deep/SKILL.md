---
name: nvidia-daily-news-v3-1-silent-deep
description: 每日通过 cc-send-safe 推送 NVIDIA 24h 新闻，归档+头条快报+深度展开+1张配图四段式，全程静默不发中间状态消息，规避节流锁死
trigger_keywords: ["NVIDIA 每日新闻", "NVIDIA 深度推送", "nvidia daily news", "英伟达新闻推送"]
source: date=2026-06-15
version: 1
updated_at: 2026-06-16T03:30:37
---

# NVIDIA 每日新闻深度版 v3.1（静默推送）

## 步骤

### Step 1: 搜索 + 撰写归档
1. 搜 NVIDIA 最近 24h 重要新闻（新品/合作/技术/财报/股价/地缘），优先源：nvidianews.nvidia.com、blogs.nvidia.com、Bloomberg、CNBC、Stocktitan、TechCrunch。
2. 每条做尽调式扩展：公司/产品背景一句话 + 技术细节（参数/benchmark/平台）+ 数据/财务指标（金额/产能/目标价）+ 业内意义（vs AMD/Broadcom/华为昇腾等）。
3. 完整深度版写入 `/home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md`，越详细越好。

### Step 2: 准备两段推送文字
4. 第 1 段 — 头条快报（≤700 字符）：开头 1 句"今日 NVIDIA 主线" + 5 条要点（标题+关键数据+背景），末尾标注 "(深度细节见第 2 段)"。
5. 第 2 段 — 深度展开（≤700 字符）：挑 1-2 个最具信息量 item 做 deep dive，必带公司是什么/技术怎么做/数字/业内对比，末尾附 2-3 个权威源链接。
6. 两段都口语化，用具体数字（x 倍、y 万、z 亿），少堆并列符。

### Step 3: 准备 1 张配图
7. 抓最具代表性的 1 张图（产品图/CEO/发布会/封面），下载到 `/tmp/nvidia_daily.jpg`。
8. `file /tmp/nvidia_daily.jpg` 确认；>100KB 用 convert 压到 ≤80KB JPEG。
9. 只准备 1 张，绝不多张（第 3 张必触发节流锁死）。

### Step 4: 严格顺序发送（3 次推送，间隔 30s）
10. `cc-send-safe -m "<头条快报全文>"`
11. `sleep 30`
12. `cc-send-safe -m "<深度展开全文>"`
13. `sleep 30`
14. `cc-send-safe --image /tmp/nvidia_daily.jpg`（一次性，失败不重试，也不发任何状态消息）

### Step 5: 静默收尾
15. 不发任何 reply 状态消息（无 "已推送"/"任务完成"/"归档路径"）。
16. 本地确认归档：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3`（仅 stdout）。

## 绝对禁止
- 不能发 2 张及以上图片
- 图片失败后不能重试图片，也不能再发任何文字（会升级节流）
- 不能省略 sleep 30（连发触发短窗口节流）
- 文字不能只列关键词，每条至少带背景/数据/对比中 2 项
- 不能发任何中间/收尾状态消息（只发实际新闻内容）
