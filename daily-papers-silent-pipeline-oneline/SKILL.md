---
name: daily-papers-silent-pipeline-oneline
description: 用户说"今日论文推荐"等触发词时，自动跑完 fetch→review→notes 三步流水线，全程静默不发中间状态消息，结束后只用一句话报告推荐文件路径 + 笔记篇数 + 目录页刷新状态
trigger_keywords: ["今日论文推荐", "论文推荐", "过去N天论文", "daily papers"]
source: date=2026-06-24
version: 1
updated_at: 2026-06-25T03:30:57
---

# daily-papers 三步流水线静默运行 + 一句话报告

## 步骤

1. 接到"今日论文推荐/过去 N 天论文推荐"等触发词，依次调用三个 skill：
   - `daily-papers-fetch`：抓 arXiv + HuggingFace 最新论文，打分筛选，富化信息，输出到 `/tmp/daily_papers_enriched.json`
   - `daily-papers-review`：读富化数据 + 扫笔记库，生成有态度推荐点评，保存到 Obsidian 推荐文件，更新 history
   - `daily-papers-notes`：补概念库 + 为推荐论文生成完整笔记，链接回填到推荐文件，**默认自动刷新 MOC 目录页**，git 自动化默认关闭
2. **全程静默**：三步之间不发"step 1 完成/正在跑 review/正在生成笔记"等任何中间状态消息
3. 结束后仅输出**一句话**报告，格式：`推荐文件: <path> | 重点笔记: N 篇 | MOC: 已刷新/未刷新`
4. 支持多天模式："过去 3 天论文推荐"、"过去一周论文推荐"、"最近 5 天" 等

## 注意

- 三步顺序固定 fetch → review → notes，不能跳步
- 中间任一步报错才打破静默，正常情况一句话收尾
- git 自动化默认关 OFF，用户不要求别开
- 不要在结尾追加"已完成/任务结束"等噪音
