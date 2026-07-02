---
name: daily-papers-silent-oneline-pipeline
description: 用户说"今日论文推荐"等触发词时，自动跑完 daily-papers 三步流水线（fetch→review→notes），全程静默不发中间状态，结束后只用一句话报告：推荐文件路径 + 必读笔记篇数 + 目录页刷新状态
trigger_keywords: ["今日论文推荐", "daily papers", "论文流水线", "过去一周论文推荐", "过去3天论文推荐", "最近论文推荐", "最近3天论文", "最近5天论文", "看看这周有啥论文", "跑一下论文推荐"]
source: date=2026-06-30
version: 2
updated_at: 2026-07-03T00:00:00
---

# 每日论文推荐三步流水线静默一句话汇报

## 步骤

1. 识别触发词（"今日论文推荐"、"过去 N 天论文推荐"、"最近 N 天论文"、"看看这周有啥论文"、"跑一下论文推荐"），调用 `daily-papers` 总入口。
2. 内部串联三步 skill，每一步之间**不发任何中间状态消息**（不发 "fetch 完成"、"开始 review"、"笔记生成中"、临时文件路径、抓取论文数量、去重数量等）：
   - **Step 1 fetch**：调用 `daily-papers-fetch` skill，抓取 arXiv + HuggingFace 最新论文，打分筛选，富化信息，输出到 `/tmp/daily_papers_enriched.json`。
   - **Step 2 review**：调用 `daily-papers-review` skill，读取富化数据，扫描 Obsidian 笔记库去重，生成推荐点评文件，保存到 `/home/xinmiao/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`。
   - **Step 3 notes**：调用 `daily-papers-notes` skill，补充概念库，为"必读"推荐生成完整笔记，链接回填到推荐文件；自动刷新 concept / paper 目录页 MOC。
3. **全程静默**：三步之间的进度、临时文件路径、抓取论文数量、去重数量等全部不发到微信，只在 stdout 日志。
4. 收尾只用一句话汇报，格式：
   ```
   推荐文件已生成 `<推荐文件绝对路径>`（必读 X + 值得看 Y + 可跳过 Z 篇，简评一句），重点论文笔记生成 N 篇（列出 slug：论文A / 论文B），目录页已自动刷新（concept A / paper B）。
   ```

## 注意

- 支持多天模式："过去 3 天"、"过去一周"、"最近 5 天" → 传给 fetch 阶段的时间窗口参数
- 推荐文件路径必须给完整绝对路径（`/home/xinmiao/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`），方便用户点开
- 必读 / 值得看 / 可跳过三档数量都要给，并附一句简评
- 笔记篇数 + 列出每篇笔记的论文短名 / slug
- 目录页刷新状态明确说 "已自动刷新（concept A / paper B）" 或 "未刷新（原因）"
- 目录页刷新失败时，一句话报告里明确写"目录页未刷新(原因)"，不额外发状态消息
- 只有最终一句话报告发给用户，中间过程一律静默
- git 自动化默认关闭，不要在汇报里提交
