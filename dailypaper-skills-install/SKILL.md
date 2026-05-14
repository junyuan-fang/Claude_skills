---
name: dailypaper-skills-install
description: 把 huangkiki/dailypaper-skills 集成进 ~/code/Claude_skills/，让 ~/.claude/skills 自动加载，同时保留上游 repo 便于 git pull
trigger_keywords: ["dailypaper-skills", "安装论文 skill", "集成 daily-papers"]
source: date=2026-05-14
version: 1
updated_at: 2026-05-15T03:31:42
---

# dailypaper-skills 集成到私人 skills repo

## 适用场景

首次集成 dailypaper-skills（或类似上游 skill repo）到本地，要求：
- skill 真文件托管在自己的 `~/code/Claude_skills/`（私人 repo）
- 上游 repo 保留以便 `git pull` 更新
- `~/.claude/skills/` 通过现有软链自动加载

## 前置环境

- conda 环境：`conda create -n dailypaper python=3.10`
- Zotero 装在 `~/Zotero/`（zotero.sqlite + storage/）
- Obsidian vault 在 `~/ObsidianVault/`
- 已有软链 `~/.claude/skills → ~/code/Claude_skills`

## 步骤

1. clone 上游 repo 到 `~/code/claude_bot/dailypaper-skills`
2. 把 6 个 skill + `_shared` 共 7 个目录的真文件**移动**（mv，不是 cp）到 `~/code/Claude_skills/`：
   - daily-papers, daily-papers-fetch, daily-papers-review, daily-papers-notes
   - generate-mocs, paper-reader, _shared
3. 在 `~/code/claude_bot/dailypaper-skills/skills/` 下建反向软链指回 `~/.claude/skills/<name>`，这样上游 repo 结构仍完整、`git pull` 不报缺文件
4. 验证 `~/code/Claude_skills` 的 `git status` 干净（7 个目录显示为 untracked，可正常 `git add`）
5. 验证 Python 能从软链路径加载 `_shared/user_config.py`，且 `obsidian_vault` / `zotero_db` 路径正确解析
6. 测试触发词：'今日论文推荐'、'读一下 Zotero 里的 XXX'、'更新索引'
7. commit 消息建议：`feat: integrate dailypaper-skills (kiki) — 6 skills + _shared`

## 注意

- 不要 cp 一份到 Claude_skills 又留一份在上游 repo，会变成两套真文件
- 上游 repo 留在 `~/code/claude_bot/dailypaper-skills/`，符合 cc-connect 产物归集规则
- 默认路径已和用户的 Zotero/Obsidian 安装位置匹配，user-config 不用改
