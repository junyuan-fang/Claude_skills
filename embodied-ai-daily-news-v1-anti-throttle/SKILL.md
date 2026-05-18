---
name: embodied-ai-daily-news-v1-anti-throttle
description: 通过 cc-connect 微信通道每日 12:00 推送具身智能（人形机器人/VLA/世界模型）新闻摘要，行业+论文混编，三段式结构，规避 ret=-2 节流锁死通道，且不解释用户已熟概念。
trigger_keywords: ["具身智能", "embodied", "人形机器人", "每日具身", "VLA 新闻", "机器人新闻"]
source: date=2026-05-18
version: 1
updated_at: 2026-05-19T03:30:36
---

# 每日具身智能新闻摘要 cron 推送 v1.1

## 适用场景

通过 cc-connect 每天 12:00 自动推送具身智能（行业 + 论文）摘要到微信，需要规避 cc-connect 的 ret=-2 节流锁死,同时尊重用户已熟概念库,不做重复解释。

## 步骤

### Step 1: 搜索 + 撰写归档
1. 搜过去 24 小时具身智能相关:
   - 行业:融资/量产/政策/合作/人事;信源 36氪、晚点、机器之心、量子位、TechCrunch、The Information
   - 中国端重点:宇树、智元、银河通用、星海图、星动纪元、UBTech、自变量
   - 美国端:Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus
   - 论文:arXiv cs.RO/cs.AI/cs.CV、HuggingFace daily papers、CoRL/RSS/ICRA/NeurIPS/ICLR
2. 每条做尽调式扩展:
   - 公司/产品背景必含(谁创立、估值、做什么)
   - 数字:融资金额、估值、产能、参数量、benchmark
   - 业内意义:国内 vs 美国节奏、技术路线之争
3. 完整深度版写入 `/home/xinmiao/code/claude_bot/news_archive/embodied-$(date +%Y-%m-%d).md`,不限字数

### Step 2: 准备两段推送文字
4. 第 1 段头条快报(≤800 字符):开头"今日具身智能主线" + 5-6 条要点(4-5 行业 + 1-2 论文),每条带【行业/论文】标签 + 数据 + 1 句公司背景,末尾标"(深度细节见第 2 段)"
5. 第 2 段深度展开(≤800 字符):挑 1-2 个 item deep dive,论文必带架构/数据/benchmark/对标 SOTA/落地性,末尾 2-3 个权威源链接
6. 口语化,用具体数字

### Step 3: 1 张配图
7. 下载到 `/tmp/embodied_daily.jpg`,`file` 确认,>100KB 用 convert 压到 ≤80KB JPEG
8. 只准备 1 张,绝不多张

### Step 4: 严格顺序发送(共 3 次,间隔 30s)
```bash
cc-send-safe -m "<头条快报全文>"
sleep 30
cc-send-safe -m "<深度展开全文>"
sleep 30
cc-send-safe --image /tmp/embodied_daily.jpg  # 失败一次即放弃,绝不重试
```

### Step 5: 静默收尾
- 不发任何 reply 状态消息
- 本地 `ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5` 确认

## 用户已熟概念库(严禁解释)

VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、humanoid、dexterous manipulation、locomotion。

判断标准:谷歌一搜有 Wikipedia 条目的概念,不要解释。只在出现新论文内部命名(DreamZero/Helix/GR00T-Mimic)、新 benchmark(MolmoSpaces/RoboArena)时 1 句带过。

公司业务背景仍要带:IREN 是谁、宇树估值、Figure 谁创立——这些不算"已熟"。

## 绝对禁止

- 发 2 张及以上图片(第 3 张必触发节流锁死)
- 图片失败后重试图片或再发任何文字(会触发节流升级)
- 省略 sleep 30(连发触发短窗口节流)
- 文字里只列关键词
- 解释用户已熟概念(VLA/WAM/Sim2Real 等)
- 发"段X已发""任务完成""已推送..."等状态消息
- 完全照抄前一天内容
