const fs = require('fs');
const path = require('path');

const DIR = 'top20';
if(!fs.existsSync(DIR)) fs.mkdirSync(DIR);

const CN = ['Tamaño mercado','Competencia LATAM','Dificultad MVP','Tiempo revenue','Potencial MRR','Escalabilidad','Ventaja equipo','Riesgo plataforma','Defensibilidad','Claridad ROI','WTP','CAC estimado','Retención','Viral / referidos','Fit equipo'];
const CD = ['Tamaño del mercado total en LATAM','Competencia local establecida — 10 = sin rival serio','Facilidad de MVP funcional — 10 = semanas','Velocidad al primer ingreso — 10 = mes 1','Potencial de MRR sostenible','Capacidad de escalar sin costo lineal','Ventaja única del equipo','Riesgo de plataformas externas — 10 = sin riesgo','Barreras para ser copiado','Claridad del ROI para el cliente','Disposición real a pagar','CAC estimado — 10 = casi cero','Probabilidad de renovación mensual','Crecimiento orgánico por referidos','Alineación con fortalezas del equipo'];

function sum(c){return c.reduce((a,x)=>a+x.s,0);}
function pct(s){return Math.round(s/150*100);}
function tierC(s){return s>=115?'#059669':s>=100?'#d97706':'#94a3b8';}
function tierL(s){return s>=115?'TOP ★★★':s>=100?'MID ★★':'BAJO ★';}
function probC(p){return p==='Alta'?'#dc2626':p==='Media'?'#d97706':'#059669';}

const CSS=`
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',system-ui,sans-serif;color:#0f172a;background:#f8fafc;font-size:15px;line-height:1.7;}
.cover{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#312e81 100%);color:#fff;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:80px 72px 72px;page-break-after:always;}
.cover-rank{font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#a5b4fc;margin-bottom:20px;}
.cover-title{font-size:52px;font-weight:900;line-height:1.1;margin-bottom:20px;}
.cover-tagline{font-size:20px;color:#c7d2fe;margin-bottom:48px;max-width:700px;line-height:1.5;}
.cover-pills{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:40px;}
.pill{padding:10px 22px;border-radius:30px;font-size:13px;font-weight:700;letter-spacing:0.3px;}
.pill-score{background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);}
.pill-cat{background:#6366f1;color:#fff;}
.pill-mvp{background:rgba(255,255,255,0.1);color:#a5b4fc;}
.cover-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
.cover-stat{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:20px;}
.cover-stat b{display:block;font-size:26px;font-weight:900;color:#fff;margin-bottom:4px;}
.cover-stat span{font-size:11px;color:#a5b4fc;text-transform:uppercase;letter-spacing:0.5px;}
.wrap{max-width:1000px;margin:0 auto;padding:60px 48px;}
.section{margin-bottom:64px;page-break-inside:avoid;}
.sec-label{font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin-bottom:8px;}
.sec-title{font-size:30px;font-weight:900;color:#0f172a;margin-bottom:24px;padding-bottom:14px;border-bottom:3px solid #e2e8f0;}
h3{font-size:20px;font-weight:800;color:#0f172a;margin:32px 0 12px;}
h4{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#64748b;margin:24px 0 10px;}
p{color:#334155;margin-bottom:14px;}
ul{padding-left:22px;margin-bottom:16px;}
li{color:#334155;margin-bottom:8px;}
.highlight-box{background:linear-gradient(135deg,#312e81,#1e3a5f);color:#fff;padding:28px 32px;border-radius:14px;margin:24px 0;}
.highlight-box p{color:#c7d2fe;margin:0;}
.highlight-box strong{color:#fff;}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0;}
.info-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.info-card h4{margin-top:0;}
.info-card p{margin:0;font-size:14px;}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:24px 0;}
.stat-box{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,0.04);}
.stat-box b{display:block;font-size:24px;font-weight:900;color:#6366f1;margin-bottom:4px;}
.stat-box span{font-size:12px;color:#64748b;}
.criterio-row{display:grid;grid-template-columns:160px 1fr 80px;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;}
.criterio-row:last-child{border-bottom:none;}
.criterio-nombre{font-size:13px;font-weight:600;color:#0f172a;}
.criterio-desc{font-size:12px;color:#64748b;margin-top:2px;}
.bar-track{height:10px;background:#f1f5f9;border-radius:5px;overflow:hidden;}
.bar-fill{height:10px;border-radius:5px;}
.criterio-score{text-align:right;font-size:15px;font-weight:800;}
.total-row{background:#f8faff;border-radius:10px;padding:16px 20px;margin-top:16px;display:flex;justify-content:space-between;align-items:center;}
.total-row span{font-size:14px;font-weight:700;color:#64748b;}
.total-row strong{font-size:22px;font-weight:900;color:#6366f1;}
.foda-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;margin:24px 0;}
.fc{padding:28px;}
.fc h4{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;}
.fc .item{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(0,0,0,0.08);}
.fc .item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
.fc .item b{display:block;font-size:14px;font-weight:700;margin-bottom:4px;}
.fc .item p{font-size:13px;margin:0;line-height:1.5;}
.fc-f{background:#f0fdf4;}.fc-f h4{color:#065f46;}
.fc-o{background:#eff6ff;}.fc-o h4{color:#1e40af;}
.fc-d{background:#fffbeb;}.fc-d h4{color:#78350f;}
.fc-a{background:#fff1f2;}.fc-a h4{color:#9f1239;}
.gtm-phase{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:28px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
.gtm-phase-header{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.phase-num{width:40px;height:40px;background:#6366f1;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;}
.phase-title{font-size:18px;font-weight:800;}
.phase-period{font-size:12px;color:#64748b;font-weight:600;}
.gtm-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px;}
.gtm-col h4{margin-top:0;font-size:11px;}
.gtm-col ul{margin:0;}
.tech-table{width:100%;border-collapse:collapse;margin:20px 0;}
.tech-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
.tech-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;}
.tech-table tr:last-child td{border-bottom:none;}
.tech-table td:first-child{font-weight:700;font-size:13px;color:#64748b;white-space:nowrap;}
.tech-table td:nth-child(2){font-weight:700;color:#6366f1;}
.tech-table td:last-child{font-size:13px;color:#334155;}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:24px 0;}
.price-card{background:#fff;border:2px solid #e2e8f0;border-radius:16px;padding:28px;position:relative;}
.price-card.featured{border-color:#6366f1;background:linear-gradient(180deg,#f5f3ff,#fff);}
.price-card .badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#6366f1;color:#fff;padding:4px 16px;border-radius:20px;font-size:11px;font-weight:700;}
.price-plan{font-size:13px;font-weight:700;color:#64748b;margin-bottom:8px;}
.price-amount{font-size:36px;font-weight:900;color:#0f172a;margin-bottom:4px;}
.price-period{font-size:13px;color:#64748b;margin-bottom:16px;}
.price-for{font-size:12px;background:#f1f5f9;padding:6px 12px;border-radius:6px;color:#64748b;margin-bottom:16px;}
.price-features{list-style:none;padding:0;margin:0;}
.price-features li{font-size:13px;padding:6px 0;border-bottom:1px solid #f1f5f9;color:#334155;}
.price-features li:last-child{border-bottom:none;}
.price-features li::before{content:'✓ ';color:#059669;font-weight:700;}
.fin-table{width:100%;border-collapse:collapse;margin:20px 0;}
.fin-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
.fin-table th:first-child{text-align:left;}
.fin-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;text-align:center;}
.fin-table td:first-child{text-align:left;font-weight:700;color:#0f172a;}
.fin-table tr:last-child td{border-bottom:none;font-weight:800;background:#f8faff;}
.roadmap{margin:24px 0;}
.rm-item{display:grid;grid-template-columns:140px 1fr;gap:24px;margin-bottom:28px;}
.rm-period{background:#6366f1;color:#fff;border-radius:10px;padding:14px 16px;text-align:center;font-size:13px;font-weight:700;height:fit-content;}
.rm-content{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 2px 6px rgba(0,0,0,0.04);}
.rm-content h4{margin-top:0;color:#6366f1;}
.rm-content ul{margin:8px 0 0;}
.comp-table{width:100%;border-collapse:collapse;margin:20px 0;}
.comp-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
.comp-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px;}
.comp-table tr:last-child td{border-bottom:none;}
.comp-table td:first-child{font-weight:800;color:#0f172a;}
.win-cell{color:#059669;font-weight:600;}
.risk-table{width:100%;border-collapse:collapse;margin:20px 0;}
.risk-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;}
.risk-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px;}
.risk-table tr:last-child td{border-bottom:none;}
.prob-alta{color:#dc2626;font-weight:700;}
.prob-media{color:#d97706;font-weight:700;}
.prob-baja{color:#059669;font-weight:700;}
.conclusion-box{background:linear-gradient(135deg,#312e81,#0f172a);color:#fff;border-radius:16px;padding:40px;margin:32px 0;}
.conclusion-box h3{color:#a5b4fc;margin-top:0;}
.conclusion-box p{color:#e0e7ff;font-size:16px;line-height:1.8;margin-bottom:16px;}
.conclusion-box p:last-child{margin:0;}
.first-step{background:#f0fdf4;border:2px solid #059669;border-radius:12px;padding:24px;margin-top:24px;}
.first-step h4{color:#065f46;margin-top:0;}
.first-step p{color:#064e3b;margin:0;font-size:15px;font-weight:500;}
.nav-footer{text-align:center;padding:40px;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;margin-top:60px;}
.nav-footer a{color:#6366f1;text-decoration:none;font-weight:700;}
@media print{
  .cover{-webkit-print-color-adjust:exact;print-color-adjust:exact;min-height:100vh;}
  .section{page-break-inside:avoid;}
  .foda-grid,.pricing-grid{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  body{background:#fff;}
}
`;

function renderDoc(idea, rank, prev, next) {
  const total = sum(idea.criterios);
  const tc = tierC(total);
  const tl = tierL(total);
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>#${rank} ${idea.nombre} — Análisis Estratégico</title>
<style>${CSS}</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-rank">📊 Ranking Top 20 · Posición #${rank} de 20 · Agustín &amp; el Flaco · 2026</div>
  <h1 class="cover-title">${idea.nombre}</h1>
  <p class="cover-tagline">${idea.tagline}</p>
  <div class="cover-pills">
    <span class="pill pill-score">${total} / 150 pts — ${tl}</span>
    <span class="pill pill-cat">${idea.categoria}</span>
    <span class="pill pill-mvp">MVP: ${idea.mvp_meses} meses</span>
    <span class="pill" style="background:rgba(255,255,255,0.1);color:#a5b4fc;">Validado: ${idea.validado}</span>
  </div>
  <div class="cover-meta">
    <div class="cover-stat"><b>${total}/150</b><span>Score total</span></div>
    <div class="cover-stat"><b>$${idea.ticket}/mes</b><span>Ticket objetivo</span></div>
    <div class="cover-stat"><b>${idea.mvp_meses} meses</b><span>Tiempo al MVP</span></div>
    <div class="cover-stat"><b>${idea.mercado.sam}</b><span>Mercado LATAM</span></div>
  </div>
</div>

<div class="wrap">

<!-- 1. RESUMEN EJECUTIVO -->
<div class="section">
  <div class="sec-label">Sección 1</div>
  <h2 class="sec-title">Resumen Ejecutivo</h2>
  ${idea.intro.map(p=>`<p>${p}</p>`).join('')}
  <div class="highlight-box">
    <p><strong>Propuesta de valor en una línea:</strong> ${idea.propuesta_valor}</p>
  </div>
  <div class="stat-row">
    <div class="stat-box"><b>${total}/150</b><span>Score estratégico</span></div>
    <div class="stat-box"><b>$${idea.ticket}</b><span>Ticket mensual</span></div>
    <div class="stat-box"><b>${idea.mvp_meses} meses</b><span>Tiempo al MVP</span></div>
    <div class="stat-box"><b>${idea.mercado.cagr}</b><span>CAGR del mercado</span></div>
  </div>
</div>

<!-- 2. PROBLEMA Y SOLUCIÓN -->
<div class="section">
  <div class="sec-label">Sección 2</div>
  <h2 class="sec-title">Problema y Solución</h2>
  <div class="info-grid">
    <div class="info-card">
      <h4>🔴 El Problema</h4>
      ${idea.problema.map(p=>`<p>${p}</p>`).join('')}
    </div>
    <div class="info-card">
      <h4>✅ Nuestra Solución</h4>
      ${idea.solucion.map(p=>`<p>${p}</p>`).join('')}
    </div>
  </div>
</div>

<!-- 3. ANÁLISIS DE MERCADO -->
<div class="section">
  <div class="sec-label">Sección 3</div>
  <h2 class="sec-title">Análisis de Mercado</h2>
  <div class="stat-row">
    <div class="stat-box"><b>${idea.mercado.tam}</b><span>Mercado global</span></div>
    <div class="stat-box"><b>${idea.mercado.sam}</b><span>SAM en LATAM</span></div>
    <div class="stat-box"><b>${idea.mercado.cagr}</b><span>CAGR proyectado</span></div>
    <div class="stat-box"><b>${idea.mercado.clientes_est}</b><span>Clientes potenciales</span></div>
  </div>
  ${idea.mercado.analisis.map(p=>`<p>${p}</p>`).join('')}
  <h3>Segmento Primario</h3>
  <p>${idea.mercado.segmento}</p>
</div>

<!-- 4. SCORING 15 CRITERIOS -->
<div class="section">
  <div class="sec-label">Sección 4</div>
  <h2 class="sec-title">Scoring Estratégico — 15 Criterios</h2>
  <p>Evaluación detallada sobre 150 puntos totales. Cada criterio se puntúa del 1 al 10.</p>
  ${idea.criterios.map((c,i)=>`
  <div class="criterio-row">
    <div>
      <div class="criterio-nombre">${CN[i]}</div>
      <div style="font-size:11px;color:#94a3b8;">${CD[i]}</div>
    </div>
    <div>
      <div class="bar-track"><div class="bar-fill" style="width:${c.s*10}%;background:${c.s>=8?'#059669':c.s>=6?'#d97706':'#94a3b8'};"></div></div>
      <div style="font-size:12px;color:#64748b;margin-top:4px;">${c.n}</div>
    </div>
    <div class="criterio-score" style="color:${c.s>=8?'#059669':c.s>=6?'#d97706':'#94a3b8'};">${c.s}/10</div>
  </div>`).join('')}
  <div class="total-row">
    <span>SCORE TOTAL (suma de 15 criterios)</span>
    <strong>${total} / 150 pts — ${pct(total)}%</strong>
  </div>
</div>

<!-- 5. ANÁLISIS FODA -->
<div class="section">
  <div class="sec-label">Sección 5</div>
  <h2 class="sec-title">Análisis FODA Estratégico</h2>
  <div class="foda-grid">
    <div class="fc fc-f">
      <h4>✅ FORTALEZAS (internas — positivas)</h4>
      ${idea.foda.f.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}
    </div>
    <div class="fc fc-o">
      <h4>🚀 OPORTUNIDADES (externas — positivas)</h4>
      ${idea.foda.o.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}
    </div>
    <div class="fc fc-d">
      <h4>⚠️ DEBILIDADES (internas — negativas)</h4>
      ${idea.foda.d.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}
    </div>
    <div class="fc fc-a">
      <h4>🔴 AMENAZAS (externas — negativas)</h4>
      ${idea.foda.a.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}
    </div>
  </div>
</div>

<!-- 6. GO-TO-MARKET -->
<div class="section">
  <div class="sec-label">Sección 6</div>
  <h2 class="sec-title">Estrategia Go-To-Market</h2>
  ${idea.gtm.map((g,i)=>`
  <div class="gtm-phase">
    <div class="gtm-phase-header">
      <div class="phase-num">${i+1}</div>
      <div>
        <div class="phase-title">${g.fase}</div>
        <div class="phase-period">${g.periodo}</div>
      </div>
    </div>
    <p>${g.desc}</p>
    <div class="gtm-cols">
      <div class="gtm-col">
        <h4>Canales</h4>
        <ul>${g.canales.map(c=>`<li>${c}</li>`).join('')}</ul>
      </div>
      <div class="gtm-col">
        <h4>KPI clave</h4>
        <ul>${g.kpis.map(k=>`<li>${k}</li>`).join('')}</ul>
      </div>
    </div>
  </div>`).join('')}
</div>

<!-- 7. TECH STACK -->
<div class="section">
  <div class="sec-label">Sección 7</div>
  <h2 class="sec-title">Stack Tecnológico</h2>
  <table class="tech-table">
    <thead><tr><th>Capa</th><th>Tecnología</th><th>Justificación</th></tr></thead>
    <tbody>
      ${idea.tech.map(t=>`<tr><td>${t.capa}</td><td>${t.nombre}</td><td>${t.razon}</td></tr>`).join('')}
    </tbody>
  </table>
</div>

<!-- 8. MODELO DE PRECIOS -->
<div class="section">
  <div class="sec-label">Sección 8</div>
  <h2 class="sec-title">Modelo de Precios</h2>
  <div class="pricing-grid">
    ${idea.precios.map((p,i)=>`
    <div class="price-card ${i===1?'featured':''}">
      ${i===1?'<span class="badge">Más popular</span>':''}
      <div class="price-plan">${p.plan}</div>
      <div class="price-amount">${p.precio}</div>
      <div class="price-period">por mes</div>
      <div class="price-for">Para: ${p.para}</div>
      <ul class="price-features">${p.incluye.map(x=>`<li>${x}</li>`).join('')}</ul>
    </div>`).join('')}
  </div>
</div>

<!-- 9. PROYECCIONES FINANCIERAS -->
<div class="section">
  <div class="sec-label">Sección 9</div>
  <h2 class="sec-title">Proyecciones Financieras — Año 1</h2>
  <p>Proyecciones conservadoras basadas en conversión de outreach directo del equipo.</p>
  <table class="fin-table">
    <thead>
      <tr><th>Período</th><th>Clientes</th><th>MRR (USD)</th><th>ARR est. (USD)</th><th>Nota clave</th></tr>
    </thead>
    <tbody>
      ${idea.financiero.map(f=>`
      <tr><td>${f.q}</td><td>${f.cli}</td><td>$${f.mrr.toLocaleString()}</td><td>$${(f.mrr*12).toLocaleString()}</td><td>${f.nota}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="highlight-box">
    <p><strong>MRR objetivo a 12 meses:</strong> $${idea.financiero[idea.financiero.length-1].mrr.toLocaleString()} USD · <strong>Payback:</strong> ${idea.payback}</p>
  </div>
</div>

<!-- 10. ROADMAP 12 MESES -->
<div class="section">
  <div class="sec-label">Sección 10</div>
  <h2 class="sec-title">Roadmap 12 Meses</h2>
  <div class="roadmap">
    ${idea.roadmap.map(r=>`
    <div class="rm-item">
      <div class="rm-period">${r.p}</div>
      <div class="rm-content">
        <h4>${r.titulo}</h4>
        <ul>${r.h.map(x=>`<li>${x}</li>`).join('')}</ul>
        <p style="font-size:12px;color:#64748b;margin-top:12px;margin-bottom:0;"><strong>KPI:</strong> ${r.kpi}</p>
      </div>
    </div>`).join('')}
  </div>
</div>

<!-- 11. COMPETENCIA -->
<div class="section">
  <div class="sec-label">Sección 11</div>
  <h2 class="sec-title">Paisaje Competitivo</h2>
  <table class="comp-table">
    <thead><tr><th>Competidor</th><th>Fortaleza</th><th>Debilidad vs. nosotros</th><th>Cómo ganamos</th></tr></thead>
    <tbody>
      ${idea.competidores.map(c=>`
      <tr>
        <td>${c.nombre}</td>
        <td>${c.f}</td>
        <td>${c.d}</td>
        <td class="win-cell">${c.g}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>

<!-- 12. ANÁLISIS DE RIESGOS -->
<div class="section">
  <div class="sec-label">Sección 12</div>
  <h2 class="sec-title">Análisis de Riesgos</h2>
  <table class="risk-table">
    <thead><tr><th>Riesgo</th><th>Probabilidad</th><th>Impacto</th><th>Mitigación</th></tr></thead>
    <tbody>
      ${idea.riesgos.map(r=>`
      <tr>
        <td>${r.r}</td>
        <td class="prob-${r.prob.toLowerCase()}">${r.prob}</td>
        <td class="prob-${r.imp.toLowerCase()}">${r.imp}</td>
        <td>${r.m}</td>
      </tr>`).join('')}
    </tbody>
  </table>
</div>

<!-- 13. CONCLUSIÓN -->
<div class="section">
  <div class="sec-label">Sección 13</div>
  <h2 class="sec-title">Conclusión Estratégica</h2>
  <div class="conclusion-box">
    <h3>Veredicto Final — ${idea.nombre}</h3>
    ${idea.conclusion.map(p=>`<p>${p}</p>`).join('')}
  </div>
  <div class="first-step">
    <h4>🎯 PRIMER PASO CONCRETO</h4>
    <p>${idea.primer_paso}</p>
  </div>
</div>

</div><!-- /wrap -->
<div class="nav-footer">
  <a href="index.html">← Volver al índice</a>
  ${prev?`&nbsp;·&nbsp;<a href="${prev}">← Anterior</a>`:''}
  ${next?`&nbsp;·&nbsp;<a href="${next}">Siguiente →</a>`:''}
  &nbsp;·&nbsp; <a href="javascript:window.print()">⬇ Exportar PDF</a>
</div>
</body></html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// DATA — TOP 20 IDEAS RE-CLASIFICADAS
// ══════════════════════════════════════════════════════════════════════════════

const RANKING = [

// ─────────────────────────────────────────────────────────────────────────────
// #1
{slug:'ai-sdr-outbound-latam', nombre:'AI SDR Outbound LATAM', categoria:'Ventas B2B',
ticket:299, mvp_meses:3, validado:'USA · Israel · España',
tagline:'El vendedor IA que prospecta, personaliza y hace seguimiento 24/7 por WhatsApp y email, sin descanso.',
propuesta_valor:'Reemplazar al SDR humano para PYMEs de LATAM que no pueden costear un equipo de ventas completo, usando IA para prospectar, personalizar y hacer seguimiento automático.',
intro:['El AI SDR Outbound LATAM es la idea #1 del portafolio con 128/150 puntos. Combina la principal fortaleza del equipo (prospección B2B de alto nivel) con la tecnología más capaz del momento (Claude API) para atacar un mercado de millones de PYMEs en LATAM que no pueden costear un equipo de ventas dedicado.','El mercado global de Sales AI supera los $8.2B y crece al 18% anual. En LATAM, el punto de dolor es aún más agudo: la mayoría de las PYMEs dependen de 1-2 vendedores que dividen su tiempo entre prospectar y cerrar, reduciendo dramáticamente la eficiencia de ambas tareas.','Este producto no compite con Salesforce ni HubSpot. Compite con el Excel de contactos y el WhatsApp personal del fundador, que es la "herramienta de ventas" de la mayoría de las PYMEs latinoamericanas. Ese es el mercado real y enorme que existe.'],
problema:['La gran mayoría de PYMEs en LATAM no puede permitirse un equipo de SDRs (Sales Development Representatives). Un SDR junior cuesta $800-1200/mes en Argentina o Uruguay, más incentivos. Además, los SDRs se van, se distraen y prospectan de forma inconsistente.','El resultado es que los fundadores hacen la prospección ellos mismos, en ratos libres, de forma no sistemática. Calculadoras conservadoras indican que esto cuesta a las PYMEs medianas el equivalente a 2-3 contratos perdidos por mes solo por falta de seguimiento.','La personalización es el segundo problema: el outreach genérico tiene tasas de apertura del 3-5%. El outreach personalizado con contexto real del prospecto puede llegar al 40-60%. La diferencia entre ambos es la cantidad de tiempo que lleva hacer esa investigación — tiempo que ningún vendedor tiene.'],
solucion:['El AI SDR Outbound LATAM es un agente IA que usa Claude API para investigar prospectos, redactar mensajes personalizados en el tono y contexto de la empresa cliente, y hacer seguimiento automático por WhatsApp Business API y email hasta obtener respuesta.','El cliente define su ICP (Ideal Customer Profile), carga su base de prospectos o la conecta con LinkedIn/Apollo, y el sistema se encarga de todo lo demás: primer contacto personalizado, seguimiento a los 3 días, reactivación a los 7 días, y escalado al humano solo cuando hay interés real.','La diferencia con herramientas como Apollo o Instantly es que Claude genera mensajes que parecen escritos a mano por alguien que realmente investigó al prospecto — no plantillas genéricas con {nombre} y {empresa} insertados. Esa diferencia de calidad es la que convierte.'],
mercado:{tam:'$8.2B',sam:'$480M',cagr:'18% anual',clientes_est:'+180.000 PYMEs B2B en LATAM',segmento:'PYMEs B2B de 5-100 empleados con ciclo de ventas de más de $500 de ticket promedio. Sectores: tecnología, servicios profesionales, logística, construcción, industria.',
analisis:['El mercado de Sales AI es uno de los más validados y de crecimiento más rápido en el mundo tecnológico. Gong se valuó en $7.2B, Apollo en $1.6B, y decenas de startups como Instantly, Lemlist y Outreach reciben financiamiento récord.',
'En LATAM, la penetración es casi cero para soluciones de calidad en español. Apollo.io tiene usuarios latinoamericanos pero no está optimizado para WhatsApp como canal principal ni para las particularidades culturales del outreach en español.',
'El timing es ideal: la adopción de WhatsApp Business por parte de las PYMEs alcanzó masa crítica en 2023-2024. Más del 85% de las PYMEs en Argentina, Uruguay, México y Brasil tienen WhatsApp Business activo. El canal ya existe; falta el agente inteligente que lo use bien.']},
criterios:[
{s:9,n:'Mercado global de $8.2B creciendo al 18%. En LATAM, +180.000 PYMEs son clientes potenciales directos.'},
{s:9,n:'No existe alternativa local de calidad. Apollo y Instantly están en inglés y sin integración nativa de WhatsApp.'},
{s:8,n:'MVP funcional en 3 meses: Claude API + WhatsApp Business API + interfaz básica de configuración de ICP.'},
{s:9,n:'El primer cliente puede generar ingresos en semana 6-8 con onboarding directo del equipo.'},
{s:9,n:'Con 100 clientes a $299/mes el MRR es $29.900. Escalable a $200K+ MRR con el equipo correcto.'},
{s:9,n:'Modelo SaaS puro: añadir cliente #1.000 cuesta lo mismo que el #10. Sin costo marginal de servicio.'},
{s:10,n:'El equipo tiene prospección B2B de alto nivel — son sus propios primeros usuarios y mejores evangelistas del producto.'},
{s:7,n:'Dependencia de Claude API (Anthropic) y WhatsApp Business API (Meta). Ambas tienen riesgos de cambio de precio.'},
{s:8,n:'El moat está en los datos de conversación acumulados y los modelos de personalización entrenados por industria.'},
{s:9,n:'ROI inmediato: si el cliente cierra 1 contrato extra por mes gracias al SDR IA, el producto se paga solo.'},
{s:9,n:'$299/mes es el equivalente a 3 horas de trabajo de un vendedor junior. WTP muy alta dado el ROI.'},
{s:8,n:'CAC muy bajo: el equipo puede hacer demos en vivo usando el propio producto para prospectar — el SDR IA se vende a sí mismo.'},
{s:8,n:'Churn esperado bajo si el cliente ve resultados en los primeros 30 días. Los primeros 3 meses son críticos.'},
{s:6,n:'Viral moderado: los prospectos que reciben mensajes de calidad preguntan "¿cómo lo hiciste?" — referral orgánico.'},
{s:10,n:'Máximo fit: el equipo son los usuarios más naturales y los mejores demostradores del producto en el mercado.'}
],
foda:{
f:[{t:'Equipo = producto en vivo',d:'Agustín y el Flaco pueden demostrar el AI SDR usando el propio producto para conseguir sus primeros clientes. El demo es la venta.'},
{t:'Claude API como diferenciador de calidad',d:'La calidad de personalización de Claude supera a GPT-3.5-turbo o modelos más baratos que usan los competidores. Esa diferencia es perceptible al leer el mensaje.'},
{t:'WhatsApp como canal único',d:'Ningún competitor global tiene integración nativa de WhatsApp de calidad. En LATAM, WhatsApp es el canal de ventas primario — esto no es un nice-to-have, es el canal.'},
{t:'Red de contactos B2B existente',d:'El equipo ya tiene red de contactos en múltiples industrias de Argentina y Uruguay que pueden ser los primeros 10 clientes piloto sin costo de adquisición.'}],
o:[{t:'Boom global de Sales AI',d:'Los inversores y el mercado están validando esta categoría masivamente. El timing de entrada es ideal — suficientemente temprano en LATAM para ser líder.'},
{t:'PYMEs sin SDR propio',d:'El 95% de las PYMEs de LATAM con 5-50 empleados no tiene equipo de ventas separado del founding team. Son el cliente natural de este producto.'},
{t:'Consolidación de WhatsApp Business',d:'Meta está invirtiendo fuerte en la infraestructura de WhatsApp Business API. La plataforma está madurando — los costos de mensajería bajan y la calidad de entrega sube.'},
{t:'Posibilidad de ser el Apollo de LATAM',d:'Apollo.io con $1.6B de valuación nunca tuvo un producto nativo para el mercado latinoamericano. El hueco existe y el timing es ahora.'}],
d:[{t:'ICP definition como cuello de botella',d:'El sistema funciona tan bien como el ICP que define el cliente. Si el cliente no sabe quién es su prospecto ideal, el SDR IA va a prospectar mal.'},
{t:'Dependencia de APIs externas',d:'Claude API y WhatsApp Business API son los dos pilares del producto. Un cambio de precios de cualquiera de los dos puede afectar los márgenes dramáticamente.'},
{t:'Aprendizaje inicial por industria',d:'Los primeros 30 días con cada cliente son de calibración. Los resultados en la semana 1 no serán los mejores — hay que gestionar las expectativas.'},
{t:'Compliance de outreach',d:'Las regulaciones de spam y outreach no solicitado varían por país. Hay que diseñar el producto con opt-out fácil y respeto a las preferencias del receptor.'}],
a:[{t:'HubSpot y Salesforce con AI nativa',d:'Los gigantes del CRM están agregando AI a sus productos de ventas. Sin embargo, sus precios y complejidad los hacen inaccesibles para las PYMEs de LATAM.'},
{t:'Commoditización del outreach IA',d:'En 2-3 años, cualquier agencia podrá ofrecer outreach con IA. El moat debe estar en los datos y la especialización vertical, no en la tecnología genérica.'},
{t:'Apollo.io entrando a LATAM con WhatsApp',d:'Si Apollo lanza integración nativa de WhatsApp en español, reduce el diferencial. Aunque tienen las personas incorrectas para ejecutar esto bien en el corto plazo.'},
{t:'Saturación del canal',d:'Si muchas empresas usan IA para outreach simultáneamente, los prospectos aprenden a ignorar esos mensajes. La calidad de personalización seguirá siendo el moat.'}]
},
gtm:[
{fase:'Fase 1 — Los primeros 10',periodo:'Mes 1-3',
desc:'Usar el propio AI SDR para conseguir los primeros 10 clientes del equipo fundador. El equipo prospecta a sus propios contactos de primero nivel en Argentina y Uruguay, en sectores que ya conocen bien (distribución, servicios B2B, tecnología). El objetivo no es escalar todavía: es conseguir 10 clientes de referencia con casos de éxito documentados.',
canales:['Prospección directa por WhatsApp al network existente','Demo en vivo usando el producto para contactar al prospecto en tiempo real','LinkedIn outreach manual con propuesta personalizada'],
kpis:['10 clientes activos al final del mes 3','3 casos de éxito documentados con métricas concretas','MRR mínimo: $2.990']},
{fase:'Fase 2 — Escala por referidos',periodo:'Mes 4-6',
desc:'Con casos de éxito documentados, activar un programa de referidos donde cada cliente activo recibe un mes gratis por cada cliente que refiere. En paralelo, comenzar con contenido en LinkedIn mostrando resultados reales con datos. El SDR IA funciona mejor que cualquier ad para conseguir nuevos clientes.',
canales:['Programa de referidos con incentivo de 1 mes gratis','LinkedIn content mostrando métricas reales de clientes','Cold outreach usando el propio SDR IA en nuevos sectores'],
kpis:['30 clientes activos al final del mes 6','NPS > 50 entre los primeros 10 clientes','MRR: $8.970']},
{fase:'Fase 3 — Especialización y escala',periodo:'Mes 7-12',
desc:'Verticalizarse en 2-3 industrias donde los resultados son más consistentes. Desarrollar el AI SDR especializado en esas industrias con modelos de mensaje y secuencias pre-entrenados. Comenzar con contenido de thought leadership y webinars para el segmento.',
canales:['Webinars para vendedores y fundadores de LATAM','Partnerships con consultoras de ventas','Presencia en comunidades de CEOs y fundadores (YPO, EO, aceleradoras)'],
kpis:['100 clientes activos al final del mes 12','MRR: $29.900','Churn mensual < 5%']}
],
tech:[
{capa:'LLM Core',nombre:'Claude 3.5 Sonnet (Anthropic API)',razon:'Superior en redacción persuasiva, contexto largo y personalización. El modelo más capaz para generar mensajes de ventas que no parezcan IA.'},
{capa:'WhatsApp',nombre:'WhatsApp Business API (Meta Cloud)',razon:'Acceso a la API oficial para envío de mensajes de alta calidad con aprobación de plantillas. Evitar el riesgo de banes de cuentas no oficiales.'},
{capa:'Email',nombre:'Resend + SMTP propio',razon:'Deliverability alta con dominio propio del cliente. Resend tiene excelente reputación y SDK simple para integraciones.'},
{capa:'Backend',nombre:'Node.js + Supabase',razon:'Stack familiar, Supabase para base de datos y autenticación con tier gratuito generoso. Supabase MCP disponible para desarrollo rápido.'},
{capa:'Frontend',nombre:'Next.js + Vercel',razon:'Dashboard de configuración de ICP, visualización de secuencias y métricas de conversación. Vercel para deploy sin fricción.'},
{capa:'Scheduling',nombre:'BullMQ (Redis)',razon:'Cola de jobs para secuencias de seguimiento con timing preciso. Crítico para no molestar a los prospectos fuera de horario.'}
],
precios:[
{plan:'Starter',precio:'$149',para:'Founder solo o empresa con 1 vendedor',incluye:['500 prospectos/mes','3 secuencias activas','Canal WhatsApp + Email','Dashboard básico','Soporte por email']},
{plan:'Growth',precio:'$299',para:'Empresas con equipo de ventas de 2-5 personas',incluye:['2.000 prospectos/mes','10 secuencias activas','Multi-usuario (3 seats)','Integraciones CRM básicas','Soporte prioritario por WhatsApp','Analytics avanzados']},
{plan:'Scale',precio:'$599',para:'Empresas con equipo de ventas de 5-15 personas',incluye:['Prospectos ilimitados','Secuencias ilimitadas','Multi-usuario (10 seats)','API de integración','Customer Success Manager','SLA 99.5% uptime']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:10,mrr:2990,nota:'10 clientes del network directo. Validación de producto.'},
{q:'Q2 (Mes 4-6)',cli:30,mrr:8970,nota:'Referidos + contenido. 20 clientes nuevos.'},
{q:'Q3 (Mes 7-9)',cli:60,mrr:17940,nota:'Verticales definidos. Webinars. Primeras contrataciones.'},
{q:'Q4 (Mes 10-12)',cli:100,mrr:29900,nota:'Escala. MRR objetivo alcanzado. Break-even claro.'}
],
payback:'Break-even en mes 4 con 5 clientes en plan Growth.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP y primeros pilotos',h:['Integrar Claude API con WhatsApp Business API para envío de mensajes personalizados','Construir formulario de configuración de ICP y onboarding básico','Conseguir 3 pilotos gratuitos con el network del equipo para calibrar el producto'],kpi:'3 pilotos activos, feedback documentado'},
{p:'Mes 3-4',titulo:'Primeros clientes pagos',h:['Lanzar producto en versión beta pagada a $149/mes','Implementar dashboard de métricas de conversación para clientes','Sistema de follow-up automático con timing configurable por cliente'],kpi:'10 clientes activos, MRR $2.990'},
{p:'Mes 5-8',titulo:'Escala y especialización',h:['Desarrollar secuencias pre-entrenadas por industria (tech, distribución, servicios)','Programa de referidos: 1 mes gratis por cada cliente referido exitoso','Integración con HubSpot y Pipedrive para clientes con CRM'],kpi:'50 clientes activos, MRR $14.950'},
{p:'Mes 9-12',titulo:'Verticalización y growth',h:['Verticalizarse en 2-3 industrias con mejores métricas de conversión','Contratar primer Customer Success Manager','Lanzar plan Scale para equipos grandes y primeras cuentas Enterprise'],kpi:'100 clientes activos, MRR $29.900'}
],
competidores:[
{nombre:'Apollo.io',f:'Base de datos de 275M+ contactos, interfaz muy completa',d:'Sin integración de WhatsApp nativa, en inglés, sin personalización con LLMs de calidad',g:'WhatsApp como canal nativo en LATAM + personalización Claude = 10x más conversión'},
{nombre:'Instantly.ai',f:'Automatización de email masivo a bajo costo',d:'No tiene LLM de calidad para personalización, sin WhatsApp, sin foco LATAM',g:'Calidad de mensaje vs volumen. Nuestros mensajes convierten 5-10x mejor por la personalización.'},
{nombre:'Vendedor junior humano',f:'Adapta el mensaje en tiempo real, construye relaciones humanas auténticas',d:'Cuesta $800-1200/mes, no trabaja 24/7, no escala a 1000 prospectos simultáneos',g:'Precio (40% del costo) + escala (10x más prospectos) + consistencia (nunca tiene un mal día)'}
],
riesgos:[
{r:'Cambio de precio de WhatsApp Business API por Meta',prob:'Media',imp:'Alto',m:'Estructura de precios que absorba hasta un 50% de aumento. Diversificar con email como canal primario de backup.'},
{r:'Baja de calidad de conversión en primeros meses',prob:'Alta',imp:'Medio',m:'Expectativas claras en onboarding: los primeros 30 días son de calibración. Proceso de mejora de ICP guiado.'},
{r:'Regulación anti-spam en LATAM',prob:'Baja',imp:'Alto',m:'Opt-out nativo en cada mensaje. Volúmenes conservadores (max 100 mensajes/día por cuenta). Documentación de consentimiento.'},
{r:'Competidor global con WhatsApp nativo',prob:'Media',imp:'Alto',m:'Moat en datos de conversación + especialización vertical + precio LATAM. Velocidad de ejecución es el diferencial.'}
],
conclusion:['El AI SDR Outbound LATAM es la idea más alineada con el equipo, el mercado y el momento tecnológico de 2026. El punto de dolor es real y costoso para las PYMEs, la solución es demostrable en vivo en 10 minutos, y el equipo es naturalmente el mejor vendedor de este producto porque ya hace exactamente esto manualmente.','La clave del éxito no está en la tecnología (que es alcanzable) sino en conseguir los primeros 10 clientes de referencia con casos de éxito documentados. Esos primeros 10 clientes son los que generan los siguientes 90 por referido y word-of-mouth. El equipo debe aceptar que los primeros 3 meses son de prueba y calibración, no de escala.','El riesgo más alto es que el equipo intente escalar antes de validar que el producto retiene clientes. Un cliente que paga durante 12 meses vale 10 veces más que uno que paga 1 mes. El foco inicial debe ser retención, no adquisición.'],
primer_paso:'Esta semana: hacer una lista de 20 empresas B2B del network directo del equipo. Enviarles un mensaje de WhatsApp ofreciendo 30 días de piloto gratuito del AI SDR a cambio de feedback semanal. Objetivo: conseguir 3 pilotos activos en 7 días.'
},

// ─────────────────────────────────────────────────────────────────────────────
// #2
{slug:'agente-research-empresarial', nombre:'Agente de Research Empresarial IA', categoria:'Agentes Autónomos',
ticket:349, mvp_meses:3, validado:'USA · Europa',
tagline:'El analista de inteligencia que trabaja 24/7: research de empresas, personas y mercados en minutos, no días.',
propuesta_valor:'Un agente IA que hace en 10 minutos lo que un analista junior tarda 2 días: research exhaustivo de empresas, competidores o personas con fuentes citadas y análisis estructurado.',
intro:['El Agente de Research Empresarial IA ocupa el puesto #2 del ranking porque combina altísima WTP (las empresas pagan caro por research de calidad), un caso de uso inmediato y demostrable, y una ventaja técnica real de Claude: los 200K tokens de contexto permiten analizar volúmenes de información que otros modelos no pueden procesar en una sola sesión.','El caso de uso es universal: toda empresa que hace ventas B2B, M&A, inversiones o partnerships necesita research antes de una reunión importante. Hoy ese research o lo hace un analista junior en 2-3 horas, o no se hace y el equipo entra a la reunión sin contexto.','La diferencia entre entrar a una reunión con y sin research de calidad puede ser la diferencia entre cerrar o perder un deal. Ese delta de valor es enorme y la disposición a pagar es alta.'],
problema:['Antes de cada reunión importante de ventas, M&A o inversión, los equipos necesitan entender en profundidad a la empresa contraparte: quiénes son, qué hacen, cómo les va, qué problemas tienen, quiénes los dirigen y cuál es el contexto competitivo.','Este research manual toma entre 2-4 horas por empresa cuando se hace bien: LinkedIn, Crunchbase, el sitio web, artículos de prensa, reportes anuales, reviews de empleados, comentarios en redes. Nadie tiene ese tiempo para cada prospecto.','El resultado es que la mayoría de las reuniones de negocio en LATAM se hacen con información superficial. Se pierde la oportunidad de personalizar la propuesta, de identificar el pain point real, y de proyectar profesionalismo desde el primer encuentro.'],
solucion:['El Agente de Research Empresarial usa Claude con búsqueda web para producir un reporte completo de una empresa en menos de 10 minutos. El reporte incluye: resumen ejecutivo, perfil de la empresa, equipo directivo, noticias recientes, análisis competitivo, posibles pain points y preguntas sugeridas para la reunión.','El agente es configurable: el usuario define el propósito del research (reunión de ventas, due diligence, benchmark competitivo, análisis de inversión) y el sistema adapta el reporte a ese objetivo específico. No es un Google mejorado — es un analista que sintetiza y razona sobre la información.','El output es un documento PDF o un brief para WhatsApp que llega al usuario en menos de 10 minutos. Se puede configurar para que llegue automáticamente 1 hora antes de cualquier reunión en el calendario del usuario.'],
mercado:{tam:'$4.8B',sam:'$280M',cagr:'22% anual',clientes_est:'+95.000 equipos de ventas B2B en LATAM',
segmento:'Equipos de ventas enterprise (5-50 vendedores), equipos de M&A y deals (bancos, fondos), inversores (ángeles, VCs), y ejecutivos que tienen reuniones de alto impacto con frecuencia.',
analisis:['El mercado de inteligencia empresarial (business intelligence) es uno de los de mayor crecimiento en la era de IA. Compañías como Perplexity ($500M valuación), Crayon ($60M levantado) y Cognism (adquirida) demuestran que el apetito inversor y de clientes por research automatizado es real.','En LATAM, el gap es más pronunciado: las empresas medianas no tienen presupuesto para contratar analistas de research ni para suscribirse a Bloomberg o Refinitiv. Pero sí tienen reuniones de negocios importantes donde el contexto marca la diferencia.','El timing es ideal: la combinación de búsqueda web + LLMs de 2026 es la primera vez en la historia que este tipo de research puede automatizarse con calidad suficiente para reemplazar al analista junior en el 80% de los casos.']},
criterios:[
{s:8,n:'Mercado global de $4.8B. En LATAM, miles de empresas medianas con equipos de ventas.'},
{s:9,n:'No existe alternativa en español con calidad de LLM. Perplexity no está optimizado para research de empresas.'},
{s:8,n:'MVP en 3 meses con Claude API + web search + template de reporte configurable por caso de uso.'},
{s:9,n:'Demo instantánea: hacer research de la empresa del prospecto en vivo durante la primera llamada. Cierra la venta.'},
{s:8,n:'Con 80 clientes a $349/mes = $27.920 MRR. Escalable sin costo marginal.'},
{s:9,n:'Cada nuevo cliente genera más datos de qué tipo de research funciona mejor. El producto mejora solo.'},
{s:9,n:'El equipo puede hacer demos perfectas del producto durante la venta del producto — usando el agente para researchar al prospecto.'},
{s:8,n:'Dependencia de proveedores de search API (Brave Search, Perplexity API). Riesgo moderado de cambio de precio.'},
{s:8,n:'Los datos acumulados de reportes por industria crean un moat difícil de replicar rápidamente.'},
{s:9,n:'ROI inmediato: si el cliente cierra 1 deal extra por trimestre gracias al research, el producto se paga 10x.'},
{s:9,n:'Alta WTP: ejecutivos y equipos de ventas están dispuestos a pagar bien por inteligencia de calidad.'},
{s:9,n:'CAC bajo: la demo en vivo durante la prospección cierra en 1-2 reuniones. Ciclo de venta corto.'},
{s:8,n:'Alta retención si el equipo lo integra en el flujo previo a reuniones. Hábito diario = churn muy bajo.'},
{s:6,n:'Viral moderado: cuando el prospecto recibe una propuesta ultra-personalizada, pregunta al vendedor cómo se preparó.'},
{s:9,n:'Máximo fit: el equipo usa esto a diario en su propio proceso de ventas y prospección.'}
],
foda:{
f:[{t:'Demo es el producto',d:'Hacer research del prospecto en vivo durante la primera llamada demuestra el valor en 10 minutos. La demo SE convierte en la herramienta de ventas.'},
{t:'Claude 200K tokens = calidad única',d:'Ningún competidor puede procesar y razonar sobre un PDF de 300 páginas de reporte anual + 50 artículos de prensa en una sola llamada de API.'},
{t:'Versatilidad de casos de uso',d:'El mismo producto sirve para prep de reunión de ventas, due diligence de M&A, research de inversión y análisis competitivo. Cuatro segmentos con un solo MVP.'},
{t:'Integración con calendario',d:'El agente puede conectarse a Google Calendar y enviar el brief de research automáticamente 60 minutos antes de cada reunión relevante.'}],
o:[{t:'Perplexity validó el modelo',d:'Perplexity creció a $500M de valuación demostrando que el mercado paga por research con IA. El nicho B2B de empresa-a-empresa está insuficientemente cubierto.'},
{t:'M&A en crecimiento en LATAM',d:'El mercado de M&A en LATAM creció 40% en 2023-2024. Cada deal requiere decenas de horas de research que pueden automatizarse parcialmente.'},
{t:'Inversores ángeles como segmento',d:'Los inversores ángeles de LATAM hacen 5-20 deals por año, cada uno requiriendo research exhaustivo. Son un segmento con alta WTP y acceso fácil vía eventos.'},
{t:'Integración con CRM como producto de datos',d:'Los reportes de research pueden alimentar automáticamente el CRM del cliente, convirtiéndose en la fuente de verdad de datos de prospectos.'}],
d:[{t:'Calidad depende de fuentes públicas',d:'Para empresas privadas en LATAM con poca presencia digital, el research puede ser superficial. Esto debe comunicarse claramente al cliente.'},
{t:'Actualización de datos',d:'Los reportes tienen fecha de corte. Una empresa que levantó financiamiento ayer no aparece en el reporte de hoy. Hay que gestionar la expectativa de frescura de datos.'},
{t:'Definición de "buena calidad" subjetiva',d:'Diferentes usuarios tienen definiciones diferentes de un buen reporte. El onboarding debe incluir calibración del tipo de output esperado.'},
{t:'Pricing difícil por variabilidad de uso',d:'Algunos usuarios hacen 1 research por semana, otros 20 por día. El modelo de precios debe acomodar esa variabilidad sin canibalizar el valor.'}],
a:[{t:'Perplexity con modo de negocios',d:'Perplexity Pro ya ofrece búsquedas con contexto empresarial. Si mejoran su UX para research estructurado, son el principal competidor.'},
{t:'LinkedIn Premium con IA integrada',d:'LinkedIn es la fuente de datos primaria para research de personas. Su modelo Premium con IA puede absorber parte del caso de uso.'},
{t:'ChatGPT con búsqueda web',d:'ChatGPT con Browsing es el "hazlo tú mismo" de muchos usuarios. Nuestro diferencial debe ser la estructura del output y la integración con el flujo de trabajo.'},
{t:'Consultoras de research',d:'Para deals de alto valor, las empresas prefieren un humano que valida y profundiza. El mercado high-end seguirá siendo humano por tiempo.'}]
},
gtm:[
{fase:'Fase 1 — Ventas enterprise como early adopters',periodo:'Mes 1-3',
desc:'Targeting directo a gerentes de ventas y equipos de M&A de empresas de 50-500 empleados en Argentina y Uruguay. La demo en vivo resolviendo el research de un deal específico del prospecto es el mejor material de ventas posible.',
canales:['LinkedIn outreach a VP Sales, Gerentes Comerciales y Managing Directors de fondos de inversión','Demo event: "Cómo hacer research de cualquier empresa en 10 minutos con IA" — webinar semanal','Contacto directo a estudios jurídicos, fondos de PE y bancos de inversión boutique'],
kpis:['15 clientes activos','3 industrias validadas con mejores casos de uso','MRR: $5.235']},
{fase:'Fase 2 — Contenido y comunidad',periodo:'Mes 4-6',
desc:'Los reportes generados son el mejor material de marketing. Publicar reports de empresas públicas de LATAM como demostración de calidad. Crear comunidad de "deal makers" que comparten inteligencia de mercado.',
canales:['LinkedIn newsletter semanal con research de empresa LATAM relevante como demo pública','Partnership con aceleradoras de startups LATAM para onboarding a founders','Webinars para equipos de ventas enterprise con certificación de uso de IA'],
kpis:['50 clientes activos','Newsletter con 5K suscriptores','MRR: $17.450']},
{fase:'Fase 3 — Integración y stickiness',periodo:'Mes 7-12',
desc:'Integraciones con CRM (HubSpot, Salesforce, Pipedrive) y con Google Calendar para que el brief llegue automáticamente antes de cada reunión. La integración crea el hábito y reduce el churn a casi cero.',
canales:['Marketplace de HubSpot y Pipedrive como canal de distribución adicional','Partnerships con consultoras de ventas que recomiendan el tool a sus clientes','Enterprise deals con bancos y fondos de inversión con contratos anuales'],
kpis:['100 clientes activos','MRR: $34.900','Churn mensual < 3%']}
],
tech:[
{capa:'LLM Core',nombre:'Claude 3.5 Sonnet',razon:'200K tokens de contexto = puede procesar un prospecto completo (web, LinkedIn, press, finanzas) en una sola llamada. Sin rival para este caso de uso.'},
{capa:'Web Search',nombre:'Brave Search API + Tavily',razon:'Fuentes complementarias: Brave para búsqueda general, Tavily específicamente optimizada para research de LLMs con citación de fuentes.'},
{capa:'PDF/Document',nombre:'Claude Documents API',razon:'Procesamiento directo de PDFs de reportes anuales, pitch decks y documentos adjuntos al request.'},
{capa:'Backend',nombre:'Node.js + Supabase',razon:'API de generación de reportes con almacenamiento de historial. Supabase como base de datos con full-text search para recuperar reports anteriores.'},
{capa:'Output',nombre:'React PDF + Resend',razon:'Generación de PDF con marca del cliente. Envío por email y WhatsApp del brief 60 minutos antes de cada reunión del calendario.'}
],
precios:[
{plan:'Solo',precio:'$149',para:'Ejecutivo individual o founder',incluye:['30 reportes/mes','Todos los tipos de research','Integración con Google Calendar','Historial de reportes']},
{plan:'Team',precio:'$349',para:'Equipos de ventas de 3-10 personas',incluye:['Reportes ilimitados','Multi-usuario (5 seats)','CRM integrations (HubSpot, Pipedrive)','Templates por industria personalizados','Soporte prioritario']},
{plan:'Enterprise',precio:'$799',para:'Firmas de M&A, fondos, bancos',incluye:['Reportes ilimitados','Usuarios ilimitados','API de integración propia','Custom templates y branding','SLA y Customer Success dedicado']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:15,mrr:5235,nota:'Equipos de ventas y fondos de inversión pequeños.'},
{q:'Q2 (Mes 4-6)',cli:50,mrr:17450,nota:'Expansión vía contenido y webinars.'},
{q:'Q3 (Mes 7-9)',cli:80,mrr:27920,nota:'Integración CRM. Expansión a Chile y México.'},
{q:'Q4 (Mes 10-12)',cli:120,mrr:41880,nota:'Primeros contratos enterprise anuales.'}
],
payback:'Break-even en mes 5 con costo de desarrollo amortizado en 12 meses.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP del agente',h:['Integrar Claude API + Brave Search para generación de reportes estructurados','Construir 5 templates de reporte por tipo de caso de uso (ventas, M&A, inversión, competencia, persona)','3 pilotos gratuitos con equipos comerciales del network'],kpi:'3 pilotos con feedback positivo documentado'},
{p:'Mes 3-4',titulo:'Producto pagado',h:['Lanzar con pricing $149/$349','Integración básica con Google Calendar para envío automático de briefs','Dashboard de historial de reportes generados'],kpi:'15 clientes activos, MRR $5.235'},
{p:'Mes 5-8',titulo:'Integraciones y escala',h:['Integraciones con HubSpot y Pipedrive','Templates por industria pre-entrenados (fintech, industrial, retail, SaaS)','Newsletter semanal de research de empresa LATAM como contenido de marketing'],kpi:'80 clientes activos, MRR $27.920'},
{p:'Mes 9-12',titulo:'Enterprise y expansión',h:['Primeros contratos anuales con fondos y bancos de inversión boutique','Expansión geográfica a México y Chile con equipo de customer success local','API propia para integraciones custom de clientes enterprise'],kpi:'120 clientes, MRR $41.880'}
],
competidores:[
{nombre:'Perplexity Pro',f:'Búsqueda web potente, UX simple, marca reconocida',d:'No estructurado para research empresarial, no tiene templates de caso de uso, no se integra con CRM',g:'Estructura del output + integración con flujo de trabajo + templates por industria = 10x más útil para B2B'},
{nombre:'LinkedIn Premium',f:'Datos de personas y empresas directamente desde la fuente',d:'No genera reports sintetizados, no analiza prensa ni financials, no se integra con el calendario',g:'Complementamos LinkedIn (somos mejores con contexto de mercado y análisis); no competimos con datos de RRHH'},
{nombre:'Analista junior interno',f:'Entiende el contexto de la empresa, puede profundizar en puntos específicos',d:'Cuesta $1.200-2.000/mes, no está disponible 24/7, no puede hacer 20 researches simultáneos',g:'Precio (20% del costo) + velocidad (10x más rápido) + disponibilidad (antes de cada reunión automáticamente)'}
],
riesgos:[
{r:'Perplexity mejora su UX para research empresarial',prob:'Media',imp:'Alto',m:'Mantener ventaja en templates específicos, integración con flujo de trabajo y output estructurado. Velocidad de ejecución es clave.'},
{r:'Calidad insuficiente en empresas privadas sin presencia digital',prob:'Alta',imp:'Medio',m:'Comunicar scope claro en onboarding. Para empresas sin presencia digital, ofrecer research de ecosistema (sector, competidores, contexto de mercado).'},
{r:'Saturación de planes de precios',prob:'Baja',imp:'Medio',m:'El modelo de pricing por reportes o por seats es más predecible. Evaluar modelo de consumo vs suscripción flat.'},
{r:'Filtración de información confidencial',prob:'Baja',imp:'Alto',m:'Política clara de no almacenamiento de datos de prospectos. SOC 2 como objetivo a 12 meses para clientes enterprise.'}
],
conclusion:['El Agente de Research Empresarial IA es el segundo producto del portafolio por razones claras: la demo vende sola, el ROI es inmediato y cuantificable, y el equipo es el usuario natural del producto todos los días. No es un producto que necesita evangelizar al mercado — el mercado ya siente el dolor todos los días.','El diferencial crítico frente a Perplexity o ChatGPT es la estructura del output para contexto de negocios específico. Un reporte genérico de 10 párrafos no es lo mismo que un brief ejecutivo organizado para una reunión de ventas con pain points identificados y preguntas sugeridas. Esa diferencia de UX es la que retiene al cliente.','La oportunidad de expansión hacia fondos de inversión y equipos de M&A es el camino al ticket alto ($799/mes+) que puede convertir este producto en el más rentable del portafolio a largo plazo.'],
primer_paso:'Mañana: hacer un research completo de 3 empresas conocidas del network usando Claude API con web search (puede ser manual con un prompt bien diseñado). Enviar ese research a los CEOs de esas empresas con el mensaje: "Hice esto en 10 minutos con IA — ¿te lo muestro y te lo ofrezco a $149/mes?". Objetivo: 1 piloto en 48 horas.'
},

// ─────────────────────────────────────────────────────────────────────────────
// #3
{slug:'propuestas-comerciales-ia', nombre:'Propuestas Comerciales IA', categoria:'Ventas B2B',
ticket:199, mvp_meses:2, validado:'USA · España · México',
tagline:'De 4 horas a 20 minutos: propuestas profesionales personalizadas que ganan deals, generadas con IA.',
propuesta_valor:'Generar propuestas comerciales profesionales, personalizadas y convincentes en 20 minutos a partir de un briefing simple, eliminando las 4-8 horas que hoy tarda un vendedor en construirlas.',
intro:['Las Propuestas Comerciales IA ocupan el puesto #3 del ranking con un MVP de solo 2 meses. Es el producto con el time-to-market más rápido del portafolio y uno de los con mayor demanda inmediata demostrable.','Toda empresa que vende servicios o productos B2B con ticket mayor a $2.000 necesita propuestas. Hoy, una propuesta bien hecha toma entre 4-8 horas de trabajo: research del cliente, personalización de la presentación, cálculo de precios, redacción del problema y la solución, diseño. La IA puede hacer el 80% en 20 minutos.','El mercado de proposal software (PandaDoc, Proposify) factura $500M+ anuales en el mundo. Ninguno de estos players está nativizado para LATAM ni usa LLMs de calidad para personalización real.'],
problema:['Los vendedores pasan entre el 30-40% de su tiempo en trabajo administrativo y de documentación, con las propuestas siendo el ítem más costoso. Una propuesta personalizada de calidad requiere: investigar al cliente, entender su problema específico, articular la solución en su idioma, calcular el valor del ROI para ellos, y diseñarlo todo de forma profesional.','El resultado es una brecha de calidad enorme: las PYMEs que tienen vendedores con tiempo hacen buenas propuestas y cierran. Las que no, mandan PDFs genéricos o presentaciones de Canva sin personalizar. La diferencia en tasa de cierre puede ser de 3-5x.','En LATAM, el problema es amplificado porque la cultura de propuestas formales es menos madura: muchas empresas pierden deals porque no tienen un formato de propuesta profesional, o porque el proceso de crear uno lleva tanto tiempo que se pierde el timing de cierre.'],
solucion:['El usuario completa un formulario de 10 preguntas: ¿quién es el cliente?, ¿cuál es el problema que resolvemos?, ¿cuánto vale ese problema para ellos?, ¿qué incluye nuestra solución?, ¿cuál es el precio?. El sistema genera una propuesta completa en 20 minutos: estructura profesional, tono personalizado al sector del cliente, cálculo de ROI, sección de garantías y casos de éxito.','La propuesta se puede entregar en PDF descargable, como link web interactivo, o directamente firmable con firma electrónica integrada. El cliente prospecto puede aceptar, comentar o pedir cambios directamente en la interfaz.','La personalización real viene de Claude que analiza el contexto del cliente (sector, tamaño, problema) y adapta no solo el contenido sino el tono, los ejemplos, los datos comparativos y el call to action. Una propuesta para una constructora suena diferente que una para una fintech.'],
mercado:{tam:'$2.1B',sam:'$180M',cagr:'14% anual',clientes_est:'+240.000 empresas de servicios B2B en LATAM',
segmento:'Agencias de marketing, consultoras, empresas de tecnología, constructoras, estudios de arquitectura y diseño, distribuidoras — cualquier empresa que vende proyectos o servicios con ticket mayor a $2.000.',
analisis:['PandaDoc ($100M ARR) y Proposify ($50M ARR) demuestran que el mercado de proposal automation es real y rentable. Ninguna de estas empresas está presente de forma significativa en LATAM.','En LATAM, el mercado está aún más virgen: la cultura de propuestas formales es menos desarrollada y las herramientas existentes están en inglés o son genéricas. El jugador que llegue primero con una solución en español, pensada para el contexto latinoamericano, tiene una ventana significativa.','La tendencia de "proposal-led growth" (donde la propuesta es la primera impresión seria de la empresa) está ganando tracción en comunidades de ventas B2B globalmente. La propuesta es el nuevo pitch deck.']},
criterios:[
{s:8,n:'Mercado de $2.1B global. En LATAM, 240.000 empresas de servicios B2B son clientes naturales.'},
{s:8,n:'No existe alternativa en español con IA de calidad. PandaDoc es en inglés y sin personalización real.'},
{s:9,n:'MVP en 2 meses con formulario de briefing, Claude API para generación, y exportación a PDF.'},
{s:9,n:'Demo instantánea: hacer una propuesta para el prospecto en la reunión de ventas en 20 minutos.'},
{s:8,n:'Con 100 clientes a $199/mes = $19.900 MRR. Target razonable en 6 meses.'},
{s:8,n:'Modelo SaaS sin costo marginal. Los templates mejoran con cada propuesta generada.'},
{s:9,n:'El equipo hace propuestas todos los días — son el usuario primario y el mejor demo en vivo.'},
{s:8,n:'Dependencia de Claude API únicamente. Riesgo moderado y manejable con prompt engineering eficiente.'},
{s:7,n:'El moat está en los templates por industria y los datos de propuestas que funcionaron vs las que no.'},
{s:9,n:'ROI muy claro: si el cliente cierra 1 deal extra por mes gracias a la propuesta, se paga 10-50x.'},
{s:8,n:'$199/mes es equivalente a 30 minutos de trabajo del vendedor más caro. WTP alta.'},
{s:9,n:'CAC mínimo: la demo en la reunión de ventas cierra en el acto. El producto es su propia herramienta de venta.'},
{s:8,n:'Alta retención: si el vendedor integra el tool en su proceso de ventas, el churn es mínimo.'},
{s:7,n:'Viral natural: el prospecto recibe una propuesta profesional y puede preguntar con qué herramienta se hizo.'},
{s:9,n:'Máximo fit: el equipo hace propuestas y necesita este tool para sus propias ventas de SaaS.'}
],
foda:{
f:[{t:'2 meses al primer cliente',d:'El MVP más rápido del portafolio. Un formulario + Claude API + exportación PDF es funcional en semanas.'},
{t:'Demo = la propia propuesta del cliente',d:'Al hacer la demo, el vendedor genera la propuesta del prospecto en tiempo real. No hay demostración más convincente.'},
{t:'Mercado masivo y democratizado',d:'Cualquier empresa B2B con ticket mayor a $2K es cliente. El ICP es amplio y fácil de encontrar.'},
{t:'Templates por industria como diferenciador',d:'Una biblioteca de templates específicos para construcción, tecnología, marketing, legal — con el lenguaje exacto de cada industria.'}],
o:[{t:'PandaDoc no tiene LATAM',d:'PandaDoc tiene presencia cero en LATAM en español. El espacio está abierto para un player nativo.'},
{t:'Firma electrónica integrada',d:'Agregar firma electrónica (DocuSign API o firma propia) convierte el producto en el flujo completo de ventas: propuesta → firma → contrato.'},
{t:'Propuestas como canal de analytics',d:'Los datos de qué propuestas se abren, cuándo, por quién y qué secciones leen más son oro para el equipo de ventas.'},
{t:'Integración con CRM como diferenciador',d:'Si la propuesta se genera automáticamente desde el CRM del cliente (HubSpot, Pipedrive), el producto se vuelve indispensable.'}],
d:[{t:'Percepción de "simplificador genérico"',d:'El riesgo es que la propuesta generada se vea obvia o genérica. El UI/UX de briefing debe ser sofisticado para extraer contexto real del vendedor.'},
{t:'Diseño visual como talón de Aquiles',d:'Las propuestas necesitan buena apariencia. El diseño IA no siempre supera a un diseñador humano. Ofrecer templates de diseño de alta calidad.'},
{t:'Competencia con Canva y PowerPoint',d:'Muchos vendedores hacen sus propuestas en Canva o PowerPoint. Cambiar ese hábito requiere demostrar un salto de calidad claro.'},
{t:'Propuestas complejas requieren iteración',d:'Para proyectos grandes (>$50K), la propuesta requiere múltiples rondas de revisión. El sistema debe facilitar esa iteración sin perder el contexto.'}],
a:[{t:'Canva con IA de documentos',d:'Canva está agregando capacidades de IA a sus presentaciones y documentos. Su base de usuarios masiva es una amenaza potencial.'},
{t:'PandaDoc entrando a LATAM en español',d:'Si PandaDoc localiza su producto al español con IA, su infraestructura existente puede superarnos rápidamente.'},
{t:'GPT-4 con documentos',d:'Usuarios técnicos ya generan propuestas con prompts de ChatGPT. Nuestro valor debe estar en la estructura, la UX y las integraciones, no en el LLM genérico.'},
{t:'Freelancers de propuestas',d:'Existe un mercado de freelancers en Workana que hacen propuestas por $50-100 la unidad. Para clientes con poco volumen, pueden ser una alternativa.'}]
},
gtm:[
{fase:'Fase 1 — Agencias y consultoras como early adopters',periodo:'Mes 1-3',
desc:'Las agencias de marketing y consultoría son los clientes ideales para empezar: hacen muchas propuestas (5-20 por mes), tienen equipos de ventas pequeños con tiempo limitado, y valoran mucho la apariencia profesional de su output.',
canales:['Prospección directa a dueños de agencias de marketing digital en LinkedIn','Grupos de Facebook y Telegram de agencias de Argentina, Uruguay y México','Demo en vivo en reunión de 30 minutos haciendo la propuesta del prospecto'],
kpis:['20 clientes activos (agencias y consultoras)','MRR: $3.980','NPS > 60']},
{fase:'Fase 2 — Expansión sectorial',periodo:'Mes 4-6',
desc:'Con templates validados para agencias, expandir a construcción, tecnología y servicios profesionales (legal, contable, ingeniería). Cada sector tiene su propio lenguaje y sus propios deal-breakers en una propuesta.',
canales:['Alianzas con asociaciones de constructoras, colegios de ingenieros y estudios de arquitectura','Content marketing en LinkedIn para CEOs y gerentes de ventas de servicios B2B','Webinar: "Cómo duplicar tu tasa de cierre con propuestas de IA"'],
kpis:['60 clientes activos en 3 sectores','MRR: $11.940','Churn < 7%']},
{fase:'Fase 3 — Stickiness y expansión',periodo:'Mes 7-12',
desc:'Integración con CRM más usados en LATAM. Firma electrónica nativa. Analytics de propuestas (cuándo se abre, qué sección lee). Estas features convierten el producto de "nice to have" a "parte del proceso de ventas".',
canales:['Marketplace de HubSpot y Pipedrive','Partnerships con consultoras de ventas que recomiendan el tool','Programa de afiliados para vendedores independientes y consultores de ventas'],
kpis:['120 clientes activos','MRR: $23.880','Expansión a Brasil en Q4']}
],
tech:[
{capa:'LLM',nombre:'Claude 3.5 Sonnet',razon:'Mejor del mercado para redacción persuasiva y estructurada en español. Genera propuestas con tono profesional consistente.'},
{capa:'PDF Generation',nombre:'Puppeteer + HTML Templates',razon:'Renderizar HTML bien diseñado a PDF es más flexible que librerías PDF directas. Permite templates responsivos y de alta calidad visual.'},
{capa:'Storage',nombre:'Supabase Storage',razon:'Almacenamiento de propuestas generadas, templates e imágenes de marca del cliente con acceso firmado seguro.'},
{capa:'Firma electrónica',nombre:'DocuSign API (o Autofirma propia)',razon:'Integración con DocuSign para firma legal en LATAM. A largo plazo, firma propia para reducir dependencia.'},
{capa:'Pagos',nombre:'Stripe + MercadoPago',razon:'Stripe para clientes con tarjeta internacional, MercadoPago para Argentina y Brasil con métodos locales de pago.'}
],
precios:[
{plan:'Starter',precio:'$99',para:'Freelancers y empresas con 1-2 vendedores',incluye:['15 propuestas/mes','5 templates de industria','Exportación PDF y link web','Historial de propuestas','Soporte por email']},
{plan:'Pro',precio:'$199',para:'Agencias y empresas con equipo de ventas',incluye:['Propuestas ilimitadas','Todos los templates de industria','Firma electrónica integrada','Analytics de apertura y lectura','3 usuarios','Personalización de marca completa']},
{plan:'Agency',precio:'$399',para:'Agencias con múltiples clientes',incluye:['Propuestas ilimitadas','Sub-cuentas por cliente','Branding white-label','API de integración','Usuarios ilimitados','Customer Success Manager']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:20,mrr:3980,nota:'Agencias y consultoras del network.'},
{q:'Q2 (Mes 4-6)',cli:60,mrr:11940,nota:'Expansión a construcción y tecnología.'},
{q:'Q3 (Mes 7-9)',cli:100,mrr:19900,nota:'Integración CRM. Primeros planes Agency.'},
{q:'Q4 (Mes 10-12)',cli:150,mrr:29850,nota:'Expansión Brasil. Firma electrónica como driver de conversión.'}
],
payback:'Break-even en mes 3 con costos iniciales mínimos de desarrollo.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP rápido',h:['Formulario de briefing (10 preguntas) + Claude API + exportación PDF','5 templates de industria: marketing, tecnología, construcción, legal, distribución','3 pilotos con agencias del network a costo cero'],kpi:'3 pilotos con propuestas de calidad demostrable'},
{p:'Mes 3-4',titulo:'Lanzamiento pagado',h:['Pricing en 3 tiers. Foco en plan Pro a $199','Analytics básico: cuándo se abre la propuesta y cuánto tiempo se lee','Integración con Google Drive para guardar propuestas en la nube del cliente'],kpi:'20 clientes, MRR $3.980'},
{p:'Mes 5-8',titulo:'Features de retención',h:['Firma electrónica con DocuSign','Integración HubSpot y Pipedrive: generar propuesta desde la oportunidad del CRM','Templates avanzados por industria con secciones de ROI y comparativas de precio'],kpi:'80 clientes, MRR $15.920'},
{p:'Mes 9-12',titulo:'Escala y expansión',h:['Lanzamiento en Brasil con templates en portugués','Plan Agency white-label para agencias que lo revenden a sus clientes','API pública para integraciones custom'],kpi:'150 clientes, MRR $29.850'}
],
competidores:[
{nombre:'PandaDoc',f:'Plataforma muy completa con firma, analytics y CRM integrations',d:'En inglés, no nativizado para LATAM, sin LLM de calidad para generación de contenido',g:'Español nativo + Claude para contenido real + precio 60% más bajo + soporte en el timezone de LATAM'},
{nombre:'Proposify',f:'Muy buena UX y templates de diseño premium',d:'Sin IA de generación de contenido, no en español, pricing alto para PYMEs LATAM',g:'IA genera el 80% del contenido = el vendedor solo revisa en vez de escribir todo desde cero'},
{nombre:'Canva o PowerPoint',f:'Gratis o muy barato, herramienta conocida',d:'Sin IA de personalización, sin analytics de apertura, sin firma electrónica, proceso lento',g:'3 horas menos de trabajo por propuesta. El ahorro de tiempo se paga en la primera propuesta del mes.'}
],
riesgos:[
{r:'Calidad de propuestas "genéricas" que no cierran deals',prob:'Media',imp:'Alto',m:'Formulario de briefing de alta calidad que extrae contexto real. Templates por industria con lenguaje específico. Proceso de revisión antes de enviar.'},
{r:'PandaDoc entra a LATAM con IA en español',prob:'Media',imp:'Alto',m:'Construir el moat en datos de propuestas de LATAM + templates específicos + integraciones con tools locales (MercadoPago, AFIP, etc.).'},
{r:'Churn alto si el cliente no ve mejora en tasa de cierre',prob:'Media',imp:'Medio',m:'Onboarding de 30 minutos con consultor de propuestas. Métricas de before/after de tiempo invertido como valor alternativo.'},
{r:'Dificultad de pricing para empresas con bajo volumen',prob:'Alta',imp:'Bajo',m:'Plan Starter de $99 con 15 propuestas/mes acomoda a freelancers sin penalizarlos. Modelo por uso como alternativa a mediano plazo.'}
],
conclusion:['Las Propuestas Comerciales IA son el producto con el camino más corto al mercado y al primer revenue. El MVP es técnicamente sencillo, el caso de uso es universal y la demo en vivo durante la reunión de ventas es el cierre más natural posible.','El diferencial no es la tecnología — es la estructura del briefing y los templates por industria. Cualquiera puede hacer una propuesta con ChatGPT; lo que este producto hace es estructurar el proceso de extracción de información, adaptarlo al lenguaje de la industria del cliente y entregarlo en el formato correcto para firmar. Eso es lo que el mercado paga.','La expansión natural a firma electrónica + analytics + CRM integration convierte este producto en el sistema de ventas completo de una PYME — no solo el generador de propuestas. Esa visión a 12 meses es lo que lo convierte en un negocio defensible.'],
primer_paso:'Esta semana: construir el formulario de briefing con 10 preguntas y conectarlo con Claude API para generar la propuesta. No necesita design perfecto ni PDF. Un Google Form que llama a Claude y devuelve un texto estructurado por email es suficiente para el primer piloto. Costo de desarrollo: cero.'
}

]; // cierre RANKING — los IDs 4 al 20 se agregan en el siguiente script

// ── GENERAR ARCHIVOS ──────────────────────────────────────────────────────────
const filenames = RANKING.map((_,i)=>`${String(i+1).padStart(2,'0')}-${RANKING[i].slug}.html`);

RANKING.forEach((idea,i)=>{
  const prev = i>0 ? filenames[i-1] : null;
  const next = i<RANKING.length-1 ? filenames[i+1] : null;
  const html = renderDoc(idea, i+1, prev, next);
  fs.writeFileSync(path.join(DIR, filenames[i]), html);
  console.log(`✓ [${i+1}/${RANKING.length}] ${idea.nombre}`);
});

// INDEX
const indexHtml = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Top 20 SaaS 2026 — Índice</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f4f8;color:#0f172a;padding:40px;}
h1{font-size:28px;font-weight:900;margin-bottom:8px;}
p{color:#64748b;margin-bottom:32px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
.card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e2e8f0;text-decoration:none;color:inherit;display:block;transition:transform 0.12s,box-shadow 0.12s;}
.card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1);}
.rank{font-size:12px;font-weight:800;color:#6366f1;letter-spacing:1px;margin-bottom:8px;}
.nombre{font-size:16px;font-weight:800;margin-bottom:6px;}
.tag{font-size:11px;background:#e0e7ff;color:#3730a3;padding:3px 10px;border-radius:12px;display:inline-block;margin-bottom:12px;}
.meta{display:flex;gap:12px;font-size:12px;color:#64748b;}
.score{font-weight:700;color:#059669;}
</style></head><body>
<h1>📊 Top 20 SaaS Ideas 2026</h1>
<p>Análisis estratégico profundo · Agustín &amp; el Flaco · Ranking reclasificado por fit de equipo</p>
<div class="grid">
${RANKING.map((idea,i)=>{
  const total = sum(idea.criterios);
  return `<a href="${filenames[i]}" class="card">
  <div class="rank">#${i+1} DE 20</div>
  <div class="nombre">${idea.nombre}</div>
  <span class="tag">${idea.categoria}</span>
  <div class="meta">
    <span class="score">${total}/150</span>
    <span>MVP: ${idea.mvp_meses} meses</span>
    <span>$${idea.ticket}/mes</span>
  </div></a>`;
}).join('\n')}
${RANKING.length < 20 ? `<div style="background:#f8faff;border:2px dashed #e2e8f0;border-radius:14px;padding:24px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px;font-weight:600;">Ideas #${RANKING.length+1}–20 — Ejecutar generar-top20-parte2.js</div>` : ''}
</div>
</body></html>`;

fs.writeFileSync(path.join(DIR,'index.html'), indexHtml);
console.log(`\n✅ ${RANKING.length} archivos + índice generados en /${DIR}/`);
console.log('📌 Ejecutar generar-top20-parte2.js para agregar ideas #4-20');
