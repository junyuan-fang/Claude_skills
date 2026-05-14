<!-- user_key: weixin:dm:o9cq80_APG37pAgbjUuI0jNs1g2E@im.wechat (32 turns) -->
# 用户画像

## 偏好风格
- 通过微信接收消息时偏好图文并茂(新闻、资讯、产品类内容尽量配图)
- 纯代码/命令行问题不要求配图
- 接受简洁的中文回复,愿意了解底层实现原理
- 偏好通过软链方式集成第三方 skill,真文件归口到自己的私人 repo 便于 git 管理

## 技术栈与角色
- 熟悉命令行工具使用,能理解 cron、daemon、JSON 配置等技术概念
- 关注 AI 基础设施与 NVIDIA 生态动态
- 关注具身智能/世界模型/VLA 方向论文(WAM、Physical AI 等)
- 熟悉 conda 环境、symlink、git 工作流

## 近期项目
- 通过 cc-connect 桥接微信接收 Claude 推送
- 已订阅 NVIDIA 每日新闻定时推送(任务 ID e2f2c8de,每天 08:00,图文版,带 cc-send-safe wrapper)
- 集成 huangkiki/dailypaper-skills 论文流水线,用于每日论文抓取/点评/笔记
- 维护私人 skills repo:junyuan-fang/Claude_skills

## 沟通习惯
- 主要通过微信(cc-connect 通道)与 Claude 对话
- 提问偏口语化,偶有错别字(如 "deam0" 指 "demo"、"健"指"建")
- 喜欢追问实现机制("是怎么实现的")、关注进展("进展咋样")
- 倾向给方向性反馈而非细节指令,会反复澄清直到目录结构符合预期

## 已知事实
- 邮箱:fangjunyuan1@gmail.com
- 使用微信会话 key:o9cq80_APG37pAgbjUuI0jNs1g2E@im.wechat
- 本地已部署 cc-connect daemon,定时任务存于 ~/.cc-connect/crons/jobs.json
- 主用户为 xinmiao(非 a 用户);Zotero 装在 ~/Zotero/,Obsidian Vault 在 ~/ObsidianVault/
- conda 环境 dailypaper(Python 3.10)已建好
- 私人 skills repo:~/code/Claude_skills(远端 junyuan-fang/Claude_skills)
- cc-connect 触发的产物统一放 ~/code/claude_bot/(包括 bin/cc-send-safe、dailypaper-skills 上游 repo)
- skill 真文件放在 ~/code/Claude_skills/,上游 repo 通过反向软链消费,方便 git pull 同步

## 注意事项
- 微信推送消息默认带配图,信息类内容尤其要图文并茂
- 修改/查询 NVIDIA 定时任务时使用当前 ID e2f2c8de(旧 ID a0b31f38、b1a241d9 已弃用)
- 微信图片接口出现 ret=-2 时用 cc-send-safe wrapper(压图+退避重试)
- 第三方 skill 集成时:真文件放进 ~/code/Claude_skills/,上游 repo 用反向 symlink 指过来,不要反过来
- ~/ObsidianVault/、~/Zotero/、~/.cc-connect/ 不归 claude_bot 管,保持原位
