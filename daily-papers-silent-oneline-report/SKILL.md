---
name: daily-papers-silent-oneline-report
title: 论文推荐三步流水线（静默 + 一句话汇报）
description: 用户说「今日论文推荐」/「过去 N 天论文推荐」时，静默串跑 daily-papers 的 fetch→review→notes 三步流水线，全程不发中间状态，完成后只用一句话回报推荐路径、推荐/笔记篇数与目录页刷新状态
trigger_keywords: ["今日论文推荐", "过去 N 天论文推荐", "论文推荐 静默", "daily-papers 一句话", "daily-papers", "论文抓取", "论文点评", "批量笔记", "静默流水线"]
source: date=2026-06-15
version: 2
updated_at: 2026-06-16T03:30:37
---

# 论文流水线静默运行 + 一句话汇报

## 步骤

1. 用户说「今日论文推荐」/「过去 N 天论文推荐」时，**直接进入 `daily-papers` 总入口**，不要逐步征询确认、不要先问要不要跑。
2. 顺序执行三步流水线，中途**不发任何中间状态消息**（不报「抓取完成」「第 1 步完成」「开始打分」「正在生成笔记」，也不报路径中间态）：
   - **fetch**：`daily-papers-fetch` — 抓 arXiv + HuggingFace，打分筛选、富化，输出 `/tmp/daily_papers_enriched.json`。
   - **review**：`daily-papers-review` — 读富化数据 + 扫描笔记库，生成有态度的推荐点评，写入 Obsidian 推荐文件（`~/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`）并更新 history。
   - **notes**：`daily-papers-notes` — 补概念库，为重点论文生成完整笔记，链接回填到推荐文件，刷新目录页（concept MOC / paper MOC）。
3. 笔记生成可用后台 agent 并行跑；**必须等每个 agent 回报并核对行数/校验结果**，确认无遗留项后才收尾。
4. 支持多天模式：「过去 3 天论文推荐」「过去一周的论文」「最近 5 天」等，把天数透传给 fetch 步骤。
5. 全部完成后，只输出**一句话**汇报，必须包含三要素：
   - 推荐文件路径（如 `~/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`）
   - 推荐篇数 + 重点论文笔记生成多少篇
   - 目录页是否刷新（concept MOC X 篇、paper MOC Y 篇）
6. 若当日无新 robotics 必读（HF Trending 多为 LLM/T2I 跨界、arXiv API 超时等），笔记数可为 0，但仍要诚实在这一句话中说明原因。

## 一句话模板

`推荐文件 \`<路径>\`（N 篇 — <可选原因说明>，已笔记 M 篇），目录页已刷新（concept MOC X 篇、paper MOC Y 篇）。`

## 注意

- **git 自动化默认关闭**，不要自作主张 commit / push。
- 不要在流水线中间输出进度播报；用户明确要求「全程静默」。
- **后台 agent 的自述不等于事实**：拿到回报后要用行数或文件校验确认笔记确实写盘（例如确认某篇笔记 966 行、校验通过）。
- arXiv API 偶发超时是常见现象，HF Trending 是 fallback 源。
- 静默期不代表不工作，长响应时间（10+ 分钟）属正常。
- 不要为了凑数把跨界 LLM/T2I 论文硬塞进 robotics 推荐。
