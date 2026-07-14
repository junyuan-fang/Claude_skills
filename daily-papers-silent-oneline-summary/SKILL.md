---
name: daily-papers-silent-oneline-summary
description: 用户说"今日论文推荐"时，走完 daily-papers 的 fetch→review→notes 三步流水线，全程静默不发中间状态，结束只用一句话汇报三项结果
trigger_keywords: ["今日论文推荐", "论文推荐", "daily papers", "跑一下论文流水线"]
source: date=2026-07-14
version: 1
updated_at: 2026-07-15T03:31:30
---

# 每日论文推荐三步流水线（静默 + 一句话汇报）

## 步骤

1. 依次执行 daily-papers 三步流水线：
   - **fetch**（论文抓取）：抓 arXiv + HuggingFace 最新论文，打分筛选富化，输出 `/tmp/daily_papers_enriched.json`
   - **review**（论文点评）：读富化数据，扫描笔记库，生成推荐点评并保存到 Obsidian，更新 history
   - **notes**（论文笔记）：为重点论文生成完整笔记，链接回填推荐文件，刷新目录页
2. 全程**静默**：不发任何中间状态消息（不发"正在抓取/点评完成"等）。
3. 完成后**只用一句话**汇报，必须包含三项：
   - 推荐文件路径
   - 重点论文笔记生成篇数
   - 目录页是否刷新

## 注意

- git 自动化默认关闭
- 除最后一句汇报外不输出其他收尾内容
