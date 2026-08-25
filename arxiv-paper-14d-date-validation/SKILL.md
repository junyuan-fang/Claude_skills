---
name: arxiv-paper-14d-date-validation
description: 在把某篇论文称为「今日/最新论文」之前，用三级校验确认其真实提交日期在 14 天窗口内，避免把几个月前的老论文包装成新发。
trigger_keywords: ["arXiv 日期校验", "论文是不是新的", "14 天窗口", "submission date", "今日论文", "HuggingFace daily papers"]
source: date=2026-08-25
version: 1
updated_at: 2026-08-26T03:32:02
---

# arXiv 论文 14 天新鲜度硬校验

## 适用场景

任何要把论文标为「今日新发」「最新论文」并推送/归档的场景。搜索引擎和二手报道经常把旧论文当新闻，必须自己校验。

## 三级校验（按优先级）

1. **HuggingFace daily papers**（最优先）：https://huggingface.co/papers —— 每日 curated，出现在当周精选里的基本可信。
2. **arXiv abstract 页精校**（权威）：
   ```bash
   curl -s https://arxiv.org/abs/<arxiv_id> | grep -Eo 'citation_date[^>]*|\[Submitted on [^]]*\]'
   ```
   读 `<meta name="citation_date">` 或页面 `[Submitted on YYYY-MM-DD]` 字段。以此为准。
3. **arXiv ID 前 4 位 YYMM 粗筛**：只用来快速排除明显过期的，**不能替代**第 2 步。例如今天 2026-05-20，ID 以 `2604` 开头的直接排除。

## 判定与处理

- **在 14 天内** → 可作为「今日论文」进头条快报和 deep dive。
- **超过 14 天** → 标题旁必须标真实日期，例：`HEX（2026-04-09 旧作，已超 14 天）`；只能放归档的「延伸阅读」段，不进头条、不进 deep dive。
- **搜不到 14 天内的新论文** → 宁可彻底放弃论文项，多放 1-2 条行业内容。绝不用「最新」「今日新发」修饰老论文。

## 注意

- 同一 arXiv ID 可能有多个版本（v1/v2）。「新鲜度」按 v1 的 submission date 判断，除非明确讨论的是新版本内容。
- 二手报道（公众号、新闻站）的发布日期 ≠ 论文提交日期，不可作为依据。
