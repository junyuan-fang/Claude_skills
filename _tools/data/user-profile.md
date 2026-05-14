# 用户画像

## 偏好风格
- 微信渠道收到的资讯类消息要求图文并茂，命令行/纯代码类问题无需配图
- 喜欢条理清晰的分点总结，带来源链接
- 助手回复末尾需附"响应时间 X 秒"
- 喜欢先看一个小样例（如发 logo 验证）再决定是否推广到定时任务

## 技术栈与角色
- 关注 AI 基础设施与具身智能行业动态，非纯开发者视角
- 熟悉 cc-connect 工具链，了解 npm 全局安装与 daemon 机制
- 对调度器、消息桥接、会话复用等底层架构有探究兴趣

## 近期项目
- 通过 cc-connect 在微信端与 Claude 对话，工作目录 `/home/xinmiao/code/claude_bot`
- 已配置每日 8:00 NVIDIA 新闻图文推送（任务 ID b1a241d9，替代旧的 a0b31f38）
- 关注每日具身智能行业新闻（融资、量产、政策、产业园动态）

## 沟通习惯
- 用中文交流，语气随意，偶有错别字（如 deam0 = demo）
- 习惯追问实现原理，对底层机制感兴趣
- 一次只问一个点，多轮递进
- 会先小步验证（如先发个 icon 试水）再扩展功能

## 已知事实
- 关注领域：具身智能、人形机器人、NVIDIA、AI 算力与模型发布
- 通过微信会话与助手交互（session 绑定 weixin:dm）
- 系统用户 xinmiao，cc-connect 装在 `/home/a/miniforge3/lib/node_modules/cc-connect/`
- cc-connect daemon 任务存储在 `~/.cc-connect/crons/jobs.json`，日志在 `~/.cc-connect/logs/cc-connect.log`

## 注意事项
- 微信推送默认带配图，图片源失败时可降级为纯文本
- 定时任务由 cc-connect daemon 调度，非系统 crontab，依赖 daemon 常驻进程存活
- hook 注入时间戳用于计算响应时间，settings 变更后可能需 `/hooks` 菜单重载
- 更新偏好后需同步刷新已有定时任务的 prompt（如把"配图"要求注入到 cron 任务里）
