---
name: arxiv-paper-date-14d-validation
description: 在把某篇 arXiv 论文写成「今日/最新论文」之前，用 HF daily papers + abstract 页 submission date 校验发布日期，避免把几个月前的老论文包装成新发。
trigger_keywords: ["arXiv 日期", "论文 14 天", "submission date", "HuggingFace daily papers", "论文是不是最新"]
source: date=2026-08-20
version: 1
updated_at: 2026-08-21T03:32:38
---

# arXiv 论文「最近 14 天」日期硬校验

## 步骤

1. **优先来源**：先看 HuggingFace daily papers（https://huggingface.co/papers）当周精选。它是每日 curated，天然满足新鲜度。
2. **粗筛**：看 arXiv ID 前 4 位 = `YYMM`。例如今天 2026-05-20，14 天窗口 = 2026-05-06 之后。ID 为 `2604.xxxxx` 的直接淘汰。
   - 注意：YYMM 只能粗筛，**不能**替代真实 submission date（v2 修订、跨月提交都会误判）。
3. **精校**：
   ```bash
   curl -s https://arxiv.org/abs/<id> | grep -i 'citation_date\|Submitted on'
   ```
   读 `[Submitted on YYYY-MM-DD]` 或 `<meta name="citation_date">`，以此为准。
4. **超窗处理**：超过 14 天的论文必须在标题旁标注真实日期，例如「HEX（2026-04-09 旧作，已超 14 天）」，且只能放进归档的「延伸阅读」区，不进头条和 deep dive。
5. **搜不到就不放**：若当日确实没有 14 天内的新论文，宁可整期只放行业条目、彻底放弃论文项。

## 注意

绝不把超窗论文标记为「今日新发」「最新」。宁缺毋滥优先于凑条数。
