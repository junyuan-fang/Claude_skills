# Hermes Agent 对标 — 实现说明

这个 repo 是为了在 **cc-connect**(本地 Claude Code × IM bridge)上,补足 Nous Research [hermes-agent](https://github.com/nousresearch/hermes-agent) 提到的几个关键能力。这里讲每个能力的**实际实现思路**和**代码位置**,以便日后回看或迁移到其他 agent 框架。

## 总体设计原则

- **不改 cc-connect Go 源码**(避免 fork 维护成本)
- **复用 cc-connect 已有的 session JSON 输出**(`~/.cc-connect/sessions/*.json`)做"事后加工"
- **LLM 任务用 `claude -p` 子进程**(直接走用户已有的 Claude Code 凭证,不再管理 API key)
- **数据存 SQLite + markdown 文件**(纯文件系统,易迁移、易备份、易 grep)
- **Cron 驱动定期更新**,而非 daemon(单点失败少、调试简单)

## 各能力 ↔ 实现对照

### #1 自我演化的技能 (Self-improving Skill Loop)

| Hermes | 这里的实现 |
|---|---|
| Agent 完成任务后**主动决定**这是新技能并存档 | Cron 每天 03:30 扫昨天对话,LLM 提炼可复用 skill |
| Skill 越用越精 | 同 slug 检测 → 调 LLM 把旧 SKILL.md + 新对话**合并**成 v2/v3 |
| 兼容 agentskills.io 开放标准 | SKILL.md 是 YAML frontmatter + body, 兼容 Claude Code 原生 skill 发现机制 |

**代码**: `_tools/scripts/extract-skill.py`
- `gather_turns()` — 从 SQLite 拉指定时段 / session / FTS 查询的对话
- `call_claude(prompt)` — 子进程 LLM 调用
- `parse_skills(output)` — 解析 LLM 返回的 JSON 数组
- `write_skill(skill)` — **核心**:同 slug 存在 → 走 `MERGE_PROMPT` 让 LLM 增量合并(保留旧版有效信息+吸收新版补充),递增 `version:` 字段
- 每次都自动 `git commit`,接 `git push`(网络通时)

**调用**:`kskill extract --date 2026-05-14` 或 cron 自动跑

### #2 长期记忆 & FTS 全文检索

| Hermes | 这里 |
|---|---|
| FTS5 索引所有会话 | 完全一样 — SQLite + FTS5 `unicode61 remove_diacritics 2` |
| LLM 摘要历史 | `query-history.py --summary` 把检索结果喂回 `claude -p` |
| 跨 session 召回 | FTS 不限 session,按时间排 |
| 增量索引 | INSERT OR IGNORE + UNIQUE 约束(project, session_id, timestamp, role) |

**代码**:
- `_tools/scripts/index-sessions.py` — 扫 cc-connect 的 JSON,建 / 增量更新 FTS5
- `_tools/scripts/query-history.py` — 命令行检索,支持 `--since/--until/--user/--session/--role/--project/--summary`

**调用**:`kskill recall <kw>` 或 `kskill recall <kw> --summary`;微信里 `/recall`

**数据库**:`_tools/data/sessions.db`(gitignored)

### #3 跨平台对话连续性

| Hermes | 这里 |
|---|---|
| 在 Telegram 说"继续昨天那个项目",Slack 也认得 | Identity 映射 + 显式调用 `/cross-context` 注入其他平台上下文 |

**代码**:
- `_tools/scripts/cross-platform-context.py`
- `_tools/data/identities.json` — 真人 → [所有平台 user_key]

**调用方式**:
1. **被动**:用户提到"另一边怎么说过…",Claude 调用 `/cross-context --user-key XXX`
2. **主动**(未来):配 Claude Code SessionStart hook,自动跑

**当前限制**:
- 默认是按需调用,而不是 SessionStart 自动注入(后者要 hook 配置,留作扩展)
- Identity 映射需要手动维护(在 `identities.json` 里加新 user_key)

### #4 用户建模 (Honcho-lite)

| Hermes | 这里 |
|---|---|
| Agent 持续构建用户偏好/性格模型 | 每天 LLM 总结近 N 天对话, 增量更新 `user-profile.md` |
| 跨 session 生效 | 通过项目级 CLAUDE.md 用 `@~/code/Claude_skills/_tools/data/user-profile.md` 注入 |
| Honcho dialectic | **未做** — 我们没辩证式建模,只做单次 LLM 摘要(质量差距:中) |

**代码**:`_tools/scripts/update-user-profile.py`
- Merged profile: 所有用户合并的画像
- `--per-user` flag: 每个 user_key 单独一份画像在 `_tools/data/profiles/<safe_key>.md`

**调用**:`kskill profile --update` 或 cron 每天 04:00 自动跑

### #5 隔离子 agent 并行执行

**未做**。Claude Code 内部的 Task 工具可以起子 agent,但跑在同一上下文里。完全独立的 RPC 隔离需要改 cc-connect 让一个会话能 fork 多个 claude 子进程,工程量大。

### #6 Hibernate / 按需唤醒

**不做**。原因:个人 Linux 机上做不到真休眠,因为 iLink 长轮询需要本地进程持续在跑接消息。这条能力**必须**配合 Modal/Daytona 这种事件触发的 serverless 平台才有意义。要做就把 cc-connect Docker 化后部署到 Modal,本 repo 不涉及。

## 自动化:Cron 计划表

```cron
0 * * * *  index-sessions.py                    # 每小时增量索引
10 3 * * * archive-session.py --date yesterday  # 每天 03:10 归档昨天
30 3 * * * extract-skill.py --date yesterday    # 每天 03:30 提炼新 skill (含合并)
0 4 * * *  update-user-profile.py --per-user    # 每天 04:00 刷新画像 (合 + 拆)
```

具体 crontab 在 `_tools/cron/crontab.example`。

## 全局可调用

```bash
kskill recall <kw>            # FTS 检索
kskill recall <kw> --summary  # + LLM 摘要
kskill list                   # 列所有 skill
kskill show <slug>            # 看一个 skill 内容
kskill extract --date ...     # 触发 skill 提炼
kskill profile [--update]     # 看 / 刷画像
kskill context --person X     # 跨平台上下文
kskill index                  # 重建索引
kskill sync                   # git pull && push
```

## 微信里直接用

通过 cc-connect 把消息路由到 Claude Code, 后者识别这些 slash command:

| 命令 | 实际跑 |
|---|---|
| `/recall <kw>` | `query-history.py` |
| `/skill-extract` | `extract-skill.py` |
| `/skills-list` | 列出顶层有 SKILL.md 的目录 |
| `/profile` | `update-user-profile.py` + cat |
| `/cross-context` | `cross-platform-context.py` |

定义文件:`~/.claude/commands/*.md`(不在 repo 里,因为是用户级配置)

## 数据流总览

```
微信用户发消息
   │
   ▼
cc-connect (长轮询接到)
   │
   ▼
Claude Code 子进程 (work_dir=/home/xinmiao/code/claude_bot)
   │ 读 CLAUDE.md → 自动 @-include 当前 user-profile.md (= 用户画像注入)
   │ 写 ~/.cc-connect/sessions/*.json
   │
   ├──→ Claude 回复 → cc-connect → 微信
   │
   └──→ (每小时) index-sessions.py: JSON → SQLite FTS5
        (每天) extract-skill.py: 扫昨天 → LLM 提炼 → SKILL.md + git
        (每天) update-user-profile.py: 扫近 7 天 → LLM 增量 → profile.md
        (按需) cross-platform-context.py: identities → 其他平台 turns → LLM 摘要
```

## 取舍 & 已知不足

- **Claude 计费**:所有 LLM 调用都通过 `claude -p`,**走你的 Anthropic 账户**。cron 一天烧 4-10 次 LLM 调用,成本可接受($0.05-0.30/day)。
- **同步**:`extract-skill.py` 自动 `git add/commit`,但 push 失败不阻断。Cron 在网络不通时静默失败,留下未推的 commit,下次 `kskill sync` 推上去。
- **重复检测粗糙**:同 slug 才合并,LLM 提炼出近似主题但不同 slug 的不会触发合并(可改进:embedding 相似度,但暂未实现)。
- **没做的(故意)**:Atropos RL 集成、模型路由、WhatsApp/Signal 桥接、Modal 部署。

## 迁移到别处

这套设计跟 Claude Code / cc-connect 关系较松。换 agent 也能用:
- 把 `index-sessions.py` 改成读你 agent 的对话存储格式
- 其他 LLM 调用替换 `claude -p` 为 `openai chat completions` / `gpt -p` / 别的 CLI
- SKILL.md 格式是开放的 (`name/description/body`),agentskills.io 兼容
- 不依赖 SQLite 之外的服务
