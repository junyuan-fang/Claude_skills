// 术语条目格式范例(取自 cuRobo IK 学习站 glossary.js,原样可参考)
// 每条字段:
//   id      kebab-case,唯一
//   match   正文中会出现的精确字符串数组,长的写在前面(避免短串抢先命中)
//   term    展示用的术语本身(通常是缩写或英文原词)
//   full    展开缩写 / 英文全称 —— 缩写一定要能在这里看到"来自哪几个词"
//   zh      中文名
//   plain   一句大白话(能类比就类比)
//   academic 一句严谨定义,值得的话点出提出者/年份/出处
//   stage   首次出现在哪个阶段/理论文件,帮助读者定位
//   links   1~3 条链接,数组,每条 {label, url}
//           —— 硬性要求:每个 url 发布前必须实测可达(WebFetch/curl 测状态码),
//              死链、404、无法访问的域名一律不收录,宁少勿假。
//              优先级:Wikipedia > 原始论文(arXiv/DOI)> 官方文档/博客 > 稳定教材页。

window.GLOSSARY = [
  {
    id: "example-term",
    match: ["Example Term", "示例术语"],
    term: "Example Term",
    full: "Example Term(展开成它真正代表的几个单词/人名)",
    zh: "示例术语",
    plain: "一句话,用类比讲清楚这是干嘛的,不用任何行话。",
    academic: "一句严谨定义,可含出处,如(Smith 1999)。",
    stage: "阶段 0",
    links: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Example" }
    ]
  }
];
