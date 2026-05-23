---
name: nvidia-daily-news-deep-v3-silent
description: 每日通过 cc-send-safe 推送 NVIDIA 24h 重要新闻，归档+头条快报+深度展开+1张配图四段式，规避节流且全程静默不发状态消息
trigger_keywords: ["NVIDIA 每日新闻", "英伟达每日推送", "nvidia daily", "英伟达推送", "nvidia cron", "nvidia 深度版", "NVIDIA 静默推送"]
source: date=2026-05-20
version: 2.1
updated_at: 2026-05-24T00:00:00
---

# NVIDIA 每日新闻深度推送 v3.1（静默无中间态）

## 步骤

### Step 1: 搜索 + 归档
1. 搜 NVIDIA 最近 24h 重要新闻（新品/合作/技术/财报/股价/地缘），优先 nvidianews.nvidia.com、blogs.nvidia.com、Bloomberg、CNBC、Stocktitan、TechCrunch
2. 每条做尽调式扩展：
   - 公司/产品背景（一句话什么公司什么产品）
   - 技术细节（参数/benchmark/硬件平台）
   - 数据/财务（金额/产能/参数量/目标价）
   - 业内意义（vs AMD/Broadcom/华为）
3. 完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md`，不限字数，越详细越好

### Step 2: 准备两段推送（各 ≤700 字符）
4. **第 1 段头条快报**：开头 1 句"今日 NVIDIA 主线" + 5 条要点。每条 = 标题 + 关键数据 + "是什么/为什么"（含公司或产品 1 句背景）。末尾标 "(深度细节见第 2 段)"
5. **第 2 段深度展开**：挑当日 1-2 个最具信息量的 item 做 deep dive。必带：公司是什么 / 技术怎么做 / 数字（金额、产能、参数量、目标价）/ 业内对比。末尾附 2-3 个权威源链接
6. 口语化，多用具体数字（x 倍/y 万/z 亿），少用并列符堆词

### Step 3: 配图（只 1 张）
7. 从今日新闻抓最具代表性 1 张图（产品/CEO/发布会/封面）下载到 `/tmp/nvidia_daily.jpg`
8. `file /tmp/nvidia_daily.jpg` 确认是图片；>100KB 用 `convert` 压到 ≤80KB JPEG
9. **绝不准备多张**（第 3 张必触发节流锁死）

### Step 4: 严格顺序发送（3 次推送，每次间隔 30s）
10. `cc-send-safe -m "<头条快报全文>"`
11. `sleep 30`
12. `cc-send-safe -m "<深度展开全文>"`
13. `sleep 30`
14. `cc-send-safe --image /tmp/nvidia_daily.jpg`（失败一次即放弃，绝不重试）

### Step 5: 静默收尾
15. 不发任何 "已推送/任务完成/段X已发" 状态消息
16. 本地确认归档：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3`（仅 stdout）

## 绝对禁止
- 不能发 ≥2 张图片（第 3 张必触发节流锁死）
- 图片失败后不能重试图片，也不能再发任何文字（会触发节流升级）
- 不能省略 sleep 30
- 文字里不能只列关键词，每条至少带背景/数据/对比中 2 项
- 不能发任何中间或收尾状态消息（用户只想看新闻本身）
