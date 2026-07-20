# 用户画像

## 偏好风格
- 极度重视静默执行,反感"已推送/任务完成/段X已发"等中间态状态消息,只看实际内容
- 收尾只要一句话报告(路径 + 关键数字 + 目录刷新状态),拒绝复述过程
- 文字推送要求口语化、避免并列符堆词,多用"x 倍、y 万、z 亿"具体数字
- 每条新闻必须做"尽调式扩展":公司背景 + 技术细节 + 数据指标 + 业内对比,让外行 30 秒掌握 why-it-matters
- 反感对已熟概念(VLA/WAM/Sim2Real/Diffusion Policy/VLM/RL/Imitation Learning/MPC 等)做解释,只允许新生/冷门术语 1 句带过
- 接受推荐输出在精读后修正(如分类、形态判断、方法 vs baseline 角色),只要一句话报告里说明修正点即可
- 一句话报告允许在必读数量异常(如仅 2 篇 / 1 篇 / 0 篇)时补充原因(如"余下多为前日重推"、"arXiv/HF 真空期"、"arXiv API 全天 timeout 仅 HF trending 撑场")
- 必读 0 篇时接受"节省 paper-reader 名额"策略,不强求硬凑笔记
- 大丰收日(30 篇全新零重合)也允许在一句话报告里点明,作为质量信号
- 一句话报告可在信号异常时补充结构性观察(如"WM 主题单日 6 篇"、"Physics-informed WM 成流派"、"Cosmos 3 冠榜"、"GigaWorld-1 WM as evaluator 罗盘"、"WM 定义+罗盘时代"、"VLA foundation 数据军备升级"、"Sim 基础设施代际更替周"、"触觉 FM 六部曲"、"test-time 学习浪潮"、"RoboDojo 揭示 SOTA VLA 真机成功率仅 12.8% vs 人类 100%")
- 一句话报告必须点明单 agent 分发未覆盖的必读论文名(如"EmbodiedGenV2 和 TouchWorld 未覆盖"),笔记可附关键 benchmark 数字(如 WAM-TTT 真机 Progress 46.2% vs π0.5 14.8%)
- 询问功能现状时(如"你现在有 X 吗"、"我记得有一个 skill 只做 Y 对吗")期待明确 yes/no + 现状机制 + 开关配置路径 + 补跑选项,不要含糊
- 口语化短消息可能语境模糊(如"科目一"舞蹈梗),接受助手先一句话复述理解并列出待对齐点再开工

## 技术栈与角色
- 深度关注 AI 基础设施、具身智能、机器人(VLA/世界模型/Diffusion Policy/Sim2Real)、CV/DL 论文
- 熟悉 NVIDIA 硬件栈(GB300/Rubin/Blackwell/DGX Spark)、光互连、产业链上下游
- 熟悉中美具身智能玩家:宇树、智元、银河通用、星海图、星动纪元、Figure、1X、Apptronik、Tesla Optimus 等
- 使用 Obsidian 作为论文笔记库(~/ObsidianVault/DailyPapers/),维护 concept MOC / paper MOC
- 通过 cc-send-safe / cc-connect 推送到飞书或微信通道
- 本机装 Zotero 客户端,数据库在 ~/Zotero/zotero.sqlite,倾向通过本地 Connector(端口 23119)沉淀,不动 sqlite
- 有虚拟形象内容项目:mascot 形象用 SDXL + IP-Adapter 生成,配 F5-TTS 声线,Hallo2 做 lip-sync;涉足 pose-driven 全身动作迁移视频生成(AnimateAnyone/MimicMotion/UniAnimate/Wan2.2-Animate 等候选)

## 近期项目
- 每日 NVIDIA 新闻推送(深度版 v3.1):头条快报 + 深度展开 + 1 张配图三段式,严格 sleep 30s 防节流
- 每日具身智能新闻推送(v1.3):行业 + 论文混编,论文必须 14 天内(HuggingFace daily 优先 + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校)
- daily-papers 三步流水线(fetch → review → notes),日产推荐常态 19-30 篇、必读 0-3 篇并生成笔记(源故障日可骤降至个位数,如 07-13 全天仅 4 篇)
- 归档目录 /home/xinmiao/code/claude_bot/news_archive/,具身智能论文归档强制 `- Project: <url>` 行供下游 awesome-physical-ai ingest
- Zotero 同步能力已存在但默认关闭(daily-papers-notes Step 2.5),仅"🔥 必读" tier 走 Connector 按分类精准归档,值得看/可跳过一律不进 Zotero
- 舞蹈视频项目:"科目一"是某段 viral 舞蹈(类似科目三),目标是用 mascot 形象 + pose-driven 全身动作迁移跑完整舞蹈视频,需 Agent teammates 并行(找参考视频 + 抽 pose + 生成测试片段);截至 2026-07-14 用户尚未确认方向

## 沟通习惯
- 任务指令极度详尽、分步骤分章节,带【绝对禁止】黑名单清单
- 用中文沟通,混用英文术语(VLA、benchmark、deep dive 等)
- 接受长响应等待时间(论文流水线常 5-30 分钟,NVIDIA/具身约 3-10 分钟)
- 任务模板高度稳定,几乎逐字复用(NVIDIA v3.1 / 具身 v1.3 已固化)
- 会追问功能现状("你现在有 X 吗"、"我记得有一个 skill 做 Y 对吗"),期待精准回忆 + 配置路径,不打太极
- 偶发即兴短消息带梗/代号(如"科目一"),需先确认语境再执行

## 已知事实
- 邮箱 fangjunyuan1@gmail.com
- 飞书 user id: ou_90d9f956a6570c6cd27a3d1bb5377138
- 时区 Asia/Shanghai
- 论文推荐产出格式:常态 19-30 篇 / 必读 0-3 / 值得看 1-15 / 可跳过 4-29(必读数会因当日重推率、arXiv/HF 真空期与源故障波动;07-13 arXiv API 全天 timeout 时仅出 4 篇)
- concept MOC 自 2026-06-29 起从 288 篇扩张:07-09 570/60,07-10 578/61,07-13 608/62,07-16 635/67(paper MOC 从 26 → 67);07-17 刷新但数量未报(上次已知 635/67)
- 日常触发时刻:NVIDIA 07:00、具身智能 07:05、论文推荐 07:15(NVIDIA 与论文每日固定;具身智能非每日必发,如 07-07/07-08/07-10/07-13/07-15/07-16/07-17 未触发)
- 论文流水线耗时波动大:07-02 大丰收 1807s、07-07 1498s、07-08 1396s、07-09 900s、07-10 1646s、07-13 源故障日 1232s、07-16 1011s、07-17 1140s;真空期最低 329s(07-01)
- NVIDIA 任务耗时:07-07 386s、07-08 461s、07-09 288s、07-10 320s、07-13 368s、07-15 513s、07-16 557s、07-17 ~550s;常态约 4-10 分钟
- 具身智能任务耗时约 3-8 分钟(07-02 454s、07-09 340s)
- 2026-07-03 arXiv 2607.xxxxx 段号启动,进入 7 月投稿洪峰;WM 单日 6 篇,Alibaba AMAP 单日投递 5 篇
- 2026-07-06 Physics-informed WM 明确成流派、Latent WM planning 三大新约束;当日必读 3 篇全覆盖(PhysMani / WorldSample / ACID)
- 2026-07-07 Cosmos 3 冠榜、VLA test-time 五部曲、触觉 VLA 五部曲收官
- 2026-07-08 GigaWorld-1 提出"WM as evaluator"罗盘、Mask2Real-WM 开辟 sim2real 第四派
- 2026-07-09 WM 进入"定义+罗盘"时代(SH AI Lab WMRoadmap + Alibaba DAMO RynnWorld-4D)、VLA foundation 数据军备升级(LingBot-VLA 2.0 60K 小时);必读 3 + 值得看 12 + 可跳过 12,笔记 1 篇(LingBotVLA2;RynnWorld-4D 和 WMRoadmap 单 agent 未覆盖)
- 2026-07-10 Sim 基础设施代际更替周(EmbodiedGenV2+SPEAR)、触觉 FM 六部曲(TouchWorld)、test-time 学习浪潮(WAM-TTT 真机 Progress 46.2% vs π0.5 14.8%);必读 3 + 值得看 15 + 可跳过 11,笔记 1 篇(WAM-TTT;EmbodiedGenV2 和 TouchWorld 单 agent 未覆盖)
- 2026-07-13 arXiv API 全天 timeout 仅 HF trending 撑场(必读 1 值得看 1 可跳过 2);RoboDojo 六校联署 sim+real benchmark,SOTA VLA 真机成功率仅 12.8% vs 人类 100%;笔记 1 篇(RoboDojo)
- 2026-07-14 三任务(NVIDIA/具身/论文)全因"out of extra usage"配额耗尽失败,配额 8:30am 重置
- 2026-07-15 NVIDIA 07:00 成功(513s),但 07:15 论文任务再次因配额耗尽失败;首次出现 NVIDIA 任务成功后配额仍不足以支撑论文流水线的情况
- 2026-07-16 NVIDIA 成功(557s),论文流水线成功(1011s);必读 2 篇(Orca 424 行 + FlowWAM),笔记链接已回填,concept 635/paper 67;配额 8:30am 重置后双任务均通过
- 2026-07-17 NVIDIA 成功(~550s),论文流水线成功(1140s);必读 1 篇(FastWAM),值得看 9 篇,可跳过 9 篇,笔记 1 篇(GigaWorldPolicy05 347 行),目录页已刷新
- Zotero 同步配置位于 ~/.claude/skills/_shared/user-config.local.json 的 zotero_sync 段,默认 enabled=false,tier="必读",tags 默认 `daily-papers`
- Zotero collections 白名单:World Model / Robot Policy / Humanoid / Navigation / Reinforcement Learning / SceneGraph / SpatialVerse / InstanceSegmentation / Dataset
- 未同步到 Zotero 的必读积压(截至 2026-07-17 约 31+ 篇,含有 Obsidian 笔记但 Zotero 未入库):HallucinationWM / IDEA / HumanoidDART / PhysiFormer / AgileFlightGen / SynPriorS2R / QwenRobotManip / DVGWM / 3DPointWM / Valdi / PVWM / PhysMani / WorldSample / ACID / Cosmos3 / VLA-Corrector / TacImag / GigaWorld-1 / Mask2Real-WM / MultiplayerWM / LingBotVLA2 / RynnWorld-4D / WMRoadmap / WAM-TTT / EmbodiedGenV2 / TouchWorld / RoboDojo / Orca / FlowWAM / FastWAM / GigaWorldPolicy05
- 论文推荐单 agent 分发覆盖不全已连续多日(07-07 至 07-10 均仅 1/3 覆盖;07-13 必读仅 1 篇天然全覆盖;07-16/07-17 必读分别 2 篇和 1 篇);必读 ≥2 篇时分发瓶颈持续暴露

## 注意事项
- 配图严格 1 张,绝不发第 2 张(必触发节流锁死)
- 图片失败后绝不重试、绝不再发任何文字
- 文字推送之间必须 sleep 30,不可省略
- 论文日期硬校验:超 14 天的旧论文不能放进头条/deep dive,只能进"延伸阅读"并标注真实日期
- 搜不到 14 天内新论文时,宁可彻底放弃论文项,绝不把老论文包装成"今日新发"
- 2026-06-22 NVIDIA 与论文任务均因 401 认证失败未完成,2026-06-23 起已恢复正常
- 配额耗尽模式已多次确认:07:00 NVIDIA 消耗配额 → 07:15 论文任务可能撞上配额边界;三任务串联窗口内配额不稳定,失败日应主动提议补跑
- 07-14 三任务全失、07-15 论文失败均为配额耗尽;07-16/07-17 两任务均成功(配额 8:30am 重置后双任务可顺利通行)
- Zotero 同步默认关闭,除非用户明确开启或说"顺手也同步到 Zotero",cron 不主动跑该步
- 开启 Zotero 同步前需确认客户端在跑(`curl 127.0.0.1:23119/connector/ping`)
- 单 agent 分发必读笔记时若存在覆盖不全,需在一句话报告中显式说明未覆盖的论文名;必读 ≥2 篇时分发策略亟需调整(如按必读篇数拆多 agent 或串行补跑)
- 舞蹈视频项目("科目一"整舞)截至 2026-07-14 尚未获用户确认方向,勿在未对齐前擅自开工
- 07-17 NVIDIA agent 违反静默规则,在结束后发出"7/17日报已完成推送...待命中，等候下一步指令"等收尾状态消息——该约束需在 skill 里持续强化,每次 NVIDIA 任务结束后不发任何 reply
