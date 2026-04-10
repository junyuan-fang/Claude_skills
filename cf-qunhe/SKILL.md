---
name: cf-qunhe
description: Work with the internal Confluence at cf.qunhequnhe.com — read/edit pages via MCP (qunhe-devops-mcp), handle mermaid/markdown macros, convert pages to markdown, and manage page permissions for robot-mobot.
---

# cf-qunhe Skill

Internal Confluence (cf.qunhequnhe.com) workflows using `qunhe-devops-mcp` MCP tools.

## Tools Available (via MCP)

| Tool | Description |
|------|-------------|
| `get_confluence_page_body` | Read page HTML (use `writeToFile: true` for large pages) |
| `get_confluence_page_metadata` | Get title, version number, space, author |
| `update_confluence_page` | Update page content (requires `id`, `version.number`, `bodyFile`) |
| `get_confluence_child_pages` | List child pages |
| `create_confluence_page` | Create new page |
| `get_confluence_page_comments` | Read comments |
| `create_confluence_page_comment` | Add comment |

## Common Workflows

### Read a page

```
get_confluence_page_body(url: "https://cf.qunhequnhe.com/pages/viewpage.action?pageId=...")
# For large pages use writeToFile: true → reads to .devops-mcp-temp/<pageId>.html
```

### Edit a page

1. `get_confluence_page_body(writeToFile: true)` — writes to `.devops-mcp-temp/<pageId>.html`
2. `get_confluence_page_metadata` — get current `version.number`
3. Edit the `.html` file
4. `update_confluence_page(id, bodyFile, version: {number: current+1, message: "..."})`

### Add a task list (todo) before a section

Insert before the target `<h1>`:

```html
<h2>待办事项</h2>
<ac:task-list>
  <ac:task>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>task description</ac:task-body>
  </ac:task>
</ac:task-list>
```

## Known Gotchas

### robot-mobot permissions

MCP acts as `robot-mobot`. If you get 404 → add robot-mobot as **View**. If you get 403 on update → add robot-mobot as **Edit**.

Page → `...` → Page Restrictions → add `robot-mobot`

### Mermaid macro: autonumber not supported

The MCP validator rejects `autonumber` in sequence diagrams. Remove it before updating:

```python
# In Python: strip autonumber lines
content = re.sub(r'\s*autonumber\n', '', content)
```

### mermaid-macro: actor keyword not supported

Replace `actor <name>` with `participant <name>` in sequence diagrams before pushing via MCP.

### Markdown macros block inline comments

Content inside `<ac:structured-macro ac:name="markdown">` cannot receive inline comments. Convert to native CF HTML instead. Key conversions:

- `**text**` → `<strong>text</strong>`
- `` `code` `` → `<code>code</code>`
- Markdown tables → `<table><tbody>...</tbody></table>`
- ` ```lang ``` ` code fences → `<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">lang</ac:parameter><ac:plain-text-body><![CDATA[...]]></ac:plain-text-body></ac:structured-macro>`
- Always escape `<` → `&lt;` and `>` → `&gt;` in text content (e.g. `alpha > 0.5` breaks CF XML parser)

### Table cells with nested lists

Use `<br>` inside table cells to separate list items inline — Confluence renders this correctly.

## Save CF Page as Markdown

Use the conversion scripts in `.devops-mcp-temp/`:

```bash
# 1. Fetch page
# get_confluence_page_body(id: <pageId>, writeToFile: true)

# 2. Convert markdown macros to native HTML (for CF update)
python .devops-mcp-temp/convert.py

# 3. Convert CF HTML to markdown (for local .md file)
python .devops-mcp-temp/to_md.py
```

Output: `docs/physics_annotation_design.md`

Mermaid diagrams are preserved as ` ```mermaid ``` ` blocks.
Expand macros become `<details><summary>title</summary>...</details>`.

## Confluence CLI (alternative)

For personal-account operations (search, export, comments), use `@qunhe/confluence-cli`:

```bash
# Install
npm install --global @qunhe/confluence-cli --registry "http://npm-registry.qunhequnhe.com"

# Read page
confluence read https://cf.qunhequnhe.com/pages/viewpage.action?pageId=81435845292

# Update page from markdown file
confluence update -f docs/physics_annotation_design.md
```

Requires `CONFLUENCE_TOKEN` env var (personal access token from cf.qunhequnhe.com/plugins/personalaccesstokens/usertokens.action).
