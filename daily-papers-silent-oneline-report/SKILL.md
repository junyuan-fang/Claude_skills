---
name: daily-papers-silent-oneline-report
description: 跑完 daily-papers 三步流水线 (fetch→review→notes) 时全程静默，仅在结束时用一句话报告推荐路径、笔记数、目录刷新状态
trigger_keywords: ["今日论文推荐", "论文推荐 静默", "daily-papers 一句话"]
source: date=2026-06-15
version: 1
updated_at: 2026-06-16T03:30:37
---

# 论文流水线静默运行 + 一句话汇报

## 步骤

1. 调用 `daily-papers` skill，串联 fetch → review → notes 三步。
2. 三步执行过程中**不发任何中间状态消息**（不报"抓取完成"、不报"开始打分"、不报路径中间态）。
3. 全部完成后，用**一句话**汇报，必须包含三要素：
   - 推荐文件路径（如 `~/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`）
   - 推荐篇数 + 重点论文笔记生成多少篇
   - 目录页是否刷新（concept MOC / paper MOC 篇数）
4. 若当日无新 robotics 必读（HF Trending 多为 LLM/T2I 跨界、arXiv API 超时等），笔记数可为 0，但仍要诚实在一句话中说明原因。

## 一句话模板

`推荐文件 \`<路径>\`（N 篇 — <可选原因说明>，已笔记 M 篇），目录页已刷新（concept MOC X 篇、paper MOC Y 篇）。`

## 注意
- arXiv API 偶发超时是常见现象，HF Trending 是 fallback 源
- 静默期不代表不工作，长响应时间（10+ 分钟）属正常
- 不要为了凑数把跨界 LLM/T2I 论文硬塞进 robotics 推荐
