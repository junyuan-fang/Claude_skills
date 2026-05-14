---
name: cc-connect-daily-news-cron
description: 用 cc-connect cron 创建每日定时新闻推送任务，指定主题、时间、配图要求
trigger_keywords: ["cc-connect cron", "定时新闻", "每日推送", "NVIDIA 日报"]
source: date=2026-05-14
version: 1
updated_at: 2026-05-15T03:31:42
---

# cc-connect 定时新闻推送（图文）

## 适用场景

用户要求每天定点收到某主题（NVIDIA、具身智能等）的新闻总结，希望图文并茂发到微信。

## 步骤

1. 创建 cron 任务，关键字段：
   - `cron_expr`：标准 cron 语法，如 `0 8 * * *`（每天 8:00）
   - `session_key`：绑定当前微信会话（cc-connect 自动注入）
   - `project`：`claude_bot`
   - `prompt`：包含三块——搜索范围（最近 24 小时）、主题关键词、输出要求（中文摘要 3-5 条 + 来源链接 + 1-3 张配图）
2. 发图统一走 `cc-send-safe` wrapper（避免 ret=-2 节流），prompt 里明确写：'用 cc-send-safe 发图'
3. 返回任务 ID 给用户，告知三个后续操作：
   - 改时间：直接说新时间
   - 停掉：`cc-connect cron del <id>`
   - 列表：`cc-connect cron list`
4. 任务存储位置：`~/.cc-connect/crons/jobs.json`
5. 日志位置：`~/.cc-connect/logs/cc-connect.log`

## 注意

- cc-connect 自带常驻 daemon 调度，不走系统 crontab
- 系统重启后 daemon 要重新拉起来定时才能继续
- 更新任务时会生成新 ID，旧 ID 自动失效
- 纯命令行/纯代码问题不强求配图，资讯/新闻/产品类要配图
