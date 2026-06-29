const fs = require('fs');
const path = require('path');
const DIR = 'top20';

// ── helpers ──────────────────────────────────────────────────────────────────
const CN=['Tamaño mercado','Competencia LATAM','Dificultad MVP','Tiempo revenue','Potencial MRR','Escalabilidad','Ventaja equipo','Riesgo plataforma','Defensibilidad','Claridad ROI','WTP','CAC estimado','Retención','Viral / referidos','Fit equipo'];
const CD=['Tamaño del mercado total en LATAM','Competencia local establecida — 10=sin rival','Facilidad de MVP funcional — 10=semanas','Velocidad al primer ingreso','Potencial MRR sostenible','Capacidad de escalar sin costo lineal','Ventaja única del equipo','Riesgo plataformas externas — 10=sin riesgo','Barreras para ser copiado','Claridad del ROI para el cliente','Disposición real a pagar','CAC estimado — 10=casi cero','Probabilidad de renovación mensual','Crecimiento orgánico por referidos','Alineación con fortalezas del equipo'];
function sum(c){return c.reduce((a,x)=>a+x.s,0);}
function tierL(s){return s>=115?'TOP ★★★':s>=100?'MID ★★':'BAJO ★';}

const CSS=`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Segoe UI',system-ui,sans-serif;color:#0f172a;background:#f8fafc;font-size:15px;line-height:1.7;}.cover{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#312e81 100%);color:#fff;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:80px 72px 72px;page-break-after:always;}.cover-rank{font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#a5b4fc;margin-bottom:20px;}.cover-title{font-size:52px;font-weight:900;line-height:1.1;margin-bottom:20px;}.cover-tagline{font-size:20px;color:#c7d2fe;margin-bottom:48px;max-width:700px;line-height:1.5;}.cover-pills{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:40px;}.pill{padding:10px 22px;border-radius:30px;font-size:13px;font-weight:700;}.pill-score{background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);}.pill-cat{background:#6366f1;color:#fff;}.cover-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}.cover-stat{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:20px;}.cover-stat b{display:block;font-size:26px;font-weight:900;color:#fff;margin-bottom:4px;}.cover-stat span{font-size:11px;color:#a5b4fc;text-transform:uppercase;letter-spacing:0.5px;}.wrap{max-width:1000px;margin:0 auto;padding:60px 48px;}.section{margin-bottom:64px;page-break-inside:avoid;}.sec-label{font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin-bottom:8px;}.sec-title{font-size:30px;font-weight:900;color:#0f172a;margin-bottom:24px;padding-bottom:14px;border-bottom:3px solid #e2e8f0;}h3{font-size:20px;font-weight:800;color:#0f172a;margin:32px 0 12px;}h4{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.8px;color:#64748b;margin:24px 0 10px;}p{color:#334155;margin-bottom:14px;}ul{padding-left:22px;margin-bottom:16px;}li{color:#334155;margin-bottom:8px;}.highlight-box{background:linear-gradient(135deg,#312e81,#1e3a5f);color:#fff;padding:28px 32px;border-radius:14px;margin:24px 0;}.highlight-box p{color:#c7d2fe;margin:0;}.highlight-box strong{color:#fff;}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0;}.info-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.05);}.info-card h4{margin-top:0;}.info-card p{margin:0;font-size:14px;}.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:24px 0;}.stat-box{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.04);}.stat-box b{display:block;font-size:24px;font-weight:900;color:#6366f1;margin-bottom:4px;}.stat-box span{font-size:12px;color:#64748b;}.criterio-row{display:grid;grid-template-columns:160px 1fr 80px;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;}.criterio-row:last-child{border-bottom:none;}.criterio-nombre{font-size:13px;font-weight:600;}.criterio-desc{font-size:11px;color:#94a3b8;}.bar-track{height:10px;background:#f1f5f9;border-radius:5px;overflow:hidden;}.bar-fill{height:10px;border-radius:5px;}.criterio-score{text-align:right;font-size:15px;font-weight:800;}.total-row{background:#f8faff;border-radius:10px;padding:16px 20px;margin-top:16px;display:flex;justify-content:space-between;align-items:center;}.total-row span{font-size:14px;font-weight:700;color:#64748b;}.total-row strong{font-size:22px;font-weight:900;color:#6366f1;}.foda-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;margin:24px 0;}.fc{padding:28px;}.fc h4{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;}.fc .item{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(0,0,0,.08);}.fc .item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}.fc .item b{display:block;font-size:14px;font-weight:700;margin-bottom:4px;}.fc .item p{font-size:13px;margin:0;line-height:1.5;}.fc-f{background:#f0fdf4;}.fc-f h4{color:#065f46;}.fc-o{background:#eff6ff;}.fc-o h4{color:#1e40af;}.fc-d{background:#fffbeb;}.fc-d h4{color:#78350f;}.fc-a{background:#fff1f2;}.fc-a h4{color:#9f1239;}.gtm-phase{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:28px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,.04);}.gtm-phase-header{display:flex;align-items:center;gap:14px;margin-bottom:16px;}.phase-num{width:40px;height:40px;background:#6366f1;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;}.phase-title{font-size:18px;font-weight:800;}.phase-period{font-size:12px;color:#64748b;font-weight:600;}.gtm-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px;}.gtm-col h4{margin-top:0;font-size:11px;}.gtm-col ul{margin:0;}.tech-table{width:100%;border-collapse:collapse;margin:20px 0;}.tech-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}.tech-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;}.tech-table tr:last-child td{border-bottom:none;}.tech-table td:first-child{font-weight:700;font-size:13px;color:#64748b;white-space:nowrap;}.tech-table td:nth-child(2){font-weight:700;color:#6366f1;}.tech-table td:last-child{font-size:13px;color:#334155;}.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:24px 0;}.price-card{background:#fff;border:2px solid #e2e8f0;border-radius:16px;padding:28px;position:relative;}.price-card.featured{border-color:#6366f1;background:linear-gradient(180deg,#f5f3ff,#fff);}.price-card .badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#6366f1;color:#fff;padding:4px 16px;border-radius:20px;font-size:11px;font-weight:700;}.price-plan{font-size:13px;font-weight:700;color:#64748b;margin-bottom:8px;}.price-amount{font-size:36px;font-weight:900;color:#0f172a;margin-bottom:4px;}.price-period{font-size:13px;color:#64748b;margin-bottom:16px;}.price-for{font-size:12px;background:#f1f5f9;padding:6px 12px;border-radius:6px;color:#64748b;margin-bottom:16px;}.price-features{list-style:none;padding:0;margin:0;}.price-features li{font-size:13px;padding:6px 0;border-bottom:1px solid #f1f5f9;color:#334155;}.price-features li:last-child{border-bottom:none;}.price-features li::before{content:'✓ ';color:#059669;font-weight:700;}.fin-table{width:100%;border-collapse:collapse;margin:20px 0;}.fin-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}.fin-table th:first-child{text-align:left;}.fin-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;text-align:center;}.fin-table td:first-child{text-align:left;font-weight:700;color:#0f172a;}.fin-table tr:last-child td{border-bottom:none;font-weight:800;background:#f8faff;}.roadmap{margin:24px 0;}.rm-item{display:grid;grid-template-columns:140px 1fr;gap:24px;margin-bottom:28px;}.rm-period{background:#6366f1;color:#fff;border-radius:10px;padding:14px 16px;text-align:center;font-size:13px;font-weight:700;height:fit-content;}.rm-content{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 2px 6px rgba(0,0,0,.04);}.rm-content h4{margin-top:0;color:#6366f1;}.rm-content ul{margin:8px 0 0;}.comp-table{width:100%;border-collapse:collapse;margin:20px 0;}.comp-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}.comp-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px;}.comp-table tr:last-child td{border-bottom:none;}.comp-table td:first-child{font-weight:800;color:#0f172a;}.win-cell{color:#059669;font-weight:600;}.risk-table{width:100%;border-collapse:collapse;margin:20px 0;}.risk-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}.risk-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px;}.risk-table tr:last-child td{border-bottom:none;}.prob-alta{color:#dc2626;font-weight:700;}.prob-media{color:#d97706;font-weight:700;}.prob-baja{color:#059669;font-weight:700;}.conclusion-box{background:linear-gradient(135deg,#312e81,#0f172a);color:#fff;border-radius:16px;padding:40px;margin:32px 0;}.conclusion-box h3{color:#a5b4fc;margin-top:0;}.conclusion-box p{color:#e0e7ff;font-size:16px;line-height:1.8;margin-bottom:16px;}.conclusion-box p:last-child{margin:0;}.first-step{background:#f0fdf4;border:2px solid #059669;border-radius:12px;padding:24px;margin-top:24px;}.first-step h4{color:#065f46;margin-top:0;}.first-step p{color:#064e3b;margin:0;font-size:15px;font-weight:500;}.nav-footer{text-align:center;padding:40px;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;margin-top:60px;}.nav-footer a{color:#6366f1;text-decoration:none;font-weight:700;}@media print{.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.section{page-break-inside:avoid;}.foda-grid,.pricing-grid{-webkit-print-color-adjust:exact;print-color-adjust:exact;}body{background:#fff;}}`;

function renderDoc(idea, rank, prev, next){
  const total=sum(idea.criterios);
  const tl=tierL(total);
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>#${rank} ${idea.nombre}</title><style>${CSS}</style></head><body>
<div class="cover">
  <div class="cover-rank">📊 Ranking Top 20 · Posición #${rank} de 20 · Agustín &amp; el Flaco · 2026</div>
  <h1 class="cover-title">${idea.nombre}</h1>
  <p class="cover-tagline">${idea.tagline}</p>
  <div class="cover-pills">
    <span class="pill pill-score">${total}/150 pts — ${tl}</span>
    <span class="pill pill-cat">${idea.categoria}</span>
    <span class="pill" style="background:rgba(255,255,255,0.1);color:#a5b4fc;">MVP: ${idea.mvp_meses} meses</span>
    <span class="pill" style="background:rgba(255,255,255,0.1);color:#a5b4fc;">Validado: ${idea.validado}</span>
  </div>
  <div class="cover-meta">
    <div class="cover-stat"><b>${total}/150</b><span>Score total</span></div>
    <div class="cover-stat"><b>$${idea.ticket}/mes</b><span>Ticket objetivo</span></div>
    <div class="cover-stat"><b>${idea.mvp_meses} meses</b><span>MVP</span></div>
    <div class="cover-stat"><b>${idea.mercado.sam}</b><span>Mercado LATAM</span></div>
  </div>
</div>
<div class="wrap">
<div class="section">
  <div class="sec-label">Sección 1</div>
  <h2 class="sec-title">Resumen Ejecutivo</h2>
  ${idea.intro.map(p=>`<p>${p}</p>`).join('')}
  <div class="highlight-box"><p><strong>Propuesta de valor:</strong> ${idea.propuesta_valor}</p></div>
  <div class="stat-row">
    <div class="stat-box"><b>${total}/150</b><span>Score</span></div>
    <div class="stat-box"><b>$${idea.ticket}</b><span>Ticket/mes</span></div>
    <div class="stat-box"><b>${idea.mvp_meses} meses</b><span>MVP</span></div>
    <div class="stat-box"><b>${idea.mercado.cagr}</b><span>CAGR mercado</span></div>
  </div>
</div>
<div class="section">
  <div class="sec-label">Sección 2</div>
  <h2 class="sec-title">Problema y Solución</h2>
  <div class="info-grid">
    <div class="info-card"><h4>🔴 El Problema</h4>${idea.problema.map(p=>`<p>${p}</p>`).join('')}</div>
    <div class="info-card"><h4>✅ Nuestra Solución</h4>${idea.solucion.map(p=>`<p>${p}</p>`).join('')}</div>
  </div>
</div>
<div class="section">
  <div class="sec-label">Sección 3</div>
  <h2 class="sec-title">Análisis de Mercado</h2>
  <div class="stat-row">
    <div class="stat-box"><b>${idea.mercado.tam}</b><span>Mercado global</span></div>
    <div class="stat-box"><b>${idea.mercado.sam}</b><span>SAM LATAM</span></div>
    <div class="stat-box"><b>${idea.mercado.cagr}</b><span>CAGR</span></div>
    <div class="stat-box"><b>${idea.mercado.clientes_est}</b><span>Clientes potenciales</span></div>
  </div>
  ${idea.mercado.analisis.map(p=>`<p>${p}</p>`).join('')}
  <h3>Segmento Primario</h3><p>${idea.mercado.segmento}</p>
</div>
<div class="section">
  <div class="sec-label">Sección 4</div>
  <h2 class="sec-title">Scoring Estratégico — 15 Criterios</h2>
  ${idea.criterios.map((c,i)=>`
  <div class="criterio-row">
    <div><div class="criterio-nombre">${CN[i]}</div><div class="criterio-desc">${CD[i]}</div></div>
    <div><div class="bar-track"><div class="bar-fill" style="width:${c.s*10}%;background:${c.s>=8?'#059669':c.s>=6?'#d97706':'#94a3b8'};"></div></div>
    <div style="font-size:12px;color:#64748b;margin-top:4px;">${c.n}</div></div>
    <div class="criterio-score" style="color:${c.s>=8?'#059669':c.s>=6?'#d97706':'#94a3b8'};">${c.s}/10</div>
  </div>`).join('')}
  <div class="total-row"><span>SCORE TOTAL</span><strong>${total}/150 pts</strong></div>
</div>
<div class="section">
  <div class="sec-label">Sección 5</div>
  <h2 class="sec-title">Análisis FODA</h2>
  <div class="foda-grid">
    <div class="fc fc-f"><h4>✅ Fortalezas</h4>${idea.foda.f.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div>
    <div class="fc fc-o"><h4>🚀 Oportunidades</h4>${idea.foda.o.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div>
    <div class="fc fc-d"><h4>⚠️ Debilidades</h4>${idea.foda.d.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div>
    <div class="fc fc-a"><h4>🔴 Amenazas</h4>${idea.foda.a.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div>
  </div>
</div>
<div class="section">
  <div class="sec-label">Sección 6</div>
  <h2 class="sec-title">Estrategia Go-To-Market</h2>
  ${idea.gtm.map((g,i)=>`<div class="gtm-phase">
    <div class="gtm-phase-header"><div class="phase-num">${i+1}</div><div><div class="phase-title">${g.fase}</div><div class="phase-period">${g.periodo}</div></div></div>
    <p>${g.desc}</p>
    <div class="gtm-cols">
      <div class="gtm-col"><h4>Canales</h4><ul>${g.canales.map(c=>`<li>${c}</li>`).join('')}</ul></div>
      <div class="gtm-col"><h4>KPIs</h4><ul>${g.kpis.map(k=>`<li>${k}</li>`).join('')}</ul></div>
    </div></div>`).join('')}
</div>
<div class="section">
  <div class="sec-label">Sección 7</div>
  <h2 class="sec-title">Stack Tecnológico</h2>
  <table class="tech-table"><thead><tr><th>Capa</th><th>Tecnología</th><th>Justificación</th></tr></thead>
  <tbody>${idea.tech.map(t=>`<tr><td>${t.capa}</td><td>${t.nombre}</td><td>${t.razon}</td></tr>`).join('')}</tbody></table>
</div>
<div class="section">
  <div class="sec-label">Sección 8</div>
  <h2 class="sec-title">Modelo de Precios</h2>
  <div class="pricing-grid">${idea.precios.map((p,i)=>`<div class="price-card ${i===1?'featured':''}">
    ${i===1?'<span class="badge">Más popular</span>':''}
    <div class="price-plan">${p.plan}</div><div class="price-amount">${p.precio}</div><div class="price-period">por mes</div>
    <div class="price-for">Para: ${p.para}</div>
    <ul class="price-features">${p.incluye.map(x=>`<li>${x}</li>`).join('')}</ul>
  </div>`).join('')}</div>
</div>
<div class="section">
  <div class="sec-label">Sección 9</div>
  <h2 class="sec-title">Proyecciones Financieras — Año 1</h2>
  <table class="fin-table"><thead><tr><th>Período</th><th>Clientes</th><th>MRR (USD)</th><th>ARR est.</th><th>Nota</th></tr></thead>
  <tbody>${idea.financiero.map(f=>`<tr><td>${f.q}</td><td>${f.cli}</td><td>$${f.mrr.toLocaleString()}</td><td>$${(f.mrr*12).toLocaleString()}</td><td>${f.nota}</td></tr>`).join('')}</tbody></table>
  <div class="highlight-box"><p><strong>MRR objetivo a 12 meses:</strong> $${idea.financiero[idea.financiero.length-1].mrr.toLocaleString()} USD · <strong>Payback:</strong> ${idea.payback}</p></div>
</div>
<div class="section">
  <div class="sec-label">Sección 10</div>
  <h2 class="sec-title">Roadmap 12 Meses</h2>
  <div class="roadmap">${idea.roadmap.map(r=>`<div class="rm-item">
    <div class="rm-period">${r.p}</div>
    <div class="rm-content"><h4>${r.titulo}</h4><ul>${r.h.map(x=>`<li>${x}</li>`).join('')}</ul>
    <p style="font-size:12px;color:#64748b;margin-top:12px;margin-bottom:0;"><strong>KPI:</strong> ${r.kpi}</p></div>
  </div>`).join('')}</div>
</div>
<div class="section">
  <div class="sec-label">Sección 11</div>
  <h2 class="sec-title">Paisaje Competitivo</h2>
  <table class="comp-table"><thead><tr><th>Competidor</th><th>Fortaleza</th><th>Debilidad vs nosotros</th><th>Cómo ganamos</th></tr></thead>
  <tbody>${idea.competidores.map(c=>`<tr><td>${c.nombre}</td><td>${c.f}</td><td>${c.d}</td><td class="win-cell">${c.g}</td></tr>`).join('')}</tbody></table>
</div>
<div class="section">
  <div class="sec-label">Sección 12</div>
  <h2 class="sec-title">Análisis de Riesgos</h2>
  <table class="risk-table"><thead><tr><th>Riesgo</th><th>Probabilidad</th><th>Impacto</th><th>Mitigación</th></tr></thead>
  <tbody>${idea.riesgos.map(r=>`<tr><td>${r.r}</td><td class="prob-${r.prob.toLowerCase()}">${r.prob}</td><td class="prob-${r.imp.toLowerCase()}">${r.imp}</td><td>${r.m}</td></tr>`).join('')}</tbody></table>
</div>
<div class="section">
  <div class="sec-label">Sección 13</div>
  <h2 class="sec-title">Conclusión Estratégica</h2>
  <div class="conclusion-box"><h3>Veredicto Final — ${idea.nombre}</h3>${idea.conclusion.map(p=>`<p>${p}</p>`).join('')}</div>
  <div class="first-step"><h4>🎯 PRIMER PASO CONCRETO</h4><p>${idea.primer_paso}</p></div>
</div>
</div>
<div class="nav-footer">
  <a href="index.html">← Índice</a>
  ${prev?`&nbsp;·&nbsp;<a href="${prev}">← Anterior</a>`:''}
  ${next?`&nbsp;·&nbsp;<a href="${next}">Siguiente →</a>`:''}
  &nbsp;·&nbsp;<a href="javascript:window.print()">⬇ PDF</a>
</div>
</body></html>`;
}

// ── DATA IDEAS #4–20 ─────────────────────────────────────────────────────────
const RANKING2 = [

// #4
{slug:'agente-ia-empresarial', nombre:'Agente IA Empresarial Personalizado', categoria:'Agentes Autónomos',
ticket:399, mvp_meses:4, validado:'USA · España',
tagline:'El ChatGPT privado de la empresa: entrenado con sus documentos, políticas y procesos. Sin filtros genéricos.',
propuesta_valor:'Un agente IA entrenado específicamente con el conocimiento de cada empresa — manuales, contratos, catálogos, FAQs — que cualquier empleado puede consultar por WhatsApp o web en segundos.',
intro:['El Agente IA Empresarial Personalizado ocupa el puesto #4 del ranking porque ataca uno de los problemas más universales de las PYMEs en crecimiento: el conocimiento está en la cabeza de pocas personas y transferirlo consume tiempo y dinero todos los días.','Cada empresa tiene información crítica dispersa en PDFs, emails, WhatsApps, carpetas de Google Drive y la memoria de sus empleados más antiguos. Cuando alguien nuevo entra, o cuando el experto está de vacaciones, ese conocimiento se bloquea. Este agente lo democratiza.','El modelo de retención es excepcional: una vez que el agente está entrenado con el conocimiento de la empresa, el costo de cambiarse a otro proveedor es muy alto. Es el producto con mayor defensibilidad natural del portafolio.'],
problema:['En toda PYME de 20+ empleados existe el mismo problema: hay 2-3 personas que "saben todo" y el resto pierde horas al día preguntándoles. "¿Cuál es el descuento máximo que puedo dar?", "¿Cuáles son los plazos de garantía del producto X?", "¿Cómo se llena el formulario de devolución?"','El costo de este problema es invisible pero enorme. Un empleado que interrumpe a un experto 8 veces al día, cada interrupción cuesta 15 minutos de la persona interrumpida = 2 horas/día de tiempo senior perdido en consultas básicas. En una empresa de 50 personas, eso son $15-20K mensuales de productividad perdida.','Las soluciones existentes (wikis, manuales, sistemas de gestión del conocimiento) fracasan porque requieren que alguien las mantenga actualizadas. Nadie lo hace. El agente IA se actualiza alimentándolo con nuevos documentos.'],
solucion:['El Agente IA Empresarial usa Claude API con RAG (Retrieval Augmented Generation) sobre los documentos de la empresa. La implementación toma 2-4 semanas: el cliente sube sus documentos, el sistema los indexa, y el agente queda disponible por WhatsApp Business API y por interfaz web.','El agente responde preguntas en lenguaje natural, cita la fuente exacta de la información ("según el Manual de Ventas, sección 3.2"), y escala al humano cuando no tiene la respuesta o cuando la consulta requiere decisión humana.','La clave de diferenciación es que el agente habla en el tono y el vocabulario de la empresa, conoce sus productos, precios, políticas y procesos. No es un chatbot genérico — es un empleado virtual que conoce la empresa tan bien como el más antiguo de sus trabajadores.'],
mercado:{tam:'$6.1B',sam:'$320M',cagr:'28% anual',clientes_est:'+65.000 PYMEs de 20+ empleados en LATAM',
segmento:'Empresas de distribución, retail con múltiples sucursales, constructoras, empresas de servicios con equipos de campo y empresas de manufactura con procesos complejos.',
analisis:['El mercado de enterprise AI assistants creció un 180% en 2023-2024 según Gartner. Herramientas como Guru, Notion AI y Confluence AI demuestran que el mercado paga bien por gestión del conocimiento inteligente.','En LATAM, el gap es enorme: estas herramientas son en inglés, costosas para PYMEs ($30-50 por usuario/mes) y no tienen integración nativa con WhatsApp como canal de consulta principal.','El timing es ideal con los modelos RAG de 2025-2026: la calidad de las respuestas contextualizadas con documentos propios de la empresa alcanzó un nivel que realmente reemplaza al experto humano en consultas rutinarias.']},
criterios:[
{s:8,n:'Mercado de $6.1B global. En LATAM, 65.000 PYMEs son clientes naturales con alto ticket.'},
{s:9,n:'No existe solución de calidad en español con WhatsApp nativo y precio PYME. Guru y Notion son demasiado caros.'},
{s:7,n:'MVP en 4 meses: RAG pipeline con Claude + WhatsApp + interfaz de upload de documentos.'},
{s:8,n:'Primer revenue en mes 2 del proyecto si se cierra cliente piloto durante el desarrollo.'},
{s:9,n:'Con 60 clientes a $399/mes = $23.940 MRR. Escalable con margen alto.'},
{s:9,n:'Cada nuevo cliente entrena su propio agente. Costo marginal cercano a cero.'},
{s:8,n:'El equipo entiende tanto el proceso de ventas B2B como la tecnología Claude API para construirlo.'},
{s:8,n:'Dependencia de Claude API pero el conocimiento de la empresa queda en nuestra plataforma. Riesgo acotado.'},
{s:10,n:'Una vez entrenado con el conocimiento de la empresa, el costo de cambiarse es muy alto. Mejor moat del portafolio.'},
{s:9,n:'ROI cuantificable: si ahorra 2 horas/día del tiempo de expertos internos, se paga en días.'},
{s:9,n:'Alta WTP: las empresas pagan bien por no perder tiempo de sus expertos. El ROI es de 5-10x el precio.'},
{s:7,n:'CAC moderado: requiere demostración del valor, onboarding de 2 semanas. Ciclo de venta de 2-4 semanas.'},
{s:10,n:'Retención casi perfecta: el conocimiento de la empresa queda capturado en el sistema. Churn < 3% mensual esperado.'},
{s:5,n:'Viral bajo: el agente es interno, los empleados no lo muestran a clientes. El CEO puede recomendar a su red.'},
{s:8,n:'El equipo tiene el fit técnico (Claude API) y comercial (ventas B2B) para ejecutarlo.'}
],
foda:{
f:[{t:'Conocimiento único de cada empresa',d:'El agente entrenado con documentos propietarios es imposible de replicar por un competidor genérico. Cada implementación es única.'},
{t:'WhatsApp como canal de consulta',d:'Los empleados ya usan WhatsApp todo el día. No hay que instalar nada ni cambiar hábitos. El agente llega al canal donde están.'},
{t:'Moat de datos excepcional',d:'Una vez que la empresa sube sus documentos y el equipo empieza a usarlo, el costo de migración a otro sistema es altísimo.'},
{t:'ROI clarísimo y cuantificable',d:'El cliente puede medir exactamente cuántas consultas al experto interno se redujeron y multiplicar por el costo/hora.'}],
o:[{t:'Crecimiento explosivo del knowledge management con IA',d:'El mercado de enterprise AI assistants crece al 28% anual. Estamos al inicio del ciclo de adopción masiva.'},
{t:'Expansión horizontal por empresa',d:'Una vez dentro de una empresa, la expansión natural es departamento por departamento. Un cliente se convierte en múltiples contratos.'},
{t:'Distribución B2B2B',d:'Consultoras de procesos y RR.HH. pueden revender el agente a sus clientes como parte de proyectos de mejora organizacional.'},
{t:'Sectores con alta regulación como mercado primario',d:'Farma, legal, financiero y construcción tienen documentación regulatoria compleja que los empleados necesitan consultar constantemente. WTP altísima.'}],
d:[{t:'Onboarding intensivo inicial',d:'La implementación de 2-4 semanas requiere tiempo del equipo del cliente para organizar y subir documentos. Algunos no lo harán bien.'},
{t:'Calidad del conocimiento de entrada',d:'Si los documentos de la empresa están desactualizados o mal estructurados, el agente dará respuestas incorrectas. Garbage in, garbage out.'},
{t:'Resistencia al cambio organizacional',d:'Los "expertos internos" pueden resistir el agente porque perciben que su rol se reduce. Hay que gestionar el cambio culturalmente.'},
{t:'Ciclo de venta largo',d:'Decisiones de compra que afectan a toda la empresa involucran a más stakeholders. El ciclo puede extenderse a 4-8 semanas.'}],
a:[{t:'Microsoft Copilot Enterprise',d:'Microsoft está integrando Copilot en Teams, SharePoint y Outlook. Las empresas con ecosistema Microsoft pueden encontrar la solución ahí.'},
{t:'Google Workspace AI',d:'Google Notebook LM y las integraciones de Gemini en Google Workspace apuntan al mismo caso de uso para empresas con Google como plataforma.'},
{t:'Chatbots de bajo costo',d:'Muchas empresas intentarán hacer esto internamente con ChatGPT o con soluciones de $50/mes. La diferencia de calidad y soporte es el argumento.'},
{t:'Crecimiento de modelos LLM in-house',d:'A medida que los LLMs se vuelven más accesibles, algunas empresas querrán correr sus propios modelos sin dependencia de APIs externas.'}]
},
gtm:[
{fase:'Fase 1 — Implementaciones piloto con demostración de ROI',periodo:'Mes 1-4',
desc:'Conseguir 5 empresas piloto en sectores con alta documentación interna: distribuidoras, constructoras o empresas de manufactura. La demo es un agente entrenado con los documentos del propio prospecto en 48 horas. El ROI se mide en la primera semana.',
canales:['Prospección directa a CEOs y gerentes de operaciones en sectores intensivos en documentación','Red de contactos de empresas B2B del equipo en Argentina y Uruguay','Demo live: entrenamos el agente con un manual del cliente en tiempo real durante la reunión'],
kpis:['5 pilotos pagados a $399/mes','ROI documentado en al menos 3 casos','MRR: $1.995']},
{fase:'Fase 2 — Expansión por referencia vertical',periodo:'Mes 5-8',
desc:'Con 5 casos de éxito documentados, atacar verticales específicos donde el pain es mayor: farma (regulación compleja), legal (contratos y jurisprudencia), construcción (normas técnicas). En cada vertical, 1 cliente referencia abre la puerta a 10 más.',
canales:['Cámaras empresariales y asociaciones de industria por vertical','LinkedIn content: "Cómo [empresa X] redujo en 70% las consultas internas con IA"','Partners: consultoras de procesos y estudios de organización que implementan el agente en sus clientes'],
kpis:['25 clientes activos en 3 verticales','MRR: $9.975','Churn mensual < 3%']},
{fase:'Fase 3 — Enterprise y expansión geográfica',periodo:'Mes 9-12',
desc:'Subir el ticket con features enterprise: analytics de uso, integración con HRMS y ERP, gestión de permisos por departamento, versión en portugués para Brasil.',
canales:['Alianzas con ERP vendors (SAP Business One, Odoo, Bsale) como canal de distribución','Expansión a México y Chile con resellers locales','Eventos de transformación digital como canal de leads enterprise'],
kpis:['50 clientes activos','MRR: $19.950','2 contratos enterprise > $1.500/mes']}
],
tech:[
{capa:'LLM',nombre:'Claude 3.5 Sonnet',razon:'200K de contexto y mejor comprensión de documentos técnicos complejos en español. Sin rival para RAG de calidad.'},
{capa:'Vector DB',nombre:'Supabase pgvector',razon:'Vector embeddings dentro de Supabase elimina la necesidad de un servicio separado. Simple, costo bajo, integración nativa.'},
{capa:'Embeddings',nombre:'OpenAI text-embedding-3-small',razon:'Excelente relación costo/calidad para indexar documentos. Alternativa: Voyage AI con embeddings multilingüe optimizados.'},
{capa:'WhatsApp',nombre:'WhatsApp Business API (Meta Cloud)',razon:'Canal de consulta principal para empleados de campo y sin acceso a computadora durante el trabajo.'},
{capa:'Frontend',nombre:'Next.js + Vercel',razon:'Panel de administración para upload de documentos, gestión de permisos y analytics de consultas más frecuentes.'}
],
precios:[
{plan:'PYME',precio:'$199',para:'Empresas de 10-30 empleados',incluye:['500MB de documentos','WhatsApp + Web','5 usuarios administradores','Soporte en horario laboral','Actualizaciones mensuales de documentos']},
{plan:'Business',precio:'$399',para:'Empresas de 30-150 empleados',incluye:['5GB de documentos','WhatsApp + Web + API','Usuarios ilimitados','Analytics de consultas','Integraciones básicas (Drive, Dropbox)','Soporte prioritario']},
{plan:'Enterprise',precio:'$999',para:'Empresas de 150+ empleados',incluye:['Almacenamiento ilimitado','Todos los canales','SSO y gestión de permisos por departamento','Integración ERP y HRMS','SLA 99.9%','Customer Success dedicado']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:5,mrr:1995,nota:'Pilotos en constructoras y distribuidoras.'},
{q:'Q2 (Mes 4-6)',cli:20,mrr:7980,nota:'Expansión vertical. Primeros referidos.'},
{q:'Q3 (Mes 7-9)',cli:40,mrr:15960,nota:'Verticales farma y legal. Partners.'},
{q:'Q4 (Mes 10-12)',cli:65,mrr:25935,nota:'Enterprise. Brasil. Contratos anuales.'}
],
payback:'Break-even en mes 6. Contratos anuales aceleran el cash flow.',
roadmap:[
{p:'Mes 1-3',titulo:'MVP RAG + WhatsApp',h:['Pipeline de ingesta de documentos: PDF, DOCX, Excel, Google Docs','Integración RAG con Claude y pgvector en Supabase','WhatsApp Bot conectado al agente + interfaz web básica'],kpi:'5 clientes piloto. Calidad de respuestas > 85% satisfacción.'},
{p:'Mes 4-6',titulo:'Producto pagado y primeros clientes',h:['Panel de administración: upload, gestión de documentos, analytics básico','Sistema de escalado al humano cuando el agente no tiene respuesta','Onboarding guiado de 2 semanas con soporte del equipo'],kpi:'20 clientes, MRR $7.980'},
{p:'Mes 7-9',titulo:'Verticales y partners',h:['Templates de onboarding por vertical (distribución, farma, construcción, legal)','Programa de partners con consultoras de procesos','Analytics avanzado: consultas más frecuentes, gaps de conocimiento identificados'],kpi:'40 clientes, MRR $15.960'},
{p:'Mes 10-12',titulo:'Enterprise y escala',h:['Features enterprise: SSO, permisos por departamento, auditoría de consultas','Integración con Google Drive y SharePoint para sincronización automática de documentos','Versión beta en portugués para clientes en Brasil'],kpi:'65 clientes, MRR $25.935'}
],
competidores:[
{nombre:'Microsoft Copilot',f:'Integración nativa con Office 365 y Teams. Ecosistema masivo.',d:'Requiere Microsoft 365 Enterprise. Sin WhatsApp nativo. Costoso para PYMEs LATAM.',g:'Precio 80% menor + WhatsApp como canal + sin requerir ecosistema Microsoft = ganamos en PYMEs que no son Microsoft-first'},
{nombre:'Guru / Confluence AI',f:'Herramientas maduras con mucha funcionalidad de wiki y knowledge base',d:'Sin WhatsApp, en inglés, $20-30/usuario/mes = $2.000-6.000/mes para empresa de 100 personas',g:'WhatsApp nativo + precio fijo low-cost + en español + onboarding asistido en LATAM'},
{nombre:'Chatbot interno con ChatGPT',f:'Fácil de intentar. Cero costo inicial con cuentas gratuitas.',d:'Sin RAG real sobre documentos propios. Sin WhatsApp API. Sin soporte. Sin actualización automática de documentos.',g:'Calidad de respuestas sobre documentos propios es 10x mejor con RAG real + soporte y onboarding + WhatsApp integrado'}
],
riesgos:[
{r:'Baja calidad de documentos de entrada del cliente',prob:'Alta',imp:'Medio',m:'Proceso de auditoría de documentos previo al onboarding. Checklist de calidad mínima requerida. Fee de onboarding para ayudar a organizar documentos.'},
{r:'Microsoft o Google incluyen el feature en sus suites',prob:'Media',imp:'Alto',m:'Apuntar a PYMEs que no son Microsoft-first. Diferencial de WhatsApp como canal. Precio y soporte local.'},
{r:'Resistencia del "experto interno" a perder relevancia',prob:'Media',imp:'Medio',m:'Posicionar el agente como herramienta para liberar al experto de consultas repetitivas, no como reemplazo. El experto entrena al agente.'},
{r:'Breach de datos de documentos confidenciales',prob:'Baja',imp:'Alto',m:'Arquitectura multi-tenant con aislamiento total. Política clara de no usar datos de clientes para entrenar modelos. SOC 2 en roadmap.'}
],
conclusion:['El Agente IA Empresarial es el producto con el mejor ratio de defensibilidad del portafolio. Una vez que el conocimiento de la empresa está capturado en el sistema, el cliente no se va. Eso convierte a cada cliente ganado en un activo recurrente casi permanente.','El desafío principal es el onboarding: conseguir que el cliente organice y suba sus documentos requiere acompañamiento activo. El modelo de implementación asistida (cobrar un fee de setup de $500-1.000) no solo genera cash adicional sino que garantiza una implementación de calidad que retiene al cliente.','La oportunidad de expansión hacia sectores altamente regulados (farma, legal, financiero) donde los documentos son críticos y el riesgo de error humano es alto es la estrategia para subir el ticket promedio a $800-1.200/mes y construir un negocio de $500K MRR+ en 24 meses.'],
primer_paso:'Esta semana: elegir 1 empresa del network con más de 20 empleados y documentación interna compleja. Pedir 5 documentos (manual de ventas, catálogo de productos, FAQ, política de garantías, lista de precios). Construir un agente RAG básico en 48 horas con Claude API y hacerle 20 preguntas que un empleado nuevo haría. Grabar el video. Usar ese video como el pitch principal del producto.'
},

// #5
{slug:'meeting-intelligence-latam', nombre:'Meeting Intelligence IA LATAM', categoria:'Productividad IA',
ticket:249, mvp_meses:3, validado:'USA (Gong, Chorus)',
tagline:'Transcripción, resumen e insights de cada reunión en español. El Gong de LATAM al precio de una PYME.',
propuesta_valor:'Transcribir, resumir y extraer action items de cada reunión de ventas en español con IA, generando insights sobre qué conversaciones cierran más y por qué — al 10% del precio de Gong.',
intro:['Meeting Intelligence IA LATAM ocupa el #5 del ranking porque valida un modelo de negocio multimillonario (Gong $7.2B, Chorus $575M adquirida por ZoomInfo) y lo traduce a un precio y formato accesible para las PYMEs de LATAM donde nadie ha llegado todavía.','El problema de reuniones no documentadas es universal: toda reunión importante genera compromisos, decisiones y next steps que se pierden si nadie los escribe. Los vendedores que sí los documentan sistemáticamente cierran 40% más.','La oportunidad en LATAM es enorme: el español fragmentado en múltiples dialectos (argentino, mexicano, colombiano) significa que las soluciones americanas no funcionan bien. El primer player con calidad real en español de LATAM tiene una ventaja de 18-24 meses.'],
problema:['Después de cada reunión de ventas, los vendedores deberían registrar en el CRM: ¿qué se discutió?, ¿qué compromisos se asumieron?, ¿cuáles son los next steps? En la práctica, menos del 30% de los vendedores lo hacen de forma completa y consistente.','El resultado: los managers no saben realmente qué pasa en las reuniones de sus equipos, los deals se pierden por falta de seguimiento, y el coaching de ventas es imposible porque no hay datos objetivos de qué conversaciones son más efectivas.','Para las empresas medianas en LATAM, Gong ($100+/usuario/mes) es inalcanzable. Un equipo de 10 vendedores costaría $1.000/mes mínimo, más la suscripción a Zoom o Teams. El mercado PYME quedó sin solución.'],
solucion:['El sistema graba o recibe el audio de cada reunión (Zoom, Teams, Google Meet, o audio directo desde WhatsApp), lo transcribe con Whisper optimizado para español de LATAM, y usa Claude para generar: resumen ejecutivo, action items por persona, objeciones identificadas, y señales de compra o riesgo detectadas.','El insight de ventas es el diferenciador: el sistema aprende qué frases, temas y comportamientos en las reuniones correlacionan con deals ganados vs perdidos en esa empresa específica. Es un coach de ventas que aprende de los datos reales del equipo.','Todo llega automáticamente al CRM (HubSpot, Pipedrive, Salesforce) como nota de la reunión. El vendedor sale de la reunión y el CRM ya está actualizado. Cero trabajo administrativo.'],
mercado:{tam:'$7.2B',sam:'$290M',cagr:'19% anual',clientes_est:'+48.000 equipos de ventas B2B en LATAM',
segmento:'Equipos de ventas B2B de 5-50 vendedores en empresas de 50-500 empleados. Sectores: SaaS, servicios profesionales, seguros, bienes raíces comercial, tecnología.',
analisis:['Gong y Chorus demostraron que el mercado paga muy bien por inteligencia de reuniones. El problema es que ninguno de los dos está localizado para LATAM — Gong tiene UI en español pero su reconocimiento de voz para español latinoamericano es inferior, y su precio ($1.200+/usuario/año) excluye a las PYMEs.','Whisper de OpenAI revolucionó la transcripción de audio en español en 2023. La calidad de transcripción para español rioplatense, mexicano o colombiano hoy es comparable con el humano. Eso desbloqueó el caso de uso para LATAM.','El CAC de este producto puede ser muy bajo porque el vendedor que usa el producto se convierte en el mejor evangelizador: sus reuniones están documentadas, su CRM está actualizado solo, y sus métricas de ventas mejoran visiblemente.']},
criterios:[
{s:8,n:'Gong se valuó en $7.2B. En LATAM el mercado equivalente es $290M sin competidor de calidad.'},
{s:9,n:'No existe alternativa en español con calidad de transcripción real y precio PYME. Gong es 10x más caro.'},
{s:8,n:'MVP en 3 meses: Whisper API + Claude + integración básica con Zoom/Meet + CRM.'},
{s:8,n:'Demo instantánea: grabar la propia reunión de ventas y mostrar el output en tiempo real al prospecto.'},
{s:8,n:'100 clientes x $249/mes = $24.900 MRR. Target razonable en 9 meses.'},
{s:9,n:'El análisis de reuniones mejora con escala: más datos = mejores insights = mayor retención.'},
{s:8,n:'El equipo hace reuniones de ventas todos los días. Son los primeros y más naturales usuarios del producto.'},
{s:7,n:'Dependencia de Whisper API (OpenAI) y Claude API. Riesgo moderado de cambio de precios.'},
{s:8,n:'Los datos de reuniones acumulados por empresa crean moat: benchmark interno del equipo es único.'},
{s:9,n:'ROI cuantificable: si el vendedor cierra 1 deal más por mes por mejor seguimiento, se paga 5-10x.'},
{s:8,n:'$249/mes es barato vs $1.200+/año de Gong. WTP alta dado el diferencial de precio.'},
{s:8,n:'CAC bajo: el vendedor puede ser el champion interno que convence al gerente. Bottom-up adoption.'},
{s:8,n:'Alta retención si el equipo integra la herramienta en el proceso de ventas. El CRM actualizado es hábito.'},
{s:7,n:'Viral moderado: los deals ganados se atribuyen visiblemente al mejor seguimiento. Referidos entre gerentes de ventas.'},
{s:8,n:'El equipo hace ventas B2B y entiende el workflow. Pueden construir y usar el producto a la vez.'}
],
foda:{
f:[{t:'Whisper + Claude = calidad real en español LATAM',d:'Whisper reconoce los dialectos latinoamericanos con >95% de accuracy. Claude resume y extrae insights mejor que cualquier modelo alternativo.'},
{t:'Precio 10x menor que Gong',d:'$249/mes vs $1.200+/usuario/año hace que sea accesible para cualquier equipo de ventas con 5+ vendedores.'},
{t:'Demo es el propio caso de uso',d:'Grabar la reunión de ventas con el prospecto y mostrarle el resumen generado en tiempo real es la mejor demostración posible.'},
{t:'Integración CRM = hábito obligatorio',d:'Una vez que el CRM se actualiza solo con cada reunión, el vendedor no quiere volver a hacerlo manual.'}],
o:[{t:'Boom de trabajo remoto consolidado',d:'Las reuniones por video en LATAM se multiplicaron 10x post-COVID y nunca volvieron al nivel pre-2020. Más reuniones = mayor necesidad de documentación.'},
{t:'WhatsApp como canal de reuniones',d:'Muchas reuniones de ventas en LATAM ocurren por WhatsApp Voice. Integrar transcripción de WhatsApp es un diferenciador único no replicable por Gong.'},
{t:'Gerentes de ventas como champions',d:'El gerente de ventas que puede ver el análisis de todas las reuniones de su equipo tiene visibilidad sin precedentes. Se convierte en el campeón interno.'},
{t:'Coaching de ventas basado en datos',d:'El módulo de coaching que muestra qué conversaciones correlacionan con cierre puede convertirse en el producto más valioso a mediano plazo.'}],
d:[{t:'Privacidad de las conversaciones',d:'Grabar reuniones de ventas puede generar fricción legal o de confianza. Necesita consentimiento explícito de todos los participantes y política de privacidad robusta.'},
{t:'Integración técnica con plataformas de video',d:'Cada plataforma (Zoom, Teams, Meet) tiene su propia API y restricciones. El mantenimiento de integraciones puede ser costoso.'},
{t:'Tiempo de procesamiento del audio',d:'Transcribir y analizar una reunión de 60 minutos toma varios minutos. El resumen no es instantáneo — hay que gestionar esa espera.'},
{t:'Dependencia de calidad del audio',d:'Audio de baja calidad (WiFi inestable, ruido de fondo) degrada la transcripción. En LATAM, la calidad de internet variable es una realidad.'}],
a:[{t:'Gong entrando a LATAM con precio reducido',d:'Si Gong lanza un tier de precio reducido para LATAM con mejor español, su infraestructura existente puede superarnos.'},
{t:'Zoom y Teams con AI nativa',d:'Zoom AI Companion y Microsoft Copilot for Teams ofrecen transcripción y resumen nativo. Si mejoran su español, reducen el diferencial.'},
{t:'Otter.ai y Fireflies con localización',d:'Estas herramientas ya tienen transcripción de reuniones a bajo precio. Si mejoran su análisis para ventas y su español, son competidores directos.'},
{t:'Regulación de grabación en LATAM',d:'Las leyes de protección de datos (LGPD en Brasil, Ley 25.326 en Argentina) requieren consentimiento explícito para grabar. Compliance es clave.'}]
},
gtm:[
{fase:'Fase 1 — Gerentes de ventas como entry point',periodo:'Mes 1-3',
desc:'Los gerentes de ventas son el buyer más natural: quieren visibilidad sobre las reuniones de su equipo sin el costo de Gong. Prospección directa a VP Sales y Gerentes Comerciales de empresas con equipos de 5-20 vendedores.',
canales:['LinkedIn outreach a VPs de Ventas y Gerentes Comerciales en Argentina, Uruguay, Chile','Demo: grabar la reunión de prospección y entregar el análisis al gerente al final — el producto demuestra su valor durante la propia venta','Comunidades de managers de ventas en WhatsApp y Telegram'],
kpis:['20 clientes activos (equipos de 5-10 vendedores)','MRR: $4.980','NPS > 55']},
{fase:'Fase 2 — Expansión por equipo',periodo:'Mes 4-7',
desc:'Una vez que el gerente está convencido, expandir a todo el equipo de ventas. El modelo de pricing por seat incentiva la expansión. El módulo de coaching — qué conversaciones cierran más — activa la demanda desde los vendedores individuales.',
canales:['Upsell inside: plan por seat para equipos grandes','Contenido sobre coaching de ventas basado en datos en LinkedIn y podcasts de ventas','Alianzas con consultoras de ventas que coachen usando los datos de la plataforma'],
kpis:['60 clientes activos','MRR: $14.940','ACV promedio: $2.988 (upside de seats)']},
{fase:'Fase 3 — Integración y moat de datos',periodo:'Mes 8-12',
desc:'Integraciones profundas con los CRMs más usados en LATAM. Módulo de benchmarking: cómo le va al equipo vs el promedio de la industria (anonimizado). Expansión a México y Colombia.',
canales:['Marketplace de HubSpot y Pipedrive','Webinars para comunidades de ventas LATAM','Partnership con bootcamps de ventas para entrenar vendedores con el tool'],
kpis:['100 clientes activos','MRR: $24.900','Expansión a México con 10 primeros clientes']}
],
tech:[
{capa:'Transcripción',nombre:'OpenAI Whisper (large-v3)',razon:'Mejor calidad en español latinoamericano. Optimizar con fine-tuning en dialectos regionales a mediano plazo.'},
{capa:'LLM Análisis',nombre:'Claude 3.5 Sonnet',razon:'Análisis de conversaciones largas (context 200K), extracción de insights de ventas, generación de resúmenes ejecutivos de alta calidad.'},
{capa:'Grabación',nombre:'Recall.ai SDK',razon:'Bot de grabación para Zoom, Teams y Google Meet sin requerir instalación en el cliente. APIs unificadas para todas las plataformas.'},
{capa:'CRM',nombre:'HubSpot API + Pipedrive API',razon:'Sincronización automática de notas de reunión al deal correspondiente en el CRM.'},
{capa:'Storage',nombre:'AWS S3 + Supabase',razon:'S3 para audio y transcripciones crudas. Supabase para metadatos estructurados y búsqueda de reuniones.'}
],
precios:[
{plan:'Starter',precio:'$99',para:'1-3 vendedores o founder solo',incluye:['20 reuniones/mes','Transcripción + resumen + action items','Integración 1 CRM','Acceso web + email automático post-reunión']},
{plan:'Team',precio:'$249',para:'Equipos de 4-15 vendedores',incluye:['Reuniones ilimitadas','Análisis de insights: qué convierte','Dashboard de gerente de ventas','Integraciones: HubSpot, Pipedrive, Salesforce','5 usuarios incluidos — $29/usuario adicional']},
{plan:'Sales Org',precio:'$599',para:'Equipos de 15+ vendedores',incluye:['Todo ilimitado','Módulo de coaching con recomendaciones por vendedor','Benchmarking del equipo','Usuarios ilimitados','API de integración propia','Customer Success Manager']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:20,mrr:4980,nota:'Gerentes de ventas pioneros. Teams de 5-10 personas.'},
{q:'Q2 (Mes 4-6)',cli:50,mrr:12450,nota:'Expansión por equipo. Upsell seats.'},
{q:'Q3 (Mes 7-9)',cli:80,mrr:19920,nota:'Integraciones CRM como driver. México.'},
{q:'Q4 (Mes 10-12)',cli:115,mrr:28635,nota:'Colombia. Coaching module. Planes anuales.'}
],
payback:'Break-even en mes 5. Modelo de seats genera expansión orgánica dentro del cliente.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP transcripción + resumen',h:['Integración Recall.ai para grabar Zoom y Meet','Whisper transcripción + Claude resumen y action items','Envío automático por email post-reunión + integración HubSpot básica'],kpi:'10 reuniones grabadas y analizadas con calidad validada'},
{p:'Mes 3-4',titulo:'Dashboard gerente',h:['Dashboard de manager: todas las reuniones del equipo visibles','Módulo básico de insights: topics más discutidos, objeciones frecuentes','Integración Pipedrive y Salesforce'],kpi:'20 clientes, MRR $4.980'},
{p:'Mes 5-8',titulo:'Coaching e insights de ventas',h:['Correlación automática: reuniones que cierran vs las que no','Recomendaciones de coaching por vendedor basadas en datos','WhatsApp transcripción para reuniones por audio móvil'],kpi:'80 clientes, MRR $19.920'},
{p:'Mes 9-12',titulo:'Expansión y moat',h:['Benchmarking industria: ¿cómo te va vs equipos similares?','Expansión México y Colombia con resellers locales','Plan anual con descuento del 20% para anclar LTV'],kpi:'115 clientes, MRR $28.635'}
],
competidores:[
{nombre:'Gong',f:'Líder del mercado con $7.2B valuación y el producto más completo del mundo',d:'Precio exclusivo de enterprise ($100+/usuario/mes), español de baja calidad, sin WhatsApp, sin soporte local',g:'1/10 del precio + español latinoamericano real + WhatsApp nativo + soporte local = ganamos el 95% del mercado PYME de LATAM que Gong no atiende'},
{nombre:'Otter.ai / Fireflies',f:'Transcripción buena, precio bajo, producto simple y rápido',d:'Sin análisis de ventas, sin integración profunda de CRM, sin insights de coaching, sin español latinoamericano optimizado',g:'Análisis de ventas avanzado + coaching module + CRM sync = no somos transcripción, somos inteligencia de ventas'},
{nombre:'Zoom AI Companion / Teams Copilot',f:'Integrado nativamente en la plataforma, sin costo adicional para usuarios existentes',d:'Análisis genérico, sin contexto de ventas, sin CRM sync automático, sin insights de equipo',g:'Especialización en ventas + CRM sync + insights cruzados del equipo = somos el copiloto de ventas, no el asistente genérico de reuniones'}
],
riesgos:[
{r:'Zoom o Teams mejoran drásticamente su transcripción en español',prob:'Media',imp:'Alto',m:'Especialización profunda en análisis de ventas — el diferencial no es la transcripción sino los insights. Moat en datos acumulados de conversaciones.'},
{r:'Consentimiento legal de grabación en cada país de LATAM',prob:'Alta',imp:'Alto',m:'Bot de grabación que solicita consentimiento explícito a todos los participantes. Política de privacidad por país. Compliance como feature de venta.'},
{r:'Calidad de audio variable en LATAM',prob:'Alta',imp:'Medio',m:'Pre-procesamiento de audio con noise reduction antes de Whisper. Advertencia al usuario cuando la calidad es insuficiente.'},
{r:'Churn si el equipo no adopta la herramienta masivamente',prob:'Media',imp:'Alto',m:'Onboarding activo de 4 semanas. La adopción individual (no solo del manager) es el KPI de retención más importante.'}
],
conclusion:['Meeting Intelligence IA LATAM tiene un mercado validado por Gong y Chorus a nivel global y un espacio totalmente abierto en LATAM. La combinación de Whisper + Claude + precio 10x menor es la ecuación para ganar este mercado.','El diferencial sostenible no es la transcripción (que es una commodity) sino los insights de ventas: qué temas se discuten en las reuniones que cierran vs las que no, cuáles son las objeciones más frecuentes por industria, qué vendedores mejoran más rápido cuando se les hace coaching basado en datos. Eso es el valor que Gong vende a $100/usuario/mes y que nosotros podemos ofrecer a $25/usuario/mes.','La estrategia de entrada bottom-up (el vendedor individual lo adopta, luego el manager ve el valor, luego se expande a todo el equipo) es la más probada en esta categoría y la que genera los NRR (Net Revenue Retention) más altos.'],
primer_paso:'Esta semana: grabar la próxima reunión de ventas con OBS o Zoom local. Procesar el audio con Whisper (hay scripts gratuitos en GitHub). Pasarle la transcripción a Claude con el prompt: "Eres un coach de ventas experto. Analiza esta transcripción y genera: 1) resumen de 5 líneas, 2) action items por persona, 3) objeciones identificadas, 4) señales positivas y negativas de compra". Compartir el resultado con el equipo como prueba del concepto.'
},

// #6
{slug:'atencion-cliente-whatsapp', nombre:'Atención al Cliente WhatsApp IA', categoria:'Customer Success IA',
ticket:299, mvp_meses:3, validado:'LATAM (múltiples países)',
tagline:'El agente IA que responde el 80% de las consultas de tus clientes por WhatsApp — 24/7, en segundos, sin error.',
propuesta_valor:'Automatizar el 80% de la atención al cliente por WhatsApp con IA, reduciendo el tiempo de respuesta de horas a segundos y liberando al equipo humano para los casos que realmente importan.',
intro:['Atención al Cliente WhatsApp IA ocupa el #6 del ranking porque es el caso de uso más inmediato y más fácil de entender para cualquier empresa en LATAM. Si tu empresa tiene clientes que mandan mensajes por WhatsApp (todas la tienen), este producto te interesa.','El mercado LATAM es único: el 85%+ de la comunicación B2C de servicio ocurre por WhatsApp, no por email ni por formularios web. Eso significa que la empresa que resuelva el problema de escalar la atención por WhatsApp tiene acceso a un mercado infinito.','La oportunidad es inmediata: el equipo puede vender este producto a cualquier e-commerce, tienda con delivery, hotel, clínica, academia o empresa de servicios que tenga un WhatsApp de atención al cliente saturado.'],
problema:['El WhatsApp de atención de una empresa mediana recibe entre 50-500 mensajes por día. Sin automatización, esto requiere 2-8 personas respondiendo en turnos. El tiempo de respuesta es de horas, los clientes se frustran, y los empleados de atención hacen exactamente las mismas preguntas una y otra vez.','El 80% de las consultas son repetitivas: "¿tienen el producto X en stock?", "¿cuándo llega mi pedido?", "¿cuál es el horario?", "¿cómo hago una devolución?". Un agente IA puede resolver este 80% perfectamente, liberando al humano para el 20% complejo.','Los chatbots actuales son el problema: los menús de opciones (Oprima 1 para...) frustran a los usuarios. Los clientes quieren respuestas en lenguaje natural, no navegar árboles de decisión.'],
solucion:['El Agente de Atención al Cliente usa WhatsApp Business API + Claude para responder en lenguaje natural a las preguntas frecuentes del negocio. El cliente configura la base de conocimiento: catálogo de productos, precios, horarios, políticas, estado de pedidos conectado al sistema del negocio.','La escalada al humano es automática: cuando el cliente pregunta algo que el agente no puede resolver, o cuando el tono del mensaje indica frustración, el sistema transfiere la conversación a un agente humano con el contexto completo de la conversación.','El diferencial con los chatbots de menús: Claude entiende el lenguaje natural en todos los dialectos latinoamericanos, maneja el contexto de la conversación completa, y responde como si fuera un empleado capacitado — no como un robot que no entiende si la pregunta no es exactamente como fue programada.'],
mercado:{tam:'$12.3B',sam:'$580M',cagr:'24% anual',clientes_est:'+320.000 empresas con WhatsApp Business activo en LATAM',
segmento:'E-commerce, retail con delivery, clínicas y centros médicos, hoteles y turismo, academias y educación, servicios de delivery, empresas de servicios con base de clientes activa.',
analisis:['El mercado de customer service automation es uno de los más grandes del ecosistema SaaS. Zendesk se valuó en $10B, Freshdesk en $3.5B. El canal WhatsApp es el diferenciador para LATAM.','La API oficial de WhatsApp Business creció de 500.000 a 10 millones de números de empresas activas entre 2021 y 2024. La infraestructura está lista — falta el agente IA de calidad que la use bien.','Players como Treble, Respond.io y WATI ofrecen soluciones de automatización pero sin LLM de calidad. Sus chatbots siguen siendo basados en árboles de decisión. La brecha de calidad con Claude es significativa.']},
criterios:[
{s:9,n:'Mercado de $12.3B global. En LATAM, 320.000 empresas son clientes directos. El TAM más grande del portafolio.'},
{s:7,n:'WATI, Treble, Respond.io existen pero sin LLM de calidad. El mercado está fragmentado con soluciones mediocres.'},
{s:8,n:'MVP en 3 meses: WhatsApp Business API + Claude + panel de configuración de FAQ y escalada.'},
{s:8,n:'Demo instantánea: conectar el WhatsApp del cliente al agente en 30 minutos y mostrar cómo responde.'},
{s:9,n:'El TAM masivo permite escalar a miles de clientes. 300 clientes a $299 = $89.700 MRR.'},
{s:9,n:'El agente mejora con cada empresa que se suma: datos de preguntas frecuentes por industria.'},
{s:8,n:'El equipo conoce WhatsApp Business API y el proceso de ventas B2B para llegar a este mercado.'},
{s:6,n:'Dependencia alta de WhatsApp Business API (Meta). Precio y políticas de uso pueden cambiar.'},
{s:7,n:'El moat está en la especialización vertical: agente para e-commerce es diferente al de clínica médica.'},
{s:9,n:'ROI inmediato: 2 personas de atención a $800/mes = $1.600/mes. El agente cuesta $299/mes. ROI del día 1.'},
{s:9,n:'WTP muy alta dado el ROI de 5x. Las empresas entienden este cálculo instantáneamente.'},
{s:8,n:'CAC bajo: la demo en 30 minutos es convincente. Ciclo de venta de 1-2 semanas para PYMEs.'},
{s:8,n:'Alta retención si el agente funciona bien. El cliente no quiere volver a la atención manual.'},
{s:7,n:'Viral moderado: los clientes del cliente reciben atención instantánea y la empresa lo menciona.'},
{s:8,n:'El equipo puede demostrar el ROI a cualquier empresa con un WhatsApp saturado de consultas.'}
],
foda:{
f:[{t:'WhatsApp como canal universal en LATAM',d:'No hay que convencer a nadie de adoptar un canal nuevo. WhatsApp es donde ya están los clientes. Es el único canal de atención que importa en LATAM.'},
{t:'ROI del día 1',d:'Una empresa que paga $1.600/mes en 2 personas de atención ahorra $1.301/mes desde el primer día. El argumento de venta es trivial.'},
{t:'Claude entiende lenguaje natural',d:'Los competidores usan chatbots de árboles de decisión. Claude entiende "quiero pedir lo mismo del jueves pasado" sin que se haya programado esa frase explícitamente.'},
{t:'Demo instantánea de 30 minutos',d:'Conectar el WhatsApp del cliente al agente y mostrar las primeras respuestas toma 30 minutos. No hay otra demostración de SaaS tan rápida de hacer.'}],
o:[{t:'API de WhatsApp creciendo al 40% anual',d:'Meta está invirtiendo fuerte en hacer WhatsApp Business la plataforma de comercio de LATAM. Cada nueva feature de Meta amplía el caso de uso del agente.'},
{t:'Catálogo de productos en WhatsApp',d:'WhatsApp Catalog permite mostrar productos directamente en el chat. El agente puede combinar atención + ventas en el mismo canal.'},
{t:'Vertical de salud como mercado premium',d:'Las clínicas médicas y centros de salud tienen altísima demanda de turnos por WhatsApp. El agente que agenda, confirma y recuerda turnos tiene WTP de $500-1.000/mes.'},
{t:'Pagos por WhatsApp en LATAM',d:'WhatsApp Pay está expandiéndose en LATAM. Un agente que atiende + vende + cobra por WhatsApp es el caso de uso definitivo.'}],
d:[{t:'Configuración inicial compleja para algunos clientes',d:'El cliente necesita estructurar su FAQ, su catálogo y sus políticas para alimentar al agente. Algunos negocios no tienen esto documentado.'},
{t:'Gestión de conversaciones mixtas IA/humano',d:'La transición entre el agente IA y el humano debe ser transparente y fluida. Mala implementación genera frustración del cliente final.'},
{t:'Límites de mensajes de WhatsApp Business API',d:'WhatsApp tiene políticas estrictas sobre frecuencia de mensajes y uso. Violar las políticas puede resultar en bans de cuenta.'},
{t:'Sensibilidad de industrias específicas',d:'En salud y finanzas, dar información incorrecta puede tener consecuencias legales. El agente necesita disclaimers claros y escalada rápida.'}],
a:[{t:'Meta desarrollando herramientas de IA nativas',d:'Meta está construyendo herramientas de IA para WhatsApp Business directamente. Pueden comernos el mercado si lanzan un agente nativo de calidad.'},
{t:'WATI y Treble bajando precios',d:'Los competidores actuales pueden añadir LLM de terceros y reducir su diferencial de precio si sienten la presión competitiva.'},
{t:'Ban masivo de cuentas de WhatsApp',d:'Meta tiene historial de banear cuentas que usan automatización fuera de los términos de uso. Compliance con la API oficial es no negociable.'},
{t:'Commoditización de agentes de WhatsApp',d:'En 2-3 años, cualquier proveedor de chatbot va a tener Claude o GPT integrado. El diferencial debe estar en la vertical y los datos.'}]
},
gtm:[
{fase:'Fase 1 — E-commerce y delivery como early adopters',periodo:'Mes 1-3',
desc:'Los e-commerce y negocios de delivery tienen el dolor más visible: WhatsApp saturado de preguntas sobre pedidos, horarios y stock. La demo conecta el agente al WhatsApp del cliente y en 30 minutos están respondiendo en vivo.',
canales:['Prospección directa en grupos de dueños de e-commerce en WhatsApp y Facebook','Partnerships con plataformas de e-commerce (Tiendanube, WooCommerce, Shopify LATAM) para llegar a su base de clientes','Demo live: conectar el WhatsApp del prospecto en la reunión y mostrar el agente respondiendo sus FAQs reales'],
kpis:['25 clientes de e-commerce y delivery','MRR: $7.475','Tiempo de respuesta promedio del cliente final: < 30 segundos']},
{fase:'Fase 2 — Expansión a salud y educación',periodo:'Mes 4-7',
desc:'Con el modelo probado en e-commerce, expandir a clínicas médicas (turnos, resultados, recordatorios) y academias (inscripciones, horarios, pagos). Estos sectores tienen WhatsApp aún más saturado y mayor WTP.',
canales:['Asociaciones de clínicas y centros médicos','Plataformas de gestión de escuelas (Schoology, Blackboard LATAM) como partners','Google Ads y Meta Ads targeteando dueños de PyMEs en LATAM'],
kpis:['80 clientes en 3 verticales','MRR: $23.920','NPS > 60']},
{fase:'Fase 3 — Escala y expansión',periodo:'Mes 8-12',
desc:'Verticalizarse profundamente en 2 industrias con mejores métricas. Desarrollar plantillas específicas de agente por vertical (clínica, e-commerce, hotel, academia). Escalar con paid acquisition una vez que el CAC es claro.',
canales:['Paid: Meta Ads (irónico pero efectivo para llegar a PYMEs) y Google Ads','Marketplace de Tiendanube y otros e-commerce platforms','Programa de afiliados para agencias de marketing digital que tienen clientes con este pain'],
kpis:['200 clientes activos','MRR: $59.800','Expansión a 3 países adicionales']}
],
tech:[
{capa:'WhatsApp',nombre:'WhatsApp Business API (Meta Cloud API)',razon:'La API oficial evita el riesgo de ban. Entrega de mensajes garantizada y acceso a features premium como catálogos y botones.'},
{capa:'LLM',nombre:'Claude 3.5 Haiku (respuestas rápidas)',razon:'Haiku para respuestas de FAQ comunes (más económico y rápido). Sonnet para casos complejos que requieren razonamiento.'},
{capa:'Knowledge Base',nombre:'Supabase pgvector',razon:'FAQ y documentos del negocio indexados con embeddings para recuperación rápida de información relevante.'},
{capa:'Workflow',nombre:'Node.js + BullMQ',razon:'Cola de mensajes para manejo de conversaciones simultáneas sin pérdida de contexto y con rate limiting para cumplir políticas de WhatsApp.'},
{capa:'Panel Admin',nombre:'Next.js + Vercel',razon:'Dashboard para que el cliente configure FAQ, vea conversaciones en tiempo real, tome control manual de chats y vea analytics de resolución.'}
],
precios:[
{plan:'PYME',precio:'$149',para:'Negocios pequeños con < 200 mensajes/día',incluye:['2.000 mensajes IA/mes','1 número de WhatsApp','FAQ ilimitadas','Escalada manual a humano','Panel básico de conversaciones']},
{plan:'Business',precio:'$299',para:'Negocios con 200-1.000 mensajes/día',incluye:['Mensajes ilimitados','Múltiples agentes configurables','Integración con sistema de pedidos','Analytics de resolución y satisfacción','3 operadores humanos en panel','Integraciones API básicas']},
{plan:'Enterprise',precio:'$699',para:'Operaciones con múltiples WhatsApps',incluye:['Múltiples números de WhatsApp','Usuarios y operadores ilimitados','Integración con ERP/CRM propios','Flujos conversacionales customizados','SLA 99.9%','Customer Success dedicado']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:25,mrr:7475,nota:'E-commerce y delivery en ARG/UY.'},
{q:'Q2 (Mes 4-6)',cli:80,mrr:23920,nota:'Salud y educación. Paid acquisition.'},
{q:'Q3 (Mes 7-9)',cli:150,mrr:44850,nota:'Escala. Partnerships con plataformas e-commerce.'},
{q:'Q4 (Mes 10-12)',cli:250,mrr:74750,nota:'Expansión regional. Planes Enterprise.'}
],
payback:'Break-even en mes 4. Alto volumen de clientes compensa ticket relativamente bajo.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP WhatsApp Agent',h:['WhatsApp Business API + Claude para respuestas de FAQ','Panel de configuración: subir FAQ, definir tono, configurar escalada','Prueba con 5 e-commerces del network'],kpi:'5 pilotos con > 70% de consultas resueltas por IA'},
{p:'Mes 3-4',titulo:'Producto pagado',h:['Lanzamiento a $149 y $299','Analytics: tasa de resolución, tiempo de respuesta, satisfacción','Integraciones básicas: Google Sheets para pedidos, Shopify para stock'],kpi:'25 clientes, MRR $7.475'},
{p:'Mes 5-8',titulo:'Verticales y escala',h:['Templates por vertical: clínica (turnos), academia (inscripciones), hotel (reservas)','Integración con sistemas de reservas (Calendly, Google Calendar)','Paid acquisition con Meta Ads — CAC objetivo < $200'],kpi:'150 clientes, MRR $44.850'},
{p:'Mes 9-12',titulo:'Expansión y enterprise',h:['Expansión a México y Colombia con resellers locales','Plan Enterprise con múltiples números y operadores ilimitados','Marketplace integrations: Tiendanube, MercadoShops, Shopify'],kpi:'250 clientes, MRR $74.750'}
],
competidores:[
{nombre:'WATI',f:'Especializado en WhatsApp Business con buena UX y muchos clientes',d:'Chatbots de árbol de decisión sin LLM real. Respuestas rígidas que no entienden lenguaje natural.',g:'Claude entiende lenguaje natural real = 10x mejor experiencia para el cliente final = menor churn para el negocio'},
{nombre:'Treble.ai',f:'Foco en LATAM, buen marketing, integraciones con CRM',d:'Sin LLM de calidad real. Precio alto para PYMEs. Onboarding complejo.',g:'Setup en 30 minutos vs semanas de Treble + precio 40% menor + calidad de respuesta real con LLM'},
{nombre:'WhatsApp sin automatizar',f:'Cero costo. Control total. Tono humano auténtico.',d:'No escala. 2-8 personas atendiendo. Tiempo de respuesta de horas. Errores humanos.',g:'$299/mes vs $1.600/mes en personal humano. El ROI de 5x se explica en 2 minutos.'}
],
riesgos:[
{r:'Meta cambia precio o políticas de WhatsApp Business API',prob:'Media',imp:'Alto',m:'Contractualizar precios con el cliente a 12 meses para absorber cambios. Construir reservas. Explorar integración con Telegram como alternativa.'},
{r:'Respuestas incorrectas en situaciones críticas (salud, finanzas)',prob:'Media',imp:'Alto',m:'Disclaimers claros en el agente. Escalada automática en topics sensibles. No operar en salud de urgencia sin revisión humana.'},
{r:'Ban de cuenta de WhatsApp por uso indebido',prob:'Baja',imp:'Alto',m:'API oficial únicamente. Rate limiting estricto. Opt-out fácil para clientes finales. Proceso de revisión de cuenta antes de escalar.'},
{r:'Churn si el tasa de resolución IA es baja',prob:'Media',imp:'Alto',m:'Onboarding con configuración de FAQ asistida. KPI de resolución como SLA interno. Si < 60% resolución, intervención proactiva del equipo.'}
],
conclusion:['Atención al Cliente WhatsApp IA tiene el potencial de ser el producto con mayor cantidad de clientes del portafolio porque el mercado direccionable es enorme (320.000 empresas) y el ROI es el más inmediato y fácil de entender de todos los productos.','El desafío es la ejecución en escala: atender a 250 clientes activos requiere un equipo de soporte y onboarding que va más allá de 2 personas. El modelo de resellers y partnerships con plataformas de e-commerce es la clave para escalar sin que el costo de atención se coma el margen.','El camino hacia el enterprise (múltiples números, integraciones con ERP, analytics avanzados) es el diferencial que convierte este producto de una herramienta de $299/mes a una plataforma de $2.000-5.000/mes para grandes retailers y cadenas con múltiples sucursales.'],
primer_paso:'Mañana: elegir 3 empresas conocidas (tienda online, clínica, academia) que tengan WhatsApp de atención saturado. Conectar el WhatsApp al agente con Claude en modo manual primero (copy-paste de mensajes a Claude y devolver la respuesta). Medir: ¿cuántas preguntas puede responder correctamente sin ayuda humana? Si supera el 70%, el producto se vende solo.'
},

// #7
{slug:'nurturing-leads-whatsapp', nombre:'Nurturing de Leads por WhatsApp IA', categoria:'Ventas B2B',
ticket:249, mvp_meses:3, validado:'USA · España',
tagline:'Cada lead caliente recibe seguimiento personalizado por WhatsApp de forma automática — hasta que compra o dice que no.',
propuesta_valor:'Automatizar el nurturing de leads por WhatsApp con IA que personaliza cada mensaje según el comportamiento del lead, manteniéndolo caliente sin que el vendedor tenga que recordarlo manualmente.',
intro:['El Nurturing de Leads por WhatsApp IA ocupa el #7 porque ataca la segunda pérdida más grande del funnel de ventas: los leads que expresan interés inicial pero se "enfrían" porque nadie los siguió a tiempo. En promedio, el 70% de los leads que podrían convertir no lo hacen por falta de seguimiento adecuado.','Este producto es el complemento natural del AI SDR (puesto #1). Mientras el SDR genera y califica los leads, el Nurturing se encarga de mantenerlos calientes y llevarlos al cierre. Son dos productos que se venden juntos naturalmente.','El caso de uso es más simple que el AI SDR y por eso también más fácil de vender: el vendedor ya tiene los leads, ya los calificó, simplemente no tiene tiempo de hacer 15 seguimientos por lead. El sistema lo hace por él.'],
problema:['El timing en ventas es todo. Un lead que visitó el sitio web ayer y descargó un recurso es 9x más probable de comprar que uno que lo hizo hace 7 días. Sin automatización, el vendedor hace el primer seguimiento, luego se olvida, y el lead que tenía potencial se va a dormir.','El seguimiento manual falla porque es invisible: el vendedor no tiene un sistema que le recuerde a quién seguir, cuándo, y con qué mensaje. Los CRMs tienen recordatorios pero el vendedor los ignora cuando tiene 50 leads activos a la vez.','El 80% de los deals de ventas B2B requieren entre 5 y 12 puntos de contacto antes del cierre. La mayoría de los vendedores se rinden después del contacto 2 o 3 si no reciben respuesta inmediata. La IA puede hacer los 12 contactos de forma personalizada y automática.'],
solucion:['El sistema define secuencias de nurturing personalizadas por segmento de lead y etapa del funnel. Cuando un lead entra al sistema (desde el CRM, desde un formulario web, o manualmente), se activa la secuencia correspondiente: un mensaje de WhatsApp el día 1, otro el día 3, otro el día 7, etc.','Cada mensaje es único y personalizado por Claude: usa el nombre del lead, el contexto de la primera conversación, el sector de su empresa, y adapta el mensaje según la respuesta del lead en mensajes anteriores. Si el lead respondió con objeciones de precio, el seguimiento habla de ROI. Si respondió que está evaluando opciones, el siguiente mensaje ofrece una comparativa.','El sistema para automáticamente cuando el lead responde positivamente (agenda reunión o pide propuesta) o dice explícitamente que no está interesado. El vendedor humano entra solo cuando hay interés real o cuando el lead quiere hablar con alguien.'],
mercado:{tam:'$3.8B',sam:'$210M',cagr:'21% anual',clientes_est:'+95.000 empresas B2B con equipo de ventas en LATAM',
segmento:'Empresas B2B de cualquier sector con ciclo de ventas de 2-8 semanas y ticket mayor a $500. El perfil del cliente es idéntico al AI SDR — son complementarios y se venden juntos.',
analisis:['El mercado de Marketing Automation y Lead Nurturing es masivo: HubSpot tiene $2B+ ARR, Marketo fue adquirida por Adobe por $4.75B. En LATAM, la adopción de estas herramientas es baja por precio y complejidad.','El canal WhatsApp para nurturing B2B es único en LATAM: las tasas de apertura de WhatsApp son del 95-98% vs 20-25% del email. Un mensaje de nurturing por WhatsApp tiene 5x más probabilidad de ser leído que uno por email.','La integración natural con el AI SDR (puesto #1) crea la oportunidad de un bundle que cubra todo el funnel: prospección + calificación + nurturing + cierre. Ese bundle puede valer $499-599/mes combinado.']},
criterios:[
{s:8,n:'Mercado de $3.8B global. Complementario al AI SDR — mismo mercado, mayor LTV por cliente.'},
{s:8,n:'No existe alternativa de nurturing con LLM por WhatsApp en LATAM. HubSpot Sequences es solo email.'},
{s:8,n:'MVP en 3 meses: secuencias de WhatsApp + Claude personalización + integración CRM.'},
{s:8,n:'Se vende como add-on al AI SDR desde el día 1. Los primeros 10 clientes del SDR son naturales.'},
{s:8,n:'Bundle con AI SDR = $549/mes. 80 clientes = $43.920 MRR.'},
{s:9,n:'Las secuencias mejoran con datos: qué mensajes en qué timing tienen más respuesta por industria.'},
{s:9,n:'El equipo entiende exactamente el pain — hacen nurturing manual ahora mismo.'},
{s:7,n:'Dependencia de WhatsApp Business API. Riesgo moderado similar al AI SDR.'},
{s:7,n:'Moat en datos de respuesta: qué secuencias convierten mejor por industria es conocimiento exclusivo.'},
{s:9,n:'ROI directo: si el cliente cierra 2 deals más por mes que antes se enfriaban, ROI de 20x.'},
{s:8,n:'WTP alta especialmente cuando se vende bundleado con AI SDR. El bundle vale más que las partes.'},
{s:9,n:'CAC mínimo: se vende a los clientes del AI SDR. Costo de adquisición casi cero para el upsell.'},
{s:8,n:'Alta retención: una vez que el vendedor ve que los leads no se enfrían, no quiere volver al follow-up manual.'},
{s:7,n:'Viral moderado: los leads bien nurturizados notan la diferencia en calidad de comunicación y lo comentan.'},
{s:9,n:'Máximo fit: el equipo hace nurturing de sus propios prospectos — el producto resuelve su propio problema.'}
],
foda:{
f:[{t:'Bundle natural con AI SDR',d:'El 100% de los clientes del AI SDR necesitan nurturing. El upsell es trivial porque resuelve el problema natural del siguiente paso del funnel.'},
{t:'WhatsApp con 95% de apertura',d:'Un follow-up de email se ignora. Un WhatsApp se lee. La efectividad del nurturing por WhatsApp es 5x mayor que el email de forma medible.'},
{t:'Personalización real vs plantillas genéricas',d:'Claude adapta cada mensaje al contexto específico del lead. No es {nombre} + {empresa} = la misma plantilla para todos.'},
{t:'Para automáticamente en el momento correcto',d:'El sistema detecta señales de interés (clic en link, respuesta positiva) y frena la secuencia para que el humano tome el control en el momento de mayor interés.'}],
o:[{t:'Bundle SDR + Nurturing = ticket mayor',d:'Vender ambos juntos por $499-599/mes aumenta el LTV del cliente y reduce el churn de ambos productos porque se vuelven interdependientes.'},
{t:'Multichannel: WhatsApp + Email + LinkedIn',d:'Expandir las secuencias de nurturing a múltiples canales (WhatsApp, email, LinkedIn message) puede multiplicar el valor del producto.'},
{t:'ABM (Account Based Marketing) para deals grandes',d:'Para cuentas enterprise con múltiples stakeholders, el nurturing IA puede tocar a cada persona con mensajes adaptados a su rol.'},
{t:'Analytics de nurturing como insight de mercado',d:'Los datos agregados de qué objeciones aparecen en cada industria, en qué etapa del funnel, son intel de mercado valiosísimo.'}],
d:[{t:'Límites de mensajes de WhatsApp no solicitados',d:'WhatsApp prohíbe enviar mensajes a leads que no iniciaron la conversación. La primera interacción debe ser opt-in. Hay que diseñar el flujo respetando esto.'},
{t:'Riesgo de spam si las secuencias no son buenas',d:'Un nurturing mal diseñado que envía mensajes muy frecuentes o muy genéricos genera bloqueos y daña la reputación del número de WhatsApp.'},
{t:'Dependencia de calidad del CRM del cliente',d:'Las secuencias dependen de los datos del CRM del cliente. Si el CRM tiene datos incompletos, el nurturing es de baja calidad.'},
{t:'Personalización requiere contexto inicial suficiente',d:'Si el lead no dio suficiente información en el primer contacto, Claude no puede personalizar mucho más allá del nombre y la empresa.'}],
a:[{t:'HubSpot Sequences con WhatsApp nativo',d:'HubSpot está agregando WhatsApp como canal. Si lanzan sequences de WhatsApp bien integradas, reducen el diferencial.'},
{t:'Apollo.io expandiendo nurturing',d:'Apollo tiene sequences de email muy buenas. Si agregan WhatsApp y LLM de calidad, son un competidor serio.'},
{t:'Regulación anti-spam más estricta',d:'Las regulaciones de comunicaciones no solicitadas en LATAM están evolucionando. Hay que mantener compliance actualizado.'},
{t:'Fatiga del destinatario',d:'Si muchas empresas hacen nurturing por WhatsApp a la vez, los leads aprenden a ignorar esos mensajes. La calidad de personalización seguirá siendo el diferencial.'}]
},
gtm:[
{fase:'Fase 1 — Upsell a clientes del AI SDR',periodo:'Mes 1-3',
desc:'El canal de venta más eficiente: los primeros 10 clientes del AI SDR reciben la propuesta del add-on de Nurturing. El upsell tiene cero costo de adquisición y el value prop es obvio: "ya tenemos tus leads, ahora mantenémoslos calientes automáticamente".',
canales:['Upsell directo a los clientes activos del AI SDR','Propuesta en la reunión de onboarding del AI SDR como feature complementaria','Demo live: mostrar qué hubiera pasado con los leads que se enfriaron en los últimos 30 días'],
kpis:['30 clientes activos (10 bundle, 20 standalone)','MRR: $7.470','Tasa de upsell: >60% de clientes SDR']},
{fase:'Fase 2 — Standalone para equipos de ventas',periodo:'Mes 4-7',
desc:'Vender el Nurturing de forma independiente a empresas que ya tienen una fuente de leads pero no tienen proceso de seguimiento sistemático. La propuesta de venta: "tienes leads pero se te enfrían — nosotros los calentamos automáticamente".',
canales:['LinkedIn outreach a gerentes de ventas en sectores con ciclos de venta largos','Alianzas con plataformas de generación de leads (formularios web, landing pages)','Webinar: "Cómo reactivar el 30% de los leads que se te fueron"'],
kpis:['80 clientes activos','MRR: $19.920','Churn mensual < 5%']},
{fase:'Fase 3 — Multichannel y expansión',periodo:'Mes 8-12',
desc:'Expandir las secuencias a email y LinkedIn para crear un sistema de nurturing multichannel. Posicionarse como la plataforma de engagement de leads para PYMEs de LATAM.',
canales:['Partnerships con generadores de leads (fintechs, plataformas de crowdfunding B2B)','Contenido: estudios de caso con datos reales de mejora de conversión','Expansión a México con resellers locales'],
kpis:['130 clientes activos','MRR: $32.370','Bundle SDR+Nurturing > 50% de la base de clientes']}
],
tech:[
{capa:'WhatsApp',nombre:'WhatsApp Business API (Meta Cloud)',razon:'API oficial para envío de secuencias aprobadas. Las plantillas HSM garantizan entregabilidad sin riesgo de ban.'},
{capa:'LLM',nombre:'Claude 3.5 Sonnet',razon:'Personalización de cada mensaje según el historial del lead, su sector, y las respuestas anteriores en la conversación.'},
{capa:'Scheduling',nombre:'BullMQ + Redis',razon:'Cola de mensajes con timing preciso para secuencias. Respeta las franjas horarias locales y el timezone del lead.'},
{capa:'CRM Integration',nombre:'HubSpot API + Pipedrive API',razon:'Sincronización bidireccional: el CRM activa la secuencia cuando el lead llega al stage correcto, y la respuesta del lead actualiza el CRM automáticamente.'},
{capa:'Analytics',nombre:'Supabase + Metabase',razon:'Dashboard de métricas por secuencia: apertura, respuesta, conversión, opt-out. Metabase para visualización sin código custom.'}
],
precios:[
{plan:'Add-on SDR',precio:'$149',para:'Clientes del AI SDR (bundle $399)',incluye:['500 leads en nurturing','3 secuencias activas','WhatsApp únicamente','Integración con AI SDR incluida']},
{plan:'Standalone',precio:'$249',para:'Equipos con fuente propia de leads',incluye:['2.000 leads en nurturing','10 secuencias activas','WhatsApp + Email','Integración con CRM (HubSpot/Pipedrive)','Analytics de performance']},
{plan:'Advanced',precio:'$499',para:'Equipos grandes con múltiples campañas',incluye:['Leads ilimitados','Secuencias ilimitadas','Multichannel: WhatsApp + Email + LinkedIn','A/B testing de mensajes','Análisis de objeciones por industria','Customer Success']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:30,mrr:7470,nota:'Upsell a clientes AI SDR + primeros standalone.'},
{q:'Q2 (Mes 4-6)',cli:70,mrr:17430,nota:'Standalone expansion. Multichannel beta.'},
{q:'Q3 (Mes 7-9)',cli:110,mrr:27390,nota:'A/B testing module. México.'},
{q:'Q4 (Mes 10-12)',cli:150,mrr:37350,nota:'Advanced plans. Expansion ARR.'}
],
payback:'Break-even en mes 4. El upsell a SDR clients tiene costo de adquisición casi cero.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP secuencias WhatsApp',h:['Sistema de secuencias configurable con timing y mensajes por etapa','Claude personaliza cada mensaje con datos del lead del CRM','Opt-out automático cuando el lead responde que no está interesado'],kpi:'10 leads en nurturing activo, 2 conversiones documentadas'},
{p:'Mes 3-4',titulo:'Integración CRM y analytics',h:['Integración bidireccional HubSpot y Pipedrive','Dashboard de performance: tasas de apertura, respuesta, conversión por secuencia','Upsell a los 10 clientes del AI SDR'],kpi:'30 clientes, MRR $7.470'},
{p:'Mes 5-8',titulo:'Multichannel y standalone',h:['Canal email como segunda opción en las secuencias','Venta standalone sin dependencia del AI SDR','Templates de secuencia por industria (SaaS B2B, distribución, servicios)'],kpi:'110 clientes, MRR $27.390'},
{p:'Mes 9-12',titulo:'Advanced y escala',h:['A/B testing de mensajes dentro de las secuencias','Análisis de objeciones más frecuentes por industria','LinkedIn como tercer canal de nurturing'],kpi:'150 clientes, MRR $37.350'}
],
competidores:[
{nombre:'HubSpot Sequences',f:'Integrado en el CRM más popular, fácil de usar, muy conocido',d:'Solo email (sin WhatsApp nativo de calidad), sin personalización real con LLM, precio alto para PYMEs',g:'WhatsApp (95% apertura vs 25% email) + Claude personalización real + precio 60% menor = 5x mejor performance'},
{nombre:'Apollo.io Sequences',f:'Base de datos de contactos integrada con secuencias de email automatizadas',d:'Sin WhatsApp, sin LLM de calidad para personalización, sin foco LATAM',g:'WhatsApp como canal + personalización contextual = mensajes que se leen y que generan respuesta'},
{nombre:'Vendedor haciendo follow-up manual',f:'Tono humano auténtico, puede improvisar según la situación',d:'Hace 2-3 seguimientos y se rinde. No recuerda el contexto de la primera conversación. No escala.',g:'12 seguimientos automáticos + personalización por Claude + escala a 1.000 leads simultáneos = lo que el humano no puede hacer'}
],
riesgos:[
{r:'WhatsApp Business API cambia términos de uso para secuencias',prob:'Media',imp:'Alto',m:'Solo usar templates aprobados (HSM). Opt-in explícito de cada lead antes de la secuencia. Email como backup.'},
{r:'Baja tasa de respuesta si el mercado se satura de nurturing IA',prob:'Media',imp:'Medio',m:'La personalización real de Claude vs plantillas genéricas seguirá siendo diferenciable. Calidad sobre volumen.'},
{r:'Dependencia de datos del CRM del cliente',prob:'Alta',imp:'Medio',m:'Onboarding con auditoría de CRM. Si los datos son incompletos, el nurturing es genérico. Hay que comunicar esto.'},
{r:'Competidor con WhatsApp + LLM a menor precio',prob:'Media',imp:'Alto',m:'Moat en datos de performance + bundle con SDR + soporte local. Velocidad de ejecución es el diferencial en el corto plazo.'}
],
conclusion:['El Nurturing de Leads por WhatsApp IA es el producto que completa el puzzle del AI SDR. Juntos, cubren el funnel completo desde la prospección hasta el cierre. El bundle natural a $499/mes ($299 SDR + $149 nurturing add-on) es la oferta que convierte a los primeros 10 clientes en defensores del producto.','El diferencial sostenible está en los datos: después de 12 meses procesando miles de conversaciones de nurturing, el sistema conoce qué mensajes convierten mejor en cada industria de LATAM. Ese conocimiento es imposible de replicar rápidamente por un newcomer.','La expansión a multichannel (WhatsApp + Email + LinkedIn) convierte este producto en la plataforma de engagement de leads más completa para PYMEs de LATAM — un mercado que HubSpot y Apollo atienden mal por precio y canal.'],
primer_paso:'Esta semana: tomar los últimos 20 leads del equipo que se "enfriaron" (dijeron que sí y desaparecieron). Diseñar una secuencia de 5 mensajes de WhatsApp manualmente, espaciados cada 3 días, cada uno con un ángulo diferente (valor, caso de uso, urgencia, comparativa, CTA directo). Enviar manualmente y medir: ¿cuántos responden? Si más del 30% reactivan, el producto tiene demanda probada.'
}

]; // fin RANKING2 — parte A (ideas #4-10)

// ── GENERAR ARCHIVOS ─────────────────────────────────────────────────────────
const RANK_OFFSET = 3; // ideas 1-3 ya generadas
const ALL_NAMES = [
  {slug:'ai-sdr-outbound-latam',nombre:'AI SDR Outbound LATAM',cat:'Ventas B2B',score:128,ticket:299,mvp:3},
  {slug:'agente-research-empresarial',nombre:'Agente de Research Empresarial IA',cat:'Agentes Autónomos',score:122,ticket:349,mvp:3},
  {slug:'propuestas-comerciales-ia',nombre:'Propuestas Comerciales IA',cat:'Ventas B2B',score:117,ticket:199,mvp:2},
  ...RANKING2.map(r=>({slug:r.slug,nombre:r.nombre,cat:r.categoria,score:sum(r.criterios),ticket:r.ticket,mvp:r.mvp_meses}))
];
const filenames = ALL_NAMES.map((_,i)=>`${String(i+1).padStart(2,'0')}-${ALL_NAMES[i].slug}.html`);

RANKING2.forEach((idea,i)=>{
  const rank = RANK_OFFSET + i + 1;
  const prev = filenames[rank-2];
  const next = rank < filenames.length ? filenames[rank] : null;
  const html = renderDoc(idea, rank, prev, next);
  fs.writeFileSync(path.join(DIR, filenames[rank-1]), html);
  console.log(`✓ [${rank}/20] ${idea.nombre}`);
});

// Regenerar index con todos los disponibles
const indexHtml = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Top 20 SaaS 2026 — Índice</title>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f4f8;color:#0f172a;padding:40px;}h1{font-size:28px;font-weight:900;margin-bottom:8px;}p{color:#64748b;margin-bottom:32px;}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}.card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.06);border:1px solid #e2e8f0;text-decoration:none;color:inherit;display:block;transition:transform .12s,box-shadow .12s;}.card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.1);}.rank{font-size:12px;font-weight:800;color:#6366f1;letter-spacing:1px;margin-bottom:8px;}.nombre{font-size:16px;font-weight:800;margin-bottom:6px;}.tag{font-size:11px;background:#e0e7ff;color:#3730a3;padding:3px 10px;border-radius:12px;display:inline-block;margin-bottom:12px;}.meta{display:flex;gap:12px;font-size:12px;color:#64748b;}.score{font-weight:700;color:#059669;}</style>
</head><body>
<h1>📊 Top 20 SaaS Ideas 2026</h1>
<p>Análisis estratégico profundo · Agustín &amp; el Flaco · Re-clasificadas por fit de equipo</p>
<div class="grid">
${ALL_NAMES.map((idea,i)=>{
  const exists = fs.existsSync(path.join(DIR, filenames[i]));
  return `<a href="${filenames[i]}" class="card" ${!exists?'style="opacity:0.4;pointer-events:none;"':''}>
  <div class="rank">#${i+1} DE 20</div>
  <div class="nombre">${idea.nombre}</div>
  <span class="tag">${idea.cat}</span>
  <div class="meta">
    <span class="score">${idea.score}/150</span>
    <span>MVP: ${idea.mvp}m</span>
    <span>$${idea.ticket}/mes</span>
    ${!exists?'<span style="color:#dc2626;font-weight:700;">Pendiente</span>':''}
  </div></a>`;
}).join('\n')}
</div></body></html>`;
fs.writeFileSync(path.join(DIR,'index.html'), indexHtml);
console.log(`\n✅ Ideas #4-${RANK_OFFSET+RANKING2.length} generadas. Index actualizado.`);
console.log('👉 Ejecutar generar-top20-parte3.js para ideas #11-20');
