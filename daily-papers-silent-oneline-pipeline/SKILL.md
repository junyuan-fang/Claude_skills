---
name: daily-papers-silent-oneline-pipeline
description: 用户说"今日论文推荐"时，自动跑完 daily-papers 三步流水线（fetch→review→notes），全程静默不发中间状态，结束后只用一句话报告：推荐文件路径 + 必读笔记篇数 + 目录页刷新状态
trigger_keywords: ["今日论文推荐", "daily papers", "论文流水线", "过去一周论文推荐", "最近论文推荐"]
source: date=2026-06-30
version: 1
updated_at: 2026-07-01T03:31:28
---

# 每日论文推荐三步流水线静默一句话汇报

## 步骤

1. 识别触发词（"今日论文推荐"、"过去 N 天论文推荐"、"最近 N 天论文"），调用 `daily-papers` 总入口。
2. 内部串联：
   - **Step 1 fetch**：调用 `daily-papers-fetch`，抓 arXiv + HuggingFace 最新论文，打分筛选富化，输出到 `/tmp/daily_papers_enriched.json`
   - **Step 2 review**：调用 `daily-papers-review`，读富化数据 + 扫笔记库，生成推荐文件到 `~/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`
   - **Step 3 notes**：调用 `daily-papers-notes`，补概念库 + 为推荐论文生成笔记，链接回填到推荐文件，目录页自动刷新
3. **全程静默**：三步之间不发任何中间状态消息（不发 "fetch 完成"、"开始 review"、"笔记生成中" 等）。
4. 收尾只用一句话汇报，格式：
   ```
   推荐文件已生成 `<推荐文件绝对路径>`（必读 X + 值得看 Y + 可跳过 Z），重点论文笔记生成 N 篇（论文A / 论文B），目录页已自动刷新。
   ```

## 注意

- 推荐文件路径必须给完整绝对路径，方便用户点开
- 必读/值得看/可跳过数量都要给
- 笔记篇数 + 列出每篇笔记的论文短名
- 目录页刷新状态明确说 "已自动刷新" 或 "未刷新（原因）"
- git 自动化默认关闭，不要在汇报里提交
