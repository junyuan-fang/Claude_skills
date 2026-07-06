---
name: daily-papers-silent-oneline-final
description: 用户说"今日论文推荐"等触发词时，自动跑完 daily-papers 三步流水线 (fetch→review→notes)，全程静默不发中间状态，结束后只用一句话报告：推荐文件路径 + 必读笔记篇数 + 目录页刷新状态
trigger_keywords: ["今日论文推荐", "论文推荐 静默", "daily-papers 一句话", "过去N天论文推荐", "过去3天论文推荐", "过去一周论文推荐", "最近3天论文", "看看这周有啥论文", "跑完三步流水线"]
source: date=2026-06-25
version: 2
updated_at: 2026-07-07T00:00:00
---

# 论文流水线静默 + 一句话收尾

## 步骤

1. 触发词命中后，直接调 `daily-papers` skill（内部串联 fetch→review→notes 三步），**不发任何中间状态消息**（不发"开始抓取…"、"评审中…"、"生成笔记…"、"review 完成"、"正在生成笔记"等）。
2. **Step 1 fetch**：调用 `daily-papers-fetch`，抓 arXiv + HuggingFace 最新，打分筛选，输出 `/tmp/daily_papers_enriched.json`。静默执行，fetch 阶段的进度日志也不发给用户。
3. **Step 2 review**：调用 `daily-papers-review`，读富化数据 + 扫笔记库，生成推荐点评，写入 `~/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`。静默执行。
4. **Step 3 notes**：调用 `daily-papers-notes`，补概念库 + 为必读论文生成完整笔记，回填链接到推荐文件，自动刷新 concept MOC + paper MOC。静默执行。
5. 全部完成后用**一句话**回复用户，模板：
   > 推荐文件已生成 `<路径>`（必读 X + 值得看 Y + 可跳过 Z，共 N 篇，<核心趋势判断 1 句>），重点论文笔记生成 M 篇（<标题列表>），目录页已自动刷新（concept A / paper B）。
6. 一句话汇报里必须包含以下要素：
   - 推荐文件路径（如 ``~/ObsidianVault/DailyPapers/2026-06-25-论文推荐.md``）
   - 推荐分布：必读 / 值得看 / 可跳过 的篇数 + 总篇数
   - 必读论文笔记生成数量 + 标题列表（如 "必读笔记 3 篇全部生成（标题1、标题2、标题3）"）
   - 目录页刷新结果（concept MOC A 篇 / paper MOC B 篇）
   - 可选：核心趋势判断 1 句

## 注意

- **绝不发**中间状态消息，静默规则覆盖整条流水线，包括 fetch 阶段的进度日志。
- 默认 git 自动化关闭（fetch/review/notes 三个 skill 内部约定）。
- Zotero 同步默认关闭（`zotero_sync.enabled = false`），除非用户显式说"顺手也同步到 Zotero"才启用 Step 2.5。
- 多天模式触发词同样适用："过去 3 天论文推荐"、"过去一周论文推荐"、"最近 3 天论文"、"看看这周有啥论文"。
