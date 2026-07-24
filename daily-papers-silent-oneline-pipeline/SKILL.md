---
name: daily-papers-silent-oneline-pipeline
description: 用户说"今日论文推荐"等触发词时，自动跑完 daily-papers 三步流水线（fetch→review→notes），全程静默不发中间状态，结束后只用一句话报告：推荐文件路径 + 必读笔记篇数 + 目录页刷新状态
trigger_keywords: ["今日论文推荐", "论文推荐", "daily papers", "论文流水线", "跑论文流水线", "过去一周论文推荐", "过去3天论文推荐", "过去N天论文推荐", "最近论文推荐", "最近3天论文", "最近5天论文", "看看这周有啥论文", "跑一下论文推荐"]
source: date=2026-06-30
version: 4
updated_at: 2026-07-25T00:00:00
---

# 每日论文推荐三步流水线静默一句话汇报

## 步骤

1. 识别触发词（"今日论文推荐"、"过去 N 天论文推荐"、"最近 N 天论文"、"看看这周有啥论文"、"跑一下论文推荐"），调用 `daily-papers` 总入口。
2. 内部依次串联三步 skill，**三步必须一口气跑完，不要中途停下问用户**，每一步之间**不发任何中间状态消息**（不发 "正在抓取"、"fetch 完成"、"开始 review"、"点评完成"、"笔记生成中"、临时文件路径、抓取论文数量、去重数量等）：
   - **Step 1 论文抓取（fetch）**：调用 `daily-papers-fetch` skill，抓取 arXiv + HuggingFace 最新论文，打分筛选，富化信息，输出到 `/tmp/daily_papers_enriched.json`。
   - **Step 2 论文点评（review）**：调用 `daily-papers-review` skill，读取富化数据，扫描 Obsidian 笔记库去重，生成推荐点评文件，保存到 `/home/xinmiao/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`，并更新 history。
   - **Step 3 论文笔记（notes）**：调用 `daily-papers-notes` skill，补充概念库，为"必读（🔥）"推荐生成完整笔记，链接回填到推荐文件；自动刷新 concept / paper 目录页（MOC）。
3. **全程静默**：三步之间的进度、临时文件路径、抓取论文数量、去重数量等全部不通过 cc-connect/推送通道发出，只在 stdout 日志。
4. 收尾**只回复一句话**汇报，必含三要素（推荐文件路径 + 必读笔记篇数 + 目录页刷新状态），格式：
   ```
   推荐文件已生成 `<推荐文件绝对路径>`（必读 X + 值得看 Y + 可跳过 Z 篇，简评一句），重点论文笔记生成 N 篇（列出 slug：论文A / 论文B），目录页已自动刷新（concept A / paper B）。
   ```

## 注意

- 支持多天模式："过去 3 天"、"过去一周"、"最近 5 天" → 传给 fetch 阶段的时间窗口参数
- 推荐文件路径必须给完整绝对路径（`/home/xinmiao/ObsidianVault/DailyPapers/YYYY-MM-DD-论文推荐.md`），方便用户点开
- 必读 / 值得看 / 可跳过三档数量都要给，并附一句简评
- 笔记篇数报**新生成**的篇数，并列出每篇笔记的论文短名 / slug；若必读论文复用了已有笔记，单独说明（如"另 1 篇复用已有笔记"）
- 目录页刷新状态明确说 "已自动刷新（concept A / paper B）"（可附概念/论文数）或 "未刷新（原因）"
- 目录页刷新失败时，一句话报告里明确写"目录页未刷新（原因）"，不额外发状态消息
- 报告可顺带一句当日亮点论文摘要（如必读论文的核心发现），但整体严格保持一句话/一段以内，不要展开分段总结
- arXiv API 超时是常见情况，可仅靠 HuggingFace trending 撑场，在报告里注明即可，不算失败
- 只有最终一句话报告发给用户，中间过程一律静默
- git 自动化默认关闭，不要自动 commit/push Obsidian 库，也不要在汇报里提交
