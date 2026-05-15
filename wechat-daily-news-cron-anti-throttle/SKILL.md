---
name: wechat-daily-news-cron-anti-throttle
description: 通过 cc-connect cron 每天定时推送某主题新闻摘要到微信时使用，规避 ret=-2 节流导致整条消息被丢的问题
trigger_keywords: ["每日新闻", "定时新闻", "NVIDIA 新闻摘要", "cron 推送", "图文并茂定时", "ret=-2", "cc-send-safe"]
source: date=2026-05-15
version: 1
updated_at: 2026-05-16T03:31:22
---

# 每日新闻 cron 防节流推送（cc-send-safe + 归档）

## 适用场景

用户要求每天定时把某主题（如 NVIDIA）24 小时新闻整理后推送到微信。直接靠 cc-connect 自动回复长内容会被 ret=-2 节流丢弃，整条摘要消失。

## 步骤

1. 搜索过去 24 小时该主题重要新闻（官方 newsroom、Bloomberg、CNBC、Reuters 优先），按重要性挑 3-5 条。
2. 中文整理：每条 1-2 句核心要点 + 简短说明，末尾附来源链接。**摘要正文严格控制在 1500 字符以内**（微信单 chunk 过长会被节流）。
3. 完整版（更多细节、不限字数）写到归档：
   ```bash
   DATE=$(date +%Y-%m-%d)
   /home/xinmiao/code/claude_bot/news_archive/<topic>-${DATE}.md
   ```
4. **不要在 cron 里发图**（实测连发图会触发 ret=-2，连带把文字摘要也丢掉）。如果非要图文并茂，用两阶段策略：
   - 先发文字摘要（≤1200 字符）
   - sleep 30s
   - 再尝试发 1 张 <80KB 的小图，失败立刻放弃，不重试
5. 发送走 wrapper，不靠 cc-connect 自动回复：
   ```bash
   cc-send-safe -m "<摘要全文>"
   # 或长内容
   echo "<摘要全文>" | cc-send-safe --stdin
   ```
   wrapper 自带 2.5s 间隔 + ret=-2 时 8/20/45s 退避重试。
6. 同时给 cc-connect reply 一句简短状态（如"已推送 XXX 摘要到微信"），**不要把摘要正文也 reply**，避免重复。
7. 跑完确认归档：
   ```bash
   ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3
   ```

## 注意

- 当天没重大新闻就简要说明，不要硬凑。
- 出现整条被丢的迹象（cron 日志里只有 `platform send failed content_len=XXXX` + `cron: job completed` 没有发送成功记录）= ret=-2 节流，需要等通道自然恢复或重置 weixin session。
