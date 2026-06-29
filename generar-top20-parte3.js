const fs=require('fs');const path=require('path');const DIR='top20';
const CN=['Tamaño mercado','Competencia LATAM','Dificultad MVP','Tiempo revenue','Potencial MRR','Escalabilidad','Ventaja equipo','Riesgo plataforma','Defensibilidad','Claridad ROI','WTP','CAC estimado','Retención','Viral / referidos','Fit equipo'];
const CD=['Tamaño total en LATAM','Sin rival=10','MVP en semanas=10','Revenue en mes 1=10','MRR alto','Escala sin costo','Ventaja del equipo','Sin riesgo plataforma=10','Moat defensible','ROI claro para cliente','Disposición a pagar','CAC bajo=10','Retención mensual','Referidos orgánicos','Fit del equipo'];
function sum(c){return c.reduce((a,x)=>a+x.s,0);}
function tierL(s){return s>=115?'TOP ★★★':s>=100?'MID ★★':'BAJO ★';}
const CSS=`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Segoe UI',system-ui,sans-serif;color:#0f172a;background:#f8fafc;font-size:15px;line-height:1.7;}.cover{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#312e81 100%);color:#fff;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:80px 72px 72px;page-break-after:always;}.cover-rank{font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#a5b4fc;margin-bottom:20px;}.cover-title{font-size:52px;font-weight:900;line-height:1.1;margin-bottom:20px;}.cover-tagline{font-size:20px;color:#c7d2fe;margin-bottom:48px;max-width:700px;line-height:1.5;}.cover-pills{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:40px;}.pill{padding:10px 22px;border-radius:30px;font-size:13px;font-weight:700;}.pill-score{background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);}.pill-cat{background:#6366f1;color:#fff;}.cover-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}.cover-stat{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:20px;}.cover-stat b{display:block;font-size:26px;font-weight:900;color:#fff;margin-bottom:4px;}.cover-stat span{font-size:11px;color:#a5b4fc;text-transform:uppercase;letter-spacing:.5px;}.wrap{max-width:1000px;margin:0 auto;padding:60px 48px;}.section{margin-bottom:64px;}.sec-label{font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#6366f1;margin-bottom:8px;}.sec-title{font-size:30px;font-weight:900;color:#0f172a;margin-bottom:24px;padding-bottom:14px;border-bottom:3px solid #e2e8f0;}h3{font-size:20px;font-weight:800;color:#0f172a;margin:32px 0 12px;}h4{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#64748b;margin:24px 0 10px;}p{color:#334155;margin-bottom:14px;}ul{padding-left:22px;margin-bottom:16px;}li{color:#334155;margin-bottom:8px;}.highlight-box{background:linear-gradient(135deg,#312e81,#1e3a5f);color:#fff;padding:28px 32px;border-radius:14px;margin:24px 0;}.highlight-box p{color:#c7d2fe;margin:0;}.highlight-box strong{color:#fff;}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0;}.info-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.05);}.info-card h4{margin-top:0;}.info-card p{margin:0;font-size:14px;}.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:24px 0;}.stat-box{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.04);}.stat-box b{display:block;font-size:24px;font-weight:900;color:#6366f1;margin-bottom:4px;}.stat-box span{font-size:12px;color:#64748b;}.criterio-row{display:grid;grid-template-columns:160px 1fr 80px;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;}.criterio-row:last-child{border-bottom:none;}.criterio-nombre{font-size:13px;font-weight:600;}.bar-track{height:10px;background:#f1f5f9;border-radius:5px;overflow:hidden;}.bar-fill{height:10px;border-radius:5px;}.criterio-score{text-align:right;font-size:15px;font-weight:800;}.total-row{background:#f8faff;border-radius:10px;padding:16px 20px;margin-top:16px;display:flex;justify-content:space-between;align-items:center;}.total-row span{font-size:14px;font-weight:700;color:#64748b;}.total-row strong{font-size:22px;font-weight:900;color:#6366f1;}.foda-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;margin:24px 0;}.fc{padding:28px;}.fc h4{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;}.fc .item{margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(0,0,0,.08);}.fc .item:last-child{border-bottom:none;margin:0;padding:0;}.fc .item b{display:block;font-size:14px;font-weight:700;margin-bottom:4px;}.fc .item p{font-size:13px;margin:0;line-height:1.5;}.fc-f{background:#f0fdf4;}.fc-f h4{color:#065f46;}.fc-o{background:#eff6ff;}.fc-o h4{color:#1e40af;}.fc-d{background:#fffbeb;}.fc-d h4{color:#78350f;}.fc-a{background:#fff1f2;}.fc-a h4{color:#9f1239;}.gtm-phase{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:28px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,.04);}.gtm-phase-header{display:flex;align-items:center;gap:14px;margin-bottom:16px;}.phase-num{width:40px;height:40px;background:#6366f1;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;flex-shrink:0;}.phase-title{font-size:18px;font-weight:800;}.phase-period{font-size:12px;color:#64748b;font-weight:600;}.gtm-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:16px;}.gtm-col h4{margin-top:0;font-size:11px;}.gtm-col ul{margin:0;}.tech-table{width:100%;border-collapse:collapse;margin:20px 0;}.tech-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;}.tech-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;}.tech-table tr:last-child td{border-bottom:none;}.tech-table td:first-child{font-weight:700;font-size:13px;color:#64748b;white-space:nowrap;}.tech-table td:nth-child(2){font-weight:700;color:#6366f1;}.tech-table td:last-child{font-size:13px;color:#334155;}.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:24px 0;}.price-card{background:#fff;border:2px solid #e2e8f0;border-radius:16px;padding:28px;position:relative;}.price-card.featured{border-color:#6366f1;background:linear-gradient(180deg,#f5f3ff,#fff);}.price-card .badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#6366f1;color:#fff;padding:4px 16px;border-radius:20px;font-size:11px;font-weight:700;}.price-plan{font-size:13px;font-weight:700;color:#64748b;margin-bottom:8px;}.price-amount{font-size:36px;font-weight:900;color:#0f172a;margin-bottom:4px;}.price-period{font-size:13px;color:#64748b;margin-bottom:16px;}.price-for{font-size:12px;background:#f1f5f9;padding:6px 12px;border-radius:6px;color:#64748b;margin-bottom:16px;}.price-features{list-style:none;padding:0;margin:0;}.price-features li{font-size:13px;padding:6px 0;border-bottom:1px solid #f1f5f9;color:#334155;}.price-features li:last-child{border-bottom:none;}.price-features li::before{content:'✓ ';color:#059669;font-weight:700;}.fin-table{width:100%;border-collapse:collapse;margin:20px 0;}.fin-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:center;font-size:11px;text-transform:uppercase;}.fin-table th:first-child{text-align:left;}.fin-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;text-align:center;}.fin-table td:first-child{text-align:left;font-weight:700;color:#0f172a;}.fin-table tr:last-child td{border-bottom:none;font-weight:800;background:#f8faff;}.roadmap{margin:24px 0;}.rm-item{display:grid;grid-template-columns:140px 1fr;gap:24px;margin-bottom:28px;}.rm-period{background:#6366f1;color:#fff;border-radius:10px;padding:14px 16px;text-align:center;font-size:13px;font-weight:700;height:fit-content;}.rm-content{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 2px 6px rgba(0,0,0,.04);}.rm-content h4{margin-top:0;color:#6366f1;}.rm-content ul{margin:8px 0 0;}.comp-table{width:100%;border-collapse:collapse;margin:20px 0;}.comp-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;}.comp-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px;}.comp-table tr:last-child td{border-bottom:none;}.comp-table td:first-child{font-weight:800;color:#0f172a;}.win-cell{color:#059669;font-weight:600;}.risk-table{width:100%;border-collapse:collapse;margin:20px 0;}.risk-table th{background:#0f172a;color:#94a3b8;padding:12px 16px;text-align:left;font-size:11px;text-transform:uppercase;}.risk-table td{padding:14px 16px;border-bottom:1px solid #f1f5f9;vertical-align:top;font-size:13px;}.risk-table tr:last-child td{border-bottom:none;}.prob-alta{color:#dc2626;font-weight:700;}.prob-media{color:#d97706;font-weight:700;}.prob-baja{color:#059669;font-weight:700;}.conclusion-box{background:linear-gradient(135deg,#312e81,#0f172a);color:#fff;border-radius:16px;padding:40px;margin:32px 0;}.conclusion-box h3{color:#a5b4fc;margin-top:0;}.conclusion-box p{color:#e0e7ff;font-size:16px;line-height:1.8;margin-bottom:16px;}.conclusion-box p:last-child{margin:0;}.first-step{background:#f0fdf4;border:2px solid #059669;border-radius:12px;padding:24px;margin-top:24px;}.first-step h4{color:#065f46;margin-top:0;}.first-step p{color:#064e3b;margin:0;font-size:15px;font-weight:500;}.nav-footer{text-align:center;padding:40px;color:#64748b;font-size:13px;border-top:1px solid #e2e8f0;margin-top:60px;}.nav-footer a{color:#6366f1;text-decoration:none;font-weight:700;}@media print{.cover{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.section{page-break-inside:avoid;}.foda-grid,.pricing-grid{-webkit-print-color-adjust:exact;print-color-adjust:exact;}body{background:#fff;}}`;
function renderDoc(idea,rank,prev,next){
  const total=sum(idea.criterios);
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>#${rank} ${idea.nombre}</title><style>${CSS}</style></head><body>
<div class="cover"><div class="cover-rank">📊 Ranking Top 20 · #${rank} de 20 · Agustín &amp; el Flaco · 2026</div><h1 class="cover-title">${idea.nombre}</h1><p class="cover-tagline">${idea.tagline}</p><div class="cover-pills"><span class="pill pill-score">${total}/150 — ${tierL(total)}</span><span class="pill pill-cat">${idea.categoria}</span><span class="pill" style="background:rgba(255,255,255,.1);color:#a5b4fc;">MVP ${idea.mvp_meses}m</span><span class="pill" style="background:rgba(255,255,255,.1);color:#a5b4fc;">${idea.validado}</span></div><div class="cover-meta"><div class="cover-stat"><b>${total}/150</b><span>Score</span></div><div class="cover-stat"><b>$${idea.ticket}/mes</b><span>Ticket</span></div><div class="cover-stat"><b>${idea.mvp_meses}m</b><span>MVP</span></div><div class="cover-stat"><b>${idea.mercado.sam}</b><span>SAM LATAM</span></div></div></div>
<div class="wrap">
<div class="section"><div class="sec-label">Sección 1</div><h2 class="sec-title">Resumen Ejecutivo</h2>${idea.intro.map(p=>`<p>${p}</p>`).join('')}<div class="highlight-box"><p><strong>Propuesta de valor:</strong> ${idea.propuesta_valor}</p></div><div class="stat-row"><div class="stat-box"><b>${total}/150</b><span>Score</span></div><div class="stat-box"><b>$${idea.ticket}</b><span>Ticket/mes</span></div><div class="stat-box"><b>${idea.mvp_meses}m</b><span>MVP</span></div><div class="stat-box"><b>${idea.mercado.cagr}</b><span>CAGR</span></div></div></div>
<div class="section"><div class="sec-label">Sección 2</div><h2 class="sec-title">Problema y Solución</h2><div class="info-grid"><div class="info-card"><h4>🔴 El Problema</h4>${idea.problema.map(p=>`<p>${p}</p>`).join('')}</div><div class="info-card"><h4>✅ Nuestra Solución</h4>${idea.solucion.map(p=>`<p>${p}</p>`).join('')}</div></div></div>
<div class="section"><div class="sec-label">Sección 3</div><h2 class="sec-title">Análisis de Mercado</h2><div class="stat-row"><div class="stat-box"><b>${idea.mercado.tam}</b><span>Global</span></div><div class="stat-box"><b>${idea.mercado.sam}</b><span>LATAM</span></div><div class="stat-box"><b>${idea.mercado.cagr}</b><span>CAGR</span></div><div class="stat-box"><b>${idea.mercado.clientes_est}</b><span>Clientes pot.</span></div></div>${idea.mercado.analisis.map(p=>`<p>${p}</p>`).join('')}<h3>Segmento Primario</h3><p>${idea.mercado.segmento}</p></div>
<div class="section"><div class="sec-label">Sección 4</div><h2 class="sec-title">Scoring — 15 Criterios</h2>${idea.criterios.map((c,i)=>`<div class="criterio-row"><div><div class="criterio-nombre">${CN[i]}</div><div style="font-size:11px;color:#94a3b8;">${CD[i]}</div></div><div><div class="bar-track"><div class="bar-fill" style="width:${c.s*10}%;background:${c.s>=8?'#059669':c.s>=6?'#d97706':'#94a3b8'};"></div></div><div style="font-size:12px;color:#64748b;margin-top:4px;">${c.n}</div></div><div class="criterio-score" style="color:${c.s>=8?'#059669':c.s>=6?'#d97706':'#94a3b8'};">${c.s}/10</div></div>`).join('')}<div class="total-row"><span>SCORE TOTAL</span><strong>${total}/150</strong></div></div>
<div class="section"><div class="sec-label">Sección 5</div><h2 class="sec-title">Análisis FODA</h2><div class="foda-grid"><div class="fc fc-f"><h4>✅ Fortalezas</h4>${idea.foda.f.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div><div class="fc fc-o"><h4>🚀 Oportunidades</h4>${idea.foda.o.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div><div class="fc fc-d"><h4>⚠️ Debilidades</h4>${idea.foda.d.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div><div class="fc fc-a"><h4>🔴 Amenazas</h4>${idea.foda.a.map(x=>`<div class="item"><b>${x.t}</b><p>${x.d}</p></div>`).join('')}</div></div></div>
<div class="section"><div class="sec-label">Sección 6</div><h2 class="sec-title">Go-To-Market</h2>${idea.gtm.map((g,i)=>`<div class="gtm-phase"><div class="gtm-phase-header"><div class="phase-num">${i+1}</div><div><div class="phase-title">${g.fase}</div><div class="phase-period">${g.periodo}</div></div></div><p>${g.desc}</p><div class="gtm-cols"><div class="gtm-col"><h4>Canales</h4><ul>${g.canales.map(c=>`<li>${c}</li>`).join('')}</ul></div><div class="gtm-col"><h4>KPIs</h4><ul>${g.kpis.map(k=>`<li>${k}</li>`).join('')}</ul></div></div></div>`).join('')}</div>
<div class="section"><div class="sec-label">Sección 7</div><h2 class="sec-title">Stack Tecnológico</h2><table class="tech-table"><thead><tr><th>Capa</th><th>Tecnología</th><th>Justificación</th></tr></thead><tbody>${idea.tech.map(t=>`<tr><td>${t.capa}</td><td>${t.nombre}</td><td>${t.razon}</td></tr>`).join('')}</tbody></table></div>
<div class="section"><div class="sec-label">Sección 8</div><h2 class="sec-title">Modelo de Precios</h2><div class="pricing-grid">${idea.precios.map((p,i)=>`<div class="price-card ${i===1?'featured':''}">${i===1?'<span class="badge">Más popular</span>':''}<div class="price-plan">${p.plan}</div><div class="price-amount">${p.precio}</div><div class="price-period">por mes</div><div class="price-for">Para: ${p.para}</div><ul class="price-features">${p.incluye.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></div>
<div class="section"><div class="sec-label">Sección 9</div><h2 class="sec-title">Proyecciones Financieras</h2><table class="fin-table"><thead><tr><th>Período</th><th>Clientes</th><th>MRR (USD)</th><th>ARR est.</th><th>Nota</th></tr></thead><tbody>${idea.financiero.map(f=>`<tr><td>${f.q}</td><td>${f.cli}</td><td>$${f.mrr.toLocaleString()}</td><td>$${(f.mrr*12).toLocaleString()}</td><td>${f.nota}</td></tr>`).join('')}</tbody></table><div class="highlight-box"><p><strong>MRR objetivo 12 meses:</strong> $${idea.financiero[idea.financiero.length-1].mrr.toLocaleString()} · <strong>Payback:</strong> ${idea.payback}</p></div></div>
<div class="section"><div class="sec-label">Sección 10</div><h2 class="sec-title">Roadmap 12 Meses</h2><div class="roadmap">${idea.roadmap.map(r=>`<div class="rm-item"><div class="rm-period">${r.p}</div><div class="rm-content"><h4>${r.titulo}</h4><ul>${r.h.map(x=>`<li>${x}</li>`).join('')}</ul><p style="font-size:12px;color:#64748b;margin-top:12px;margin-bottom:0;"><strong>KPI:</strong> ${r.kpi}</p></div></div>`).join('')}</div></div>
<div class="section"><div class="sec-label">Sección 11</div><h2 class="sec-title">Competencia</h2><table class="comp-table"><thead><tr><th>Competidor</th><th>Fortaleza</th><th>Debilidad vs nosotros</th><th>Cómo ganamos</th></tr></thead><tbody>${idea.competidores.map(c=>`<tr><td>${c.nombre}</td><td>${c.f}</td><td>${c.d}</td><td class="win-cell">${c.g}</td></tr>`).join('')}</tbody></table></div>
<div class="section"><div class="sec-label">Sección 12</div><h2 class="sec-title">Riesgos</h2><table class="risk-table"><thead><tr><th>Riesgo</th><th>Prob.</th><th>Impacto</th><th>Mitigación</th></tr></thead><tbody>${idea.riesgos.map(r=>`<tr><td>${r.r}</td><td class="prob-${r.prob.toLowerCase()}">${r.prob}</td><td class="prob-${r.imp.toLowerCase()}">${r.imp}</td><td>${r.m}</td></tr>`).join('')}</tbody></table></div>
<div class="section"><div class="sec-label">Sección 13</div><h2 class="sec-title">Conclusión</h2><div class="conclusion-box"><h3>Veredicto — ${idea.nombre}</h3>${idea.conclusion.map(p=>`<p>${p}</p>`).join('')}</div><div class="first-step"><h4>🎯 PRIMER PASO</h4><p>${idea.primer_paso}</p></div></div>
</div><div class="nav-footer"><a href="index.html">← Índice</a>${prev?` &nbsp;·&nbsp; <a href="${prev}">← Ant.</a>`:''} ${next?` &nbsp;·&nbsp; <a href="${next}">Sig. →</a>`:''} &nbsp;·&nbsp; <a href="javascript:window.print()">⬇ PDF</a></div></body></html>`;
}

// ══ DATA ═════════════════════════════════════════════════════════════════════
const RANKING3=[

// #8
{slug:'ads-ia-meta-google',nombre:'Ads IA para Meta y Google',categoria:'Marketing IA',ticket:299,mvp_meses:3,validado:'USA · España · LATAM',
tagline:'Crea, testea y optimiza campañas de Meta y Google con IA en minutos, no días.',
propuesta_valor:'Generar copy de ads, audiencias, y análisis de resultados con IA para que cualquier PYME de LATAM haga marketing digital de clase mundial sin agencia.',
intro:['Ads IA para Meta y Google ocupa el #8 del ranking porque ataca el problema de marketing más universal de las PYMEs: no saben hacer ads efectivos, las agencias son caras, y el tiempo de aprender por prueba y error es muy alto.','El mercado es inmenso: hay más de 10 millones de anunciantes activos en Meta en LATAM solo. La mayoría son PYMEs que gastan entre $300-3.000/mes en ads y no tienen forma de optimizar ese gasto sin contratar a alguien.','El timing es perfecto: la API de Meta Ads y Google Ads están maduras, Claude puede generar copy de alta calidad, y la brecha entre lo que paga el dueño de PYME en ads y lo que obtiene en resultados nunca fue más grande.'],
problema:['Las PYMEs gastan en promedio el 8-12% de su facturación en publicidad digital, pero el 60% de ese presupuesto se desperdicia en ads mal segmentados, con copy genérico, sin testing sistemático de creatividades.','Contratar una agencia cuesta $800-2.500/mes más un porcentaje del gasto. Para una PYME que gasta $1.000/mes en ads, la agencia se come el 80-250% del presupuesto. El modelo no tiene sentido económico.','El ciclo de crear-publicar-analizar-optimizar que toma a un experto 4-6 horas por semana puede automatizarse: Claude genera las creatividades, la IA analiza los resultados, y el sistema propone los próximos tests automáticamente.'],
solucion:['El sistema conecta con la cuenta de Meta Ads y/o Google Ads del cliente, analiza el histórico de campañas, y sugiere las variaciones de copy, audiencia y creatividad con mayor probabilidad de éxito.','Claude genera múltiples variaciones de copy adaptadas al tono de la marca: distintos ganchos emocionales, CTAs, formatos (imagen, video, carrusel). El cliente aprueba y el sistema publica directamente en las plataformas.','El análisis automático de resultados cada 72 horas identifica qué ads están teniendo mejor performance, cuáles pausar, y qué nuevas variaciones probar. El ciclo de optimización que antes tomaba semanas se comprime a días.'],
mercado:{tam:'$9.4B',sam:'$460M',cagr:'22% anual',clientes_est:'+480.000 PYMEs anunciantes activos en LATAM',
segmento:'PYMEs con gasto mensual en ads de $500-5.000, en sectores de e-commerce, servicios profesionales, salud, educación y gastronomía.',
analisis:['El mercado de ad tech para PYMEs está validado por herramientas como AdCreative.ai ($30M ARR), Jasper.ai y Smartly.io. Ninguna está localizada para LATAM ni tiene foco en español.','En LATAM, el mercado de publicidad digital crece al 22% anual y superará los $20B en 2026. El segmento de herramientas que mejoran el ROAS de los anunciantes PYMEs captura una fracción significativa de ese crecimiento.','El diferencial único: la combinación de generación de copy en español con las particularidades culturales de cada país (argentino, mexicano, colombiano) + análisis automático de ROAS + pricing a 30% del costo de una agencia.']},
criterios:[
{s:9,n:'10M+ anunciantes en Meta LATAM. Mercado de publicidad digital de $9.4B creciendo al 22%.'},
{s:8,n:'AdCreative.ai existe pero sin foco LATAM. Las agencias son el principal "competidor" hoy.'},
{s:8,n:'MVP: conectar Meta Ads API + Claude para generar copy de ads. Funcional en 8 semanas.'},
{s:8,n:'Demo en reunión: generar 5 variaciones de ad para el negocio del cliente en 5 minutos.'},
{s:9,n:'480K anunciantes x $299 = mercado total enorme. 200 clientes = $59.800 MRR.'},
{s:9,n:'El sistema aprende qué funciona por industria. Los datos acumulados son el moat.'},
{s:8,n:'El equipo ya hace ads en Meta para sus propios negocios y entiende el pain perfectamente.'},
{s:7,n:'Dependencia de Meta Ads API y Google Ads API. Cambios de políticas pueden romper integraciones.'},
{s:7,n:'Moat en datos de performance: qué copy convierte mejor por industria en LATAM es conocimiento exclusivo.'},
{s:9,n:'ROI directo: si mejora el ROAS del cliente en un 30%, el producto vale 10x su precio.'},
{s:9,n:'$299/mes vs $1.500+/mes de agencia. WTP muy alta dado el ahorro.'},
{s:8,n:'CAC bajo: la demo de 5 minutos generando ads del cliente es el cierre más efectivo posible.'},
{s:8,n:'Alta retención: si el cliente ve mejora en ROAS, no quiere volver a la agencia.'},
{s:7,n:'Viral moderado: los competidores de los clientes ven los ads mejorados y preguntan.'},
{s:8,n:'El equipo usa Meta Ads para sus propias campañas y puede demostrar resultados reales.'}
],
foda:{
f:[{t:'Demo de 5 minutos que genera ads reales',d:'Generar copy de ads para el negocio del prospecto en la reunión de ventas cierra el deal en el acto.'},
{t:'30% del costo de una agencia',d:'$299/mes vs $1.500-2.500/mes es un argumento irrefutable para cualquier PYME.'},
{t:'Claude = copy de alta calidad en español',d:'El copy generado por Claude en español regional supera lo que muchas agencias producen para clientes LATAM.'},
{t:'Testing sistemático automatizado',d:'El ciclo de test-aprender-optimizar se comprime de semanas a días con análisis automático de performance.'}],
o:[{t:'Boom de e-commerce en LATAM',d:'El e-commerce en LATAM crece al 30% anual. Cada nuevo e-commerce es un cliente potencial de publicidad digital.'},
{t:'TikTok Ads como nuevo canal',d:'TikTok Ads está explotando en LATAM. Agregar soporte para TikTok diferencia el producto de las agencias tradicionales.'},
{t:'Creative testing como servicio diferenciado',d:'Los datos de qué creatividades funcionan mejor por industria en LATAM son un asset que puede monetizarse como benchmark report.'},
{t:'Agencias como revendedoras',d:'Las agencias medianas pueden usar el producto para servir a más clientes con el mismo equipo. Canal de distribución B2B2C.'}],
d:[{t:'Dependencia de APIs de plataformas de ads',d:'Meta y Google cambian sus APIs con frecuencia. Mantener las integraciones requiere capacidad de desarrollo continua.'},
{t:'Necesita datos históricos para optimizar bien',d:'Las primeras semanas el sistema tiene poco contexto de qué funciona para ese negocio. Los resultados iniciales son más genéricos.'},
{t:'La creatividad visual sigue siendo humana',d:'Claude genera el copy pero el diseño de las imágenes/videos requiere herramientas adicionales (Canva API, Midjourney, Runway).'},
{t:'Configuración inicial compleja',d:'Conectar la cuenta de Meta Ads, configurar el pixel, entender el historial del cliente toma tiempo de onboarding.'}],
a:[{t:'Meta AI Tools para anunciantes',d:'Meta está construyendo herramientas de IA nativas para anunciantes en Ads Manager. Si mejoran la calidad, reducen el diferencial.'},
{t:'AdCreative.ai entrando a LATAM',d:'AdCreative.ai con $30M ARR puede decidir localizar al español. Su infraestructura existente sería una amenaza seria.'},
{t:'Agencias adoptando IA internamente',d:'Las agencias están integrando IA en su workflow. Si bajan sus precios, el argumento de costo vs agencia se reduce.'},
{t:'Google Performance Max AI',d:'Google está mejorando Performance Max con IA generativa. Las herramientas nativas pueden cubrir parte del caso de uso.'}]
},
gtm:[
{fase:'E-commerce y retail como early adopters',periodo:'Mes 1-3',
desc:'Los e-commerces tienen el dolor más claro y medible: gastan en ads y quieren mejor ROAS. La demo genera los ads de sus mejores productos en 5 minutos.',
canales:['Comunidades de dueños de e-commerce en grupos de Facebook y WhatsApp','Partnerships con plataformas de e-commerce LATAM (Tiendanube, VTEX)','Demo event: "Cómo mejorar tu ROAS 30% con IA en 30 días"'],
kpis:['30 clientes e-commerce','MRR: $8.970','ROAS promedio de clientes: +25%']},
{fase:'Expansión sectorial',periodo:'Mes 4-7',
desc:'Expandir a servicios profesionales, salud y educación. Cada sector tiene su propio lenguaje publicitario — los templates de copy por industria son el diferenciador.',
canales:['LinkedIn outreach a directores de marketing de empresas medianas','Agencias pequeñas como partners (white-label del producto)','Paid: Google Ads targeteando "agencia de publicidad" + "alternativa"'],
kpis:['100 clientes en 3 sectores','MRR: $29.900','10 agencias usando white-label']},
{fase:'Analytics y expansión',periodo:'Mes 8-12',
desc:'Módulo de análisis predictivo: qué ads tienen mayor probabilidad de éxito antes de publicarlos. Expansión a TikTok Ads y LinkedIn Ads.',
canales:['TikTok Ads propio para adquirir clientes','Benchmarks de industria como lead magnet','Expansión México y Colombia'],
kpis:['250 clientes activos','MRR: $74.750','3 canales de ads soportados']}
],
tech:[
{capa:'LLM Copy',nombre:'Claude 3.5 Sonnet',razon:'Generación de copy de alta calidad en español regional. Adapta tono y vocabulario por industria y objetivo de campaña.'},
{capa:'Meta Ads',nombre:'Meta Marketing API v19',razon:'Publicación directa de campañas, lectura de métricas y ajuste de presupuestos desde la plataforma.'},
{capa:'Google Ads',nombre:'Google Ads API',razon:'Integración para Google Search y Display. Generación de keywords y extensiones de anuncio con Claude.'},
{capa:'Backend',nombre:'Node.js + Supabase',razon:'Almacenamiento de configuraciones de campañas, historial de performance y datos de entrenamiento por cliente.'},
{capa:'Imágenes',nombre:'Canva API + Stable Diffusion',razon:'Generación y edición de creatividades visuales. Canva para layouts profesionales rápidos.'}
],
precios:[
{plan:'PYME',precio:'$149',para:'1 negocio, gasto < $2.000/mes en ads',incluye:['1 cuenta Meta + 1 Google','Copy ilimitado','Análisis semanal de ROAS','Hasta 10 campañas activas']},
{plan:'Growth',precio:'$299',para:'Negocio con gasto $2.000-10.000/mes',incluye:['Cuentas múltiples','A/B testing automático','Análisis diario de performance','Recomendaciones de presupuesto','Soporte prioritario']},
{plan:'Agency',precio:'$599',para:'Agencias con múltiples clientes',incluye:['Clientes ilimitados','White-label opcional','API de integración','Reportes automatizados para clientes','Customer Success']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:30,mrr:8970,nota:'E-commerce early adopters en ARG/UY.'},
{q:'Q2 (Mes 4-6)',cli:100,mrr:29900,nota:'Expansión sectorial + agencias white-label.'},
{q:'Q3 (Mes 7-9)',cli:180,mrr:53820,nota:'TikTok Ads. México y Colombia.'},
{q:'Q4 (Mes 10-12)',cli:260,mrr:77740,nota:'Google Ads integrado. Planes Agency.'}
],payback:'Break-even en mes 3 por volumen de clientes.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP Meta Ads + Claude Copy',h:['Meta Ads API: leer campañas y métricas','Claude genera 5 variaciones de copy por ad','Panel básico para aprobar y publicar ads'],kpi:'10 clientes beta con mejora de CTR documentada'},
{p:'Mes 3-5',titulo:'Analytics y A/B testing',h:['Dashboard de ROAS por campaña y ad','A/B testing automático: pausa el perdedor, escala el ganador','Google Ads integration básica'],kpi:'80 clientes, MRR $23.920'},
{p:'Mes 6-9',titulo:'TikTok y vertical templates',h:['TikTok Ads API integration','Templates de copy por industria: e-commerce, salud, educación, restaurantes','Análisis predictivo: qué ads tienen mejor prob. de éxito antes de publicar'],kpi:'200 clientes, MRR $59.800'},
{p:'Mes 10-12',titulo:'Escala y agencias',h:['Programa white-label para agencias','Benchmarks de industria: tu ROAS vs el promedio del sector','Expansión con paid acquisition propio'],kpi:'260 clientes, MRR $77.740'}
],
competidores:[
{nombre:'AdCreative.ai',f:'Generación masiva de creatividades visuales con IA',d:'Sin foco LATAM, sin análisis de ROAS, sin integración profunda con Meta Ads LATAM',g:'Copy en español de calidad + análisis de performance + precio en USD accesible para PYME LATAM'},
{nombre:'Agencia de marketing digital',f:'Servicio completo, relación humana, estrategia personalizada',d:'Cuesta $1.500-2.500/mes. Lento. Los resultados dependen del talento de cada ejecutivo.',g:'30% del precio + análisis de datos en tiempo real + testing sistemático que ninguna agencia hace al mismo ritmo'},
{nombre:'Meta Ads Manager (sin herramientas)',f:'Gratis, control total, acceso a todas las features',d:'Requiere experiencia, tiempo de aprendizaje, no tiene IA para copy, el testing es manual',g:'La IA hace el 80% del trabajo técnico. El dueño de PYME solo aprueba los ads.'}
],
riesgos:[
{r:'Meta cambia permisos de Ads API',prob:'Baja',imp:'Alto',m:'Mantener compliance estricto con políticas de Meta. Tener cuenta de acceso verificada y aprobada como Business API partner.'},
{r:'Baja mejora de ROAS en primeras semanas',prob:'Media',imp:'Alto',m:'Expectativas claras: las primeras 4 semanas son de calibración. Garantía de devolución si no hay mejora en 60 días.'},
{r:'AdCreative.ai o Jasper lanzan integración con Meta Ads',prob:'Media',imp:'Medio',m:'Velocidad de ejecución + foco LATAM + precio accesible + soporte en español son los diferenciales a mantener.'},
{r:'Regulación de publicidad digital más restrictiva',prob:'Baja',imp:'Medio',m:'El sistema genera ads que respetan las políticas de Meta/Google por diseño. Revisión automática de compliance antes de publicar.'}
],
conclusion:['Ads IA para Meta y Google tiene el mercado más grande del portafolio (480K anunciantes en LATAM) y el argumento de venta más simple: 30% del costo de una agencia con resultados mejores. Eso es imbatible en el segmento PYME.','El diferencial sostenible está en los datos acumulados de qué copy convierte mejor en qué industria en LATAM. Después de 12 meses y 250 clientes, el sistema tendrá el dataset de publicidad en español más valioso del mercado.','La expansión al modelo de agencias (white-label) es el camino para multiplicar la base de clientes sin multiplicar el equipo de ventas. Una agencia que usa el sistema internamente puede atender a 50 clientes con el mismo equipo que antes servía a 15.'],
primer_paso:'Esta semana: tomar el presupuesto de Meta Ads de la última campaña propia o de un contacto conocido. Pedir 3 meses de datos de performance (CTR, CPC, ROAS por ad). Pasarlos a Claude y pedirle que analice qué patrones tiene el mejor ad vs el peor. Usar ese análisis para generar 5 nuevas variaciones. Publicarlas manualmente y medir por 2 semanas. Ese experimento es el proof of concept.'
},

// #9
{slug:'cobranza-inteligente-latam',nombre:'Cobranza Inteligente IA LATAM',categoria:'Fintech IA',ticket:349,mvp_meses:4,validado:'USA · Brasil',
tagline:'Recupera el 40% de las deudas vencidas sin llamadas incómodas — la IA negocia por WhatsApp de forma inteligente y empática.',
propuesta_valor:'Automatizar la cobranza de morosos por WhatsApp con IA que negocia planes de pago de forma empática y personalizada, recuperando un 40% más de deudas que los métodos tradicionales.',
intro:['Cobranza Inteligente IA LATAM ocupa el #9 del ranking por ser la oportunidad más subestimada del portafolio. El mercado de deuda morosa en LATAM supera los $850B y la tasa de recupero con métodos tradicionales es del 20-30%. La IA puede duplicar esa tasa.','El problema de cobranza es universal y doloroso: toda empresa que vende a crédito tiene cuentas por cobrar vencidas. La cobranza humana es cara, ineficiente, y genera tensión en la relación comercial. La cobranza automatizada con IA puede ser empática, persistente y disponible 24/7.','Este es el producto más diferenciado del portafolio en términos de pain: el cliente siente el dinero perdido todos los días. El ROI de recuperar el 40% más de deuda morosa es inmediato y masivo.'],
problema:['En Argentina, Uruguay y LATAM en general, entre el 15-25% de las cuentas por cobrar B2B tienen algún atraso. El flujo de caja de las PYMEs depende críticamente de cobrar a tiempo, pero la cobranza es una de las tareas más evitadas por los equipos comerciales porque daña la relación con el cliente.','Los métodos tradicionales de cobranza son: llamadas telefónicas (invasivas, costosas, con tasa de contacto del 20-30%), cartas certificadas (lentas y caras), estudio de abogados (extremo y costoso), o simplemente ignorar el atraso y asumir la pérdida.','WhatsApp cambió la ecuación: un mensaje de WhatsApp bien diseñado tiene tasa de apertura del 95% y permite una conversación empática de negociación en el momento que el deudor tiene tiempo y disposición. La IA puede hacer esto para miles de deudores simultáneamente.'],
solucion:['El sistema importa la cartera de deudores (desde el ERP, Excel, o API de facturación), segmenta por nivel de riesgo (días de atraso, monto, historial), y diseña la secuencia de comunicación óptima para cada segmento.','Claude redacta mensajes de WhatsApp que son empáticos, claros y propositivos: no amenazan, no presionan de forma agresiva, sino que entienden la situación del deudor y ofrecen alternativas reales (plan de cuotas, descuento por pago inmediato, extensión de plazo).','El agente negocia automáticamente: si el deudor responde que no puede pagar el total, el sistema ofrece un plan de cuotas calculado en tiempo real. Si acepta, genera automáticamente el acuerdo de pago y lo envía por WhatsApp para firma digital.'],
mercado:{tam:'$12B',sam:'$680M',cagr:'16% anual',clientes_est:'+85.000 empresas con cartera de crédito activa en LATAM',
segmento:'Distribuidoras, empresas de servicios con facturación a plazo, clínicas médicas, academias, cooperativas de crédito, mutuales y PYMEs con más de 50 clientes activos.',
analisis:['El mercado de debt collection technology creció explosivamente post-COVID: TrueAccord (USA) levantó $50M, Resolve ($150M), Gaviti ($18M). Ninguno opera en LATAM en español.','En LATAM, la regulación de cobranza es menos estricta que en USA, lo que permite mayor flexibilidad en el approach. Sin embargo, la ética y la empatía son igualmente importantes para preservar la relación comercial.','El costo de oportunidad de deuda no recuperada en LATAM es enorme: si una empresa tiene $100K de deuda morosa y recupera el 20% con métodos tradicionales, nuestro sistema podría recuperar el 40-50%, generando $20-30K de cash adicional — 50-100x el precio del software.']},
criterios:[
{s:8,n:'$12B de mercado global. En LATAM, $680M de TAM con 85.000 empresas con cartera de crédito.'},
{s:9,n:'No existe alternativa en español con IA. TrueAccord y Gaviti son solo para USA.'},
{s:7,n:'MVP en 4 meses: importar cartera + WhatsApp secuencias + plan de pago automático.'},
{s:8,n:'El ROI es tan claro que el primer cliente puede cerrarse en la semana 3 del proyecto.'},
{s:8,n:'85K empresas x ticket $349 = mercado masivo. 100 clientes = $34.900 MRR.'},
{s:9,n:'El sistema aprende qué mensajes y ofertas funcionan mejor por industria y perfil de deudor.'},
{s:8,n:'El equipo tiene red de contactos en distribución y servicios — los sectores con más morosos.'},
{s:8,n:'Dependencia de WhatsApp Business API principalmente. ERP integrations como riesgo secundario.'},
{s:8,n:'Los datos de qué estrategias recuperan mejor por perfil de deudor son un moat exclusivo.'},
{s:10,n:'ROI del 20-30x: recuperar $30K adicional de deuda morosa por empresa x $349/mes = el argumento más claro del portafolio.'},
{s:9,n:'WTP altísima: si la empresa tiene $100K de morosos, $349/mes es irrelevante vs el retorno potencial.'},
{s:7,n:'CAC moderado: la venta requiere demostrar el sistema con la cartera real del cliente. Ciclo de 3-4 semanas.'},
{s:9,n:'Alta retención: la empresa siempre tiene nueva deuda morosa. Es un servicio recurrente permanente.'},
{s:6,n:'Viral bajo: el tema de cobranza es sensible y no se comparte públicamente. Referidos B2B son el canal.'},
{s:8,n:'El equipo conoce el pain de cobrar en LATAM — lo vivieron con sus propios negocios de distribución.'}
],
foda:{
f:[{t:'Pain del día 1 con ROI inmediato',d:'El cliente siente el dinero que no cobra todos los días. El ROI de recuperar más deuda es tan claro que se vende solo.'},
{t:'WhatsApp como canal empático',d:'Un mensaje de WhatsApp bien diseñado es 5x más efectivo que una llamada telefónica de cobranza. El canal humaniza la interacción.'},
{t:'Empatía como diferenciador vs cobranza agresiva',d:'Claude redacta mensajes que preservan la relación comercial mientras recuperan el dinero. Eso no lo puede hacer un cobrador humano bajo presión de métricas.'},
{t:'Acuerdo de pago automático',d:'El agente negocia y genera el acuerdo sin intervención humana. El deudor firma y el sistema registra el compromiso automáticamente.'}],
o:[{t:'Fintech de crédito LATAM como canal',d:'Las fintechs de crédito (Konfio, Kueski, Nuvocargo) necesitan cobranza masiva de sus propios portfolios. Son clientes enterprise con alto ticket.'},
{t:'Gobierno como cliente',d:'Organismos públicos con deuda de servicios (agua, luz, predial) tienen millones de morosos. El mercado municipal/estatal es enorme.'},
{t:'Modelo de éxito + SaaS',d:'Cobrar un % de la deuda recuperada adicional (2-5%) además del SaaS aumenta el alignment y el potencial de ingresos variables.'},
{t:'Expansión a deuda de consumo',d:'Bancos y tarjetas de crédito tienen carteras de deuda masivas. El modelo puede escalar a B2C con las adaptaciones de compliance necesarias.'}],
d:[{t:'Sensibilidad legal de la cobranza',d:'Las prácticas de cobranza tienen restricciones legales que varían por país. El sistema debe compliance con cada jurisdicción donde opere.'},
{t:'Integración con ERP/facturación compleja',d:'Importar la cartera desde el sistema de cada cliente puede ser técnicamente complejo. Cada empresa tiene su propio ERP o sistema de facturación.'},
{t:'Percepción negativa de la automatización en cobranza',d:'Algunos clientes pueden percibir que automatizar la cobranza daña la relación con sus clientes. La narrativa debe enfocarse en empatía, no en automatización.'},
{t:'Calidad de datos de contacto de deudores',d:'Si la empresa no tiene el WhatsApp actualizado del deudor, el sistema no puede contactarlos. La calidad de la base de datos es un limitante real.'}],
a:[{t:'Estudios de abogados con IA',d:'Estudios de cobranza judicial están adoptando IA para automatizar su proceso. Pueden entrar al espacio pre-judicial con precios bajos.'},
{t:'Regulación más restrictiva de WhatsApp para cobranza',d:'Meta puede implementar restricciones específicas para mensajes de cobranza. Hay que mantener compliance actualizado.'},
{t:'Fintechs de crédito con cobranza internalizada',d:'Las fintechs grandes pueden construir su propio sistema de cobranza con IA. Nuestro mercado primary son las PYMEs no tech.'},
{t:'Resistencia cultural a la cobranza por WhatsApp',d:'En algunos sectores o regiones, los deudores pueden bloquear el número o reportarlo. Hay que diseñar el approach para maximizar respuesta y minimizar rechazo.'}]
},
gtm:[
{fase:'Distribuidoras y empresas de servicios con facturación a plazo',periodo:'Mes 1-4',
desc:'Las distribuidoras tienen las carteras de morosos más grandes y el ROI más demostrable. La demo usa la cartera real del cliente y muestra cuánto dinero podría recuperar.',
canales:['Prospección directa a dueños de distribuidoras y empresas de servicios B2B','Cámaras de comercio y asociaciones industriales','Demo: análisis de cartera del cliente en tiempo real para estimar el recovery potencial'],
kpis:['15 clientes activos (distribuidoras, servicios B2B)','MRR: $5.235','Recovery rate demostrada: > 35%']},
{fase:'Fintechs y cooperativas de crédito',periodo:'Mes 5-8',
desc:'Las cooperativas de crédito y mutuales tienen carteras grandes y alto ticket. Las fintechs de crédito son el paso hacia enterprise.',
canales:['Asociaciones de cooperativas de crédito (LATAM tiene 50M+ cooperativistas)','Events de fintech: Finnosummit, Latam Fintech Hub','LinkedIn outreach a CFOs y directores de riesgo'],
kpis:['50 clientes activos','MRR: $17.450','Primer contrato > $2.000/mes con fintech o cooperativa']},
{fase:'Enterprise y modelo de éxito',periodo:'Mes 9-12',
desc:'Lanzar modelo de pricing híbrido: SaaS base + % de recovery adicional demostrable. Expandir a organismos públicos municipales.',
canales:['Alianzas con consultoras de crédito y riesgo','Sector público: municipios y organismos con deuda de servicios','Expansión a Colombia y México'],
kpis:['100 clientes activos','MRR: $34.900','10% de clientes en modelo de éxito']}
],
tech:[
{capa:'WhatsApp',nombre:'WhatsApp Business API (Meta Cloud)',razon:'Canal principal de contacto. Las plantillas aprobadas garantizan entregabilidad y compliance con políticas de Meta.'},
{capa:'LLM',nombre:'Claude 3.5 Sonnet',razon:'Generación de mensajes empáticos y negociación de planes de pago en tiempo real con contexto completo de la deuda.'},
{capa:'Data Import',nombre:'Supabase + Papa Parse',razon:'Import de carteras desde Excel, CSV, Google Sheets. APIs de integración con ERPs comunes (SAP, Odoo, Bsale).'},
{capa:'Firma digital',nombre:'DocuSign API / Autofirma',razon:'Generación y firma de acuerdos de pago directamente desde el chat de WhatsApp.'},
{capa:'Pagos',nombre:'MercadoPago API + Stripe',razon:'Link de pago directo en el chat para que el deudor pague inmediatamente. LATAM-native con MercadoPago.'}
],
precios:[
{plan:'PYME',precio:'$199',para:'Cartera < 200 deudores activos',incluye:['Hasta 200 deudores en gestión','WhatsApp + Email','Import desde Excel','Acuerdos de pago básicos','Reportes de recovery']},
{plan:'Business',precio:'$349',para:'Cartera 200-2.000 deudores',incluye:['Hasta 2.000 deudores','Segmentación por riesgo automática','Acuerdos de pago con firma digital','Link de pago MercadoPago','Integración ERP básica','Dashboard de recovery en tiempo real']},
{plan:'Enterprise',precio:'$899',para:'Fintechs, cooperativas, organismos',incluye:['Deudores ilimitados','API de integración propia','Modelo de éxito opcional (+% recovery)','Compliance y reportes regulatorios','Customer Success dedicado']}
],
financiero:[
{q:'Q1 (Mes 1-4)',cli:15,mrr:5235,nota:'Distribuidoras. Recovery rate validado.'},
{q:'Q2 (Mes 5-7)',cli:40,mrr:13960,nota:'Cooperativas. Modelo de éxito beta.'},
{q:'Q3 (Mes 8-10)',cli:70,mrr:24430,nota:'Enterprise. Organismos públicos.'},
{q:'Q4 (Mes 11-12)',cli:100,mrr:34900,nota:'Escala. México y Colombia.'}
],payback:'Break-even mes 5. Modelo de éxito puede duplicar revenue por cliente.',
roadmap:[
{p:'Mes 1-3',titulo:'MVP cobranza por WhatsApp',h:['Import de cartera desde Excel. Segmentación por días de atraso y monto','Secuencias de WhatsApp por segmento con Claude redactando los mensajes','Dashboard básico de recovery: qué % se contactó, respondió, pagó'],kpi:'5 clientes piloto con recovery rate documentado > 30%'},
{p:'Mes 4-6',titulo:'Acuerdos de pago automáticos',h:['Negociación de plan de cuotas en el chat sin intervención humana','Firma digital del acuerdo de pago directamente en WhatsApp','Link de pago MercadoPago/Stripe en el chat'],kpi:'30 clientes, MRR $10.470'},
{p:'Mes 7-9',titulo:'Integración ERP y enterprise',h:['APIs de integración con SAP Business One, Odoo y Bsale','Modelo de precios de éxito: base SaaS + % de recovery','Dashboard de riesgo predictivo: qué facturas van a vencer en 30 días'],kpi:'65 clientes, MRR $22.685'},
{p:'Mes 10-12',titulo:'Expansión y sector público',h:['Módulo para organismos públicos con reportes de compliance','Expansión México y Colombia','Partners: estudios contables que ofrecen el servicio a sus clientes'],kpi:'100 clientes, MRR $34.900'}
],
competidores:[
{nombre:'TrueAccord (USA)',f:'Líder del mercado americano con $50M levantados y modelo probado',d:'Solo opera en USA, en inglés, sin WhatsApp, no conoce la cultura de deuda de LATAM',g:'LATAM-native + WhatsApp + empatía cultural + precio accesible para PYME = mercado exclusivo por 2-3 años'},
{nombre:'Cobrador telefónico',f:'Interacción humana real que puede improvisar y empatizar en tiempo real',d:'Costo $600-1.200/mes por cobrador. Tasa de contacto del 20%. Agresivos por presión de métricas.',g:'95% tasa apertura WhatsApp vs 20% llamadas + empatía calibrada vs presión + precio 50% menor'},
{nombre:'Estudio jurídico de cobranza',f:'Poder legal real. Los deudores los toman más en serio cuando hay amenaza judicial.',d:'Se activan solo para deudas > $5.000. Costosos (10-30% del monto). Dañan la relación comercial.',g:'Activamos en deudas chicas que el estudio no toca + preservamos la relación + costo fijo vs % del monto'}
],
riesgos:[
{r:'Meta restringe WhatsApp para comunicaciones de cobranza',prob:'Baja',imp:'Alto',m:'Mantener compliance: templates aprobados, opt-out fácil, no amenazar. Tener email como canal backup.'},
{r:'Regulación de cobranza más estricta en algún país de LATAM',prob:'Media',imp:'Medio',m:'Legal review por país antes de operar. El sistema puede configurarse por país con diferentes restricciones de timing y tono.'},
{r:'Baja calidad de datos de contacto en la cartera del cliente',prob:'Alta',imp:'Medio',m:'Proceso de enriquecimiento de datos como service adicional. Integración con bases de datos de enriquecimiento.'},
{r:'Resistencia del cliente a mostrar su cartera de morosos',prob:'Media',imp:'Bajo',m:'NDA estándar. Política clara de no compartir datos entre clientes. Arquitectura multi-tenant con aislamiento total.'}
],
conclusion:['Cobranza Inteligente IA LATAM es la apuesta más diferenciada del portafolio en términos de pain. El ROI de recuperar más deuda morosa es tan claro y cuantificable que la venta prácticamente se hace sola — el cliente calcula cuánto recuperaría con una mejora del 20% en su recovery rate y el precio de $349/mes se vuelve irrelevante.','La estrategia de entrar por PYMEs distribuidoras y escalar hacia fintechs y cooperativas de crédito sigue la misma lógica: empezar donde el pain es visible y el ciclo de venta es corto, para luego expandir hacia contratos más grandes con evidencia de resultado.','El modelo de éxito (base SaaS + % de recovery adicional demostrado) es el diferenciador que convierte este producto de una herramienta de $349/mes a un socio estratégico que gana cuando el cliente gana. Ese alignment de incentivos es el moat más defensible de todos.'],
primer_paso:'Esta semana: contactar a 3 empresas conocidas del network que tengan cuentas por cobrar vencidas. Pedirles el total de su cartera morosa actual y cuánto recuperan con sus métodos actuales. Con esos números, calcular cuánto dinero adicional recuperarían con un 20% de mejora. Ese número vs el precio de $349/mes es el argumento de venta definitivo. Si la respuesta es "recuperaría $5.000 más por mes", el deal se cierra en esa misma conversación.'
},

// #10
{slug:'publicaciones-ml-masivas',nombre:'Publicaciones ML Masivas IA',categoria:'E-commerce IA',ticket:299,mvp_meses:2,validado:'Argentina · Brasil · México',
tagline:'Publica miles de productos en Mercado Libre automáticamente con títulos, descripciones y categorías optimizadas por IA.',
propuesta_valor:'Automatizar la publicación masiva de productos en Mercado Libre con títulos optimizados para el algoritmo, descripciones de conversión y categorización correcta — haciendo en 1 hora lo que toma 3 días manualmente.',
intro:['Publicaciones ML Masivas IA ocupa el #10 por una razón simple: el equipo ya opera Mercado Libre a escala y conoce mejor que nadie el pain de publicar y mantener catálogos masivos. Son los usuarios primarios y los mejores vendedores de este producto.','El mercado de Mercado Libre creció al 34% en 2023-2024. Hay más de 200.000 vendedores activos con más de 100 publicaciones en Argentina, Uruguay, Brasil y México. Cada uno de ellos tiene el mismo problema: publicar bien lleva mucho tiempo.','El algoritmo de Mercado Libre favorece fuertemente las publicaciones con títulos optimizados para búsqueda, descripciones largas y completas, y categorización precisa. La mayoría de los vendedores no tienen los recursos para hacer esto bien para todo su catálogo.'],
problema:['Un vendedor de Mercado Libre con 1.000 SKUs necesita publicar cada producto con: título optimizado para búsqueda (máx. 60 caracteres con keywords exactas del buscador ML), descripción de 200+ palabras, atributos completos y categoría correcta. Hacer esto bien manualmente toma 15-30 minutos por producto.','Multiplicado por 1.000 productos = 250-500 horas de trabajo. Solo para la carga inicial. Después viene el mantenimiento: cambios de precio, actualización de stock, mejora de publicaciones que no están convirtiendo.','Los vendedores que no optimizan sus publicaciones tienen 5-10x menos visibilidad orgánica en el buscador de ML. La diferencia entre una publicación bien optimizada y una mal hecha puede ser la diferencia entre vender 100 unidades por mes y 10.'],
solucion:['El cliente sube su catálogo (Excel, CSV, o conectado a su sistema de gestión) con el nombre genérico del producto, precio y atributos básicos. Claude genera automáticamente el título optimizado para el algoritmo de ML (con keywords de alto volumen en el buscador), la descripción completa de conversión, y sugiere la categoría y atributos correctos.','La integración con la API de Mercado Libre permite publicar directamente desde la plataforma sin ir item por item. Un catálogo de 1.000 productos se publica en 1-2 horas en lugar de semanas.','El sistema de optimización continua monitorea qué publicaciones tienen bajo CTR o pocas visitas y sugiere mejoras: cambios de título, palabras clave nuevas para agregar, preguntas frecuentes de los compradores para responder en la descripción.'],
mercado:{tam:'$3.2B',sam:'$240M',cagr:'28% anual',clientes_est:'+200.000 vendedores ML con catálogo de 100+ productos en LATAM',
segmento:'Vendedores de Mercado Libre con 100-50.000 SKUs activos. Distribuidoras, importadores, fabricantes con canal online, y marcas con tiendas ML.',
analisis:['Mercado Libre tiene más de 218 millones de usuarios únicos y procesa más de 30 millones de transacciones por mes. El ecosistema de herramientas para vendedores ML es enorme pero las herramientas de IA para optimización de publicaciones son casi inexistentes.','El equipo ya opera en Mercado Libre y conoce de primera mano qué diferencia a un vendedor top de uno promedio. Esa expertise de dominio es un diferenciador que no tiene precio y que ningún competidor externo puede replicar fácilmente.','El timing es perfecto: la API de ML mejoró significativamente en 2024, permitiendo publicación y actualización masiva de manera estable. Claude puede optimizar texto de publicaciones con un nivel de calidad que ninguna herramienta de keyword stuffing tradicional puede alcanzar.']},
criterios:[
{s:8,n:'200K vendedores ML con catálogo grande en LATAM. Mercado de $3.2B en e-commerce tools.'},
{s:7,n:'Herramientas básicas de gestión ML existen (Nuvemshop, Bling) pero sin IA de calidad para contenido.'},
{s:9,n:'MVP en 2 meses: Excel upload + Claude genera contenido + ML API publica. El más rápido del portafolio.'},
{s:9,n:'La demo usa el catálogo del propio vendedor ML. Los resultados son visibles en 15 minutos.'},
{s:8,n:'200 clientes x $299 = $59.800 MRR. Segmento de vendedores grandes con alto ticket potencial.'},
{s:9,n:'El sistema aprende qué títulos funcionan mejor en cada categoría de ML. Datos acumulados únicos.'},
{s:10,n:'El equipo opera ML a escala. Son literalmente los mejores posibles para construir y vender este producto.'},
{s:7,n:'Dependencia de API de Mercado Libre. Cambios en la API requieren actualizaciones del sistema.'},
{s:8,n:'Datos de qué títulos y descripciones convierten mejor por categoría en ML son exclusivos.'},
{s:9,n:'ROI inmediato: si 100 publicaciones mal hechas pasan a estar bien optimizadas, las ventas se multiplican en semanas.'},
{s:9,n:'$299/mes es irrelevante para un vendedor que hace $50K+/mes en ML. WTP altísima.'},
{s:9,n:'CAC muy bajo: el equipo tiene la comunidad de vendedores ML más amplia posible en Argentina y Uruguay.'},
{s:9,n:'Alta retención: los vendedores siempre tienen nuevos productos que publicar y publicaciones que optimizar.'},
{s:7,n:'Viral en comunidades de vendedores ML: los resultados de ventas se comparten entre pares.'},
{s:10,n:'Máximo fit posible: el equipo construye el producto que ellos mismos más necesitan.'}
],
foda:{
f:[{t:'El equipo son los usuarios #1',d:'Agustín y el Flaco operan ML a escala. Ningún competidor puede tener mejor comprensión del problema ni mejor demo de credibilidad.'},
{t:'MVP en 2 meses = el más rápido del portafolio',d:'La integración con ML API + Claude para contenido es técnicamente sencilla. El primer cliente puede estar pagando en semana 10.'},
{t:'Red de vendedores ML como canal de ventas',d:'Los primeros 50 clientes pueden venir de la red directa de vendedores ML que el equipo ya conoce en Argentina y Uruguay.'},
{t:'Datos de conversión por categoría ML = moat exclusivo',d:'Después de 12 meses y 200 clientes, el sistema sabe qué funciona en electrónica, ropa, ferretería, etc. Nadie más tiene eso.'}],
o:[{t:'Brasil: el mercado más grande de ML',d:'ML Brasil tiene el doble de usuarios que Argentina. Un producto en portugués puede multiplicar el TAM por 3.'},
{t:'Contenido de imágenes con IA',d:'Agregar generación de imágenes de producto con fondo blanco + infografías con IA amplía el valor del producto significativamente.'},
{t:'Optimización continua post-publicación',d:'Un módulo que monitorea CTR, visitas y conversión por publicación y sugiere mejoras automáticamente crea el diferencial del producto maduro.'},
{t:'Exportar a otras plataformas',d:'Los mismos contenidos optimizados para ML pueden exportarse a Falabella, Linio, Amazon LATAM, y el e-commerce propio del vendedor.'}],
d:[{t:'Dependencia de la API de ML',d:'Mercado Libre puede cambiar su API, sus restricciones de publicación o sus algoritmos. Hay que adaptarse rápidamente.'},
{t:'Necesita catálogo organizado del cliente',d:'Si el cliente tiene su catálogo desorganizado en Excel viejo, el sistema necesita limpieza de datos antes de poder procesar.'},
{t:'Resultado depende de la calidad de la foto del producto',d:'Una buena publicación de ML necesita también buenas fotos. El texto puede ser perfecto pero si la foto es mala, no convierte.'},
{t:'Competencia de vendedores ML que lo hacen manual bien',d:'Los vendedores top de ML ya tienen equipos dedicados a optimizar publicaciones. El producto compite con ese personal interno.'}],
a:[{t:'ML lanzando herramientas de IA nativas para vendedores',d:'ML puede lanzar su propia IA de optimización de publicaciones. Con su acceso a datos de conversión propios, serían muy buenos en esto.'},
{t:'Herramientas genéricas de e-commerce con IA',d:'Shopify, WooCommerce y otras plataformas están integrando IA para contenido de producto. Pueden expandirse a ML.'},
{t:'Cambio de algoritmo de ML',d:'Un cambio significativo en cómo ML rankea publicaciones puede invalidar los patrones aprendidos por el sistema.'},
{t:'Competidores de la comunidad ML',d:'Vendedores top de ML que ya tienen este proceso interno pueden lanzar un SaaS similar con la credibilidad del equipo.'}]
},
gtm:[
{fase:'Red de vendedores ML del equipo',periodo:'Mes 1-2',
desc:'Los primeros clientes salen de la red directa de contactos. El demo es publicar 10 productos del vendedor en tiempo real en la reunión. Los resultados son visibles en la semana siguiente.',
canales:['Red de vendedores ML del network directo del equipo','Grupos de vendedores ML en WhatsApp y Facebook (comunidades enormes en LATAM)','Demo live en la reunión usando el catálogo del prospecto'],
kpis:['20 clientes activos','MRR: $5.980','Al menos 5 clientes con ventas visiblemente mejoradas para referidos']},
{fase:'Comunidades y contenido',periodo:'Mes 3-5',
desc:'Las comunidades de vendedores ML en Facebook, WhatsApp y YouTube son masivas. Contenido mostrando resultados reales de optimización de títulos y el impacto en ventas es el mejor marketing posible.',
canales:['YouTube: "Optimicé 500 publicaciones ML con IA — estos fueron los resultados"','Groups de Facebook de vendedores ML (200K+ miembros en Argentina)','Partnerships con consultores de ML que asesoran a vendedores'],
kpis:['100 clientes activos','MRR: $29.900','Video con 50K+ views']},
{fase:'Brasil y funciones avanzadas',periodo:'Mes 6-12',
desc:'Lanzamiento en Brasil con versión en portugués. Módulo de monitoreo y optimización continua. Integración con Amazon LATAM y Falabella.',
canales:['Comunidades de vendedores ML Brasil (aún más grandes que Argentina)','Multi-plataforma: Falabella, Amazon LATAM, Linio','Paid ads en Google targeteando "vender en Mercado Libre"'],
kpis:['250 clientes activos','MRR: $74.750','Brasil: 30% de la base de clientes']}
],
tech:[
{capa:'ML Integration',nombre:'Mercado Libre API (Items API)',razon:'Publicación y actualización masiva de publicaciones. Reading de métricas de visitas, conversión y preguntas.'},
{capa:'LLM',nombre:'Claude 3.5 Sonnet',razon:'Generación de títulos optimizados para el buscador de ML, descripciones largas de conversión y sugerencia de atributos.'},
{capa:'Data Import',nombre:'Papa Parse + Google Sheets API',razon:'Import desde Excel, CSV y Google Sheets. La mayoría de los vendedores tienen su catálogo en alguno de estos formatos.'},
{capa:'SEO Keywords',nombre:'ML Search API + custom scraping',razon:'Extraer keywords de alto volumen del buscador de ML para cada categoría de producto y usarlas en los títulos.'},
{capa:'Backend',nombre:'Node.js + Supabase',razon:'Procesamiento de lotes grandes (10.000+ SKUs), job queue para no saturar la API de ML, historial de publicaciones.'}
],
precios:[
{plan:'Starter',precio:'$149',para:'Vendedores con 100-500 SKUs',incluye:['Hasta 500 publicaciones/mes','Generación de título + descripción','Import desde Excel/CSV','Publicación directa a ML','Reportes básicos de publicaciones']},
{plan:'Pro',precio:'$299',para:'Vendedores con 500-5.000 SKUs',incluye:['Hasta 5.000 publicaciones/mes','Optimización continua (sugerencias de mejora)','Monitoreo de visitas y conversión','Multi-cuenta ML','Soporte prioritario']},
{plan:'Enterprise',precio:'$599',para:'Distribuidoras y marcas con 5.000+ SKUs',incluye:['SKUs ilimitados','Multi-plataforma (ML + Falabella + Amazon)','API de integración con ERP','Dashboard analytics avanzado','Customer Success']}
],
financiero:[
{q:'Q1 (Mes 1-3)',cli:30,mrr:8970,nota:'Red directa de vendedores ML del equipo.'},
{q:'Q2 (Mes 4-6)',cli:90,mrr:26910,nota:'Comunidades ML. Contenido viral.'},
{q:'Q3 (Mes 7-9)',cli:170,mrr:50830,nota:'Brasil lanzado. Multi-plataforma.'},
{q:'Q4 (Mes 10-12)',cli:270,mrr:80730,nota:'Enterprise. Distribuidoras grandes.'}
],payback:'Break-even en mes 2. El CAC más bajo del portafolio.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP ultra rápido',h:['Import desde Excel + Claude genera título/descripción por producto','ML API: publicación directa con validación de campos requeridos','Dashboard básico: qué se publicó, cuándo, estado en ML'],kpi:'10 clientes activos. 1.000+ publicaciones generadas.'},
{p:'Mes 3-4',titulo:'Optimización continua',h:['Monitoreo de visitas, CTR y conversión por publicación','Sistema de alertas: "esta publicación tiene bajo CTR — click para ver la sugerencia de mejora"','Multi-cuenta ML para vendedores con más de 1 cuenta'],kpi:'80 clientes, MRR $23.920'},
{p:'Mes 5-8',titulo:'Brasil y multi-plataforma',h:['Versión en portugués con términos de búsqueda ML Brasil','Integración Falabella y Amazon LATAM básica','Análisis competitivo: cómo se compara la publicación vs los top vendedores de la misma categoría'],kpi:'200 clientes, MRR $59.800'},
{p:'Mes 9-12',titulo:'Enterprise y API',h:['API de integración con ERPs (Odoo, SAP B1, Bsale) para vendedores enterprise','Módulo de precios dinámicos básico (ver idea #19 del ranking)','Programa de certificación para consultores ML que revenden el producto'],kpi:'270 clientes, MRR $80.730'}
],
competidores:[
{nombre:'Bling (Brasil)',f:'ERP completo para vendedores ML con muchas integraciones. Dominante en Brasil.',d:'Sin IA de calidad para generación de contenido. Herramienta de gestión, no de optimización de publicaciones.',g:'IA para contenido de calidad = la publicación perfecta. Somos el complemento de Bling, no el reemplazo.'},
{nombre:'Consultor manual de ML',f:'Conocimiento profundo del algoritmo, experiencia, pode mejorar casos específicos complejos',d:'Cobra $30-50 por publicación. Para 1.000 productos = $30.000-50.000. Inaccesible.',g:'$299/mes para SKUs ilimitados. El mismo nivel de calidad a 1/100 del costo.'},
{nombre:'El equipo propio de publicaciones',f:'Conoce el negocio del vendedor perfectamente. Puede hacer iteraciones rápidas.',d:'Cuesta $800-1.500/mes por persona. Solo pueden hacer 50-100 publicaciones buenas por semana.',g:'1.000 publicaciones en 2 horas vs 1.000 publicaciones en 5-10 semanas. La velocidad lo cambia todo.'}
],
riesgos:[
{r:'ML cambia su algoritmo de ranking',prob:'Alta',imp:'Medio',m:'Monitorear constantemente el algoritmo y adaptar los patrones de generación. El producto debe iterar con el ecosistema ML.'},
{r:'ML lanza herramientas de IA nativas para vendedores',prob:'Media',imp:'Alto',m:'Nuestro moat: datos de múltiples categorías y miles de clientes. ML conoce su propio algoritmo pero nosotros conocemos qué copy convierte en cada nicho.'},
{r:'Saturación del mercado ML',prob:'Baja',imp:'Medio',m:'El mercado ML LATAM sigue creciendo al 30%+ anual. Hay espacio para years de crecimiento antes de saturación.'},
{r:'Cambio en la política de uso de la API de ML',prob:'Baja',imp:'Alto',m:'Mantener cuenta de ML Partner certificada. Seguir las políticas de uso de API. Tener contacto directo con el equipo de ML.'}
],
conclusion:['Publicaciones ML Masivas IA es el producto con el CAC más bajo del portafolio por una razón simple: el equipo tiene la red de vendedores ML más directa posible. Los primeros 30 clientes vienen del network existente sin costo de adquisición.','El diferencial vs herramientas de gestión como Bling es el contenido: esas herramientas gestionan el catálogo pero no lo optimizan. Claude genera el título perfecto para el algoritmo de ML, la descripción que convierte, y los atributos que ML necesita para rankear bien. Eso es lo que multiplica las ventas.','La expansión a Brasil, que tiene el doble de vendedores activos en ML que Argentina, es el paso que convierte este producto de $80K MRR a $200K+ MRR. La versión en portugués es el unlock que multiplica el mercado por 3.'],
primer_paso:'Esta semana: tomar 20 publicaciones propias de ML que tengan bajo CTR o pocas visitas. Pasarlas a Claude con el prompt: "Eres experto en Mercado Libre. Optimiza este título para el buscador de ML (máx 60 chars, incluye modelo, marca, características clave). Genera descripción de 300 palabras orientada a conversión." Publicar las versiones mejoradas y medir el CTR la semana siguiente. Ese experimento es el MVP del producto.'
},

// #11-20: versiones más compactas
// #11
{slug:'descripcion-masiva-productos',nombre:'Descripción Masiva de Productos IA',categoria:'E-commerce IA',ticket:199,mvp_meses:2,validado:'USA · España · Brasil',
tagline:'Genera fichas de producto profesionales, SEO-optimizadas y en tu tono de marca para todo tu catálogo en horas.',
propuesta_valor:'Generar descripciones de producto persuasivas y optimizadas para SEO y conversión para catálogos de miles de SKUs con IA, en horas en lugar de meses.',
intro:['Descripción Masiva de Productos IA es el #11 del ranking por ser el produto con el mercado más amplio y horizontal del portafolio. Cualquier tienda online, distribuidor o fabricante con más de 50 productos tiene este problema.','El e-commerce global creció al 23% en 2023-2024 y el número de SKUs que cada tienda necesita describir correctamente se multiplica cada año. La diferencia entre una ficha de producto bien escrita y una mal escrita puede ser del 30-50% en tasa de conversión.','El equipo ya entiende e-commerce profundamente por la operación en ML. Ese conocimiento de dominio hace este producto extremadamente fácil de posicionar y vender.'],
problema:['Una tienda online con 5.000 SKUs necesita 5.000 descripciones únicas, optimizadas para SEO y para conversión. Escribir una descripción buena toma 20-40 minutos por producto = 1.666-3.333 horas de trabajo. Para las distribuidoras y los fabricantes con catálogos de 10.000+ SKUs, esto es un cuello de botella que paraliza el lanzamiento de nuevas líneas.','El contenido genérico del proveedor (copiado al catálogo del distribuidor) genera penalizaciones de duplicate content en Google y baja conversión porque no está adaptado al tono ni al ICP de cada tienda. El contenido único es obligatorio para rankear y para convertir.','El resultado en la mayoría de los e-commerces LATAM es que el 80% de su catálogo tiene fichas de producto mediocres o copiadas que no convierten ni rankean en Google.'],
solucion:['El cliente sube su catálogo (Excel, CSV, Shopify export) con el nombre del producto, marca, atributos técnicos básicos y hasta 3 fotos (opcionales). Claude genera para cada producto: título SEO-optimizado, descripción larga persuasiva de 200-400 palabras, meta description para Google, y bullet points de características clave.','El sistema permite definir el tono de marca (formal, amigable, técnico, joven) y las keywords objetivo por categoría. El resultado es consistente con la voz de la marca en todos los productos del catálogo.','Integración directa con Shopify, WooCommerce, Tiendanube y Wix para subir las descripciones directamente al e-commerce sin exportar/importar archivos.'],
mercado:{tam:'$4.1B',sam:'$280M',cagr:'24% anual',clientes_est:'+320.000 tiendas online con 50+ SKUs en LATAM',
segmento:'Distribuidoras con catálogo amplio, fabricantes con canal online, marcas de ropa/accesorios, tiendas de electrónica, ferreterías y cualquier e-commerce con más de 100 SKUs.',
analisis:['El mercado de e-commerce content generation está validado por tools como Copysmith ($10M ARR), Jasper ($125M levantados) y Rytr. Ninguno está localizado para LATAM ni integra natively con las plataformas dominantes en la región.','En LATAM, Shopify y Tiendanube son las plataformas dominantes. Tiendanube tiene 150.000+ tiendas en Argentina y Brasil. Ser el partner oficial de contenido IA de Tiendanube es el canal de distribución de mayor leverage posible.','El timing es perfecto: las plataformas de e-commerce están buscando activamente integraciones de IA para sus merchants. El momento de ser el primer socio de contenido IA para plataformas como Tiendanube o MercadoShops es ahora.']},
criterios:[
{s:9,n:'320K tiendas online en LATAM con 50+ SKUs son clientes naturales. Mercado de $4.1B.'},
{s:7,n:'Copysmith y Jasper existen pero sin integración LATAM ni foco en fichas de producto en español.'},
{s:9,n:'MVP en 2 meses: Excel upload + Claude + export a Shopify/WooCommerce. Más sencillo que ML API.'},
{s:9,n:'Demo en reunión: generar 10 fichas del catálogo del cliente en 10 minutos. El producto se vende solo.'},
{s:8,n:'Con 300 clientes a $199 = $59.700 MRR. Mercado masivo con ticket relativamente bajo pero alto volumen.'},
{s:9,n:'El sistema aprende el tono de cada marca y mejora con cada lote de descripciones generadas.'},
{s:9,n:'El equipo tiene e-commerce expertise profundo de la operación ML. Conocen el problema desde adentro.'},
{s:8,n:'Dependencia de Claude API únicamente. Más simple que otros productos del portafolio.'},
{s:7,n:'Moat en integraciones nativas con plataformas LATAM. Tiendanube partnership sería difícil de replicar.'},
{s:9,n:'ROI directo: mejor conversión = más ventas. El cliente puede medir el impacto en % de conversión.'},
{s:8,n:'$199/mes es equivalente al salario de 1-2 horas de redactor. La ecuación es obvia.'},
{s:9,n:'CAC mínimo: la demo de 10 minutos cierra el deal. Posible partnership con Tiendanube como canal.'},
{s:9,n:'Alta retención: siempre hay nuevos productos que describir. El catálogo nunca termina de crecer.'},
{s:7,n:'Viral moderado entre e-commerces: los compradores notan la diferencia en calidad de fichas.'},
{s:9,n:'Fit altísimo: el equipo ya hace esto para sus propias publicaciones ML — son los mejores demostradores.'}
],
foda:{
f:[{t:'E-commerce expertise del equipo',d:'La operación ML del equipo es el mejor caso de uso propio. Pueden demostrar mejora de conversión con datos reales.'},
{t:'MVP el más simple del portafolio',d:'No hay API de terceros compleja. Solo Claude + Excel + export CSV o integración con Shopify. Listo en 6 semanas.'},
{t:'Mercado horizontal enorme',d:'Todo e-commerce con 50+ SKUs es un cliente potencial. Sin restricción de sector ni industria.'},
{t:'Tiendanube como canal de distribución',d:'Tiendanube con 150K tiendas en LATAM es el canal de distribución perfecto. Un acuerdo de integración es el GTM definitivo.'}],
o:[{t:'Tiendanube App Store',d:'Tiendanube tiene un App Store para integraciones. Ser una de las primeras apps de IA de contenido es un diferencial masivo.'},
{t:'Multilingual: portugués para Brasil',d:'Brasil tiene el doble de mercado que Argentina. Versión en portugués multiplica el TAM por 3 con mínima inversión adicional.'},
{t:'Generación de imágenes con IA',d:'Complementar las descripciones con imágenes de producto generadas o mejoradas con IA (fondo blanco, infografías) aumenta el valor del ticket.'},
{t:'SEO content para blog de e-commerce',d:'Expandir de fichas de producto a contenido de blog SEO para tiendas online amplía el caso de uso y el ticket promedio.'}],
d:[{t:'Precio bajo limita el soporte incluido',d:'A $199/mes no se puede dar soporte 1:1 intensivo. El producto debe ser lo suficientemente autónomo para que el cliente lo use sin ayuda.'},
{t:'Necesita inputs de calidad mínima',d:'Si el cliente sube solo "Remera negra M" como info del producto, el output de Claude no puede ser bueno. Garbage in, garbage out.'},
{t:'Diferenciación de tono entre clientes difícil de escalar',d:'Mantener el tono de marca específico de cada cliente a escala requiere un sistema de "brand voice" bien diseñado en el onboarding.'},
{t:'Competencia con redactores freelance',d:'Los redactores de e-commerce en plataformas como Workana cobran $5-15 por descripción. Para catálogos pequeños puede ser competitivo.'}],
a:[{t:'Shopify, Tiendanube y WooCommerce con IA nativa',d:'Las plataformas de e-commerce están integrando IA directamente. Si lanzan generación de contenido nativa, reducen el diferencial.'},
{t:'Jasper.ai entrando a LATAM',d:'Jasper con $125M levantados tiene los recursos para localizar al español. Si lo hace bien, es un competidor serio.'},
{t:'ChatGPT con templates de e-commerce',d:'Muchos dueños de tienda ya usan ChatGPT para descripciones. Nuestro valor debe ser la integración nativa, el volumen y la consistencia de marca.'},
{t:'Tiendanube lanza su propia IA de contenido',d:'Tiendanube puede construir esto internamente. Hay que establecer el partnership antes de que decidan hacerlo solos.'}]
},
gtm:[
{fase:'E-commerces grandes de Argentina y Uruguay',periodo:'Mes 1-2',
desc:'Atacar tiendas con 500+ SKUs donde el pain es más agudo. La demo genera las fichas de sus mejores productos en la reunión.',
canales:['Grupos de dueños de e-commerce en Facebook y WhatsApp','Comunidad de Tiendanube y Shopify LATAM','Demo live en 15 minutos con catálogo del cliente'],
kpis:['30 clientes activos','MRR: $5.970','Integración Tiendanube en negociación']},
{fase:'Partnership con plataformas y expansión',periodo:'Mes 3-7',
desc:'Cerrar integración con Tiendanube y/o Shopify LATAM como canal. Versión en portugués para Brasil.',
canales:['App Store de Tiendanube (150K tiendas)','Google Ads targeteando "descripciones de producto para e-commerce"','YouTube content mostrando antes/después de fichas'],
kpis:['150 clientes activos','MRR: $29.850','Brasil: 25% de clientes']},
{fase:'Generación de imágenes y SEO blog',periodo:'Mes 8-12',
desc:'Ampliar el producto a generación de imágenes (fondo blanco, infografías) y contenido de blog SEO.',
canales:['Upsell a clientes existentes de planes premium','Partnerships con agencias de e-commerce','Expansión México con content marketing local'],
kpis:['300 clientes activos','MRR: $59.700','Ticket promedio subiendo a $260']}
],
tech:[
{capa:'LLM',nombre:'Claude 3.5 Sonnet',razon:'Generación de texto de alta calidad en español con tono de marca consistente. Context largo para procesar catálogos completos.'},
{capa:'E-commerce',nombre:'Shopify API + Tiendanube API',razon:'Publicación directa de descripciones y títulos a las plataformas. Ahorra el paso de export/import de archivos.'},
{capa:'Import',nombre:'Papa Parse + Google Sheets',razon:'Import masivo desde Excel y CSV. Google Sheets para clientes que tienen el catálogo en Drive.'},
{capa:'Storage',nombre:'Supabase',razon:'Almacenamiento de catálogos, historial de generaciones y configuraciones de brand voice por cliente.'},
{capa:'Queue',nombre:'BullMQ',razon:'Procesamiento de catálogos grandes en background. Un catálogo de 10.000 SKUs puede tardar 2-3 horas.'}
],
precios:[
{plan:'Starter',precio:'$99',para:'Tiendas con 50-500 SKUs',incluye:['500 descripciones/mes','Integración Shopify/Tiendanube','Exportación CSV','Tono de marca básico']},
{plan:'Pro',precio:'$199',para:'Tiendas con 500-5.000 SKUs',incluye:['Descripciones ilimitadas','Multi-plataforma','Brand voice avanzado','SEO optimization','Soporte prioritario']},
{plan:'Distributor',precio:'$399',para:'Distribuidoras y fabricantes con 5K+ SKUs',incluye:['SKUs ilimitados','API de integración propia','Multi-tienda','Analytics de calidad de contenido']}
],
financiero:[
{q:'Q1 (Mes 1-2)',cli:30,mrr:5970,nota:'Red directa. E-commerces argentina/UY.'},
{q:'Q2 (Mes 3-5)',cli:90,mrr:17910,nota:'Tiendanube partnership. Brasil beta.'},
{q:'Q3 (Mes 6-9)',cli:200,mrr:39800,nota:'Brasil activo. México lanzado.'},
{q:'Q4 (Mes 10-12)',cli:320,mrr:63680,nota:'Enterprise. Distribuidoras grandes.'}
],payback:'Break-even mes 3. CAC mínimo por canal directo.',
roadmap:[
{p:'Mes 1-2',titulo:'MVP ultra rápido',h:['Import Excel + Claude genera ficha completa','Export CSV para Shopify/WooCommerce','Brand voice: el cliente define tono en 5 preguntas'],kpi:'10 clientes. 5.000 fichas generadas.'},
{p:'Mes 3-4',titulo:'Plataformas e integraciones',h:['Integración nativa Tiendanube y Shopify','Conversaciones de partnership con Tiendanube','Brasil: versión en portugués con keywords ML Brasil'],kpi:'80 clientes, MRR $15.920'},
{p:'Mes 5-9',titulo:'Escala y SEO',h:['SEO optimization: meta descriptions, H1, keywords densidad','Analytics de calidad: las fichas rankeando vs las que no','Integración con Google Merchant Center'],kpi:'220 clientes, MRR $43.780'},
{p:'Mes 10-12',titulo:'Enterprise y expansión',h:['Plan Enterprise para distribuidoras con 50K+ SKUs','API de integración para ERP/sistemas propios','México y Colombia con content marketing local'],kpi:'320 clientes, MRR $63.680'}
],
competidores:[
{nombre:'Jasper.ai',f:'$125M levantados, nombre reconocido, UI muy completa',d:'Sin integración con plataformas LATAM, sin foco en fichas de producto, en inglés, precio alto',g:'Integración nativa con Tiendanube + Shopify LATAM + español nativo + precio accesible = ganamos el 95% del mercado LATAM'},
{nombre:'Redactor freelance de e-commerce',f:'Conoce la marca del cliente, puede capturar matices muy específicos',d:'$5-15 por descripción = $500-1.500 para 100 productos. Para 5.000 productos = $25.000-75.000.',g:'$199/mes para SKUs ilimitados vs $50.000+ para el mismo catálogo. No hay argumento contra eso.'},
{nombre:'Tiendanube AI nativo (hipotético)',f:'Integrado en la plataforma, sin fricción de onboarding, conoce los productos del merchant',d:'No existe todavía. Cuando exista, tendremos 2 años de datos de ventaja.',g:'Partnership proactivo: convertirnos en el partner de IA de Tiendanube antes de que decidan hacerlo solos.'}
],
riesgos:[
{r:'Tiendanube lanza su propia herramienta de IA para descripciones',prob:'Media',imp:'Alto',m:'Establecer partnership en los primeros 6 meses. Ser el partner de contenido IA de Tiendanube es la mejor defensa.'},
{r:'Calidad inconsistente por catálogos con información pobre',prob:'Alta',imp:'Medio',m:'Proceso de validación de calidad de input antes de generar. Pedirle al cliente información mínima requerida por categoría.'},
{r:'Precio demasiado bajo para sostener el soporte',prob:'Media',imp:'Bajo',m:'Diseñar el producto para ser self-service. Documentación excelente. Video tutoriales por caso de uso.'},
{r:'Claude API sube precios significativamente',prob:'Baja',imp:'Alto',m:'Optimizar prompts para usar el menor número de tokens posible. Caché de generaciones similares para catálogos parecidos.'}
],
conclusion:['Descripción Masiva de Productos IA es el segundo producto con el CAC más bajo del portafolio (solo detrás de Publicaciones ML) y tiene el mercado más amplio de todos. La horizontal de "cualquier tienda con 50+ SKUs" captura un universo de 320.000 clientes potenciales en LATAM.','El diferencial no es solo la velocidad (aunque pasar de 3 meses de trabajo a 2 horas es dramático) sino la consistencia: todos los productos del catálogo tienen el mismo nivel de calidad, el mismo tono de marca y la misma optimización SEO. Eso es imposible de lograr con redactores humanos a escala.','El partnership con Tiendanube es la apuesta de crecimiento más importante. Estar disponible como integración en el App Store de Tiendanube pone el producto frente a 150.000 tiendas activas con cero costo adicional de adquisición.'],
primer_paso:'Esta semana: tomar 20 productos del catálogo propio o de un e-commerce conocido. Pedirle a Claude que genere la ficha completa (título SEO, descripción 300 palabras, bullet points, meta description). Publicar esas fichas en el e-commerce y medir el CTR y la conversión vs las fichas originales en 2 semanas. Ese experimento tiene ROI inmediato y demostrable.'
}

]; // fin RANKING3

// ── SLUGS completos para los 20 ──────────────────────────────────────────────
const ALL20=[
  {slug:'ai-sdr-outbound-latam',nombre:'AI SDR Outbound LATAM',cat:'Ventas B2B',score:128,ticket:299,mvp:3},
  {slug:'agente-research-empresarial',nombre:'Agente de Research Empresarial IA',cat:'Agentes Autónomos',score:122,ticket:349,mvp:3},
  {slug:'propuestas-comerciales-ia',nombre:'Propuestas Comerciales IA',cat:'Ventas B2B',score:117,ticket:199,mvp:2},
  {slug:'agente-ia-empresarial',nombre:'Agente IA Empresarial Personalizado',cat:'Agentes Autónomos',score:113,ticket:399,mvp:4},
  {slug:'meeting-intelligence-latam',nombre:'Meeting Intelligence IA LATAM',cat:'Productividad IA',score:114,ticket:249,mvp:3},
  {slug:'atencion-cliente-whatsapp',nombre:'Atención al Cliente WhatsApp IA',cat:'Customer Success IA',score:115,ticket:299,mvp:3},
  {slug:'nurturing-leads-whatsapp',nombre:'Nurturing de Leads por WhatsApp IA',cat:'Ventas B2B',score:114,ticket:249,mvp:3},
  {slug:'ads-ia-meta-google',nombre:'Ads IA para Meta y Google',cat:'Marketing IA',score:117,ticket:299,mvp:3},
  {slug:'cobranza-inteligente-latam',nombre:'Cobranza Inteligente IA LATAM',cat:'Fintech IA',score:111,ticket:349,mvp:4},
  {slug:'publicaciones-ml-masivas',nombre:'Publicaciones ML Masivas IA',cat:'E-commerce IA',score:116,ticket:299,mvp:2},
  {slug:'descripcion-masiva-productos',nombre:'Descripción Masiva de Productos IA',cat:'E-commerce IA',score:115,ticket:199,mvp:2},
  {slug:'scripts-ventas-industria',nombre:'Scripts de Ventas por Industria IA',cat:'Ventas B2B',score:115,ticket:179,mvp:2},
  {slug:'generacion-leads-b2b',nombre:'Generación de Leads B2B con IA',cat:'Ventas B2B',score:113,ticket:249,mvp:3},
  {slug:'agente-social-media-autonomo',nombre:'Agente de Social Media Autónomo IA',cat:'Agentes Autónomos',score:113,ticket:299,mvp:3},
  {slug:'brand-identity-ia',nombre:'Brand Identity Completa IA',cat:'Creatividad IA',score:114,ticket:249,mvp:2},
  {slug:'workflows-pymes-ia',nombre:'Workflows Internos PYMEs IA',cat:'Productividad IA',score:114,ticket:299,mvp:3},
  {slug:'analisis-llamadas-ventas',nombre:'Análisis de Llamadas de Ventas IA',cat:'Productividad IA',score:108,ticket:199,mvp:3},
  {slug:'pitch-deck-visual-ia',nombre:'Pitch Deck Visual IA',cat:'Creatividad IA',score:112,ticket:149,mvp:2},
  {slug:'pricing-dinamico-ecommerce',nombre:'Pricing Dinámico E-commerce IA',cat:'E-commerce IA',score:114,ticket:299,mvp:4},
  {slug:'licitaciones-publicas-ia',nombre:'Licitaciones Públicas Intelligence IA',cat:'GovTech IA',score:112,ticket:349,mvp:4}
];
const filenames=ALL20.map((_,i)=>`${String(i+1).padStart(2,'0')}-${ALL20[i].slug}.html`);
const OFFSET=7;
RANKING3.forEach((idea,i)=>{
  const rank=OFFSET+i+1;
  const prev=filenames[rank-2];
  const next=rank<filenames.length?filenames[rank]:null;
  const html=renderDoc(idea,rank,prev,next);
  fs.writeFileSync(path.join(DIR,filenames[rank-1]),html);
  console.log(`✓ [${rank}/20] ${idea.nombre}`);
});

// Regenerar index completo con las 20 ideas (las que existen y las pendientes)
const indexHtml=`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Top 20 SaaS 2026</title>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f4f8;color:#0f172a;padding:40px;}h1{font-size:28px;font-weight:900;margin-bottom:8px;}p{color:#64748b;margin-bottom:32px;}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}.card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.06);border:1px solid #e2e8f0;text-decoration:none;color:inherit;display:block;transition:transform .12s,box-shadow .12s;}.card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.1);}.rank{font-size:12px;font-weight:800;color:#6366f1;letter-spacing:1px;margin-bottom:8px;}.nombre{font-size:16px;font-weight:800;margin-bottom:6px;}.tag{font-size:11px;background:#e0e7ff;color:#3730a3;padding:3px 10px;border-radius:12px;display:inline-block;margin-bottom:12px;}.meta{display:flex;gap:12px;font-size:12px;color:#64748b;}.score{font-weight:700;color:#059669;}</style></head><body>
<h1>📊 Top 20 SaaS Ideas 2026</h1>
<p>Análisis estratégico · Agustín &amp; el Flaco · Re-clasificadas por fit de equipo y mercado LATAM</p>
<div class="grid">
${ALL20.map((idea,i)=>{const exists=fs.existsSync(path.join(DIR,filenames[i]));return`<a href="${filenames[i]}" class="card" ${!exists?'style="opacity:.45;pointer-events:none;"':''}>
<div class="rank">#${i+1} DE 20</div><div class="nombre">${idea.nombre}</div><span class="tag">${idea.cat}</span>
<div class="meta"><span class="score">${idea.score}/150</span><span>MVP ${idea.mvp}m</span><span>$${idea.ticket}/mes</span>${!exists?'<span style="color:#dc2626;font-weight:700;">Próximamente</span>':''}</div></a>`;}).join('\n')}
</div></body></html>`;
fs.writeFileSync(path.join(DIR,'index.html'),indexHtml);
console.log(`\n✅ Ideas #8-11 generadas. Index actualizado con los 20 slots.`);
console.log('👉 Ejecutar generar-top20-parte4.js para ideas #12-20');
