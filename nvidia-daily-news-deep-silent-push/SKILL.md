---
name: nvidia-daily-news-deep-silent-push
title: NVIDIA 每日新闻深度版静默推送 (v3.1)
description: 每日抓取 NVIDIA 近 24 小时新闻，写完整深度归档，再经 cc-send-safe 按「头条快报 + 深度展开 + 1 张配图」三段式静默推送微信/飞书，规避通道 ret=-2 节流锁死。
trigger_keywords: ["NVIDIA 新闻", "英伟达每日推送", "nvidia daily news", "深度版新闻摘要", "深度版推送", "深度版 v3.1", "cc-send-safe", "news_archive", "新闻归档"]
source: date=2026-08-14
version: 3
updated_at: 2026-08-25T00:00:00
---

# NVIDIA 每日新闻深度版静默推送 (v3.1)

## 适用场景 / 目标

每日（通常由 cron 触发）推送 NVIDIA 新闻摘要到 cc-connect 微信通道。目标是让用户对每条消息都有具体理解（背景 / 数据 / 对比），而不是只看到关键词堆砌；且全程**不发任何中间态/收尾状态消息**，只发实际内容。

## 步骤

### Step 1: 搜索 + 撰写归档

1. 搜 NVIDIA 最近 24 小时重要新闻（新品 / 合作 / 技术 / 财报 / 股价 / 地缘）。优先信源：`nvidianews.nvidia.com`、`blogs.nvidia.com`、Bloomberg、CNBC、Stocktitan、TechCrunch。
2. 每条新闻做**尽调式扩展**，标准是让不熟该领域的人 30 秒掌握 why-it-matters，以下四类信息每条至少覆盖 2 项：
   - **公司/产品背景**：如「IREN 是澳洲挖矿转型 AI 算力的数据中心运营商，市值约 X」「Corning 即康宁，主营特种玻璃和光纤」「GR00T 是 NVIDIA 通用人形机器人基础模型系列」。
   - **技术细节**：模型参数量、训练数据规模/来源、benchmark 数字、推理延迟、对标 SOTA；硬件平台（GB300 / Rubin / Blackwell / DGX Spark）；网络与光互连规格。
   - **数据/财务**：合作金额、产能（GW / 产线 / 倍数）、新增岗位、ROI、目标价升降幅度、股价反应。
   - **业内意义**：vs AMD / Broadcom / 华为昇腾 / SK 海力士的竞争对比、产业链位置、为什么是关键信号。
3. 把**完整深度版**（全部细节 + 所有引用）写入：
   ```bash
   /home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md
   ```
   归档不限字数，越详细越好。

### Step 2: 准备两段推送文字

4. **第 1 段 — 头条快报（≤700 字符）**
   - 开头 1 句「今日 NVIDIA 主线」，然后 5 条要点。
   - 每条：标题 + 1 句关键数据 + 1 句「是什么/为什么」（含公司或产品 1 句背景）。
   - 末尾标注「(深度细节见第 2 段)」。
5. **第 2 段 — 深度展开（≤700 字符）**
   - 挑当日最具信息量的 1-2 个 item 做 deep dive。
   - 必带：公司是什么 / 技术怎么做（训练方式、数据、benchmark 或推理细节其一）/ 数字（金额、产能、参数量、目标价）/ 一句业内对比。
   - 末尾附 2-3 个最权威源链接（nvidianews / 官方 blog / CNBC）。
6. 两段都口语化，少用并列符堆词，多用「x 倍、y 万、z 亿」具体数字。

### Step 3: 准备 1 张配图

7. 从今日新闻抓最具代表性的 1 张图（产品图 / CEO 照 / 发布会 / 新闻封面），下载到 `/tmp/nvidia_daily.jpg`。
8. `file /tmp/nvidia_daily.jpg` 确认是图片；若 >100KB 用 `convert` 压到 ≤80KB JPEG。
9. **只准备 1 张**，绝不多张——第 3 次图片推送必触发节流锁死。

### Step 4: 严格顺序发送（共 3 次推送，每次间隔 30s）

```bash
cc-send-safe -m "<头条快报全文>"
sleep 30
cc-send-safe -m "<深度展开全文>"
sleep 30
cc-send-safe --image /tmp/nvidia_daily.jpg   # 一次性，失败即放弃
```

图片失败**绝不重试**（每次失败请求加深节流），也**不发任何状态消息**（用户能从内容缺失自己判断）。

### Step 5: 静默收尾

10. **不发任何 reply 状态消息**（不发「已推送…」「任务完成」「归档路径」）。用户只想看实际新闻内容，状态信息都是噪音。
11. 本地确认归档（仅 stdout 日志，不推送）：
    ```bash
    ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3
    ```

## 绝对禁止

- 发 2 张及以上图片
- 图片失败后重试图片
- 图片失败后再发任何文字（会触发节流升级）
- 省略 `sleep 30`（连发触发短窗口节流）
- 文字里只列关键词（每条至少带背景/数据/对比中的 2 项）
- 发「段X已发」「任务完成」「已推送…」等任何中间/收尾状态消息
