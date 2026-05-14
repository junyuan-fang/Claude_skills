# Claude_skills

个人 Claude Code 工作流积累:
**对话归档 + FTS 全文检索 + 自动技能提炼 + 用户偏好建模**。

补足 cc-connect (Claude × IM 桥接) 相对 Hermes Agent 的几个关键能力缺失。

## 目录

```
.
├── scripts/
│   ├── archive-session.py     # cc-connect sessions JSON → 当日 markdown 存档
│   ├── index-sessions.py      # SQLite FTS5 索引所有历史会话
│   ├── query-history.py       # CLI 检索: 关键词 / 时间 / 平台
│   ├── extract-skill.py       # LLM 把一段对话提炼成可复用 skill
│   └── update-user-profile.py # LLM 根据近 N 天对话更新用户画像
├── skills/                    # 自动提炼出的技能 (用 Claude 的 SKILL.md 格式)
├── data/
│   ├── sessions.db            # FTS5 索引数据库
│   └── user-profile.md        # 当前用户画像快照
└── cron/
    └── crontab.example        # 定时任务示例
```

## 快速开始

```bash
# 1. 建索引 (扫一遍 ~/.cc-connect/sessions/)
python3 scripts/index-sessions.py

# 2. 检索: 找上周关于 "weixin" 的对话
python3 scripts/query-history.py weixin

# 3. 从某条 session 提炼 skill
python3 scripts/extract-skill.py <session_id>

# 4. 更新用户画像
python3 scripts/update-user-profile.py

# 5. 把上面的任务设成 cron, 让它每天自动跑
crontab -e          # 复制 cron/crontab.example 内容粘进去
```

## 在微信 / Claude 里直接用

下面的 slash command 已经在 `~/.claude/commands/` 注册 (由 install.sh 完成):

| 命令 | 作用 |
|---|---|
| `/recall <kw>` | 历史会话全文检索 |
| `/skills` | 列出本地技能 |
| `/profile` | 查看 / 更新用户画像 |
| `/skill-extract` | 把当前对话提炼成新技能 |

## 与 cc-connect 的关系

- cc-connect 本身不变 (没改其 Go 源码)
- 这套工具读 `~/.cc-connect/sessions/*.json` (cc-connect 写出的会话历史)
- 写到独立 SQLite + 独立 skill 文件,跟 cc-connect 互不干扰
- Claude Code 通过命令行调用这些脚本,微信里发 `/recall xxx` 等同于 Claude 跑对应脚本

## 依赖

- Python 3.10+ (sqlite3 with FTS5,几乎都有)
- `claude` CLI (Claude Code) — 用于 LLM 调用,不需要单独 API key
- 无其他 pip 依赖
