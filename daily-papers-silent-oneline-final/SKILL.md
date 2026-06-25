---
name: daily-papers-silent-oneline-final
description: 用户说"今日论文推荐"等触发词时，自动跑完 daily-papers 三步流水线 (fetch→review→notes)，全程静默不发中间状态，结束后只用一句话报告：推荐文件路径 + 必读笔记篇数 + 目录页刷新状态
trigger_keywords: ["今日论文推荐", "论文推荐 静默", "daily-papers 一句话", "过去N天论文推荐", "跑完三步流水线"]
source: date=2026-06-25
version: 1
updated_at: 2026-06-26T03:30:36
---

# 论文流水线静默 + 一句话收尾

## 步骤

1. 依次串联跑：
   - **Step 1 fetch**：调用 `daily-papers-fetch`，产出 `/tmp/daily_papers_enriched.json`
   - **Step 2 review**：调用 `daily-papers-review`，产出 `~/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`
   - **Step 3 notes**：调用 `daily-papers-notes`，为必读论文生成完整笔记，回填链接到推荐文件，刷新 concept MOC + paper MOC
2. 三步之间**不发任何中间状态消息**（不发"开始抓取…"、"评审中…"、"生成笔记…"）
3. 全部完成后用**一句话**回复用户，必须包含 3 个要素：
   - 推荐文件路径（如 ``~/ObsidianVault/DailyPapers/2026-06-25-论文推荐.md``）
   - 必读论文笔记生成数量（如 "必读笔记 3 篇全部生成（标题1、标题2、标题3）"）
   - 目录页刷新结果（如 "concept MOC X 篇、paper MOC Y 篇"）
4. 可在路径括号里补充推荐分布：必读 / 值得看 / 可跳过 的篇数，但不要展开成多行

## 注意

- 默认 git 自动化关闭（fetch/review/notes 三个 skill 内部约定）
- 多天模式触发词同样适用："过去 3 天论文推荐"、"过去一周论文推荐"
- 静默规则覆盖整条流水线，包括 fetch 阶段的进度日志也不要发给用户
