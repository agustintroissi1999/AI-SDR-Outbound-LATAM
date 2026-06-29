# AI SDR Outbound LATAM

> SDR de Inteligencia Artificial para PYMEs de LATAM — prospección por WhatsApp y email en español, potenciado por Claude AI.

**Stack:** Node.js · Supabase · Next.js · WhatsApp Business API · Claude API · Resend · Vercel  
**Ticket objetivo:** $299/mes · **MVP:** 3 meses · **Mercado LATAM:** $480M

---

## Equipo

| Rol | Responsable | Foco |
|-----|------------|------|
| Producto & Tech | El Flaco | MVP, backend, integraciones |
| Ventas & Prospección | Agustín | Pilotos, clientes, feedback |

---

## Estado actual

**Sprint activo:** Semana 1 — Validación y Setup

---

## Tareas — El Flaco (Tech)

### Semana 1-2
- [ ] Setup repo y entorno de desarrollo
- [ ] Crear proyecto en Supabase (tablas: usuarios, campañas, prospectos, mensajes)
- [ ] Integrar Claude API — prompt base para mensajes de prospección
- [ ] Conectar WhatsApp Business API (Meta Cloud API)
- [ ] Endpoint básico: recibir lista CSV de prospectos

### Mes 1 — Motor core
- [ ] Generador de mensajes por industria/ICP con Claude
- [ ] Envío de secuencia WhatsApp: mensaje 1 → follow-up 1 → follow-up 2
- [ ] Scheduling con BullMQ + Redis (timing de follow-ups)
- [ ] Tracking de respuestas (webhook WhatsApp)

### Mes 2 — Dashboard
- [ ] Auth (login / registro)
- [ ] Panel de campañas: crear, pausar, ver estado
- [ ] Vista de prospectos por campaña (pendiente / contactado / respondió / reunión)
- [ ] Integración email via Resend como canal alternativo
- [ ] Importar prospectos desde CSV

### Mes 3 — Refinamiento
- [ ] Métricas por campaña: tasa respuesta, reuniones generadas
- [ ] Ajustes por feedback de pilotos
- [ ] Onboarding flow para nuevos clientes
- [ ] Billing básico (Stripe o MercadoPago)

---

## Tareas — Agustín (Ventas)

### Semana 1-2
- [ ] Lista de 20 empresas B2B de la red con contacto directo
- [ ] Definir ICP inicial: industria, tamaño, cargo del contacto
- [ ] Armar pitch de 3 líneas para pilotos gratuitos
- [ ] Primer outreach a los 20 contactos
- [ ] **Meta: 3 pilotos comprometidos esta semana**

### Mes 1
- [ ] Entrevistar a cada piloto: ¿qué industria? ¿qué mensaje funciona? ¿cuántos prospectos/mes?
- [ ] Documentar hallazgos de ICP → pasarle al Flaco
- [ ] Segundo round de outreach (20 contactos más)
- [ ] Armar deck de pitch de 5 slides

### Mes 2-3
- [ ] Onboardear los primeros 3 pilotos en el MVP
- [ ] Capturar métricas: tasa respuesta, reuniones generadas
- [ ] Escribir 2-3 casos de éxito documentados
- [ ] Cerrar primeros clientes pagos (meta: 5 clientes en plan Growth)

---

## Objetivos por fase

### Q1 — Validación (Mes 1-3)
- 3 pilotos activos con feedback documentado
- Motor de envío WhatsApp + Claude funcionando
- MRR objetivo: $2.990 (10 clientes)

### Q2 — Escala (Mes 4-6)
- Programa de referidos activo
- 30 clientes
- MRR objetivo: $8.970

### Q3-Q4 — Especialización (Mes 7-12)
- Verticalizarse en 2-3 industrias
- 100 clientes
- MRR objetivo: $29.900
- Break-even

---

## Decisiones tomadas

| Decisión | Opción elegida | Razón |
|---------|---------------|-------|
| LLM | Claude 3.5 Sonnet | Superior en redacción persuasiva en español |
| Canal principal | WhatsApp Business API oficial | Sin banes, nativo LATAM |
| Canal secundario | Email via Resend | Deliverability alta |
| Backend | Node.js + Supabase | Stack familiar, escalable |
| Frontend | Next.js + Vercel | Deploy rápido, sin infra |
| Precios | $149 / $299 / $599 por mes | Starter / Growth / Scale |

---

## Precios

| Plan | Precio | Prospectos | Secuencias |
|------|--------|-----------|-----------|
| Starter | $149/mes | 500/mes | 3 |
| Growth | $299/mes | 2.000/mes | 10 |
| Scale | $599/mes | Ilimitados | Ilimitadas |

---

## Links

- [Análisis estratégico completo](https://agustintroissi1999.github.io/AI-SDR-Outbound-LATAM/01-ai-sdr-outbound-latam.html)
- [Documento de referencia local](./AI-SDR-OUTBOUND-LATAM.md)
