---
name: arxiv-id-date-validation
description: 引用 arXiv 论文为"今日/近期新发"前，必须用 ID 前 4 位 YYMM 粗筛 + 读 abstract 页精校，避免把几个月前的老论文包装成新发
trigger_keywords: ["arxiv 日期", "论文校验", "今日论文", "新发论文"]
source: date=2026-05-20
version: 1
updated_at: 2026-05-21T03:31:51
---

# arXiv ID 日期硬校验（防引用老论文）

## 步骤

1. **粗筛**：arXiv ID 前 4 位 = YYMM（年月）。例如 `2606.xxxxx` = 2026-06 提交，`2505.xxxxx` = 2025-05 提交
2. **窗口判定**：当前规则"今日/近期新论文"= 最近 14 天内（具身智能 cron 使用；NVIDIA 等其他场景可放宽到 60 天）
3. **精校**：粗筛通过后，必须打开 abstract 页面读 `[Submitted on YYYY-MM-DD]` 字段确认真实提交日，因为 ID 月份只能保证年月不能保证日
4. **超窗口处理**：
   - 绝不放在头条快报或"今日 deep dive"
   - 若必须引用，标题旁标注真实年份（例："LeVERB（2025-06 旧作）"）
   - 只能放在"延伸阅读"段落
5. **搜不到合规论文**：宁可只发行业新闻、彻底放弃论文项，也不要硬塞老论文

## 信源优先级

1. HuggingFace daily papers（每日 curated，最新且权威）
2. arXiv 最近一周 trending（cs.RO / cs.AI / cs.CV / cs.LG）
3. 上述都没合规结果 → 放弃论文项

## 触发教训

曾经把 LeVERB（`2506.13751` = 2025-06）当做"今日论文"上头条，被用户当场抓包。原因：只看了关键词没看 ID。此校验即为防止该类错误。
