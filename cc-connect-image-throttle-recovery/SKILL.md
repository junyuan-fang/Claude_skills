---
name: cc-connect-image-throttle-recovery
description: 微信图片接口连续返回 ret=-2（限流/服务端节流）时，用统一 wrapper 压图+退避重试，并部署到 PATH
trigger_keywords: ["cc-connect", "微信发图失败", "ret=-2", "图片限流", "cc-send-safe"]
source: date=2026-05-14
version: 1
updated_at: 2026-05-15T03:31:42
---

# cc-connect 微信发图节流自救

## 适用场景

通过 cc-connect 发图到微信时，连续返回 ret=-2 / 接口 reject，疑似服务端节流。

## 步骤

1. 在 `~/code/claude_bot/bin/cc-send-safe` 写一个统一 wrapper，做三件事：
   - 用 PIL 或 `convert` 把图片压到合理大小（长边 ≤ 1280，质量 ~85）
   - 调 `cc-connect send --image <压缩后路径>`
   - 失败时按指数退避重试（10s → 30s → 73s），仍失败则写日志到 `~/.cc-connect/logs/send-fail.log`
2. 把 wrapper 软链到 PATH：`ln -s ~/code/claude_bot/bin/cc-send-safe /home/a/.local/bin/cc-send-safe`
3. 修改所有定时任务的 prompt，把发图命令统一替换为 `cc-send-safe`
4. 如果节流是服务端级别（连 73s 退避都救不回来），需要：
   - 等数小时自然解开，或
   - 跑 `cc-connect weixin setup --project <project>` 扫码重置 token
5. 把 wrapper 的用法记成 reference memory，便于未来定时任务复用

## 注意

- 不要把 wrapper 放到 `/home/a/.local/bin/` 真文件，源文件统一放 `~/code/claude_bot/bin/` 下，PATH 处只放软链
- 退避重试不能解决服务端 token 失效，只能解决短时限流
