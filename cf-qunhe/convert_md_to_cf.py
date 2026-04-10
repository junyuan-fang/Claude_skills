import re
import os

def md_inline_to_html(text):
    # First extract code spans to protect their content
    code_spans = []
    def save_code(m):
        code_spans.append(m.group(1))
        return f'\x00CODE{len(code_spans)-1}\x00'
    text = re.sub(r'`([^`]+)`', save_code, text)
    # Escape < and > in plain text
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    # Bold
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    # Restore code spans (content inside code should also be escaped)
    for i, code in enumerate(code_spans):
        escaped = code.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        text = text.replace(f'\x00CODE{i}\x00', f'<code>{escaped}</code>')
    return text

def parse_md_table(lines):
    rows = []
    for line in lines:
        if re.match(r'\s*\|[-| :]+\|\s*$', line):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        rows.append(cells)
    if not rows:
        return ''
    html = '<table><tbody>'
    for i, row in enumerate(rows):
        tag = 'th' if i == 0 else 'td'
        html += '<tr>' + ''.join(f'<{tag}><p>{md_inline_to_html(c)}</p></{tag}>' for c in row) + '</tr>'
    html += '</tbody></table>'
    return html

def make_code_macro(lang, code):
    lang_attr = f'<ac:parameter ac:name="language">{lang}</ac:parameter>\n  ' if lang else ''
    return (
        f'<ac:structured-macro ac:name="code" ac:schema-version="1">\n'
        f'  {lang_attr}'
        f'<ac:plain-text-body><![CDATA[{code}]]></ac:plain-text-body>\n'
        f'</ac:structured-macro>'
    )

def collect_list_items(lines, start):
    """Collect consecutive list items (ul or ol), return (items, next_i).
    Each item is (indent_level, ordered, content, sub_items)."""
    items = []
    i = start
    while i < len(lines):
        line = lines[i]
        m_ul = re.match(r'^(\s*)-\s+(.*)', line)
        m_ol = re.match(r'^(\s*)\d+\.\s+(.*)', line)
        if not m_ul and not m_ol:
            break
        indent = len((m_ul or m_ol).group(1))
        content = (m_ul or m_ol).group(2)
        items.append((indent, bool(m_ol), content))
        i += 1
    return items, i

def build_list_html(items):
    """Build nested <ul>/<ol> HTML from flat list of (indent, ordered, content)."""
    if not items:
        return ''
    # Group by indent level
    root_indent = items[0][0]
    root_ordered = items[0][1]
    tag = 'ol' if root_ordered else 'ul'
    html = f'<{tag}>'
    i = 0
    while i < len(items):
        indent, ordered, content = items[i]
        if indent == root_indent:
            # Collect sub-items (deeper indent)
            sub_items = []
            j = i + 1
            while j < len(items) and items[j][0] > root_indent:
                sub_items.append(items[j])
                j += 1
            li_content = f'<p>{md_inline_to_html(content)}</p>'
            if sub_items:
                li_content += build_list_html(sub_items)
            html += f'<li>{li_content}</li>'
            i = j
        else:
            i += 1
    html += f'</{tag}>'
    return html

def markdown_to_cf_html(md_text):
    lines = md_text.split('\n')
    html_parts = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Fenced code block
        m_fence = re.match(r'^```(\w*)\s*$', line)
        if m_fence:
            lang = m_fence.group(1)
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].startswith('```'):
                code_lines.append(lines[i])
                i += 1
            i += 1  # skip closing ```
            html_parts.append(make_code_macro(lang, '\n'.join(code_lines)))
            continue
        # Heading — shift down by 1 so # → h2, ## → h3, ### → h4, #### → bold p
        m = re.match(r'^(#{1,4})\s+(.+)', line)
        if m:
            md_level = len(m.group(1))
            text = md_inline_to_html(m.group(2))
            if md_level <= 3:
                cf_level = md_level + 1  # # → h2, ## → h3, ### → h4
                html_parts.append(f'<h{cf_level}>{text}</h{cf_level}>')
            else:
                # #### → bold paragraph with top margin separator
                html_parts.append(f'<p><strong>{text}</strong></p>')
            i += 1
            continue
        if re.match(r'^---+\s*$', line):
            html_parts.append('<hr/>')
            i += 1
            continue
        if line.startswith('>'):
            content = line.lstrip('> ').strip()
            html_parts.append(f'<blockquote><p>{md_inline_to_html(content)}</p></blockquote>')
            i += 1
            continue
        if re.match(r'\s*\|', line):
            table_lines = []
            while i < len(lines) and re.match(r'\s*\|', lines[i]):
                table_lines.append(lines[i])
                i += 1
            html_parts.append(parse_md_table(table_lines))
            continue
        # Unordered or ordered list
        if re.match(r'^\s*-\s+', line) or re.match(r'^\s*\d+\.\s+', line):
            items, i = collect_list_items(lines, i)
            html_parts.append(build_list_html(items))
            continue
        if line.strip() == '':
            html_parts.append('<p><br/></p>')
            i += 1
            continue
        html_parts.append(f'<p>{md_inline_to_html(line)}</p>')
        i += 1
    return '\n'.join(html_parts)

def replace_markdown_macros(html_content):
    pattern = re.compile(
        r'<ac:structured-macro ac:name="markdown"[^>]*>.*?<ac:plain-text-body><!\[CDATA\[(.*?)\]\]></ac:plain-text-body>\s*</ac:structured-macro>',
        re.DOTALL
    )
    def replacer(m):
        md = m.group(1)
        return markdown_to_cf_html(md)
    return pattern.sub(replacer, html_content)

with open(r'E:\code\physics_annotation_sv\.devops-mcp-temp\81435845292.html', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Original length: {len(content)}")
print(f"Markdown macros found: {content.count('ac:name=\"markdown\"')}")

converted = replace_markdown_macros(content)

# Remove the redundant h2 title from the interface doc markdown
# (it duplicates the existing h1 "接口文档：" in the page)
converted = re.sub(
    r'<h2>物理参数预估系统.*?后端接口文档</h2>\n',
    '', converted
)

print(f"Converted length: {len(converted)}")
print(f"Remaining markdown macros: {converted.count('ac:name=\"markdown\"')}")

with open(r'E:\code\physics_annotation_sv\.devops-mcp-temp\81435845292_converted.html', 'w', encoding='utf-8') as f:
    f.write(converted)

print("Done")
