---
name: cc-send-safe-anti-throttle-protocol
title: cc-send-safe 微信推送防节流协议
description: 通过 cc-connect / cc-send-safe 向微信连发多条消息或图片时，用于避免 ret=-2 节流锁死通道的固定发送节奏与禁忌。
trigger_keywords: ["cc-send-safe", "cc-connect", "ret=-2", "节流", "微信推送 节流", "请稍后再试", "推送锁死", "微信推送", "发图片失败"]
source: date=2026-08-12
version: 3
updated_at: 2026-08-18T00:00:00
---

# cc-send-safe 微信推送防节流发送协议

## 适用场景

任何一次任务里需要经 `cc-send-safe` 向微信通道连续发送 **多条文字或图片** 时（日报、摘要、批量结果推送）。

cc-connect 微信通道对短窗口内连发极敏感，触发 ret=-2 后会锁死通道，且 **每次失败请求都会加深节流**。

## 固定发送节奏

1. 单次任务最多 3 次推送：文字 → 文字 → 图片（2 段文字 + 1 张图片）。
2. 每两次推送之间 **必须 `sleep 30`**，连发会触发短窗口节流。
3. 单条文字控制在 700-800 字符以内。

```bash
cc-send-safe -m "<第 1 段全文>"
sleep 30
cc-send-safe -m "<第 2 段全文>"
sleep 30
cc-send-safe --image /tmp/<name>.jpg    # 一次性尝试
```

## 图片规则

4. 一次任务（每轮）只准备并发送 **1 张** 图片。第 3 张图片必触发节流锁死。
5. 发送前先验证并压缩：

```bash
file /tmp/<name>.jpg                     # 确认确实是图片而非 HTML 错误页
convert /tmp/<name>.jpg -quality 80 -resize 1280x /tmp/<name>.jpg   # >100KB 时压到 ≤80KB
```

   压到 80 质量 / 1280 宽仍 >80KB 时，再降到 `-quality 70 -resize 1200x`。

6. 图片发送 **一次性，失败即放弃，绝不重试** —— 每次失败请求都会加深节流。
7. 图片失败后 **不要再发任何文字**（包括「图片发送失败」这类说明），会触发节流升级。用户能从内容缺失自行判断，无需告知。

## 静默原则

8. 不发任何中间态 / 收尾状态消息：「段X已发」「任务完成」「已推送…」「归档在 XX 路径」全部禁止。用户只想看实际内容，状态信息是噪音，也白白消耗推送配额。
9. 需要确认结果时只写本地 stdout 日志，不发到推送通道，例如：

```bash
ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -5
```

## 绝对禁止

- 省略 `sleep 30`
- 单任务发 2 张及以上图片
- 图片失败后重试或补发文字
- 推送任何中间/收尾状态消息

## 注意

- 若通道已长时间返回 ret=-2，说明已被锁死，停止一切发送，等待冷却而不是重试。
