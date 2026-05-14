#!/usr/bin/env python3
"""
Maintain a continuously-updated user profile (Honcho-lite).

Reads the last N days of conversations from sessions.db, prompts Claude
to merge new observations into the existing data/user-profile.md.

The profile captures: preferences, communication style, recurring tasks,
known facts about the user. Designed to be injected into Claude's system
prompt at session start so the agent "remembers" the user.

Usage:
    update-user-profile.py                    # use last 7 days
    update-user-profile.py --days 30
    update-user-profile.py --user "o9cq8"     # specific user only
    update-user-profile.py --reset            # rebuild from scratch
"""
from __future__ import annotations

import argparse
import datetime as dt
import re
import sqlite3
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB = REPO_ROOT / "data" / "sessions.db"
DEFAULT_PROFILE = REPO_ROOT / "data" / "user-profile.md"


PROMPT_TEMPLATE = """你是一个用户画像维护助手。你的任务是根据下面的【最近对话记录】,
**增量更新**【现有画像】,产出一份新的用户画像 markdown。

要求:
- 用第三人称写,称呼用户为"用户"
- 包含小节: 偏好风格、技术栈与角色、近期项目、沟通习惯、已知事实、注意事项
- 每一条最多一行,精炼
- 已有信息不要丢,除非新对话明确否定它
- 不要写"未知"、"不确定"、"基于推测"这种水分
- 不要复述对话内容,只提炼**长期有效**的信息
- 输出**纯 markdown**,不要加 JSON 包装,不要 ``` 包裹

=== 现有画像 ===
{existing}
=== 结束 ===

=== 最近对话 (按时间顺序) ===
{transcript}
=== 结束 ===

直接输出新的画像 markdown:
"""

EMPTY_PROFILE = """# 用户画像

## 偏好风格
- (尚无观察)

## 技术栈与角色
- (尚无观察)

## 近期项目
- (尚无观察)

## 沟通习惯
- (尚无观察)

## 已知事实
- (尚无观察)

## 注意事项
- (尚无观察)
"""


def gather(conn, days: int, user_filter: str | None) -> list:
    since = (dt.datetime.now() - dt.timedelta(days=days)).isoformat()
    where = ["timestamp >= ?"]
    params = [since]
    if user_filter:
        where.append("user_key LIKE ?")
        params.append(f"%{user_filter}%")
    sql = ("SELECT timestamp, role, content, user_name FROM turns "
           f"WHERE {' AND '.join(where)} ORDER BY timestamp")
    return conn.execute(sql, params).fetchall()


def call_claude(prompt: str) -> str:
    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True, text=True, timeout=300,
    )
    return result.stdout.strip()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--db", type=Path, default=DEFAULT_DB)
    ap.add_argument("--profile", type=Path, default=DEFAULT_PROFILE)
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--user", help="user_key substring filter")
    ap.add_argument("--reset", action="store_true",
                    help="discard existing profile, build from scratch")
    ap.add_argument("--dry-run", action="store_true",
                    help="print prompt instead of calling claude")
    args = ap.parse_args()

    if not args.db.exists():
        print(f"db not found: {args.db}", file=sys.stderr)
        return 1

    args.profile.parent.mkdir(parents=True, exist_ok=True)
    existing = (EMPTY_PROFILE if args.reset or not args.profile.exists()
                else args.profile.read_text(encoding="utf-8"))

    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row
    rows = gather(conn, args.days, args.user)
    if not rows:
        print(f"(no turns in last {args.days} days)")
        return 0
    print(f"  using {len(rows)} turns from last {args.days} day(s)…")

    transcript = "\n\n".join(
        f"[{r['timestamp'][:19]}] {r['role']} ({r['user_name'] or '-'}): "
        f"{r['content']}"
        for r in rows
    )
    # cap
    if len(transcript) > 60000:
        transcript = transcript[-60000:]

    prompt = PROMPT_TEMPLATE.format(existing=existing, transcript=transcript)

    if args.dry_run:
        print(prompt)
        return 0

    new = call_claude(prompt)
    if not new:
        print("ERROR: claude returned empty", file=sys.stderr)
        return 2

    # strip any accidental fences
    new = re.sub(r"^```(?:markdown|md)?\s*", "", new)
    new = re.sub(r"\s*```\s*$", "", new)

    backup = args.profile.with_suffix(".md.bak")
    if args.profile.exists():
        backup.write_text(args.profile.read_text(encoding="utf-8"),
                          encoding="utf-8")
    args.profile.write_text(new + "\n", encoding="utf-8")
    print(f"  + updated {args.profile.relative_to(REPO_ROOT)}")
    print(f"    (previous saved to {backup.name})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
