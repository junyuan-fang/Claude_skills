---
name: wechat-cc-connect-channel-health
description: 排查并维护 cc-connect 微信推送通道,避免长时间 ret=-2 锁死;用于 cron 推送频繁出现'请稍后再试'或通道节流时
trigger_keywords: ["cc-connect", "微信节流", "ret=-2", "请稍后再试", "通道锁死", "weixin throttle"]
source: date=2026-05-16
version: 1
updated_at: 2026-05-17T03:31:11
---

# cc-connect 微信通道长期健康四件套

## 背景真相

- `cc-send-safe` 返回 `Message sent successfully` 是**假信号**——只是把消息加进 cc-connect 内部队列就返回,不等 weixin 实际接收。
- 每次失败的 image 推送会累积 ret=-2,weixin 服务端把整个 token 列入黑名单,可锁 22h+。
- 解锁手段:`cc-connect weixin setup --project claude_bot` 扫码换 token,或重启 daemon(重启后反垃圾计数器重置)。

## 诊断步骤

1. **不要只看 cc-send-safe 退出码**。读 daemon 日志确认真实送达情况。
2. 观察 ret=-2 出现频率和持续时间窗口(锁通常 15-24h+)。
3. 测试 chunk 长度敏感性:节流降级时,~80-400 字短消息仍可过,>1000 字会全失败。

## 长期健康四件套

1. **新版 wrapper**:发完后读 daemon 日志确认真实送达,失败立刻知道,不再误判。
2. **watchdog 守护进程**:监控 ret=-2 计数,超阈值自动重启 daemon,无需人工扫码。
3. **cron prompt v3**:放弃发图,长摘要拆成 3-4 段短文本,每段 ≤400 字符,间隔 5-10s。
4. **归档先于推送**:每条 cron 先写归档(`~/code/claude_bot/news_archive/`),归档是 source-of-truth,推送是 best-effort。

## 应急恢复

- 终端运行 `cc-connect weixin setup --project claude_bot` 扫码重置 token。
- 或重启 cc-connect daemon 进程清空连接状态。

## 绝对禁止

- 图片失败后重试图片(每次失败都加深节流)。
- 图片失败后再发任何文字(触发节流升级)。
- 单次 cron 内发 ≥2 张图(实测第 3 张必触发锁死)。
