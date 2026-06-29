const { marked } = require('marked');
const fs = require('fs');

const md = fs.readFileSync('MANUAL-ESTRATEGICO.md', 'utf8');
const body = marked.parse(md);

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manual Estratégico SaaS LATAM — Agustín & el Flaco</title>
<style>
  :root {
    --primary: #0f172a;
    --accent: #6366f1;
    --accent-light: #e0e7ff;
    --green: #059669;
    --green-light: #d1fae5;
    --red: #dc2626;
    --red-light: #fee2e2;
    --yellow: #d97706;
    --yellow-light: #fef3c7;
    --blue: #2563eb;
    --blue-light: #dbeafe;
    --gray: #64748b;
    --border: #e2e8f0;
    --bg: #f8fafc;
    --white: #ffffff;
    --code-bg: #1e293b;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: var(--bg);
    color: var(--primary);
    line-height: 1.75;
    font-size: 15px;
  }

  /* COVER — h1 at top */
  body > h1:first-of-type {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #312e81 100%);
    color: white;
    margin: 0;
    padding: 64px 60px 48px;
    font-size: 38px;
    font-weight: 900;
    line-height: 1.2;
    border-bottom: none;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 40px 80px;
  }

  /* HEADINGS */
  h1 { font-size: 32px; font-weight: 900; margin: 48px 0 16px; color: var(--primary); border-bottom: 3px solid var(--accent); padding-bottom: 10px; }
  h2 { font-size: 24px; font-weight: 800; margin: 40px 0 12px; color: var(--primary); border-bottom: 2px solid var(--border); padding-bottom: 8px; }
  h3 { font-size: 19px; font-weight: 700; margin: 32px 0 10px; color: var(--accent); }
  h4 { font-size: 15px; font-weight: 700; margin: 24px 0 8px; color: var(--primary); text-transform: uppercase; letter-spacing: 0.8px; }

  /* FIRST H3 after cover acts as subtitle */
  body > h3:first-of-type {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #312e81 100%);
    color: #a5b4fc;
    margin: 0;
    padding: 0 60px 40px;
    font-size: 16px;
    font-weight: 500;
    border-bottom: none;
  }

  /* PARAGRAPH */
  p { margin-bottom: 14px; color: #334155; }

  /* BLOCKQUOTE */
  blockquote {
    border-left: 4px solid var(--accent);
    background: var(--accent-light);
    padding: 16px 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
    font-style: normal;
    color: #312e81;
    font-weight: 500;
  }

  blockquote p { margin: 0; color: #312e81; }

  /* LISTS */
  ul, ol { margin: 12px 0 12px 24px; }
  li { margin-bottom: 6px; color: #334155; }
  li > ul, li > ol { margin: 6px 0 6px 20px; }

  /* TABLES */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 14px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }

  thead tr { background: var(--primary); color: white; }
  th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 11px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
  tr:nth-child(even) td { background: var(--bg); }
  tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: var(--accent-light); transition: background 0.15s; }

  /* CODE */
  code {
    background: #f1f5f9;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 13px;
    font-family: 'Cascadia Code', 'Fira Code', monospace;
    color: #7c3aed;
  }

  pre {
    background: var(--code-bg);
    color: #e2e8f0;
    padding: 20px 24px;
    border-radius: 10px;
    overflow-x: auto;
    margin: 20px 0;
    font-size: 13px;
    line-height: 1.6;
  }

  pre code {
    background: none;
    padding: 0;
    color: #e2e8f0;
    font-size: 13px;
  }

  /* HR */
  hr {
    border: none;
    border-top: 2px solid var(--border);
    margin: 40px 0;
  }

  /* STRONG */
  strong { color: var(--primary); font-weight: 700; }

  /* LINKS */
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }

  /* PRINT BUTTON */
  .print-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--accent);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.45);
    z-index: 100;
    font-family: inherit;
  }
  .print-btn:hover { background: #4f46e5; }

  /* TOC styling */
  .container > ul:first-of-type {
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px 24px 24px 44px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  @media print {
    .print-btn { display: none; }
    body > h1:first-of-type, body > h3:first-of-type { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    table { page-break-inside: avoid; }
  }

  @media (max-width: 700px) {
    body > h1:first-of-type { padding: 40px 24px 28px; font-size: 26px; }
    body > h3:first-of-type { padding: 0 24px 32px; }
    .container { padding: 32px 20px 60px; }
  }
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">⬇ Exportar PDF</button>
${body}
</body>
</html>`;

fs.writeFileSync('MANUAL-ESTRATEGICO.html', html);
console.log('OK');
