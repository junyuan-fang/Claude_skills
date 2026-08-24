---
name: arxiv-paper-date-14d-validation
title: arXiv 论文「近期新发」日期硬校验（14 天窗口）
description: 在把某篇 arXiv 论文称为「今日/最新/近期新发」之前，用三级校验（HF daily papers + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校）确认它确实在 14 天窗口内，避免把几个月前的旧论文包装成新发。
trigger_keywords: ["arXiv 日期", "arXiv 日期校验", "论文是不是新的", "论文是不是最新", "论文 14 天", "14 天窗口", "submission date", "citation_date", "HuggingFace daily papers", "今日论文"]
source: date=2026-08-20
version: 3
updated_at: 2026-08-25T00:00:00
---

# arXiv 论文「最近 14 天」日期硬校验

## 何时用

任何要宣称某论文是「今日新发」「最新论文」「近期成果」的场合：

- 每日论文推送（daily-papers 系列）
- 新闻摘要里的论文项（NVIDIA / 具身智能日报的论文段）
- awesome list / 归档库的 ingest

## 三级校验（按优先级）

1. **HuggingFace daily papers 优先**：先看 `https://huggingface.co/papers` 当日/当周精选。它是每日 curated，命中即可信为近期，天然满足新鲜度。

2. **arXiv ID 粗筛**：ID 前 4 位 = `YYMM`（提交年月）。例如今天 2026-05-20，14 天窗口 = 2026-05-06 之后；ID 为 `2601.xxxxx`、`2604.xxxxx` 明显超窗，直接淘汰。
   - **粗筛不能替代精校**：同一 YYMM 内可能是月初提交，已超 14 天；v2/v3 修订、cross-list、跨月提交都会让 ID 与实际可见时间脱节。

3. **abstract 页 submission date 精校**（必须做）：
   ```bash
   curl -s https://arxiv.org/abs/<arxiv_id> | grep -Ei 'citation_date|Submitted on'
   ```
   读 `<meta name="citation_date">` 或页面上的 `[Submitted on YYYY-MM-DD]`，以此为准，与今天日期做差，>14 天则淘汰。

## 判定与降级处理

- 窗口：以「今天」为准往前 **14 天**。例如今天 2026-05-20 → 只收 2026-05-06 之后提交的。
- 只有 14 天内的论文可以进「今日论文」/ 头条 / deep dive。
- **超窗但仍想提及**：
  - 必须在标题旁标注真实日期，例如 `HEX（2026-04-09 旧作，已超 14 天）`
  - **不得进头条 / deep dive**，只能放进归档的「延伸阅读」段。
- **搜不到就不放**：若当日确实没有 14 天内的新论文，宁可整期彻底放弃论文项，用 1-2 条行业新闻补足。

## 注意

绝不把超窗论文标记为「今日新发」「最新」「近期新发」。宁缺毋滥优先于凑条数——一次把旧论文说成新发，会污染下游归档和自动 ingest 的数据。
