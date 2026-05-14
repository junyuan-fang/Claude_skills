# Claude_skills

个人 Claude Code skills 合集 + 工作流积累工具。

每个**顶层目录**(除 `_tools/`)是一个独立 skill,内含 `SKILL.md`(YAML frontmatter + 正文)。
clone 到 `~/.claude/skills/` 后可被 Claude Code 自动发现。

## 已有 Skills

| Skill | 来源 | 说明 |
|---|---|---|
| **confluence** | 手写 | 通过 `@qunhe/confluence-cli` 读写搜索 Confluence 页面 |
| **cf-qunhe** | 手写 | 群核内部 Confluence (cf.qunhequnhe.com) MCP 工作流: mermaid/markdown 宏处理、页面 ↔ markdown 转换 |
| **cc-connect-daily-cron** | 自动提炼 | 用 cc-connect 创建每日定时新闻推送(微信) |
| **wechat-image-rich-reply** | 自动提炼 | 微信通道资讯类回复优先图文并茂 |

## `_tools/` — 工作流积累基础设施

```
_tools/
├── scripts/
│   ├── index-sessions.py        # 把 cc-connect session JSON → SQLite FTS5
│   ├── query-history.py         # 命令行历史检索 (可选 LLM 摘要)
│   ├── archive-session.py       # 导出对话到 markdown
│   ├── extract-skill.py         # LLM 把一段对话提炼成 SKILL.md
│   └── update-user-profile.py   # LLM 增量维护 user-profile.md
├── cron/crontab.example         # 每日自动跑上面这些
└── data/                        # 索引 / 画像 / 归档 (gitignored)
```

## 安装

```bash
# 1. 把 repo clone 到 Claude skills 目录
git clone git@github.com:junyuan-fang/Claude_skills.git ~/.claude/skills

# 2. (可选) 启用自动归档 / 提炼 / 画像
crontab -e   # 粘贴 _tools/cron/crontab.example 内容
```

## 在 cc-connect / 微信里使用

下列 slash command 已注册到 `~/.claude/commands/`:

| 命令 | 作用 |
|---|---|
| `/recall <kw>` | 历史会话全文检索 |
| `/recall <kw> --summary` | 检索 + LLM 摘要 |
| `/skill-extract` | 提炼今天对话的可复用技能 |
| `/skills-list` | 列出本地已积累的 skill |
| `/profile` | 查看当前用户画像 |
| `/profile update` | 用近 7 天对话刷新画像 |

## 依赖

- Python 3.10+ (stdlib `sqlite3` with FTS5)
- `claude` CLI (Claude Code) — 用于 LLM 调用,不需要单独 API key

## 灵感来源

补足 cc-connect (Claude × IM 桥接) 相对 Hermes Agent 的几个能力缺失:
**FTS 长期记忆 / 自我演化技能 / 用户画像维护**。
详见 work_dir 里的 `cc-connect-vs-hermes.md`。

## 同步技能更新

```bash
cd ~/.claude/skills
git add . && git commit -m "Update skills" && git push
```
