---
name: cc-connect-daily-cron
description: 当用户要求定时(每天/每周)推送某主题新闻或资讯到微信时使用此 skill
trigger_keywords: ["定时", "每天", "推送", "cc-connect", "cron", "新闻", "微信"]
source: date=2026-05-14
extracted_at: 2026-05-14T16:53:10
---

# 用 cc-connect 创建每日定时新闻推送

## 适用场景

用户说"每天给我发 XX 新闻""定时推送 XX""每周一汇总 XX"这类需求时使用。底层是 cc-connect daemon(不是系统 crontab)。

## 步骤

1. 确认推送内容、时间、是否带图。默认时间用早 8:00,默认条数 3-5 条,默认中文摘要 + 来源链接。
2. 用 cc-connect cron 命令创建任务,cron 表达式示例:
   - 每天 8:00 → `0 8 * * *`
   - 每周一 9:00 → `0 9 * * 1`
3. prompt 模板:`搜索 <主题> 最近 24 小时的重要新闻(新品/合作/demo/财报等),按重要性排前 3-5 条中文摘要,附来源链接[,抓 1-3 张配图一起发]`
4. 创建完成后回复用户:
   - 任务 ID(便于后续删改)
   - 触发时间
   - 推送内容概要
   - 停用方式:`cc-connect cron del <id>`
   - 列出全部:`cc-connect cron list`
5. 如果用户后续要求改内容(如"加上图"),需要重新创建一条新任务并返回新 ID,旧 ID 可一并删掉或保留待用户确认。

## 关键路径

- 任务存储:`~/.cc-connect/crons/jobs.json`
- 日志查看:`tail -f ~/.cc-connect/logs/cc-connect.log`
- daemon 进程名:`cc-connect`
- 全局安装位置:`/home/a/miniforge3/lib/node_modules/cc-connect/bin/cc-connect`

## 注意

- 任务绑定 session_key(如 `weixin:dm:xxx@im.wechat`),会按当前会话通道推送
- daemon 在系统重启后需要重新拉起才能继续
- 触发时会启动新的 claude CLI 子进程,可通过 `--session-mode reuse` 复用会话上下文
- 微信通道支持图文,纯代码/命令行类回复不需要硬凑图片
