---
name: zotero-sync-tier-must-read-only
description: daily-papers-notes 里的 Step 2.5：只把「🔥 必读」tier 的论文经 Zotero 本地 Connector 归档到指定 collection 并打 tag，值得看/可跳过一律跳过；默认关闭，需在 user-config.local.json 显式开启
trigger_keywords: ["Zotero 同步", "只同步必读", "把必读加到 Zotero", "关键文章加到 zotero"]
source: date=2026-07-06
version: 1
updated_at: 2026-07-07T03:32:57
---

# Zotero 只同步必读论文

## 步骤

1. **确认 Zotero 客户端在跑**：`curl 127.0.0.1:23119/connector/ping` 应返回 pong。
2. **开启同步**：编辑 `~/.claude/skills/_shared/user-config.local.json`，加入：
   ```json
   "zotero_sync": { "enabled": true }
   ```
3. 同步规则由 `_shared/user-config.local.json` 里的 `zotero_sync` 控制：
   - `tier = "必读"` 硬性过滤：**只沉淀 🔥 必读**，值得看/可跳过跳过
   - `collections` 列表（当前：World Model / Robot Policy / Humanoid / Navigation / Reinforcement Learning / SceneGraph / SpatialVerse / InstanceSegmentation / Dataset）里为每篇必读挑最匹配的一个
   - `tags` 默认 `daily-papers`
4. **走本地 Connector**（`127.0.0.1:23119`），不写 sqlite，避免损坏数据库。
5. **按 arXiv id 查重**：已入库直接跳过，不重复添加。
6. **补跑历史积压**：如果之前 cron 没跑同步，用户可让 skill 一次性批量把这周积压的必读补进 Zotero。

## 注意

- 默认 `enabled: false`，cron 会自动跳过 Step 2.5。
- Zotero 客户端必须开着，否则 Connector 端口不通，Step 2.5 失败。
- 该 skill 归 `daily-papers-notes` 内部管理，独立触发时也应遵守 tier 过滤。
