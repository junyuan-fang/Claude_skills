# 用户画像

## 偏好风格
- 极度重视静默执行：全程不发中间态状态消息，只发实际内容,收尾也不发"任务完成/已推送"类噪音
- 结果汇报要极简：一句话说清路径 + 关键产物数量 + 目录页刷新状态即可
- 内容深度优先：每条新闻要做"尽调式扩展",能让不熟领域的人 30 秒抓住 why-it-matters,而非罗列关键词
- 数字化表达:偏好"x 倍/y 万/z 亿"具体数字,不喜欢并列符堆词
- 已熟概念不要再解释(VLA/WAM/VLM/Sim2Real/Diffusion Policy/Imitation Learning/RL 等),只解释真正冷门/新生术语
- 概念是否需要解释的判定标准:谷歌一搜有 Wikipedia 条目的概念一律不解释
- 接受"重复触发时主动跳过 + 简短说明理由"的判断,重于机械执行(2026-08-10 同日二次触发未重发)
- 汇报中带"今日主题脉络"洞察与"我核实后修正了哪些事实"是加分项(2026-08-27 论文档),比纯数字清单更有价值
- 汇报语言应保持中文:2026-08-28 两档均出现英文开场句("I'll write the two push segments now."、"All three stages are done."),与其中文习惯不符

## 技术栈与角色
- 具身智能 / 3D 视觉 / 点云分割方向研究者,深度使用 Pointcept、Volt、SPFormer
- 机器 GPU 为 RTX 5090(cu128),常运行训练/推理任务
- 日常工具链:Obsidian 笔记库(DailyPapers)、Claude Code 多 skill 流水线、cc-connect 微信推送通道、飞书触发、arXiv/HuggingFace papers
- 熟悉学术论文写作规范与 arXiv ID 编码(YYMM 前缀)

## 近期项目
- 每日 NVIDIA 新闻推送(v3.1 静默深度版):归档 + 头条快报 + 深度展开 + 1 张配图三段式,归档到 `~/code/claude_bot/news_archive/nvidia-YYYY-MM-DD.md`
- 每日具身智能新闻推送(v1.3):行业+论文混编,论文强制 14 天窗口(HF daily 优先+arXiv abstract 精校),归档每篇必带 `- Project: <url>` 供下游 awesome-physical-ai ingest
- daily-papers 三步流水线(fetch→review→notes):日更 Obsidian 论文笔记与目录页;推荐文件位于 `~/code/claude_bot/Obsidian_Vault/DailyPapers/YYYY-MM-DD-论文推荐.md`
- 概念/论文库持续增长(2026-07-31 为 813/81,2026-08-13 为 1098/101,2026-08-27 已达 1301/113);概念库单日新增 18-44 条
- 论文笔记已支持双 vault 同步
- 推荐文件稳定做三档分流,近日固定为 20 篇(6 必读 / 7 值得看 / 7 可跳过),并注明因超 14 天窗口或跑题被排除的论文(2026-08-27 排除 10 篇)
- 3D 点云分割与具身模型跟进:Xiaomi-Robotics-1、DriftWorld、FastWAM、GigaWorldPolicy、AlayaWorld、MVA、ABot-World-0、HOST、Orca、FlowWAM、Kairos、DataPyramid、FeelWorld、HiFi-UMI、DC-WAM、πR²、TurboVLA、CheckVLA、Auto-JEPA、WCM、Faster-WAM、Ego2Robot、WorldCycle、BridgeVLA++、WorldTrace、WorldSimProbe、EchoWM、LAWA、GaussianWAM、TrAct、LeFlow 等
- 当前关注 WAM"中间表征之争":latent action(LAWA) vs 3DGS 蒸馏(GaussianWAM) vs visual tracks(TrAct),均针对 Fast-WAM 砍未来分支后泛化下降的问题
- 论文笔记支持复用:同一论文多日再推时复用已有笔记(Xiaomi-Robotics-1、AlayaWorld、MVA、DataPyramid、ABot-World-0、πR² 均已多次复用),不重复生成
- 必读笔记篇数与长度浮动:常见 2 篇 350-780 行,单篇可长至 811-966 行;也可单日 6 篇 401-567 行
- 笔记生成可交由后台 agent 并行(单日常见 5-6 个 agent),主流程需逐个回收回报并做行数/完整性校验后才算收尾
- 笔记完整性校验包含固定小节存在性检查(`## 关键公式`、`## 实验结果`)、公式/配图达标、链接与分流表 wikilink 对齐实际文件名
- 周末档降级策略:arXiv 宕机时用 HF Trending 兜底,再推占比高
- 非 embodied 论文(如 KimiK3)、涉及数据集协议内容(如 CG-World)、摘要信息不足(如 ACE-Data-0)、或留待用户按需精读(如 DF³)的论文即使入选推荐也可不生成笔记
- 因额度/API 故障漏跑的档次可在后续日期补跑(2026-08-10 补齐 8/7 论文流水线)

## 沟通习惯
- 用超长结构化 prompt 指定完整流程:Step 1-5 + 【绝对禁止】清单,细化到 sleep 秒数、字符上限、发送顺序
- 通过飞书 open_id 触发 cron/手动任务(ou_90d9f956...),固定日程:07:00 NVIDIA、07:15 论文推荐、07:45 具身新闻;触发时刻偶有分钟级漂移
- 2026-08-26 起稳定为"NVIDIA(07:00) + 论文推荐(07:15)"两档,连续 08-26/08-27/08-28 触发;具身档自 08-26 起连续缺席
- 论文推荐档已简化为一句话调用:"走完 daily-papers 三步流水线,静默,完成后一句话报路径 + 笔记篇数 + 目录页刷新状态"
- 周末(8/22、8/23)未见触发记录,说明日程以工作日为主
- 部分日期只跑单档(2026-08-18 仅 NVIDIA),说明日程可临时缩减
- 新闻类任务 prompt 逐字重发,内容长期稳定,视为不可协商的执行规范
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
- 论文摘要里的宣称需二次核实:2026-08-27 发现 LAWA "Efficient" 是相对 Joint-WAM 而非 Fast-WAM(实测慢 72%)、LeFlow 实为四基准评测——笔记应以核实后事实为准
- RTX 5090 NVIDIA 显示引擎易 wedge,只有完整 reboot 能清;GUI 走 TurboVNC+Xfce 端口 5903
- Claude 工作产物统一放 `~/code/claude_bot/` 下管理
- 2026-07-22 OAuth token 撤销致全天任务 401;2026-08-06 NVIDIA 与具身两档均报 API ConnectionRefused;需持续关注认证与 API 连通状态
- 用量配额耗尽是常见失败模式:2026-08-07 论文推荐与具身新闻两档均报"You've hit your limit · resets 8:30am",07:00-08:30 密集任务易撞额度上限
- NVIDIA 档耗时波动极大(8/18 1533 秒、8/21 1896 秒、8/24 1370 秒、8/25 1190 秒、8/26 846 秒、8/27 394 秒),偶有短耗时(8/17 267 秒)
- 具身档耗时典型 700-1300 秒(8/19 219 秒、8/21 756 秒、8/24 1279 秒、8/25 875 秒),可跑到 08:00 之后
- 论文推荐档耗时不稳:8/26 2530 秒、8/27 2710 秒(跑满 07:15-08:00),但 8/28 仅 71 秒——异常短耗时须核对推荐文件与笔记是否真正生成
- 定时任务执行结果需事后核对:多次出现响应错位、空响应(2026-08-12 NVIDIA 档仅回零宽字符)、只回响应时间无内容摘要的情况
- 2026-08-28 NVIDIA 档回复泄漏了中间态过程句("I'll write the two push segments now."、"Sending now."),直接违反静默规范,需重点防范
- 新闻类任务只回"响应时间 X 秒"无摘要已成常态(2026-07-27 起持续),需人工核对归档文件与实际推送是否真正执行
- 论文推荐档回报格式不稳定:8/26 退化为单篇笔记校验确认、8/27 给了多段汇报、8/28 较接近一句话要求——目标是简洁三要素,额外洞察可加但不要淹没主信息
