# 用户画像

## 偏好风格
- 微信渠道收到的资讯类消息要求图文并茂，命令行/纯代码类问题无需配图
- 喜欢条理清晰的分点总结，带来源链接
- 助手回复末尾需附"响应时间 X 秒"
- 喜欢先看一个小样例（如发 logo 验证）再决定是否推广到定时任务
- 偏好统一的目录归集管理（cc-connect 产物集中放 `~/code/claude_bot/`）
- 希望第三方 skill 真文件落到自己的私人 repo，上游 repo 通过软链同步，方便提交

## 技术栈与角色
- 关注 AI 基础设施与具身智能行业动态，非纯开发者视角
- 熟悉 cc-connect 工具链，了解 npm 全局安装与 daemon 机制
- 对调度器、消息桥接、会话复用等底层架构有探究兴趣
- 熟悉 conda 环境管理、git 仓库与软链组织
- 已使用 Zotero（含 Better BibTeX）+ Obsidian 的论文/笔记工作流

## 近期项目
- 通过 cc-connect 在微信端与 Claude 对话，工作目录 `/home/xinmiao/code/claude_bot`
- 已配置每日 8:00 NVIDIA 新闻图文推送（当前任务 ID `e2f2c8de`，已挂 cc-send-safe wrapper）
- 关注每日具身智能行业新闻（融资、量产、政策、产业园动态）
- 集成 huangkiki/dailypaper-skills：真文件在 `~/code/Claude_skills/`，上游 repo 留在 `~/code/claude_bot/dailypaper-skills/` 反向软链供 git pull
- 关注方向包含 World Action Model (WAM)、Physical AI、VLA 等

## 沟通习惯
- 用中文交流，语气随意，偶有错别字（如 deam0 = demo、健 = 建、dialypaper = dailypaper）
- 习惯追问实现原理，对底层机制感兴趣
- 一次只问一个点，多轮递进
- 会先小步验证（如先发个 icon 试水）再扩展功能
- 目录/架构调整会反复纠正直到符合心智模型，需要先听清意图再动手

## 已知事实
- 关注领域：具身智能、人形机器人、NVIDIA、AI 算力与模型发布、World Action Model、Physical AI
- 通过微信会话与助手交互（session 绑定 weixin:dm）
- 系统用户 xinmiao，cc-connect 装在 `/home/a/miniforge3/lib/node_modules/cc-connect/`
- cc-connect daemon 任务存储在 `~/.cc-connect/crons/jobs.json`，日志在 `~/.cc-connect/logs/cc-connect.log`
- 私人 skills repo：`~/code/Claude_skills/`（远端 junyuan-fang/Claude_skills），通过 `~/.claude/skills` 软链生效
- Zotero 数据在 `~/Zotero/`，Obsidian vault 在 `~/ObsidianVault/`，Obsidian AppImage 在 `~/Applications/`
- conda 环境 `dailypaper`（Python 3.10）已建好，用于跑 dailypaper-skills 流水线
- 微信图片发送 wrapper `cc-send-safe` 部署在 `~/code/claude_bot/bin/`，通过 `/home/a/.local/bin/` 软链入 PATH

## 注意事项
- 微信推送默认带配图，图片源失败时可降级为纯文本
- 微信图片接口出现 ret=-2 时为服务端节流，需走 cc-send-safe（压图+退避），严重时只能等数小时或扫码重置 token
- 定时任务由 cc-connect daemon 调度，非系统 crontab，依赖 daemon 常驻进程存活
- hook 注入时间戳用于计算响应时间，settings 变更后可能需 `/hooks` 菜单重载
- 更新偏好后需同步刷新已有定时任务的 prompt（如把"配图"要求注入到 cron 任务里）
- cc-connect 触发的 Claude 产物默认归到 `~/code/claude_bot/`，但 `~/ObsidianVault`、`~/Zotero`、`~/.cc-connect` 等固定位置除外
- 集成第三方 skill 仓库时：真文件落 `~/code/Claude_skills/`，上游 repo 内 `skills/*` 反向软链回来，便于 git pull 同步
- 涉及目录结构/归属调整前先确认用户意图，避免反复返工
