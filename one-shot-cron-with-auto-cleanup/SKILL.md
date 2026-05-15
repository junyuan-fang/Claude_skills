---
name: one-shot-cron-with-auto-cleanup
description: 需要让 cron 在某个具体日期/时刻只跑一次，跑完自动删除任务，避免明年同日重复触发
trigger_keywords: ["一次性 cron", "临时定时", "跑完删掉", "今天 X 点再发一次", "one-shot schedule"]
source: date=2026-05-15
version: 1
updated_at: 2026-05-16T03:31:22
---

# 一次性 cron 任务 + 自动清理监听

## 适用场景

用户说"今天 10 点再给我跑一次 XXX"——需要立即创建一个只触发一次的 cron，跑完后必须清理掉，否则明年同月同日会再触发。

## 步骤

1. 用"年内唯一一次"的 cron 表达式创建任务，例如今天 5/15 10:00：
   ```
   0 10 15 5 *
   ```
   记下返回的任务 ID（如 `29ad5c50`）。
2. 后台起一个监听循环（run_in_background），轮询 cron 日志：
   ```bash
   until grep -q "cron: job completed id=<TASK_ID>" <log>; do sleep 30; done
   cc-connect cron del <TASK_ID>
   ```
3. 监听器加 30 分钟超时兜底，万一 cron 没跑成功不会永远挂着。
4. 监听器完成后，把删除结果回报给用户。

## 注意

- 不要用 `* * * * *` 之类宽匹配再靠监听删——任务可能在监听器起来前已经触发多次。
- 日志匹配字符串要用任务 ID 兜底，避免误匹配其他 job 的 completed 行。
