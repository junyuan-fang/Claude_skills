---
name: arxiv-paper-date-14d-validation
title: arXiv 论文「近期新发」日期校验（14 天窗口）
description: 在把某篇 arXiv 论文称为「今日/最新/近期新发」之前，用 HF daily papers + arXiv ID 粗筛 + abstract 页 submission date 精校，避免把几个月前的老论文包装成新发。
trigger_keywords: ["arXiv 日期", "arXiv 日期校验", "论文 14 天", "14 天窗口", "submission date", "HuggingFace daily papers", "论文是不是最新", "今日论文"]
source: date=2026-08-20
version: 2
updated_at: 2026-08-22T00:00:00
---

# arXiv 论文「最近 14 天」日期硬校验

## 校验流程（按优先级）

1. **HuggingFace daily papers 优先**：先看 `https://huggingface.co/papers` 当日/当周精选。它是每日 curated，命中即可信为近期，天然满足新鲜度。
2. **arXiv ID 粗筛**：ID 前 4 位 = `YYMM`（提交年月）。例如今天 2026-05-20，14 天窗口 = 2026-05-06 之后；ID 为 `2601.xxxxx`、`2604.xxxxx` 明显超窗，直接淘汰。
   - **粗筛不能替代精校**：同一 YYMM 内可能是月初提交，已超 14 天；v2 修订、跨月提交也会误判。
3. **abstract 页精校**：
   ```bash
   curl -s https://arxiv.org/abs/<arxiv_id> | grep -Ei 'citation_date|Submitted on'
   ```
   读 `[Submitted on YYYY-MM-DD]` 或 `<meta name="citation_date">`，以此为准，与今天日期做差，>14 天则淘汰。

## 处理规则

- 只有 14 天内的论文可以进「今日论文」/头条/deep dive。
- **超窗但仍想提及**：必须在标题旁标注真实日期，例如 `HEX（2026-04-09 旧作，已超 14 天）`，且只能放进归档的「延伸阅读」区，不进头条和 deep dive。
- **搜不到就不放**：若当日确实没有 14 天内的新论文，宁可整期彻底不放论文项，用行业条目补足。

## 注意

绝不把超窗论文标记为「今日新发」「最新」「近期新发」。宁缺毋滥优先于凑条数。
