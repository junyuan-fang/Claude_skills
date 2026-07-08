# 用户画像

## 偏好风格
- 极度重视静默执行,反感"已推送/任务完成/段X已发"等中间态状态消息,只看实际内容
- 收尾只要一句话报告(路径 + 关键数字 + 目录刷新状态),拒绝复述过程
- 文字推送要求口语化、避免并列符堆词,多用"x 倍、y 万、z 亿"具体数字
- 每条新闻必须做"尽调式扩展":公司背景 + 技术细节 + 数据指标 + 业内对比,让外行 30 秒掌握 why-it-matters
- 反感对已熟概念(VLA/WAM/Sim2Real/Diffusion Policy/VLM/RL/Imitation Learning/MPC 等)做解释,只允许新生/冷门术语 1 句带过
- 接受推荐输出在精读后修正(如分类、形态判断、方法 vs baseline 角色),只要一句话报告里说明修正点即可
- 一句话报告允许在必读数量异常(如仅 2 篇 / 0 篇)时补充原因(如"余下多为前日重推"、"arXiv/HF 真空期")
- 必读 0 篇时接受"节省 paper-reader 名额"策略,不强求硬凑笔记
- 大丰收日(30 篇全新零重合)也允许在一句话报告里点明,作为质量信号
- 一句话报告可在信号异常时补充结构性观察(如"WM 主题单日 6 篇"、"Alibaba AMAP 一日五发"、"2607.xxxxx 7 月洪峰启动"、"Physics-informed WM 成流派"、"CN 大厂 embodied 多元化"、"Cosmos 3 冠榜"、"VLA test-time 五部曲"、"GigaWorld-1 WM as evaluator 罗盘"、"Mask2Real-WM sim2real 第四派")
- 一句话报告可在单 agent 分发未覆盖某些必读时点明(如"VLA-Corrector 和 TacImag 因单 agent 分发未覆盖"、"Mask2Real-WM 和 MultiplayerWM 因单 agent 分发未覆盖")作为质量说明
- 询问功能现状时(如"你现在有 X 吗"、"我记得有一个 skill 只做 Y 对吗")期待明确 yes/no + 现状机制 + 开关配置路径 + 补跑选项,不要含糊

## 技术栈与角色
- 深度关注 AI 基础设施、具身智能、机器人(VLA/世界模型/Diffusion Policy/Sim2Real)、CV/DL 论文
- 熟悉 NVIDIA 硬件栈(GB300/Rubin/Blackwell/DGX Spark)、光互连、产业链上下游
- 熟悉中美具身智能玩家:宇树、智元、银河通用、星海图、星动纪元、Figure、1X、Apptronik、Tesla Optimus 等
- 使用 Obsidian 作为论文笔记库(~/ObsidianVault/DailyPapers/),维护 concept MOC / paper MOC
- 通过 cc-send-safe / cc-connect 推送到飞书或微信通道
- 本机装 Zotero 客户端,数据库在 ~/Zotero/zotero.sqlite,倾向通过本地 Connector(端口 23119)沉淀,不动 sqlite

## 近期项目
- 每日 NVIDIA 新闻推送(深度版 v3.1):头条快报 + 深度展开 + 1 张配图三段式,严格 sleep 30s 防节流
- 每日具身智能新闻推送(v1.3):行业 + 论文混编,论文必须 14 天内(HuggingFace daily 优先 + arXiv ID YYMM 粗筛 + abstract 页 submission date 精校)
- daily-papers 三步流水线(fetch → review → notes),日产推荐 20-30 篇、必读 0-3 篇并生成笔记
- 归档目录 /home/xinmiao/code/claude_bot/news_archive/,具身智能论文归档强制 `- Project: <url>` 行供下游 awesome-physical-ai ingest
- Zotero 同步能力已存在但默认关闭(daily-papers-notes Step 2.5),仅"🔥 必读" tier 走 Connector 按分类精准归档,值得看/可跳过一律不进 Zotero

## 沟通习惯
- 任务指令极度详尽、分步骤分章节,带【绝对禁止】黑名单清单
- 用中文沟通,混用英文术语(VLA、benchmark、deep dive 等)
- 接受长响应等待时间(论文流水线常 5-30 分钟,NVIDIA/具身约 3-8 分钟)
- 任务模板高度稳定,几乎逐字复用(NVIDIA v3.1 / 具身 v1.3 已固化)
- 会追问功能现状("你现在有 X 吗"、"我记得有一个 skill 做 Y 对吗"),期待精准回忆 + 配置路径,不打太极

## 已知事实
- 邮箱 fangjunyuan1@gmail.com
- 飞书 user id: ou_90d9f956a6570c6cd27a3d1bb5377138
- 论文推荐产出格式:20-30 篇 / 必读 0-3 / 值得看 1-14 / 可跳过 4-29(必读数会因当日重推率与 arXiv/HF 真空期波动)
- concept MOC 自 2026-06-29 起从 288 篇扩张到 553 条(2026-07-08),paper MOC 从 26 → 59 条
- 日常触发时刻:NVIDIA 07:00、具身智能 07:05、论文推荐 07:15(每日固定节奏)
- 论文流水线耗时波动大:2026-06-29 耗时 1510s、06-30 耗时 1237s、07-01 真空期仅 329s、07-02 大丰收 1807s、07-03 洪峰 907s、07-06 耗时 1011s、07-07 耗时 1498s、07-08 耗时 1396s
- NVIDIA 任务耗时波动:2026-06-30 485s、07-01 433s、07-02 276s、07-03 370s、07-06 566s、07-07 386s、07-08 461s;常态约 4-10 分钟
- 具身智能任务耗时约 3-8 分钟(2026-07-02 为 454s)
- 2026-07-03 arXiv 2607.xxxxx 段号启动,进入 7 月投稿洪峰;WM(世界模型)单日 6 篇,Alibaba AMAP 单日投递 5 篇
- 2026-07-06 观察到 Physics-informed WM 明确成流派、Latent WM planning 三大新约束、CN 大厂 embodied 主题多元化
- 2026-07-07 观察到 Cosmos 3 冠榜、VLA test-time 五部曲、触觉 VLA 五部曲收官
- 2026-07-08 观察到 GigaWorld-1 提出 "WM as evaluator" 罗盘、Mask2Real-WM 开辟 sim2real 第四派、SH AI Lab / 清华 / 同济 国内 embodied 大厂论文栈化
- Zotero 同步配置位于 ~/.claude/skills/_shared/user-config.local.json 的 zotero_sync 段,默认 enabled=false,tier="必读",tags 默认 `daily-papers`
- Zotero collections 白名单:World Model / Robot Policy / Humanoid / Navigation / Reinforcement Learning / SceneGraph / SpatialVerse / InstanceSegmentation / Dataset
- Zotero 同步按 arXiv id 查重,已入库跳过
- 未同步到 Zotero 的必读积压(截至 2026-07-08 约 18+ 篇):HallucinationWM / IDEA / HumanoidDART / PhysiFormer / AgileFlightGen / SynPriorS2R / QwenRobotManip / DVGWM / 3DPointWM / Valdi / PVWM / PhysMani / WorldSample / ACID / Cosmos3 / VLA-Corrector / TacImag / GigaWorld-1 / Mask2Real-WM / MultiplayerWM
- 论文推荐单 agent 分发存在覆盖不全风险:2026-07-07 必读 3 篇中仅 Cosmos3 生成笔记(1/3);2026-07-08 必读 3 篇中仅 GigaWorld-1 生成笔记(1/3),连续两日 1/3 覆盖

## 注意事项
- 配图严格 1 张,绝不发第 2 张(必触发节流锁死)
- 图片失败后绝不重试、绝不再发任何文字
- 文字推送之间必须 sleep 30,不可省略
- 论文日期硬校验:超 14 天的旧论文不能放进头条/deep dive,只能进"延伸阅读"并标注真实日期
- 搜不到 14 天内新论文时,宁可彻底放弃论文项,绝不把老论文包装成"今日新发"
- 2026-06-22 NVIDIA 与论文任务均因 401 认证失败未完成,2026-06-23 起已恢复正常
- 2026-06-24 论文流水线收尾报告退化为"SkyJEPA done. Waiting on Foresight."(违反一句话报告规范,需避免在笔记仍在生成时提前回复);2026-06-25 之后已稳定标准格式
- 当日推荐被前日重推稀释时(如 2026-06-30 必读仅 2 篇、2026-07-01 必读 0 篇且 23/30 为 6/29-6/30 重推),需在一句话报告中点明原因
- Zotero 同步默认关闭,除非用户明确开启或说"顺手也同步到 Zotero",cron 不主动跑该步
- 开启 Zotero 同步前需确认客户端在跑(`curl 127.0.0.1:23119/connector/ping`)
- 单 agent 分发必读笔记时若存在覆盖不全(如 2026-07-07 / 2026-07-08 均仅 1/3),需在一句话报告中显式说明未覆盖的论文名;连续 1/3 覆盖已成模式,需考虑调整分发策略
