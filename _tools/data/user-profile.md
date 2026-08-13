# 用户画像

## 偏好风格
- 极度重视静默执行：全程不发中间态状态消息，只发实际内容,收尾也不发"任务完成/已推送"类噪音
- 结果汇报要极简：一句话说清路径 + 关键产物数量 + 目录页刷新状态即可
- 内容深度优先：每条新闻要做"尽调式扩展",能让不熟领域的人 30 秒抓住 why-it-matters,而非罗列关键词
- 数字化表达:偏好"x 倍/y 万/z 亿"具体数字,不喜欢并列符堆词
- 已熟概念不要再解释(VLA/WAM/VLM/Sim2Real/Diffusion Policy/Imitation Learning/RL 等),只解释真正冷门/新生术语
- 概念是否需要解释的判定标准:谷歌一搜有 Wikipedia 条目的概念一律不解释
- 接受"重复触发时主动跳过 + 简短说明理由"的判断,重于机械执行(2026-08-10 同日二次触发未重发)

## 技术栈与角色
- 具身智能 / 3D 视觉 / 点云分割方向研究者,深度使用 Pointcept、Volt、SPFormer
- 机器 GPU 为 RTX 5090(cu128),常运行训练/推理任务
- 日常工具链:Obsidian 笔记库(DailyPapers)、Claude Code 多 skill 流水线、cc-connect 微信推送通道、飞书触发、arXiv/HuggingFace papers
- 熟悉学术论文写作规范与 arXiv ID 编码(YYMM 前缀)

## 近期项目
- 每日 NVIDIA 新闻推送(v3.1 静默深度版):归档 + 头条快报 + 深度展开 + 1 张配图三段式,归档到 `~/code/claude_bot/news_archive/nvidia-YYYY-MM-DD.md`
- 每日具身智能新闻推送(v1.3):行业+论文混编,论文强制 14 天窗口(HF daily 优先+arXiv abstract 精校),归档每篇必带 `- Project: <url>` 供下游 awesome-physical-ai ingest
- daily-papers 三步流水线(fetch→review→notes):日更 Obsidian 论文笔记与目录页,概念/论文库持续增长(2026-07-31 为 813/81,2026-08-05 为 877/85,2026-08-07 补跑后为 903/87,2026-08-13 已达 1098/101)
- 论文笔记已支持双 vault 同步
- 3D 点云分割与具身模型跟进:Xiaomi-Robotics-1、DriftWorld、FastWAM、GigaWorldPolicy、AlayaWorld、MVA、ABot-World-0、HOST、Orca、FlowWAM、Kairos、DataPyramid、FeelWorld、HiFi-UMI、DC-WAM、πR²、TurboVLA、CheckVLA、Auto-JEPA、WCM、Faster-WAM、Ego2Robot、WorldCycle、BridgeVLA++、WorldTrace、WorldSimProbe 等
- 论文笔记支持复用:同一论文多日再推时复用已有笔记(Xiaomi-Robotics-1、AlayaWorld、MVA、DataPyramid、ABot-World-0、πR² 均已多次复用),不重复生成
- 必读笔记通常每日 2 篇、350-780 行/篇;单篇可长至 811-966 行(Kairos 811、WorldSimProbe 864、WorldTrace 966)
- 笔记生成可交由后台 agent 并行(单日常见 5 个 agent),主流程需逐个回收回报并做行数/完整性校验后才算收尾
- 周末档降级策略:arXiv 宕机时用 HF Trending 兜底,再推占比高
- 非 embodied 论文(如 KimiK3)、涉及数据集协议内容(如 CG-World)、摘要信息不足(如 ACE-Data-0)、或留待用户按需精读(如 DF³)的论文即使入选推荐也可不生成笔记
- 因额度/API 故障漏跑的档次可在后续日期补跑(2026-08-10 补齐 8/7 论文流水线)

## 沟通习惯
- 用超长结构化 prompt 指定完整流程:Step 1-5 + 【绝对禁止】清单,细化到 sleep 秒数、字符上限、发送顺序
- 通过飞书 open_id 触发 cron/手动任务(ou_90d9f956...),固定日程:07:00 NVIDIA、07:15 论文推荐、07:45 具身新闻,周末照常运行;触发时刻偶有分钟级漂移
- 每日任务 prompt 逐字重发,内容长期稳定,视为不可协商的执行规范
- 同一档任务偶有同日重复触发(cron + 手动),需判重而非盲目重发
- 中文为主,技术术语混用英文
- 反复强调"绝对禁止"事项,说明曾被违反过

## 已知事实
- 用户已熟知概念清单(不要再解释):VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、humanoid、灵巧手、locomotion
- 关注公司:宇树、智元、银河通用、星海图、星动纪元、Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON、UBTech、星尘智能、自变量、Simple AI、华为、HUST、同济、复旦、人大、Qwen
- 关注科研机构:CASIA、BAAI、SJTU、清华、密歇根、华为诺亚等国内外高校/实验室的具身与世界模型工作
- 关注宇树 IPO 进程(2026-08-10 网下申购 2618 倍,打新 9:30 开始)
- 邮箱:fangjunyuan1@gmail.com
- 时区为 Asia/Shanghai
- 机器 IP 10.10.30.49(内网),配置有 Qunhe VPN(NetworkManager `qunheVPN-k8s-xs`,`vpn up/down/status` 脚本)
- 使用 Qunhe DevOps MCP(`@qunhe/devops-mcp` + MOON_TOKEN)对接内网 cf.qunhequnhe.com Confluence

## 注意事项
- 推送图片一天最多 1 张,第 3 张必触发 ret=-2 节流锁死;失败不能重试
- 每次 cc-send-safe 之间强制 sleep 30,连发会触发短窗口节流
- 图片失败后不能再发任何文字(会触发节流升级)
- 同日同档重复触发时不要重发相同内容,会加深通道节流;改为简短说明已推送情况
- 论文引用严格 14 天窗口:arXiv ID YYMM 粗筛 + abstract 页 submission date 精校;搜不到就宁可不放论文项,绝不把老论文包装成"今日新发"
- 具身论文归档每篇必带 `- Project: <url>` 行(项目主页 > GitHub > demo,找不到写 N/A),下游自动 ingest 依赖
- RTX 5090 NVIDIA 显示引擎易 wedge,只有完整 reboot 能清;GUI 走 TurboVNC+Xfce 端口 5903
- Claude 工作产物统一放 `~/code/claude_bot/` 下管理
- 2026-07-22 OAuth token 撤销致全天任务 401;2026-08-06 NVIDIA 与具身两档均报 API ConnectionRefused;需持续关注认证与 API 连通状态
- 用量配额耗尽是常见失败模式:2026-08-07 论文推荐与具身新闻两档均报"You've hit your limit · resets 8:30am",07:00-08:30 密集三连任务易撞额度上限,当日仅 NVIDIA 档成功
- 三连任务窗口拥挤:NVIDIA 档单次 335-628 秒、具身档 709-1006 秒、论文档 1400-2340 秒,叠加后极易在 08:30 额度重置前耗尽配额
- 定时任务执行结果需事后核对:多次出现响应错位、空响应(2026-08-12 NVIDIA 档仅回零宽字符)、只回响应时间无内容摘要的情况
- 流水线耗时波动大(1 秒~2760 秒),超长耗时可能与响应异常相关,长时间无回复不代表失败
- 新闻类任务只回"响应时间 X 秒"无摘要已成常态(2026-07-27 起),需人工核对归档文件与实际推送是否真正执行
- 论文推荐档末尾回报常变成后台 agent 回执确认(如 WorldTrace 966 行、WorldSimProbe 864 行、8/13 五 agent 全部回执),而非完整流水线一句话摘要
