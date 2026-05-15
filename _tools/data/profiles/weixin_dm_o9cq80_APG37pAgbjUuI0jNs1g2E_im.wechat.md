<!-- user_key: weixin:dm:o9cq80_APG37pAgbjUuI0jNs1g2E@im.wechat (50 turns) -->
# 用户画像

## 偏好风格
- 通过微信接收消息时偏好图文并茂(新闻、资讯、产品类内容尽量配图)
- 纯代码/命令行问题不要求配图
- 接受简洁的中文回复,愿意了解底层实现原理
- 偏好通过软链方式集成第三方 skill,真文件归口到自己的私人 repo 便于 git 管理
- 鼓励助手主动试错探索最优方案,允许通过多次实验找到稳定可行的解法
- 一次性任务跑完后倾向于立即清理临时配置,避免遗留垃圾(如明年同日重复触发)

## 技术栈与角色
- 熟悉命令行工具使用,能理解 cron、daemon、JSON 配置等技术概念
- 关注 AI 基础设施与 NVIDIA 生态动态
- 关注具身智能/世界模型/VLA 方向论文(WAM、Physical AI 等)
- 熟悉 conda 环境、symlink、git 工作流

## 近期项目
- 通过 cc-connect 桥接微信接收 Claude 推送
- 已订阅 NVIDIA 每日新闻定时推送(任务 ID a285150d,每天 08:00,v2 防节流策略:先发文字再试 1 张小图)
- 集成 huangkiki/dailypaper-skills 论文流水线,用于每日论文抓取/点评/笔记
- 维护私人 skills repo:junyuan-fang/Claude_skills
- 持续优化微信图文推送防节流方案,记录实验数据排查 ret=-2 触发机制

## 沟通习惯
- 主要通过微信(cc-connect 通道)与 Claude 对话
- 提问偏口语化,偶有错别字(如 "deam0" 指 "demo"、"健"指"建")
- 喜欢追问实现机制("是怎么实现的")、关注进展("进展咋样")
- 倾向给方向性反馈而非细节指令,会反复澄清直到目录结构符合预期
- 消息有时被截断("然后你和我说下是"),需要助手主动追问澄清

## 已知事实
- 邮箱:fangjunyuan1@gmail.com
- 使用微信会话 key:o9cq80_APG37pAgbjUuI0jNs1g2E@im.wechat
- 本地已部署 cc-connect daemon,定时任务存于 ~/.cc-connect/crons/jobs.json
- 主用户为 xinmiao(非 a 用户);Zotero 装在 ~/Zotero/(含 zotero.sqlite 和 storage/),Obsidian Vault 在 ~/ObsidianVault/
- Obsidian AppImage 装在 ~/Applications/Obsidian-1.12.7.AppImage
- conda 环境 dailypaper(Python 3.10)已建好
- 私人 skills repo:~/code/Claude_skills(远端 junyuan-fang/Claude_skills)
- cc-connect 触发的产物统一放 ~/code/claude_bot/(包括 bin/cc-send-safe、dailypaper-skills 上游 repo、news_archive/)
- skill 真文件放在 ~/code/Claude_skills/,上游 repo 通过反向软链消费,方便 git pull 同步
- NVIDIA 新闻归档存于 ~/code/claude_bot/news_archive/nvidia-YYYY-MM-DD.md

## 注意事项
- 微信推送消息默认带配图,信息类内容尤其要图文并茂
- 修改/查询 NVIDIA 定时任务时使用当前 ID a285150d(旧 ID a0b31f38、b1a241d9、e2f2c8de 已弃用)
- 微信图片接口出现 ret=-2 时用 cc-send-safe wrapper(压图+退避重试)
- cron 环境下连发图片易触发 ret=-2 把后续文字也丢掉,策略:先发文字摘要,30s 后再试发 1 张 <80KB 小图,失败不重试
- 长摘要走 cc-send-safe -m 或 --stdin 直发,不要靠 cc-connect 自动回复(长文易丢)
- 第三方 skill 集成时:真文件放进 ~/code/Claude_skills/,上游 repo 用反向 symlink 指过来,不要反过来
- ~/ObsidianVault/、~/Zotero/、~/.cc-connect/ 不归 claude_bot 管,保持原位
- 一次性临时 cron 跑完后要主动清掉,避免明年同日重复触发
