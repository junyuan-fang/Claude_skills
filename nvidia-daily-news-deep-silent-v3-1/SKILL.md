---
name: nvidia-daily-news-deep-silent-v3-1
description: 每日通过 cc-send-safe 推送 NVIDIA 24h 重要新闻，归档深度版+头条快报+深度展开+1张配图四段式，全程静默不发任何中间/收尾状态消息，规避 ret=-2 节流
trigger_keywords: ["NVIDIA 每日新闻", "英伟达新闻推送", "英伟达新闻摘要", "nvidia daily news", "nvidia daily", "NVIDIA 24h", "NVIDIA 新闻", "每日 NVIDIA", "深度版新闻", "静默推送 NVIDIA", "nvidia 深度版"]
source: date=2026-06-30
version: 3.2
updated_at: 2026-07-14T00:00:00
---

# NVIDIA 每日新闻深度版静默推送 v3.1

## 目标

让用户对每条消息都有具体理解（公司背景+技术细节+数字+对比），而不是只看到关键词堆砌。四段式产出（归档深度版+头条快报+深度展开+1 张配图），全程静默，只发实际新闻内容。

## Step 1: 搜索 + 撰写归档

1. 搜 NVIDIA 最近 24 小时重要新闻（新品/合作/技术/财报/股价/地缘），优先源：nvidianews.nvidia.com、blogs.nvidia.com、Bloomberg、CNBC、Stocktitan、TechCrunch。
2. 每条新闻做尽调式扩展（标准：让不熟该领域的人 30 秒掌握 why-it-matters）：
   - 公司/产品背景：例如 "IREN 是澳洲挖矿转型 AI 算力的数据中心运营商"、"Corning 光纤玻璃供应商"、"GR00T 是 NVIDIA 通用人形机器人基础模型系列"
   - 技术细节：模型参数量、训练数据规模、benchmark、推理延迟、对标 SOTA；硬件平台（GB300/Rubin/Blackwell/DGX Spark）；网络与光互连规格
   - 数据/财务指标：合作金额、产能（GW/产线/倍数）、新增岗位、ROI、目标价升降幅度、股价反应
   - 业内意义：竞争对比（vs AMD/Broadcom/华为昇腾/SK 海力士）、产业链位置
3. 完整深度版（全部细节+引用）写到 `/home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md`，归档不限字数，越详细越好。

## Step 2: 准备两段推送文字

4. 第 1 段 — 头条快报（≤700 字符）：
   - 开头 1 句 "今日 NVIDIA 主线"，然后 5 条要点
   - 每条：标题 + 1 句关键数据 + 1 句 "是什么/为什么"（含公司或产品 1 句背景）
   - 末尾标注 "(深度细节见第 2 段)"
5. 第 2 段 — 深度展开（≤700 字符）：
   - 挑当日最具信息量的 1-2 个 item 做 deep dive
   - 必带：公司是什么 / 技术怎么做 / 数字（金额、产能、参数、目标价）/ 一句业内对比
   - 末尾附 2-3 个最权威源链接
6. 两段都要口语化，少用并列符堆词，多用 "x 倍、y 万、z 亿" 具体数字。

## Step 3: 准备 1 张配图

7. 从今日新闻抓最具代表性的 1 张图（产品图、CEO 照、发布会、新闻封面），下载到 `/tmp/nvidia_daily.jpg`。
8. `file /tmp/nvidia_daily.jpg` 确认是图片；如 >100KB 用 `convert` 压到 ≤80KB JPEG。
9. 只准备 1 张，绝不多张（第 3 张必触发节流锁死）。

## Step 4: 严格顺序发送（3 次推送，每次间隔 30s）

10. `cc-send-safe -m "<头条快报全文>"`
11. `sleep 30`
12. `cc-send-safe -m "<深度展开全文>"`
13. `sleep 30`
14. `cc-send-safe --image /tmp/nvidia_daily.jpg` — 一次性，失败一次就放弃，绝不重试；图片失败也不发任何状态消息。

## Step 5: 静默收尾

15. 不发任何 reply 状态消息（不发 "已推送..."、不发 "任务完成"、不发归档路径）。
16. 本地仅 stdout 确认归档：`ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3`，不推送。

## 绝对禁止

- 不能发 2 张及以上图片
- 不能在图片失败后重试图片
- 不能在图片失败后再发任何文字（会触发节流升级）
- 不能省略 sleep 30（连发触发短窗口节流）
- 不能在文字里只列关键词（每条必须带 背景/数据/对比 中至少 2 项）
- 不能发 "段 X 已发"、"任务完成"、"已推送..." 等任何中间/收尾状态消息，用户只想看实际新闻内容
