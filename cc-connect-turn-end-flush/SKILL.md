---
name: cc-connect-turn-end-flush
description: 理解 cc-connect 的 session 队列机制:同一 turn 内调用 cc-connect send 的消息会被 queued,turn 结束后才统一推送;用于调试'发了但用户没收到'类问题
trigger_keywords: ["cc-connect send", "turn 结束", "session 队列", "图片没收到", "daemon flush"]
source: date=2026-05-16
version: 1
updated_at: 2026-05-17T03:31:11
---

# cc-connect 图片推送依赖 turn 结束才 flush

## 核心机制

- cc-connect 一个 session 一次只处理一个 turn。
- turn 内调 `cc-connect send` 的消息(尤其 attachment)会被加入队列。
- 当前 turn 结束后,daemon 才统一推送:先推 attachment,再推最终 reply。

## 调试建议

1. 不要在同一 turn 内多次调 send 然后等待——它不会立刻推。
2. 想测试图片是否真送达,把 send 命令调完后**立刻结束 turn**,让 daemon flush。
3. 用户在下一 turn 反馈收到情况:
   - 文字+图都收到 → 通道健康
   - 只收到文字 → 通道对文字 OK 对图片仍敏感
   - 都没收到 → throttle 仍存在,需 token reset
4. 想验证真实送达必须读 daemon 日志,不能只看 cc-send-safe 退出码。

## 注意

- 这是 cc-connect 的设计行为,不是 bug。
- cron 任务中的 reply 也走同样队列,所以不能依赖 cron 内重试逻辑判断送达。
