import re

def cf_html_to_md(html):
    # Remove mermaid macros - keep content as code block
    def mermaid_to_md(m):
        code = m.group(1).strip()
        return f'\n```mermaid\n{code}\n```\n'
    html = re.sub(
        r'<ac:structured-macro ac:name="mermaid-macro"[^>]*>.*?<ac:plain-text-body><!\[CDATA\[(.*?)\]\]></ac:plain-text-body>\s*</ac:structured-macro>',
        mermaid_to_md, html, flags=re.DOTALL
    )

    # Task list
    def task_to_md(m):
        status = 'x' if 'complete' in m.group(1) and 'incomplete' not in m.group(1) else ' '
        body = m.group(2).strip()
        return f'- [{status}] {body}'
    html = re.sub(
        r'<ac:task>.*?<ac:task-status>(.*?)</ac:task-status>.*?<ac:task-body>(.*?)</ac:task-body>.*?</ac:task>',
        task_to_md, html, flags=re.DOTALL
    )
    html = re.sub(r'<ac:task-list>(.*?)</ac:task-list>', r'\1', html, flags=re.DOTALL)

    # Expand macros - use placeholder to survive tag stripping
    OPEN_DETAILS = '\x00DETAILS_OPEN\x00'
    CLOSE_DETAILS = '\x00DETAILS_CLOSE\x00'
    def expand_to_md(m):
        title = re.sub(r'<[^>]+>', '', m.group(1)).strip()
        body = m.group(2)
        return f'\n{OPEN_DETAILS}{title}{OPEN_DETAILS}\n\n{body}\n{CLOSE_DETAILS}\n'
    html = re.sub(
        r'<ac:structured-macro ac:name="expand"[^>]*>\s*<ac:parameter ac:name="title">(.*?)</ac:parameter>\s*<ac:rich-text-body>(.*?)</ac:rich-text-body>\s*</ac:structured-macro>',
        expand_to_md, html, flags=re.DOTALL
    )

    # Inline comment markers - strip
    html = re.sub(r'<ac:inline-comment-marker[^>]*>(.*?)</ac:inline-comment-marker>', r'\1', html, flags=re.DOTALL)

    # Images
    html = re.sub(r'<ac:image[^>]*>.*?</ac:image>', '[image]', html, flags=re.DOTALL)

    # Headings
    for level in range(1, 7):
        html = re.sub(rf'<h{level}[^>]*>(.*?)</h{level}>', lambda m, l=level: '\n' + '#'*l + ' ' + re.sub(r'<[^>]+>', '', m.group(1)).strip() + '\n', html, flags=re.DOTALL)

    # Tables
    BR = '\x00BR\x00'
    def flatten_cell(cell_html):
        cell_html = re.sub(r'<li[^>]*>(.*?)</li>', lambda m: BR + '- ' + re.sub(r'<[^>]+>', '', m.group(1)).strip(), cell_html, flags=re.DOTALL)
        cell_html = re.sub(r'<[uo]l[^>]*>|</[uo]l>', '', cell_html)
        cell_html = re.sub(r'<p[^>]*>(.*?)</p>', lambda m: re.sub(r'<[^>]+>', '', m.group(1)).strip() + BR, cell_html, flags=re.DOTALL)
        cell_html = re.sub(r'<[^>]+>', '', cell_html)
        parts = [p.strip() for p in cell_html.replace(BR, '\n').splitlines() if p.strip()]
        # Use BR placeholder so it survives the later tag-strip pass
        return BR.join(parts)

    def table_to_md(m):
        table_html = m.group(0)
        rows = re.findall(r'<tr>(.*?)</tr>', table_html, re.DOTALL)
        md_rows = []
        for i, row in enumerate(rows):
            cells = re.findall(r'<t[hd][^>]*>(.*?)</t[hd]>', row, re.DOTALL)
            cells = [flatten_cell(c) for c in cells]
            md_rows.append('| ' + ' | '.join(cells) + ' |')
            if i == 0:
                md_rows.append('| ' + ' | '.join(['---'] * len(cells)) + ' |')
        return '\n' + '\n'.join(md_rows) + '\n'
    html = re.sub(r'<table[^>]*>.*?</table>', table_to_md, html, flags=re.DOTALL)

    # Inline formatting
    html = re.sub(r'<strong>(.*?)</strong>', r'**\1**', html, flags=re.DOTALL)
    html = re.sub(r'<code>(.*?)</code>', r'`\1`', html, flags=re.DOTALL)
    html = re.sub(r'<blockquote><p>(.*?)</p></blockquote>', r'> \1', html, flags=re.DOTALL)

    # Lists
    html = re.sub(r'<li[^>]*>(.*?)</li>', lambda m: '- ' + re.sub(r'<[^>]+>', '', m.group(1)).strip(), html, flags=re.DOTALL)
    html = re.sub(r'<[uo]l[^>]*>', '', html)
    html = re.sub(r'</[uo]l>', '', html)

    # Paragraphs and breaks
    html = re.sub(r'<p[^>]*>\s*<br\s*/>\s*</p>', '\n', html)
    html = re.sub(r'<br\s*/>', '\n', html)
    html = re.sub(r'<p[^>]*>(.*?)</p>', lambda m: re.sub(r'<[^>]+>', '', m.group(1)).strip() + '\n', html, flags=re.DOTALL)

    # Links
    html = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r'[\2](\1)', html, flags=re.DOTALL)

    # Strip remaining tags
    html = re.sub(r'<[^>]+>', '', html)

    # Restore <br> placeholders (from table cells)
    html = html.replace('\x00BR\x00', '<br>')

    # Restore details/summary from placeholders
    def restore_details(text):
        result = []
        for line in text.split('\n'):
            if '\x00DETAILS_OPEN\x00' in line:
                parts = line.split('\x00DETAILS_OPEN\x00')
                title = parts[1] if len(parts) > 1 else ''
                result.append(f'<details>\n<summary>{title}</summary>')
            elif '\x00DETAILS_CLOSE\x00' in line:
                result.append('</details>')
            else:
                result.append(line)
        return '\n'.join(result)
    html = restore_details(html)

    # Unescape HTML entities
    html = html.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('&nbsp;', ' ')
    html = html.replace('&rarr;', '→').replace('&larr;', '←').replace('&lsquo;', "'").replace('&rsquo;', "'")
    html = html.replace('&ldquo;', '"').replace('&rdquo;', '"').replace('&mdash;', '—').replace('&ndash;', '–')
    html = html.replace('&sup2;', '²').replace('&sup3;', '³').replace('&le;', '≤').replace('&ge;', '≥')

    # Clean up multiple blank lines
    html = re.sub(r'\n{3,}', '\n\n', html)

    return html.strip()

with open(r'E:\code\physics_annotation_sv\.devops-mcp-temp\81435845292_converted.html', 'r', encoding='utf-8') as f:
    content = f.read()

md = cf_html_to_md(content)

out_path = 'E:\\code\\physics_annotation_sv\\docs\\physics_annotation_design.md'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('# 物理参数预估+ 赋值，铰链，运动轴估计\n\n')
    f.write(f'> Confluence: https://cf.qunhequnhe.com/pages/viewpage.action?pageId=81435845292\n\n')
    f.write(md)

print(f"Saved to {out_path}")
print(f"Lines: {len(md.splitlines())}")
