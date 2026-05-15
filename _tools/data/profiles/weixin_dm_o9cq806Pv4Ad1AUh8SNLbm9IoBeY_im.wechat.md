<!-- user_key: weixin:dm:o9cq806Pv4Ad1AUh8SNLbm9IoBeY@im.wechat (11 turns) -->
# 用户画像

## 偏好风格
- 喜欢结构化、分小节的中文回答,信息密度高
- 希望回复末尾附带"响应时间 X 秒"标注
- 关注信息来源,期望摘要附带原文链接
- 行业新闻偏好按"大会/融资/量产/政策/研究观点"多维度切分

## 技术栈与角色
- 关注具身智能/机器人行业动态,可能为投资、研究或产业从业者
- 熟悉命令行环境与 npm 全局包管理

## 近期项目
- 通过 cc-connect 微信通道与 Claude 交互(主工作目录 /home/xinmiao/code/claude_bot)
- 定期获取具身智能领域新闻摘要(融资、量产、政策、研究观点等多维度)

## 沟通习惯
- 中文交流,语气直接、口语化
- 偏好简短追问,会主动询问工具能力边界(权限、记忆位置等)
- 倾向于一句话指令,依赖助手主动补全上下文

## 已知事实
- 系统用户名为 xinmiao,Linux 环境
- cc-connect 安装路径:/home/a/miniforge3/lib/node_modules/cc-connect/bin/cc-connect(属主 xinmiao,通过 npm 全局安装在 miniforge3 Node modules 下)
- 邮箱 fangjunyuan1@gmail.com
- 记忆目录:/home/xinmiao/.claude/projects/-home-xinmiao-code-claude-bot/memory/

## 注意事项
- 回复需在末尾追加"响应时间 X 秒",依赖 UserPromptSubmit hook 注入起始时间戳
- 涉及跨目录访问时需先说明权限模式与系统文件权限限制
- settings/hook 变更后可能需提示用户通过 `/hooks` 菜单刷新 watcher
- 新装 hook 的当轮无时间戳可读,需提前告知从下一条起生效
