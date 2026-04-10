---
name: cf-qunhe
description: Work with the internal Confluence at cf.qunhequnhe.com — read/edit pages via MCP (qunhe-devops-mcp), handle mermaid/markdown macros, convert pages to markdown, and manage page permissions for robot-mobot.
---

# cf-qunhe Skill

Internal Confluence (cf.qunhequnhe.com) workflows using `qunhe-devops-mcp` MCP tools.

## Files in this skill

| File | Purpose |
|------|---------|
| `convert_md_to_cf.py` | Convert `markdown` macros in CF HTML to native CF HTML (tables, code blocks, bold). Run before uploading to CF. |
| `cf_to_md.py` | Convert CF HTML to readable Markdown. Run to save a local `.md` copy. |

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
# For large pages use writeToFile: true → writes to .devops-mcp-temp/<pageId>.html
```

### Edit a page

1. `get_confluence_page_body(id, writeToFile: true)`
2. `get_confluence_page_metadata(id)` — note the current `version.number`
3. Edit `.devops-mcp-temp/<pageId>.html`
4. `update_confluence_page(id, bodyFile, version: {number: current+1, message: "..."})`

### Fix markdown macros + save as .md (full workflow)

```bash
# 1. Fetch page via MCP (writeToFile: true) → .devops-mcp-temp/<pageId>.html

# 2. Convert markdown macros to native CF HTML, then upload
#    Copy convert_md_to_cf.py to project, update INPUT/OUTPUT paths at bottom, run:
python convert_md_to_cf.py

# 3. Save page as local markdown
#    Copy cf_to_md.py to project, update paths, run:
python cf_to_md.py
```

### Add a task list (todo) before a section

```html
<h2>待办事项</h2>
<ac:task-list>
  <ac:task>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>task description</ac:task-body>
  </ac:task>
</ac:task-list>
```

---

## convert_md_to_cf.py — Conversion Rules

Converts all `<ac:structured-macro ac:name="markdown">` blocks to native Confluence HTML so users can add inline comments.

### Inline formatting

| Markdown | CF HTML |
|----------|---------|
| `**text**` | `<strong>text</strong>` |
| `` `code` `` | `<code>code</code>` |

**Important:** escape `<` → `&lt;` and `>` → `&gt;` in plain text **before** applying bold/code. Code span content is also escaped. This prevents CF XML parser errors (e.g. `alpha > 0.5` would break the upload).

### Headings

Markdown `#` levels are shifted down by 1 to fit inside existing CF page structure:
- `#` → `<h2>`, `##` → `<h3>`, `###` → `<h4>`, `####` → `<p><strong>...</strong></p>`

### Tables

```
| col1 | col2 |    →    <table><tbody>
|------|------|              <tr><th><p>col1</p></th><th><p>col2</p></th></tr>
| a    | b    |              <tr><td><p>a</p></td><td><p>b</p></td></tr>
                        </tbody></table>
```

Cells with nested lists (e.g. `<ul>` inside `<td>`) are flattened to inline text using `<br>` separators — Confluence renders these correctly in table cells.

### Code fences

````
```json          →    <ac:structured-macro ac:name="code">
{...}                   <ac:parameter ac:name="language">json</ac:parameter>
```                     <ac:plain-text-body><![CDATA[{...}]]></ac:plain-text-body>
                      </ac:structured-macro>
````

Language tag is preserved (json, python, bash, etc.). Plain ` ``` ` (no language) produces a code macro with no language attribute.

### Lists

Unordered (`- item`) and ordered (`1. item`) lists, including nested (indent-based), are converted to `<ul>/<ol><li>` HTML.

### Other elements

| Markdown | CF HTML |
|----------|---------|
| `> quote` | `<blockquote><p>quote</p></blockquote>` |
| `---` | `<hr/>` |
| blank line | `<p><br/></p>` |
| plain text line | `<p>text</p>` |

---

## cf_to_md.py — Conversion Rules

Converts CF storage HTML to readable GitHub-flavored Markdown.

### Element mapping

| CF Element | Markdown output |
|------------|----------------|
| `<ac:structured-macro name="mermaid-macro">` | ` ```mermaid ... ``` ` code block |
| `<ac:structured-macro name="expand">` | `<details><summary>title</summary>...</details>` |
| `<ac:task-list>` / `<ac:task>` | `- [ ] task` / `- [x] task` |
| `<ac:structured-macro name="code">` | ` ```lang ... ``` ` |
| `<ac:image>` | `[image]` placeholder |
| `<h1>`–`<h6>` | `#`–`######` headings |
| `<table>` | Markdown pipe table |
| `<strong>` | `**text**` |
| `<code>` | `` `text` `` |
| `<blockquote>` | `> text` |
| `<ul>/<li>` | `- item` |
| `<br>` inside `<td>` | preserved as `<br>` (markdown tables support this) |

### Tricky parts

**Table cells with nested content:** List items and paragraphs inside `<td>` are joined with `<br>` so the table row stays on one line. Uses a `\x00BR\x00` placeholder to survive the final tag-strip pass.

**`<details>` tags:** Also use `\x00DETAILS_OPEN\x00` / `\x00DETAILS_CLOSE\x00` placeholders so they aren't removed by the final `re.sub(r'<[^>]+>', '', html)` tag-strip.

**HTML entity unescaping** (applied at the end):
`&lt;` → `<`, `&gt;` → `>`, `&amp;` → `&`, `&nbsp;` → ` `, `&rarr;` → `→`, etc.

---

## Known Gotchas

### robot-mobot permissions

MCP acts as `robot-mobot`. 404 → grant **View**. 403 on update → grant **Edit**.

Page → `...` → Page Restrictions → add `robot-mobot`

### Mermaid: autonumber + actor not supported by MCP validator

```python
content = re.sub(r'\s*autonumber\n', '', content)
content = content.replace('actor ', 'participant ')
```

### Version conflict on update

If you get `409 Version must be incremented`, re-fetch with `get_confluence_page_metadata` to get the latest version number — someone else may have edited the page.

---

## Confluence CLI (alternative)

For personal-account operations (search, export, comments):

```bash
npm install --global @qunhe/confluence-cli --registry "http://npm-registry.qunhequnhe.com"
export CONFLUENCE_TOKEN="<pat from cf.qunhequnhe.com/plugins/personalaccesstokens/usertokens.action>"

confluence read https://cf.qunhequnhe.com/pages/viewpage.action?pageId=81435845292
confluence update -f docs/design.md
confluence search "keyword"
```
