---
name: nvidia-daily-news-v3-1-silent-deep-archive
description: 每日通过 cc-send-safe 推送 NVIDIA 24 小时重要新闻：先写完整深度归档，再分头条快报+深度展开+1 张配图三段式推送，每段间隔 30s，全程静默不发状态消息，规避 ret=-2 节流
trigger_keywords: ["NVIDIA 每日新闻", "英伟达推送", "英伟达新闻推送", "英伟达新闻摘要", "nvidia daily", "nvidia daily news", "nvidia 新闻 cron", "NVIDIA 新闻", "每日 NVIDIA", "深度版新闻推送"]
source: date=2026-06-24
version: 3.2
updated_at: 2026-07-11T00:00:00
---

# NVIDIA 每日新闻深度推送 v3.1（静默+归档+双段+单图）

## 步骤

### Step 1: 搜索 + 撰写归档
1. 搜过去 24 小时 NVIDIA 重要新闻（新品/合作/技术/财报/股价/地缘），优先信源 nvidianews.nvidia.com、blogs.nvidia.com、Bloomberg、CNBC、Stocktitan、TechCrunch
2. 每条新闻做尽调式扩展（标准：让不熟悉该领域的人 30 秒掌握 why-it-matters）：
   - 公司/产品背景（1 句，如 "IREN 是澳洲挖矿转型 AI 算力的数据中心运营商"）
   - 技术细节：参数量、训练数据、benchmark、硬件平台（GB300/Rubin/Blackwell 等）
   - 数据/财务指标：合作金额、产能、目标价、股价反应
   - 业内意义：竞争对比（vs AMD/Broadcom/华为昇腾/SK 海力士等）、产业链位置
3. 完整深度版（全部细节+所有引用）写到 `/home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md`，归档不限字数

### Step 2: 准备两段推送文字
4. **第 1 段 头条快报（≤700 字符）**：开头 1 句「今日 NVIDIA 主线」+ 5 条要点。每条 = 标题 + 1 句关键数据 + 1 句「是什么/为什么」+ 1 句公司背景。末尾标注「(深度细节见第 2 段)」
5. **第 2 段 深度展开（≤700 字符）**：挑当日最具信息量的 1-2 个 item 做 deep dive，必带「公司是什么 / 技术怎么做（训练/数据/benchmark/推理细节其一）/ 具体数字 / 1 句业内对比」+ 末尾附 2-3 个权威源链接
6. 两段口语化，少并列符，少堆关键词，多用具体数字（x 倍、y 万、z 亿）

### Step 3: 准备 1 张配图
7. 抓当日最具代表性 1 张图（产品/CEO/发布会/新闻封面）下载到 `/tmp/nvidia_daily.jpg`
8. `file /tmp/nvidia_daily.jpg` 确认是图片；>100KB 用 `convert` 压到 ≤80KB JPEG
9. **只准备 1 张**，绝不多张（第 3 张必触发节流锁死）

### Step 4: 严格顺序发送（3 次推送，每次间隔 30s）
10. `cc-send-safe -m "<头条快报全文>"`
11. `sleep 30`
12. `cc-send-safe -m "<深度展开全文>"`
13. `sleep 30`
14. `cc-send-safe --image /tmp/nvidia_daily.jpg`（一次性，失败一次就放弃，绝不重试，失败也不发任何状态消息）

### Step 5: 静默收尾
15. 不发任何 reply 状态消息（无「已推送/任务完成/归档路径」）
16. 本地确认归档：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3`（仅 stdout，不发飞书/微信）

## 绝对禁止
- 2 张及以上图片
- 图片失败后重试图片（每次失败请求加深节流）
- 图片失败后再发任何文字（会触发节流升级）
- 省略 sleep 30（连发触发短窗口节流）
- 文字里只列关键词（每条至少带背景/数据/对比中的 2 项）
- 发「段X已发/任务完成/已推送…」等任何中间或收尾状态消息，只发实际新闻内容
