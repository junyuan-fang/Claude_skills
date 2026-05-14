---
name: claude-bot-artifact-layout
description: 通过 cc-connect 触发的 Claude 工作产物（脚本、临时工具、上游 repo 拷贝）默认放到 ~/code/claude_bot/ 下统一管理
trigger_keywords: ["claude_bot", "cc-connect 产物", "目录归集"]
source: date=2026-05-14
version: 1
updated_at: 2026-05-15T03:31:42
---

# cc-connect 产物统一归集到 claude_bot

## 适用场景

cc-connect 启动的 Claude 会话里产生的脚本/工具/拷贝下来的 repo，用户希望集中放到 `~/code/claude_bot/` 便于管理。

## 步骤

1. 默认目录布局：
   ```
   ~/code/claude_bot/
     ├── CLAUDE.md
     ├── bin/          ← 自己写的辅助脚本（如 cc-send-safe）
     └── <upstream-repo>/   ← 从 GitHub clone 的上游工具 repo
   ```
2. 暴露到 PATH 的可执行文件：源文件放 `~/code/claude_bot/bin/`，在 `/home/a/.local/bin/` 或 `~/.local/bin/` 下用 `ln -s` 软链过去
3. 例外不归 claude_bot 管的固定位置：
   - `~/ObsidianVault/`（Obsidian 库）
   - `~/Zotero/`（Zotero 数据）
   - `~/.cc-connect/`（cc-connect 工作目录）
   - `~/code/Claude_skills/`（私人 skills repo）
4. 误放到其他目录时，用 `mv` 移到 claude_bot 下，再重建所有引用（软链、PATH、skills 软链等）

## 注意

- 移动后要扫一遍 `~/.claude/skills/` 等引用路径，重建所有软链
- 私人 skills repo `~/code/Claude_skills/` 不要被污染，移动前后跑 `git status` 确认
