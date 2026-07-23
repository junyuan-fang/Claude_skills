# 用户画像

## 偏好风格
- 极度重视静默执行：全程不发中间态状态消息，只发实际内容,收尾也不发"任务完成/已推送"类噪音
- 结果汇报要极简：一句话说清路径 + 关键产物数量 + 目录页刷新状态即可
- 内容深度优先：每条新闻要做"尽调式扩展",能让不熟领域的人 30 秒抓住 why-it-matters,而非罗列关键词
- 数字化表达:偏好"x 倍/y 万/z 亿"具体数字,不喜欢并列符堆词
- 已熟概念不要再解释(VLA/WAM/VLM/Sim2Real/Diffusion Policy/Imitation Learning/RL 等),只解释真正冷门/新生术语

## 技术栈与角色
- 具身智能 / 3D 视觉 / 点云分割方向研究者,深度使用 Pointcept、Volt、SPFormer
- 机器 GPU 为 RTX 5090(cu128),常运行训练/推理任务
- 日常工具链:Obsidian 笔记库(DailyPapers)、Claude Code 多 skill 流水线、cc-connect 微信推送通道、arXiv/HuggingFace papers
- 熟悉学术论文写作规范与 arXiv ID 编码(YYMM 前缀)

## 近期项目
- 每日 NVIDIA 新闻推送(v3.1 静默深度版):归档 + 头条快报 + 深度展开 + 1 张配图三段式,归档到 `~/code/claude_bot/news_archive/nvidia-YYYY-MM-DD.md`
- 每日具身智能新闻推送(v1.3):行业+论文混编,论文强制 14 天窗口(HF daily 优先+arXiv abstract 精校),归档每篇必带 `- Project: <url>` 供下游 awesome-physical-ai ingest
- daily-papers 三步流水线(fetch→review→notes):日更 Obsidian 论文笔记与目录页,概念库/论文库分别索引(2026-07-23 已到 695 概念 / 72 论文)
- 3D 点云分割实验:Xiaomi-Robotics-1、DriftWorld、FastWAM、GigaWorldPolicy、AlayaWorld、MVA、Orca、FlowWAM 等模型跟进
- 论文笔记支持复用:同一论文多日出现时复用已有笔记(如 Xiaomi-Robotics-1),不重复生成

## 沟通习惯
- 用超长结构化 prompt 指定完整流程:Step 1-5 + 【绝对禁止】清单,细化到 sleep 秒数、字符上限、发送顺序
- 通过飞书 open_id 触发 cron/手动任务(ou_90d9f956...),固定日程:07:00 NVIDIA、07:15 论文推荐、~07:45/15:44 具身新闻
- 中文为主,技术术语混用英文
- 反复强调"绝对禁止"事项,说明曾被违反过

## 已知事实
- 用户已熟知概念清单(不要再解释):VLA、WAM、VLM、Sim2Real、Teleoperation、Diffusion Policy、Imitation Learning、RL、Behavior Cloning、Foundation Model、Whole-body Control、ZMP、MPC、CMA-ES、四足、humanoid、灵巧手、locomotion
- 关注公司:宇树、智元、银河通用、星海图、星动纪元、Figure、1X、Apptronik、Agility、Boston Dynamics、Tesla Optimus、小鹏 IRON、UBTech、星尘智能、自变量
- 邮箱:fangjunyuan1@gmail.com
- 机器 IP 10.10.30.49(内网),配置有 Qunhe VPN(NetworkManager `qunheVPN-k8s-xs`,`vpn up/down/status` 脚本)
- 使用 Qunhe DevOps MCP(`@qunhe/devops-mcp` + MOON_TOKEN)对接内网 cf.qunhequnhe.com Confluence

## 注意事项
- 推送图片一天最多 1 张,第 3 张必触发 ret=-2 节流锁死;失败不能重试
- 每次 cc-send-safe 之间强制 sleep 30,连发会触发短窗口节流
- 图片失败后不能再发任何文字(会触发节流升级)
- 论文引用严格 14 天窗口:arXiv ID YYMM 粗筛 + abstract 页 submission date 精校;搜不到就宁可不放论文项,绝不把老论文包装成"今日新发"
- 具身论文归档每篇必带 `- Project: <url>` 行(项目主页 > GitHub > demo,找不到写 N/A),下游自动 ingest 依赖
- RTX 5090 NVIDIA 显示引擎易 wedge,只有完整 reboot 能清;GUI 走 TurboVNC+Xfce 端口 5903
- Claude 工作产物统一放 `~/code/claude_bot/` 下管理
- 2026-07-22 OAuth token 被撤销导致全天三个定时任务(NVIDIA/论文/具身)全部 401 失败,2026-07-23 已恢复;需关注认证状态
- 2026-07-23 出现任务响应错位(NVIDIA prompt 收到论文推荐的回复),且流水线耗时可达 2760 秒;定时任务执行结果需事后核对
