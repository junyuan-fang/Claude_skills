---
name: nvidia-daily-news-v3-anti-throttle
description: 通过 cc-connect 微信通道每日推送 NVIDIA 新闻摘要，采用头条+深度+配图三段式结构，规避 ret=-2 节流锁死通道
trigger_keywords: ["NVIDIA 摘要", "NVIDIA 新闻", "nvidia daily", "每日 NVIDIA", "NVIDIA cron", "英伟达新闻"]
source: date=2026-05-17
version: 1
updated_at: 2026-05-18T03:30:28
---

# 每日 NVIDIA 新闻摘要 v3（深度版 + 分段防节流）

## 适用场景

用 cc-connect 微信通道每天定时推送 NVIDIA 新闻摘要时使用。核心矛盾：单条长文字 + 多图必触发 ret=-2 节流（第 3 张图必锁死通道），但用户又要求每条新闻有公司/技术/数据/对比的深度展开，不能只列关键词。

## 步骤

### Step 1: 搜索 + 撰写归档（不限字数）

1. 搜 NVIDIA 最近 24 小时重要新闻（新品/合作/技术/财报/股价/地缘），优先源：nvidianews.nvidia.com、blogs.nvidia.com、Bloomberg、CNBC、Stocktitan、TechCrunch。
2. 每条新闻做尽调式扩展，必带以下 4 类细节中至少 2 类：
   - **公司/产品背景**：例 "IREN 是澳洲挖矿转型 AI 算力的数据中心运营商"、"GR00T 是 NVIDIA 通用人形机器人基础模型系列"
   - **技术细节**：参数量、训练数据、benchmark、推理延迟、硬件平台（GB300/Rubin/Blackwell/DGX Spark）
   - **数据/财务**：合作金额、产能 GW、新增岗位、目标价升降、股价反应
   - **业内意义**：vs AMD/Broadcom/华为昇腾/SK 海力士、产业链位置
3. 完整深度版写到 `/home/xinmiao/code/claude_bot/news_archive/nvidia-$(date +%Y-%m-%d).md`，越详细越好。

### Step 2: 准备两段推送文字

4. **第 1 段 - 头条快报（≤700 字符）**：开头 1 句"今日 NVIDIA 主线"+ 5 条要点（标题 + 关键数据 + 1 句背景），末尾标 "(深度细节见第 2 段)"。
5. **第 2 段 - 深度展开（≤700 字符）**：挑 1-2 个 item deep dive，必带公司是什么/技术怎么做/具体数字/一句业内对比，末尾附 2-3 个权威源链接。
6. 口语化，少用并列符堆词，多用 "x 倍、y 万、z 亿" 具体数字。

### Step 3: 准备 1 张配图

7. 抓最具代表性的 1 张图（产品图/CEO 照/发布会/新闻封面），下载到 `/tmp/nvidia_daily.jpg`。
8. `file /tmp/nvidia_daily.jpg` 确认是图片格式，>100KB 则 `convert` 压到 ≤80KB JPEG。
9. **只准备 1 张**，绝不多张。

### Step 4: 严格顺序发送（共 3 次，每次间隔 30s）

10. `cc-send-safe -m "<头条快报>"`
11. `sleep 30`
12. `cc-send-safe -m "<深度展开>"`
13. `sleep 30`
14. `cc-send-safe --image /tmp/nvidia_daily.jpg`（一次性，失败不重试）

### Step 5: 收尾（静默版）

15. 不发任何 reply 状态消息（避免中间态干扰用户）。
16. `ls -la /home/xinmiao/code/claude_bot/news_archive/ | tail -3` 确认归档。

## 绝对禁止

- 不能发 2 张及以上图片（第 3 张必锁死通道）
- 图片失败后不能重试图片（每次失败请求加深节流）
- 图片失败后不能再发任何文字（会触发节流升级）
- 不能省略 sleep 30（连发触发短窗口节流）
- 文字里不能只列关键词（违背深度版宗旨）
- 不能依赖 cc-connect auto-reply 发摘要正文（长 chunk 易丢且无持久重试）

## 失败兜底

- 文字发送失败 → 报错停止，不继续发图
- 图片失败 → reply 备注 "图片本次未发出（通道节流），归档可看完整图文"
- 4 小时通道完全静默仍 ret=-2 → 需 `cc-connect weixin setup --project claude_bot` 扫码换 token（daemon 重启不解决，token 黑名单会持续）

## 用户偏好

多步任务执行时，不要每个 background task 完成就刷状态消息，只在末尾发一句汇总（参考 feedback_no_intermediate_status）。
