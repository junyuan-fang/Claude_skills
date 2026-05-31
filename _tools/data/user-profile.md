# 用户画像

## 偏好风格
- 微信渠道收到的资讯类消息要求图文并茂，命令行/纯代码类问题无需配图
- 喜欢条理清晰的分点总结，带来源链接
- 助手回复末尾需附"响应时间 X 秒"
- 喜欢先看一个小样例（如发 logo 验证）再决定是否推广到定时任务
- 偏好统一的目录归集管理（cc-connect 产物集中放 `~/code/claude_bot/`）
- 希望第三方 skill 真文件落到自己的私人 repo，上游 repo 通过软链同步，方便提交
- 遇到棘手问题倾向于让助手"多次尝试、做对照实验"，自己挑选最佳方案
- 偏好长期健康的系统化方案而非每次救火式临时修复
- 不喜欢看工具调用/后台任务/中间步骤的状态汇报，多步任务只要末尾一句汇总
- 推送内容偏好"尽调式深度"：每条要带公司背景、技术细节、具体数字、业内对比，而非堆关键词
- 已熟领域术语（VLA/WAM/Sim2Real/Teleoperation/Diffusion Policy/VLM/RL/IL/MPC/ZMP/locomotion/dexterous manipulation/Actor-Critic 等）无需解释，只解释真正新生/小众术语和公司业务背景
- 论文引用必须做日期硬校验，"今日论文"要求 14 天内（5/20 后口径），HuggingFace daily 优先，搜不到就宁可不放也不包装老论文
- 展示自己造的工具/产物时喜欢看"实物 + 实现方式"两件套（如要 mp4 同时要架构说明），实现说明偏好分模块+阶段化分解
- 偶尔通过简短问候（"你好""还工作吗"）做存活探活，期待秒回 + 顺带汇报已有 cron 状态
- 询问技术名词时常带笔误/截断（如"nvidiafffinc""nv diff"），期待助手猜出最可能候选并用表格列出对比，必要时追问澄清
- 名词追问回复偏好"是什么 + 三件套/系列对比表 + 为什么重要 + 作者/出处"四件套结构
- 对错拼名词的反馈极简（下一条只补两字"nv diff 的"），期待助手立即把第一轮的候选表替换成正确栈再展开
- 看长文公众号/论文解读时，期待助手提炼"主线判断 + 技术三件套表格 + 实验数字 + 作者金句"，并对核心概念加单独词条解释

## 技术栈与角色
- 关注 AI 基础设施与具身智能行业动态，非纯开发者视角
- 熟悉 cc-connect 工具链，了解 npm 全局安装与 daemon 机制
- 对调度器、消息桥接、会话复用等底层架构有探究兴趣
- 熟悉 conda 环境管理、git 仓库与软链组织
- 已使用 Zotero（含 Better BibTeX）+ Obsidian 的论文/笔记工作流
- 具身智能领域有较深背景，掌握常见 ML/机器人学术语，无需基础概念扫盲
- 关注短视频内容生产（YouTube Shorts 1080×1920 竖屏 9:16），了解 TTS/ASR/SDXL/NVENC 等多模态视频流水线
- 关注可微渲染 / 3D 重建 / 神经渲染方向（nvdiffrast / nvdiffrec / nvdiffmodeling 三件套、PyTorch3D、Mitsuba 3、Dr.Jit），与具身智能合成数据 pipeline 相关
- 关注 VLA + 世界模型 + Critic/RLHF 范式融合方向，跟踪罗剑岚 SERL → HIL-SERL → LWD → τ0-WM 这条评价驱动技术线

## 近期项目
- 通过 cc-connect 在微信/飞书端与 Claude 对话，工作目录 `/home/xinmiao/code/claude_bot`
- 每日 NVIDIA 新闻图文推送，cron ID `a285150d`，**5/31 起改为工作日 `0 8 * * 1-5`**（v3.1 静默深度版：头条 + 深度 + 单图，三段间隔 30s）
- 每日具身智能新闻图文推送，cron ID `d667c0db`，**5/31 起改为工作日 `0 12 * * 1-5`**（v1.3：行业 + 论文混编，论文必须 14 天内，HF daily 优先，arXiv ID YYMM 粗筛 + abstract 精校）
- 归档目录 `~/code/claude_bot/news_archive/`（NVIDIA + embodied 两套完整版 markdown）
- 集成 huangkiki/dailypaper-skills：真文件在 `~/code/Claude_skills/`，上游 repo 留在 `~/code/claude_bot/dailypaper-skills/` 反向软链供 git pull
- dailypaper-video 流水线 `~/code/claude_bot/dailypaper-video/`：7 阶段把日推荐 md 转 1080p 竖屏 mp4，串行调度 F5-TTS → faster-whisper → SDXL Lightning → ffmpeg NVENC，准备投 YouTube Shorts（手动审核，v1 不自动上传）
- 已产出首版样片 `2026-05-20-papers.mp4`（1080p / 60-90s / 3.89 MB / 8 篇 2605.xxxxx 论文，全部 14 天内）
- 关注方向包含 World Action Model (WAM)、Physical AI、VLA、Diffusion Policy、Sim2Real、τ0-WM 世界模型、Critic 驱动 RL 后训练
- 持续探索微信图片接口节流规律，做频率 vs 日累计的对照实验
- 已开始使用飞书通道（session id `ou_…` 前缀），可在飞书端触发任务；飞书直传 mp4 会报 `code=230055`，需走封面图 + zip 打包
- 两个日推 cron 在 5/24–5/31 期间稳定运行，响应时间 75–119 秒区间，无中间态噪音

## 沟通习惯
- 用中文交流，语气随意，偶有错别字或被掐断的半句话（如 deam0 = demo、健 = 建、dialypaper = dailypaper、leverb = LeVERB、洗 = 稍、nvidiafffinc / nv diff = nvdiffrast）
- 习惯追问实现原理，对底层机制感兴趣
- 一次只问一个点，多轮递进
- 会先小步验证（如先发个 icon 试水）再扩展功能
- 目录/架构调整会反复纠正直到符合心智模型，需要先听清意图再动手
- 消息可能被截断，遇到不完整提问时应列出最可能的几个意图请其确认
- 被动等待时会主动追问"进展咋样""怎么样了"，需要中途主动汇报状态（但要简洁，别堆中间态）
- 验证迭代节奏：要求改动后会立刻说"你再跑一次我看看效果"
- 会基于自身领域知识抓助手的事实错误（如指出 LeVERB 是 2025 年旧作），期待立即修正 + 加入校验规则避免复发
- 改需求多以一句话短指令下达（如"改一下，今日论文必须两个礼拜内的"、"把每天八点和12点改成工作日才启动"），期待助手立即落到 cron prompt/schedule 并同步 memory
- 一次请求里常并列多个产物（如"实现方式发我 + 做的 mp4 也发过来"），期待一次性都给齐
- 名词追问常用极短回复修正（如先问错拼，下一条只补"nv diff 的"），期待助手快速重新对齐
- 飞书 reply chain 回复时，新内容常附在引用块尾部一行（如末尾单独一句"nv diff 的"），需要扫到引用结尾才能拿到真正问题
- 阅读长文后会就文中术语（如"critic"）追问独立词条，期待助手不重复全文背景、直接给定义+变体表+在该语境的特殊点

## 已知事实
- 关注领域：具身智能、人形机器人、NVIDIA、AI 算力与模型发布、World Action Model、Physical AI、可微渲染/3D 重建、VLA + 世界模型 + Critic 路线
- 通过微信会话与助手交互（session 绑定 weixin:dm），也使用飞书会话（`ou_…`）
- 系统用户 xinmiao，cc-connect 装在 `/home/a/miniforge3/lib/node_modules/cc-connect/`
- cc-connect daemon 任务存储在 `~/.cc-connect/crons/jobs.json`，日志在 `~/.cc-connect/logs/cc-connect.log`
- 私人 skills repo：`~/code/Claude_skills/`（远端 junyuan-fang/Claude_skills），通过 `~/.claude/skills` 软链生效
- Zotero 数据在 `~/Zotero/`（含 storage 子目录），Obsidian vault 在 `~/ObsidianVault/`，Obsidian AppImage 在 `~/Applications/Obsidian-1.12.7.AppImage`
- conda 环境 `dailypaper`（Python 3.10）已建好，用于跑 dailypaper-skills 流水线
- 微信图片发送 wrapper `cc-send-safe` 部署在 `~/code/claude_bot/bin/`，通过 `/home/a/.local/bin/` 软链入 PATH
- cc-connect send 返回 success 仅代表入队，不等于真实送达；真实状态需读 daemon 日志确认
- 节流锁定后 daemon 重启可清零反垃圾计数（等同 token reset），但不换 token，下次 cron 跑可能立刻重新被锁
- 微信通道节流可持续 >24h 不自然恢复，唯一彻底解锁手段是扫码换 token (`cc-connect weixin setup --project claude_bot`)
- cron 触发关键词模式："深度版"（v3.1 NVIDIA / v1.3 embodied），均含静默无中间态 + 已熟概念不解释 + 论文 14 天内
- 单卡 24GB 资源（用于 dailypaper-video 模型串行调度）
- daily-papers 流水线分三步：fetch（纯 Python 零 token，HF + arXiv API 打分去重富化）→ review（Claude 锐评分🔥/👀/💤）→ notes（Claude 编排 paper-reader，质量阈值≥120 行/2 公式/1 图）
- daily-papers 配置在 `_shared/user-config.json`（路径、关键词、打分规则、自动化开关）
- daily-papers review 阶段硬约束：不能凭空说"只有仿真"，必须查 `has_real_world` 字段
- daily-papers notes 阶段会扫所有 `[[概念]]` 链接 + `method_names` 自动归类到 16 个概念子目录，并自动刷新 MOC，git 自动化可选
- 飞书短问候 / Cyber Policy 拒答事件：cc-connect 飞书入口可能命中 Anthropic Usage Policy 触发自动拒答（公众号链接也可能命中），需引导切模型或换适配器
- 用户 Cyber 限流时被建议切 `claude-sonnet-4-20250514`
- nvdiffrast / nvdiffrec / nvdiffmodeling 是 NVIDIA Research 可微渲染三件套（NVlabs 出品，Samuli Laine / Janne Hellsten / Jaakko Lehtinen 等芬兰组作者，与 StyleGAN / Instant NGP 同一拨人），与 PyTorch3D / Mitsuba 3 / Dr.Jit 并列可微渲染主流栈
- NVIDIA 商用渲染器栈：Iray（离线 PBR）/ OptiX（RTX SDK 底层）/ Omniverse RTX Renderer（实时光追，Isaac Sim 用）/ Falcor（开源研究框架）/ NeuralVDB+vMaterials（体积材质）
- 罗剑岚团队技术线：SERL → HIL-SERL → LWD（2026-05 初）→ τ0-WM（2026-05-31 开源），主线是"评价（critic）驱动真机 RL"
- τ0-WM 关键事实：Wan2.2 视频主干 + 并联 Action DiT + Simulator 打分头；17800h 真机遥操 + 6500h UMI + 3000h ego video ≈ 3 万小时；43% → 60%（+RCS+LAR），vs ACG baseline 22 个点提升；repo `sii-research/tau-0-wm`
- "天南具身公园"是关注的具身算法行业评论公众号（作者天南）

## 注意事项
- 微信推送默认带配图，图片源失败时可降级为纯文本
- 微信图片接口出现 ret=-2 时为服务端节流，需走 cc-send-safe（压图+退避），严重时只能等数小时或扫码重置 token / 重启 daemon
- 节流是 chunk 长度敏感的：短消息（~80-400 字）通常仍可过，长消息（>1000 字）会被拒
- 长文 cron（>1500 字符 / 多 chunk）易被微信判垃圾整条丢弃，必须走 wrapper 直发并控制字符数
- cron 任务中**不要同时发图+长文**，推荐三段式：头条文字 → 30s → 深度文字 → 30s → 单张小图（<80KB），图片失败立刻放弃
- 多段推送禁止省略 sleep 30，否则触发短窗口节流
- 同一 turn 内的 cc-connect send 会被队列暂存，turn 结束后才统一推送，不要在 turn 内等图片送达
- 定时任务由 cc-connect daemon 调度，非系统 crontab，依赖 daemon 常驻进程存活；cron 表达式可加 `1-5` 限定工作日
- hook 注入时间戳用于计算响应时间，settings 变更后可能需 `/hooks` 菜单重载
- 更新偏好后需同步刷新已有定时任务的 prompt（如把"配图"要求、"已熟概念不解释"、"论文 14 天硬校验"、"工作日才跑"注入到 cron 任务里）
- cc-connect 触发的 Claude 产物默认归到 `~/code/claude_bot/`，但 `~/ObsidianVault`、`~/Zotero`、`~/.cc-connect` 等固定位置除外
- 集成第三方 skill 仓库时：真文件落 `~/code/Claude_skills/`，上游 repo 内 `skills/*` 反向软链回来，便于 git pull 同步
- 涉及目录结构/归属调整前先确认用户意图，避免反复返工
- 一次性 cron（如补发任务）跑完需用后台监听器自动删除，避免明年同日重复触发
- 归档（news_archive）应作为 source-of-truth 优先写入，推送视为 best-effort
- 多步执行过程中不要每步发状态消息，只在最终发一次汇总（用户明确反感中间态噪音）
- cron 推送 prompt 中不要加"已推送..."这种收尾 reply，保持静默
- 给用户写资讯/科普类内容时跳过已熟术语解释，只解释新生/小众术语和公司业务背景
- 飞书通道当前仅作为接收用户消息使用，cc-connect 推送仍走微信适配器；飞书直传 mp4 会被拒（code=230055），需用封面图 + zip 曲线救国
- 引用 arXiv 论文为"今日新发"前必须用 ID 前 4 位 YYMM 粗筛 + 读 abstract 页 `[Submitted on]` 精校，避免把老论文包装成新发
- dailypaper-video 字幕用 faster-whisper 反推 srt（不用 narration 文本，否则 TTS 实际语速会错位）；配图优先真实 figure/demo/项目页截图，不用 T2I 生成
- cc-send-safe 返回 "Message sent successfully" 只代表入队成功，不等于送达；真实状态必须读 `~/.cc-connect/logs/cc-connect.log` 的 outbound ret 码确认
- 节流锁可在通道完全静默数小时后仍未自然恢复，"4 小时空闲未恢复"通常意味着 >24h 长期锁定，需立即扫码换 token
- 用户偶尔会问"还工作吗 / 你好"做存活探活，需快速短回并主动汇报已有 cron 跑过状态
- 飞书入口的短问候/公众号链接可能触发 Anthropic Cyber Usage Policy 自动拒答，必要时引导用户切 `claude-sonnet-4-20250514` 或换通道
- 解释 dailypaper / 流水线类项目时优先给"模块 → 阶段 → 关键技术决策"的结构化分解，附产物路径与文件名
- 用户输入英文技术名词常带笔误或被截断，先按发音/拼写最近邻列候选表格，再请其用一两字补齐（如"nv diff"→nvdiffrast）
- 解析飞书 reply chain 消息时，真正的新问题往往在引用块末尾的独立一行，不要把它当作引用的一部分忽略
- 解释 NVIDIA 系名字时要先分清"商用渲染器栈（Iray/OptiX/Omniverse/Falcor）"vs"研究用可微渲染栈（nvdiffrast 三件套）"两条线，避免把 AI 研究库当成电影渲染器讲
- 解读公众号长文要点结构：主线判断 → 技术三件套表格 → 实验数字 → 作者金句 → 一句话概括，附作者/公众号名
- 改 cron 触发时间（如改成工作日）后只回一句确认表 + 不解释 cron 语法（用户已熟），表里列 cron ID + 表达式 + 含义即可
