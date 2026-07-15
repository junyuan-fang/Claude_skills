/* Build the vC docs site from the learning markdown. Node 18, no deps. */
const fs = require("fs");
const path = require("path");

const ROOT = "/data/curobo/curobo-learning";
const OUT = path.join(ROOT, "site", "vC");

/* ---------- page model ---------------------------------------------------- */
// linear order used for pager + sidebar
const PAGES = [
  { id: "index", url: "index.html", title: "总览", navLabel: "总览", group: "start" },
  { id: "stage-0", url: "stage-0.html", src: "stages/00-世界观.md",
    title: "阶段 0 · 世界观", navLabel: "0 · 世界观", group: "stage", stage: true },
  { id: "stage-1", url: "stage-1.html", src: "stages/01-跑通与目标函数.md",
    title: "阶段 1 · 跑通与目标函数", navLabel: "1 · 跑通与目标函数", group: "stage", stage: true },
  { id: "stage-2", url: "stage-2.html", src: "stages/02-求解器核心.md",
    title: "阶段 2 · 求解器核心", navLabel: "2 · 求解器核心 ⭐", group: "stage", stage: true },
  { id: "stage-3", url: "stage-3.html", src: "stages/03-代价函数与GPU运动学.md",
    title: "阶段 3 · 代价函数与 GPU 运动学", navLabel: "3 · 代价函数与GPU运动学", group: "stage", stage: true },
  { id: "stage-4", url: "stage-4.html", src: "stages/04-cuRoboV2进阶.md",
    title: "阶段 4 · cuRoboV2 进阶", navLabel: "4 · cuRoboV2 进阶", group: "stage", stage: true },
  { id: "stage-5", url: "stage-5.html", src: "stages/05-贡献之路.md",
    title: "阶段 5 · 贡献之路", navLabel: "5 · 贡献之路", group: "stage", stage: true },
  { id: "theory-0", url: "theory-0.html", src: "theory/00-零基础白话导读.md",
    title: "理论 0 · 零基础白话导读", navLabel: "00 · 零基础白话导读", group: "theory" },
  { id: "theory-1", url: "theory-1.html", src: "theory/01-四元数与位姿误差.md",
    title: "理论 1 · 四元数与位姿误差", navLabel: "四元数与位姿误差", group: "theory" },
  { id: "theory-2", url: "theory-2.html", src: "theory/02-数值优化-从梯度下降到LBFGS和LM.md",
    title: "理论 2 · 数值优化：GD → L-BFGS → LM", navLabel: "数值优化 GD→LBFGS→LM", group: "theory" },
  { id: "theory-3", url: "theory-3.html", src: "theory/03-线搜索-Armijo与Wolfe.md",
    title: "理论 3 · 线搜索：Armijo 与 Wolfe", navLabel: "线搜索 Armijo/Wolfe", group: "theory" },
  { id: "theory-4", url: "theory-4.html", src: "theory/04-MPPI粒子优化.md",
    title: "理论 4 · MPPI 粒子优化", navLabel: "MPPI 粒子优化", group: "theory" },
  { id: "resources", url: "resources.html", src: "资源链接.md",
    title: "外部资源", navLabel: "资源链接", group: "start" },
  { id: "glossary", url: "glossary.html",
    title: "术语表", navLabel: "术语表", group: "start" },
];
const byId = Object.fromEntries(PAGES.map((p) => [p.id, p]));

// map md basenames -> site url (for cross links)
const MD2URL = {};
PAGES.forEach((p) => {
  if (p.src) MD2URL[path.basename(p.src)] = p.url;
});
MD2URL["IK学习路线.md"] = "index.html";

// glossary data (for build-time term matching); runtime uses the same file for cards
let GLOSSARY = [];
try {
  const gpath = path.join(OUT, "glossary.js");
  if (fs.existsSync(gpath)) {
    const win = {};
    new Function("window", fs.readFileSync(gpath, "utf8"))(win);
    GLOSSARY = win.GLOSSARY || [];
  }
} catch (e) {
  console.warn("glossary load failed:", e.message);
  GLOSSARY = [];
}

/* ---------- inline formatting -------------------------------------------- */
function escHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function escAttr(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// convert inline markdown (already NOT inside code fence). ctx (optional) enables
// glossary term annotation on body text (headings/chrome pass no ctx → skipped).
function inline(text, ctx) {
  var Z = String.fromCharCode(0);
  const codeSpans = [],
    mathSpans = [],
    linkSpans = [],
    termSpans = [];
  // 1. inline code
  text = text.replace(/`([^`]+)`/g, function (m, c) {
    codeSpans.push("<code>" + escHtml(c) + "</code>");
    return Z + "C" + (codeSpans.length - 1) + Z;
  });
  // 2. math: display $$..$$ then inline $..$ (raw LaTeX kept for KaTeX auto-render)
  text = text.replace(/\$\$([^$]+?)\$\$/g, function (m, inner) {
    mathSpans.push("$$" + escHtml(inner) + "$$");
    return Z + "M" + (mathSpans.length - 1) + Z;
  });
  text = text.replace(/\$([^$\n]+?)\$/g, function (m, inner) {
    mathSpans.push("$" + escHtml(inner) + "$");
    return Z + "M" + (mathSpans.length - 1) + Z;
  });
  // 3. markdown links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, label, url) {
    linkSpans.push(anchor(url, label));
    return Z + "L" + (linkSpans.length - 1) + Z;
  });
  // 4. bare urls
  text = text.replace(/https?:\/\/[^\s<]+/g, function (m) {
    var trail = "";
    var t = m.match(/[.,;:)），。、！？】]+$/);
    if (t) {
      trail = t[0];
      m = m.slice(0, -trail.length);
    }
    linkSpans.push(
      '<a href="' + escAttr(m) + '" target="_blank" rel="noopener">' + escHtml(m) + "</a>"
    );
    return Z + "L" + (linkSpans.length - 1) + Z + trail;
  });
  // 5. escape remaining text
  text = escHtml(text);
  // 6. line breaks (callers join multi-line blocks with \n)
  text = text.replace(/\n/g, "<br>");
  // 7. bold
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // 8. glossary term annotation (body only); stashed as placeholders so later
  //    terms never re-match inside an inserted <span> or its attributes
  if (ctx && ctx.glossary && ctx.glossary.length) {
    ctx.glossary.forEach(function (g) {
      if (ctx.used.has(g.id)) return;
      var variants = (Array.isArray(g.match) ? g.match : [g.match]).filter(Boolean);
      var best = -1,
        bestLen = 0;
      variants.forEach(function (v) {
        var esc = v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var ascii = /^[\x20-\x7E]+$/.test(v) && /[A-Za-z0-9]/.test(v);
        var re = ascii
          ? new RegExp("(^|[^A-Za-z0-9])(" + esc + ")(?![A-Za-z0-9])")
          : new RegExp("(" + esc + ")");
        var mm = re.exec(text);
        if (mm) {
          var idx = ascii ? mm.index + mm[1].length : mm.index;
          var len = (ascii ? mm[2] : mm[1]).length;
          if (best < 0 || idx < best) {
            best = idx;
            bestLen = len;
          }
        }
      });
      if (best >= 0) {
        var termText = text.slice(best, best + bestLen);
        termSpans.push(
          '<span class="term" data-term="' + escAttr(g.id) + '">' + termText + "</span>"
        );
        var ph = Z + "T" + (termSpans.length - 1) + Z;
        text = text.slice(0, best) + ph + text.slice(best + bestLen);
        ctx.used.add(g.id);
      }
    });
  }
  // 9. restore placeholders
  text = text.replace(new RegExp(Z + "T(\\d+)" + Z, "g"), function (m, i) {
    return termSpans[+i];
  });
  text = text.replace(new RegExp(Z + "C(\\d+)" + Z, "g"), function (m, i) {
    return codeSpans[+i];
  });
  text = text.replace(new RegExp(Z + "M(\\d+)" + Z, "g"), function (m, i) {
    return mathSpans[+i];
  });
  text = text.replace(new RegExp(Z + "L(\\d+)" + Z, "g"), function (m, i) {
    return linkSpans[+i];
  });
  return text;
}

function anchor(url, label) {
  let href = url.trim();
  let external = /^https?:\/\//.test(href);
  if (!external) {
    // resolve md cross-link
    let base = href.split("#")[0];
    let hash = href.includes("#") ? "#" + href.split("#")[1] : "";
    let bn = path.basename(base);
    if (MD2URL[bn]) href = MD2URL[bn] + hash;
  }
  const attrs = external ? ' target="_blank" rel="noopener"' : "";
  return '<a href="' + escAttr(href) + '"' + attrs + ">" + escHtml(label) + "</a>";
}

/* ---------- block parser -------------------------------------------------- */
let slugCounter = {};
function slugify(text, used) {
  let base = text
    .toLowerCase()
    .replace(/[`*]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w一-龥\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!base) base = "sec";
  let s = base,
    i = 1;
  while (used[s]) s = base + "-" + i++;
  used[s] = true;
  return s;
}

// section container detection from h2 text
function containerType(title) {
  if (/检验/.test(title)) return "tip";
  if (/坑/.test(title)) return "warning";
  return null;
}
// checkbox section detection (stage pages)
function checkboxSlug(title) {
  if (/动手练习/.test(title)) return "exercise";
  if (/检验/.test(title)) return "checkpoint";
  if (/前置知识自查|自查/.test(title)) return "prereq";
  return null;
}

function parseMarkdown(md, page) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const used = {};
  // per-page glossary annotation context (first occurrence of each term per page)
  const termCtx = { glossary: GLOSSARY, used: new Set() };
  const headings = [];
  const progressKeys = [];
  let plain = [];
  let out = [];
  let i = 0;

  // container state
  let container = null; // { type }
  let curSection = null; // current section title (for checkbox detection)
  const checkboxCounters = {};

  function nextCheckKey(slug) {
    const n = checkboxCounters[slug] || 0;
    checkboxCounters[slug] = n + 1;
    const key = "vc:ck:" + page.id + ":" + slug + ":" + n;
    progressKeys.push(key);
    return key;
  }
  // does the current section (from line idx until next h2) contain a list?
  function sectionHasList(idx) {
    for (let j = idx; j < lines.length; j++) {
      if (/^##\s/.test(lines[j])) break;
      if (/^\s*([-*]|\d+\.)\s+/.test(lines[j])) return true;
    }
    return false;
  }

  function closeContainer() {
    if (container) {
      out.push("</div>");
      container = null;
    }
  }

  function renderList(startIdx, indent) {
    // returns {html, next}
    let idx = startIdx;
    const ordered = /^\s*\d+\.\s/.test(lines[idx]);
    const isCheckSection =
      page.stage && curSection && checkboxSlug(curSection);
    let html = "";
    const items = [];
    while (idx < lines.length) {
      const line = lines[idx];
      if (line.trim() === "") {
        // lookahead: continue list only if next non-empty is a list item at same indent
        let j = idx + 1;
        if (j < lines.length && /^\s*([-*]|\d+\.)\s/.test(lines[j])) {
          idx++;
          continue;
        }
        break;
      }
      const m = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      if (!m) break;
      const ind = m[1].length;
      if (ind < indent) break;
      if (ind > indent) {
        // nested — attach to previous item
        const nested = renderList(idx, ind);
        if (items.length) items[items.length - 1].children += nested.html;
        idx = nested.next;
        continue;
      }
      let content = m[3];
      // checkbox raw syntax
      let forcedCheck = null;
      const cb = content.match(/^\[([ xX])\]\s+(.*)$/);
      if (cb) {
        forcedCheck = true;
        content = cb[2];
      }
      items.push({ content: inline(content, termCtx), children: "", checkbox: forcedCheck });
      plain.push(content);
      idx++;
    }
    if (isCheckSection) {
      const slug = checkboxSlug(curSection);
      html += '<ul class="check-list">';
      items.forEach((it) => {
        const key = nextCheckKey(slug);
        html +=
          '<li class="check-item"><input type="checkbox" data-key="' +
          key +
          '" aria-label="标记完成"><span class="check-body">' +
          it.content +
          it.children +
          "</span></li>";
      });
      html += "</ul>";
    } else {
      const tag = ordered ? "ol" : "ul";
      html += "<" + tag + ">";
      items.forEach((it) => {
        html += "<li>" + it.content + it.children + "</li>";
      });
      html += "</" + tag + ">";
    }
    return { html, next: idx };
  }

  while (i < lines.length) {
    let line = lines[i];

    // blank
    if (line.trim() === "") {
      i++;
      continue;
    }

    // fenced code
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      const codeHtml = escHtml(buf.join("\n"));
      out.push(
        '<div class="code-block">' +
          (lang ? '<span class="code-lang">' + escHtml(lang) + "</span>" : "") +
          '<button class="copy-btn" type="button" aria-label="复制代码">' +
          '<span class="copy-label">复制</span></button>' +
          "<pre><code>" +
          codeHtml +
          "</code></pre></div>"
      );
      continue;
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const rawText = h[2].trim();
      // skip the H1 (page title provided separately) but capture for plain
      if (level === 1) {
        plain.push(rawText);
        i++;
        continue;
      }
      const id = slugify(rawText, used);
      plain.push(rawText);
      if (level === 2) {
        closeContainer();
        curSection = rawText;
        const ct = containerType(rawText);
        if (ct) {
          const label =
            ct === "tip" ? "✓ " + rawText : ct === "warning" ? "⚠ " + rawText : rawText;
          out.push('<div class="custom-block ' + ct + '" id="' + id + '">');
          out.push('<div class="custom-block-title">' + escHtml(label) + "</div>");
          headings.push({ level, text: rawText, id });
          container = { type: ct };
          i++;
          continue;
        }
      }
      if (level === 3) curSection = rawText;
      headings.push({ level, text: rawText, id });
      const anchorLink =
        '<a class="anchor" href="#' + id + '" aria-hidden="true">#</a>';
      out.push(
        "<h" + level + ' id="' + id + '">' + inline(rawText) + anchorLink + "</h" + level + ">"
      );
      i++;
      continue;
    }

    // table
    if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:\-|]+\|\s*$/.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2; // skip separator
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      let t = '<div class="table-wrap"><table><thead><tr>';
      header.forEach((c) => {
        t += "<th>" + inline(c, termCtx) + "</th>";
        plain.push(c);
      });
      t += "</tr></thead><tbody>";
      rows.forEach((r) => {
        t += "<tr>";
        r.forEach((c) => {
          t += "<td>" + inline(c, termCtx) + "</td>";
          plain.push(c);
        });
        t += "</tr>";
      });
      t += "</tbody></table></div>";
      out.push(t);
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const txt = buf.join(" ");
      plain.push(txt);
      // 📐 derivation: neutral dedicated container (thin left rule), title = first
      // line (bold), body = the rest; not term-annotated to keep the math focused
      if (/📐/.test(buf[0] || "")) {
        let titleLine = (buf[0] || "")
          .replace(/^\s*\*\*/, "")
          .replace(/\*\*\s*$/, "");
        const bodyLines = buf.slice(1);
        out.push('<div class="custom-block derivation">');
        out.push('<div class="custom-block-title">' + inline(titleLine) + "</div>");
        if (bodyLines.length)
          out.push("<p>" + inline(bodyLines.join("\n")) + "</p>");
        out.push("</div>");
        continue;
      }
      // a 💡-prefixed blockquote is a tip; everything else is a neutral note
      let bqBody = buf.join("\n");
      let bqType = "info",
        bqTitle = "说明";
      if (/^\s*💡/.test(bqBody)) {
        bqType = "tip";
        bqTitle = "💡 提示";
        bqBody = bqBody.replace(/^\s*💡\s*/, "");
      }
      out.push(
        '<div class="custom-block ' +
          bqType +
          '"><div class="custom-block-title">' +
          bqTitle +
          "</div><p>" +
          inline(bqBody, termCtx) +
          "</p></div>"
      );
      continue;
    }

    // horizontal rule
    if (/^---+\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

    // display math ($$ ... $$) — kept as a single text node (no <br>) for KaTeX auto-render
    if (/^\s*\$\$/.test(line)) {
      const t = line.trim();
      const single = t.match(/^\$\$([\s\S]*)\$\$$/);
      if (single && single[1].length > 0 && single[1].indexOf("$$") === -1) {
        out.push('<div class="math-block">$$' + escHtml(single[1]) + "$$</div>");
        i++;
        continue;
      }
      const buf = [];
      const head = t.slice(2);
      if (head.trim()) buf.push(head);
      i++;
      while (i < lines.length && !/\$\$\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        const tail = lines[i].replace(/\$\$\s*$/, "");
        if (tail.trim()) buf.push(tail);
        i++;
      }
      out.push('<div class="math-block">$$' + escHtml(buf.join("\n")) + "$$</div>");
      continue;
    }

    // list
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const r = renderList(i, line.match(/^(\s*)/)[1].length);
      out.push(r.html);
      i = r.next;
      continue;
    }

    // paragraph
    const pbuf = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i]) &&
      !/^\|.*\|\s*$/.test(lines[i]) &&
      !/^\s*\$\$/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i])
    ) {
      pbuf.push(lines[i]);
      i++;
    }
    const ptext = pbuf.join("\n");
    plain.push(ptext.replace(/\n/g, " "));
    // prose-only checkpoint on a stage page → single checkbox
    if (
      page.stage &&
      curSection &&
      checkboxSlug(curSection) === "checkpoint" &&
      !sectionHasList(i)
    ) {
      const key = nextCheckKey("checkpoint");
      out.push(
        '<ul class="check-list"><li class="check-item"><input type="checkbox" data-key="' +
          key +
          '" aria-label="标记完成"><span class="check-body">' +
          inline(pbuf.join("\n"), termCtx) +
          "</span></li></ul>"
      );
      continue;
    }
    out.push("<p>" + inline(pbuf.join("\n"), termCtx) + "</p>");
  }
  closeContainer();

  return {
    html: out.join("\n"),
    headings,
    progressKeys,
    plain: stripMath(plain.join(" ")).replace(/\s+/g, " ").trim(),
  };
}

// split a table row on unescaped, non-math pipes (so $\|x\|$ / $|a|$ survive intact)
function splitRow(line) {
  let s = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let cur = "",
    inMath = false;
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    if (ch === "\\" && k + 1 < s.length) {
      cur += ch + s[k + 1];
      k++;
      continue;
    }
    if (ch === "$") {
      inMath = !inMath;
      cur += ch;
      continue;
    }
    if (ch === "|" && !inMath) {
      cells.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

// remove LaTeX from a string for the plain-text search index
function stripMath(s) {
  return s
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+?\$/g, " ");
}

/* ---------- shared HTML chrome ------------------------------------------- */
const THEME_INIT =
  "(function(){try{var t=localStorage.getItem('vc:theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();";

const SUN_SVG =
  '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
const MOON_SVG =
  '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const SEARCH_SVG =
  '<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
const BURGER_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

function topbar() {
  return `<header class="topbar">
  <button class="icon-btn hamburger" aria-label="打开导航" aria-expanded="false">${BURGER_SVG}</button>
  <a class="topbar-title" href="index.html"><span class="topbar-logo">IK</span><span class="full">cuRobo IK 学习路线</span></a>
  <div class="topbar-spacer"></div>
  <div class="search-box">
    ${SEARCH_SVG}
    <input class="search-input" type="text" placeholder="搜索文档" aria-label="搜索" autocomplete="off" spellcheck="false">
    <span class="search-key">/</span>
    <div class="search-results" role="listbox"></div>
  </div>
  <button class="icon-btn theme-toggle" aria-label="切换主题">${SUN_SVG}${MOON_SVG}</button>
</header>`;
}

function sidebar(activeId) {
  const groups = [
    { key: "start", title: "开始", ids: ["index", "resources", "glossary"] },
    { key: "stage", title: "学习阶段", ids: ["stage-0", "stage-1", "stage-2", "stage-3", "stage-4", "stage-5"] },
    { key: "theory", title: "理论教程", ids: ["theory-0", "theory-1", "theory-2", "theory-3", "theory-4"] },
  ];
  let html = '<aside class="sidebar" id="sidebar"><nav>';
  groups.forEach((g) => {
    html += '<div class="nav-group"><div class="nav-group-title">' + g.title + "</div>";
    g.ids.forEach((id) => {
      const p = byId[id];
      const active = id === activeId ? " active" : "";
      const count = p.stage
        ? '<span class="nav-count" data-page="' + id + '">0/0</span>'
        : "";
      html +=
        '<a class="nav-link' +
        active +
        '" href="' +
        p.url +
        '"><span class="nav-label">' +
        escHtml(p.navLabel) +
        "</span>" +
        count +
        "</a>";
    });
    html += "</div>";
  });
  html += "</nav></aside>";
  return html;
}

function pager(id) {
  const idx = PAGES.findIndex((p) => p.id === id);
  const prev = idx > 0 ? PAGES[idx - 1] : null;
  const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
  if (!prev && !next) return "";
  let html = '<nav class="pager">';
  if (prev)
    html +=
      '<a class="pager-link prev" href="' +
      prev.url +
      '"><span class="pager-dir">上一页</span><span class="pager-title">' +
      escHtml(prev.title) +
      "</span></a>";
  if (next)
    html +=
      '<a class="pager-link next" href="' +
      next.url +
      '"><span class="pager-dir">下一页</span><span class="pager-title">' +
      escHtml(next.title) +
      "</span></a>";
  html += "</nav>";
  return html;
}

function tocHtml(headings) {
  const list = headings.filter((h) => h.level === 2 || h.level === 3);
  if (list.length < 2) return "";
  let html =
    '<aside class="toc"><div class="toc-inner"><div class="toc-title">本页目录</div><nav>';
  list.forEach((h) => {
    html +=
      '<a class="toc-link lvl-' +
      h.level +
      '" href="#' +
      h.id +
      '">' +
      escHtml(h.text) +
      "</a>";
  });
  html += "</nav></div></aside>";
  return html;
}

function shell(page, bodyInner, headings) {
  const toc = headings ? tocHtml(headings) : "";
  return `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escHtml(page.title)} · cuRobo IK 学习路线</title>
<meta name="description" content="cuRobo IK 学习路线 — ${escHtml(page.title)}">
<script>${THEME_INIT}</script>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%2318794e'/><text x='16' y='23' font-family='Arial,sans-serif' font-size='17' font-weight='bold' fill='white' text-anchor='middle'>IK</text></svg>">
<link rel="stylesheet" href="vendor/katex/katex.min.css">
<link rel="stylesheet" href="style.css">
</head>
<body>
${topbar()}
${sidebar(page.id)}
<div class="backdrop" id="backdrop"></div>
<main class="main">
  <div class="page">
    <div class="doc-col">
${bodyInner}
    </div>
${toc}
  </div>
</main>
<script src="search-index.js"></script>
<script src="glossary.js"></script>
<script src="vendor/katex/katex.min.js"></script>
<script src="vendor/katex/auto-render.min.js"></script>
<script>
(function () {
  function render() {
    if (!window.renderMathInElement) return;
    var target = document.querySelector(".page") || document.body;
    window.renderMathInElement(target, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"]
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", render);
  else render();
})();
</script>
<script src="app.js"></script>
</body>
</html>`;
}

/* ---------- index page ---------------------------------------------------- */
function buildIndex() {
  const stageMeta = [
    { id: "stage-0", n: "0", time: "0.5 天", desc: "说清 “IK = 优化问题”，两篇论文分工。" },
    { id: "stage-1", n: "1", time: "1 天", desc: "跑通 example，读懂 Eq 14 的目标函数。" },
    { id: "stage-2", n: "2 ⭐", time: "2–3 天", desc: "画出 solve_pose 数据流，复现两个消融。" },
    { id: "stage-3", n: "3", time: "2 天", desc: "球表示 + 距离查询，FK 融合成单 kernel。" },
    { id: "stage-4", n: "4", time: "2 天", desc: "说清 cuRoboV2 在 IK 上的增量。" },
    { id: "stage-5", n: "5", time: "第 2 周起", desc: "从热身到发出第一个 PR。" },
  ];
  const theoryMeta = [
    { id: "theory-0", n: "0", t: "零基础白话导读", s: "看不懂阶段 0？零数学先导" },
    { id: "theory-1", n: "1", t: "四元数与位姿误差", s: "服务阶段 1 · Eq 14 方向项" },
    { id: "theory-2", n: "2", t: "数值优化：GD → L-BFGS → LM", s: "服务阶段 2 · 求解器主体" },
    { id: "theory-3", n: "3", t: "线搜索：Armijo 与 Wolfe", s: "服务阶段 2 · 并行噪声线搜索" },
    { id: "theory-4", n: "4", t: "MPPI 粒子优化", s: "服务阶段 2 · 种子播种" },
  ];

  let cards = "";
  stageMeta.forEach((s) => {
    const p = byId[s.id];
    cards += `<a class="card" data-page="${s.id}" href="${p.url}">
  <div class="card-top"><span class="card-badge">${s.n}</span><span class="card-time">${s.time}</span></div>
  <h3>${escHtml(p.title.replace(/^阶段 \d+ · /, ""))}</h3>
  <div class="card-desc">${escHtml(s.desc)}</div>
  <div class="card-progress"><div class="progress"><div class="progress-fill"></div></div><span class="frac tnum">0/0</span></div>
</a>`;
  });

  let theory = "";
  theoryMeta.forEach((t) => {
    const p = byId[t.id];
    theory += `<a class="theory-item" href="${p.url}">
  <span class="theory-num">${t.n}</span>
  <span class="theory-body"><span class="t">${escHtml(t.t)}</span><br><span class="s">${escHtml(t.s)}</span></span>
  <span class="arrow">→</span>
</a>`;
  });

  const timelineRows = stageMeta
    .map((s) => {
      const p = byId[s.id];
      const milestones = {
        "stage-0": "说清 “IK = 优化问题”",
        "stage-1": "example 全跑通，懂 Eq 14",
        "stage-2": "画出 solve_pose 数据流，复现 2 个消融",
        "stage-3": "懂球表示与 kernel 融合",
        "stage-4": "说清 v2 的 IK 增量",
        "stage-5": "发出第一个 PR",
      };
      return `<tr><td class="tnum">${s.n}</td><td><a href="${p.url}">${escHtml(
        p.title.replace(/^阶段 \d+ · /, "")
      )}</a></td><td>${s.time}</td><td>${milestones[s.id]}</td></tr>`;
    })
    .join("");

  const body = `<article class="doc">
  <section class="hero">
    <h1>cuRobo <span class="accent">IK</span> 学习路线</h1>
    <p class="hero-thesis">以算法为主线，论文 + 代码双轨，最快吃透 cuRobo 的逆运动学，最终能给 NVlabs/curobo 提 PR。</p>
    <div class="hero-actions">
      <a class="btn btn-brand" href="stage-0.html">开始学习 →</a>
      <a class="btn btn-ghost" href="resources.html">查看资源</a>
    </div>
    <div class="hero-progress">
      <div class="ring" data-total-pages="1"><span>0%</span></div>
      <div class="hero-progress-text">
        <div>总进度 <b class="hero-progress-count tnum">0 / 0</b> 个检查项</div>
        <div style="color:var(--text-3);font-size:14px;">勾选各阶段的动手练习与检验标准，进度自动保存在本地。</div>
      </div>
    </div>
  </section>

  <div class="callout">
    <div class="callout-label">核心世界观</div>
    <p><strong>cuRobo 没有独立的 “IK 算法”。</strong> 它把 IK 写成非线性优化问题：<code>min_θ  C_pose + C_限位 + C_自碰撞 + C_场景碰撞</code>，用「多种子并行 + LM 播种 + L-BFGS 精化 + 并行线搜索」在 GPU 上同时解几十个初值，取最优。</p>
    <p>它快不是因为单次求解更聪明，而是<strong>大规模并行 + FK 融合成单 kernel + 机器人退化为球集合</strong>三层设计——batch=1000 时约 3.7 万解/秒（比 TracIK 快 23×）。</p>
  </div>

  <div class="section-head"><h2>学习阶段</h2><p>按顺序学，过不了检验标准就不进下一阶段。</p></div>
  <div class="table-wrap"><table><thead><tr><th>阶段</th><th>主题</th><th>时间</th><th>里程碑</th></tr></thead><tbody>${timelineRows}</tbody></table></div>
  <div class="card-grid" style="margin-top:20px;">${cards}</div>

  <div class="section-head"><h2>理论小教程</h2><p>卡住了再看，不用提前全读。</p></div>
  <div class="theory-list">${theory}</div>

  <div class="section-head"><h2>三条原则</h2></div>
  <div class="principles">
    <div class="principle"><div class="n">01</div><p><strong>代码先行，论文精读跟随</strong>——概念先在代码里见到，再回论文看公式和消融。</p></div>
    <div class="principle"><div class="n">02</div><p><strong>只读指定页码</strong>，58 页报告不通读；Section 5（轨迹优化/MPC）与 IK 无关，跳过。</p></div>
    <div class="principle"><div class="n">03</div><p><strong>过不了检验标准就不进下一阶段。</strong></p></div>
  </div>

  <div class="custom-block warning" style="margin-top:28px;">
    <div class="custom-block-title">⚠ 三个坑</div>
    <ul>
      <li>网上教程多是老 API（<code>curobo.wrap.reacher.ik_solver</code>）；main 分支已换成 <code>from curobo import InverseKinematics</code>，搜资料区分 v0.7 / v0.8。</li>
      <li>四元数是 <strong>wxyz</strong> 顺序。</li>
      <li>batch=1 时 cuRobo 比 TracIK 慢（2.7ms vs 0.9ms），优势从 batch≥10 开始——做对比实验别踩坑。</li>
    </ul>
  </div>
  ${pager("index")}
</article>`;

  const plain =
    "cuRobo IK 学习路线 以算法为主线，论文 + 代码双轨，最快吃透 cuRobo 的逆运动学，最终能给 NVlabs/curobo 提 PR。cuRobo 没有独立的 IK 算法，它把 IK 写成非线性优化问题。大规模并行 FK 融合成单 kernel 机器人退化为球集合。学习阶段 理论小教程 三条原则 三个坑 四元数是 wxyz 顺序 batch=1 时 cuRobo 比 TracIK 慢。";
  const headings = [
    { level: 2, text: "学习阶段", id: "" },
    { level: 2, text: "理论小教程", id: "" },
    { level: 2, text: "三条原则", id: "" },
  ];
  return { html: shell(byId.index, body, null), plain, headings };
}

/* ---------- glossary page -------------------------------------------------- */
function buildGlossary() {
  const linkOf = (l) =>
    '<a class="gloss-link" href="' +
    escAttr(l.url) +
    (/^https?:/.test(l.url) ? '" target="_blank" rel="noopener">' : '">') +
    escHtml(l.label || l.text || l.url) +
    "</a>";

  // group by stage, preserving GLOSSARY order within each group
  const groups = [];
  const gmap = {};
  GLOSSARY.forEach((g) => {
    const s = g.stage || "其它";
    if (!gmap[s]) {
      gmap[s] = [];
      groups.push(s);
    }
    gmap[s].push(g);
  });
  groups.sort();

  const plainParts = [];
  const headings = [];
  let sections = "";
  groups.forEach((s) => {
    const id = "stage-" + slugify(s, {});
    headings.push({ text: s, id });
    sections += '<h2 id="' + id + '">' + escHtml(s) + "</h2>";
    sections += '<div class="gloss-list">';
    gmap[s].forEach((g) => {
      plainParts.push(g.term, g.zh, g.plain, g.academic);
      sections +=
        '<div class="gloss-item" id="term-' +
        escAttr(g.id) +
        '"><div class="gloss-head"><span class="gloss-term">' +
        escHtml(g.term) +
        "</span>" +
        (g.zh ? '<span class="gloss-zh">' + escHtml(g.zh) + "</span>" : "") +
        "</div>" +
        (g.full ? '<div class="gloss-full">' + escHtml(g.full) + "</div>" : "") +
        (g.plain ? '<div class="gloss-plain">' + escHtml(g.plain) + "</div>" : "") +
        (g.academic
          ? '<div class="gloss-academic">' + escHtml(g.academic) + "</div>"
          : "") +
        ((g.links || []).length
          ? '<div class="gloss-links">' + g.links.map(linkOf).join("") + "</div>"
          : "") +
        "</div>";
    });
    sections += "</div>";
  });

  const body = `<article class="doc">
  <div class="doc-breadcrumb">开始</div>
  <h1>术语表</h1>
  <p>本站正文里带虚线下划线的术语会在页边给出注释。下面是全部 ${GLOSSARY.length} 条术语的完整解释，按首次出现的阶段分组。</p>
${sections}
  ${pager("glossary")}
</article>`;

  return {
    html: shell(byId.glossary, body, headings.length >= 2 ? headings.map((h) => ({ level: 2, text: h.text, id: h.id })) : null),
    plain: plainParts.join(" ").replace(/\s+/g, " ").trim(),
    headings: headings.map((h) => ({ text: h.text, id: h.id })),
  };
}

/* ---------- build all ----------------------------------------------------- */
const searchIndex = [];
const stageProgress = {};

PAGES.forEach((page) => {
  if (page.id === "index") {
    const built = buildIndex();
    fs.writeFileSync(path.join(OUT, page.url), built.html);
    searchIndex.push({
      title: page.title === "总览" ? "cuRobo IK 学习路线 · 总览" : page.title,
      url: page.url,
      headings: [],
      text: built.plain,
    });
    return;
  }
  if (page.id === "glossary") {
    const built = buildGlossary();
    fs.writeFileSync(path.join(OUT, page.url), built.html);
    searchIndex.push({
      title: page.title,
      url: page.url,
      headings: built.headings,
      text: built.plain,
    });
    return;
  }
  const md = fs.readFileSync(path.join(ROOT, page.src), "utf8");
  // page H1 title from first heading
  const h1 = (md.match(/^#\s+(.*)$/m) || [])[1] || page.title;
  const parsed = parseMarkdown(md, page);
  const bc =
    page.group === "stage"
      ? "学习阶段"
      : page.group === "theory"
      ? "理论教程"
      : "开始";
  const body = `<article class="doc">
  <div class="doc-breadcrumb">${bc}</div>
  <h1>${inline(h1)}</h1>
${parsed.html}
  ${pager(page.id)}
</article>`;
  fs.writeFileSync(path.join(OUT, page.url), shell(page, body, parsed.headings));

  if (parsed.progressKeys.length) stageProgress[page.id] = parsed.progressKeys;

  searchIndex.push({
    title: page.title,
    url: page.url,
    headings: parsed.headings
      .filter((hh) => hh.id)
      .map((hh) => ({ text: stripMath(hh.text).replace(/\s+/g, " ").trim(), id: hh.id })),
    text: parsed.plain,
  });
});

// search-index.js
const dataJs =
  "window.SEARCH_INDEX = " +
  JSON.stringify(searchIndex) +
  ";\nwindow.STAGE_PROGRESS = " +
  JSON.stringify(stageProgress) +
  ";\n";
fs.writeFileSync(path.join(OUT, "search-index.js"), dataJs);

// report
const counts = {};
Object.keys(stageProgress).forEach((k) => (counts[k] = stageProgress[k].length));
console.log("Pages written:", PAGES.length);
console.log("Checkbox counts:", JSON.stringify(counts, null, 0));
console.log("Search entries:", searchIndex.length);
