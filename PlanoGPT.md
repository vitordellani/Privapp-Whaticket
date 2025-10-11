# Plano de Implementação — Notificações via WhatsApp no Whaticket

## Objetivo
Implementar um sistema de notificação que avise automaticamente, via WhatsApp, o número configurado do(s) usuário(s) responsável(is) quando uma nova mensagem for recebida em um ticket/conversa, operando exclusivamente no back-end, de forma assíncrona e segura, com baixo impacto no desempenho e compatível com a arquitetura atual do Whaticket.

## Escopo
- Adicionar campo no cadastro de usuários para armazenar o número de WhatsApp que receberá notificações.
- Detectar novas mensagens recebidas (mensagens de entrada, `fromMe = false`).
- Enfileirar e enviar notificação formatada para o número cadastrado, de forma assíncrona.
- Garantir que o envio ocorra apenas no back-end (sem exibição na interface do usuário).
- Oferecer alternância por configuração (feature flag) e respeitar multi-tenant.

## Princípios
- Segurança de dados e segredo de credenciais (env vars, minimização de logs, validação de entrada, criptografia quando aplicável).
- Desempenho: processamento assíncrono, uso de fila, coalescência/debounce onde fizer sentido.
- Manutenibilidade: componente modular, testes, métricas e logs estruturados.
- Compatibilidade: mudanças incrementais, com feature flag e sem quebrar fluxos existentes.

---

## Arquitetura Proposta
1. Detecção de evento
   - Acoplar a lógica de disparo a um ponto de evento já existente no back-end quando uma nova mensagem de cliente é persistida (ex.: repositório/serviço `Message` ou event bus interno).
   - Critério de disparo: `message.fromMe === false` e `message.isDeleted !== true`.

2. Enfileiramento assíncrono
   - Usar fila baseada em Redis (Bull/BullMQ), já utilizada no Whaticket (se aplicável). Criar job `notify:user:new-message`.
   - Configurar `backoff` exponencial, tentativas, DLQ (dead-letter) e concorrência.

3. Serviço de notificação
   - Implementar `NotificationService` -> `WhatsappNotificationProvider` (adapter) para envio.
   - Mensagens são formatadas por `NotificationFormatter` com placeholders e regras de truncamento.

4. Canal de envio
   - Opção A (preferencial por simplicidade): reutilizar a sessão WhatsApp já conectada do tenant para envio ao número do usuário notificado.
   - Opção B (mais robusta): ter uma sessão/número dedicado a notificações por tenant (evita mistura com número de atendimento). Pode ser ativado via config.
   - O provider abstrai a origem do envio, mantendo compatibilidade.

5. Governança/controle
   - Feature flag global e por tenant: `NOTIFY_NEW_MESSAGE_ENABLED` + `tenant.settings.notifyNewMessage`.
   - Preferência por usuário: `user.notifyOnNewMessage`.
   - Janelas de coalescência (ex.: 60s) e limites por ticket/usuário para evitar spam.

6. Observabilidade e segurança
   - Logs estruturados com correlação (ids de tenant, ticket, message, user). Sem conteúdo sensível completo (apenas trechos resumidos).
   - Métricas: taxa de enfileiramento, sucesso/falha de envio, latência, DLQ size.
   - Alertas para falhas consecutivas por tenant.

---

## Alterações de Dados (DB e Modelo)
- Tabela/Modelo `Users`:
  - Campo `whatsappNotificationNumber` (string, validado no formato E.164, armazenar apenas dígitos + prefixo `+`).
  - Campo `notifyOnNewMessage` (boolean, default `false`).
  - Opcional: `quietHours` (janela de silêncio) para silenciar notificações fora do horário.
- Migração:
  - Criar migration idempotente, sem alterar dados existentes.
  - Índice se necessário para consultas por usuário, mas provavelmente não crítico.
- Validação:
  - Normalizar entrada para E.164; rejeitar números inválidos; mascarar em logs.

---

## Integração no Back-end
1. Ponto de disparo (evento de nova mensagem)
   - No fluxo onde a mensagem de cliente é persistida, publicar evento `message:received` com payload mínimo (ids e metadados).
   - Um `MessageReceivedListener` filtra apenas mensagens de entrada e resolve os usuários alvo.

2. Seleção de destinatários
   - Regra padrão: usuário atribuído ao ticket (owner/assignee) e que tenha `notifyOnNewMessage = true` e `whatsappNotificationNumber` válido.
   - Fallback (configurável): todos os usuários com papel de atendimento do setor/queue do ticket, respeitando preferências.
   - Multi-tenant: sempre restringir por `tenantId`.

3. Enfileiramento do job
   - Para cada destinatário, criar job `notify:user:new-message` com payload: `{ tenantId, ticketId, messageId, userId, number }` e chave de idempotência (ex.: hash de `tenantId:ticketId:userId:messageId`).
   - Definir `attempts`, `backoff`, `removeOnComplete: true`, `removeOnFail: false`.

4. Processador do job
   - Recupera contexto (ticket, contato, preview da última mensagem) e formata o texto.
   - Aplica janelas de coalescência: se existir job similar recente para o mesmo `ticketId:userId` em X segundos, agrupar.
   - Invoca `WhatsappNotificationProvider.send(number, text, options)`.
   - Registra métricas e resultado; reencaminha a DLQ após esgotar tentativas.

---

## Formatação da Notificação
- Template base (personalizável por tenant):
  - "[Whaticket] Novo msg de {contactName} no ticket #{ticketNumber}: {preview}"
  - Inclui link direto para o ticket (se aplicável) e identificação do tenant.
- Regras:
  - `preview` truncado (ex.: 140 chars), remover quebras e mídia vira marcador (ex.: "[Áudio]", "[Imagem]").
  - Evitar inclusão de dados sensíveis.
  - Localização (pt-BR por padrão), suporte a i18n.

---

## Segurança
- Segredos e tokens somente via variáveis de ambiente; sem hardcode.
- Sanitização/validação forte dos números (E.164), evitar injeções.
- Rate limit e coalescência para mitigar abuso/loops.
- Auditoria mínima: registrar quem habilitou/desabilitou preferências.
- Evitar ecoar conteúdo completo da mensagem em logs.

---

## Desempenho e Confiabilidade
- Assíncrono com fila (Redis). Nenhum await de envio no caminho crítico de gravação da mensagem.
- Retries com backoff e DLQ.
- Circuit breaker no provider para falhas sustentadas.
- Cache leve de preferências por usuário/tenant (TTL curto) para reduzir consultas repetidas.

---

## Compatibilidade e Isolamento
- O envio acontece apenas no back-end; nenhuma mensagem de notificação aparece na timeline/UX do Whaticket.
- Feature flag global e por tenant; default desativado.
- Provider desacoplado: caso futuro exija outro canal (ex.: SMS), a interface permanece.

---

## Passo a Passo de Implementação
1. Migrações e modelos
   - Criar migrations para `Users`: `whatsappNotificationNumber`, `notifyOnNewMessage` (default `false`).
   - Atualizar modelos/ORM e validações.

2. API/Admin
   - Expor os novos campos no endpoint de update de usuário (admin) com validação.
   - Opcional: UI de Admin para configurar por usuário/tenant. (As notificações não aparecem na UI final; apenas configuração.)

3. Eventos
   - Publicar evento `message:received` no ponto de persistência de mensagens de entrada.
   - Implementar `MessageReceivedListener` para enfileirar jobs por destinatário.

4. Fila e Jobs
   - Criar fila `notifications` (Bull/BullMQ) e job `notify:user:new-message`.
   - Configurar concorrência, backoff e DLQ.

5. Serviço e Provider
   - Implementar `NotificationService` e `WhatsappNotificationProvider` com suporte a Opção A/B de sessão.
   - Implementar `NotificationFormatter` com template e truncamento.

6. Feature flags e config
   - `NOTIFY_NEW_MESSAGE_ENABLED` global, `tenant.settings.notifyNewMessage` e `user.notifyOnNewMessage`.
   - Variáveis de ambiente/documentação de configuração por ambiente.

7. Observabilidade
   - Logs estruturados e métricas; integrar com monitoramento existente (ex.: Sentry/Prometheus).

8. Testes
   - Unitários: seleção de destinatários, validação de número, formatação, idempotência, coalescência.
   - Integração: listener -> fila -> processor -> provider (mock).

9. Rollout
   - Implantar com flag OFF, migrar DB, habilitar por tenant piloto, monitorar métricas e DLQ, expandir gradualmente.

---

## Pseudocódigo (alto nível)

```ts
// Ao salvar mensagem recebida
if (!message.fromMe) {
  eventBus.publish('message:received', { tenantId, ticketId: message.ticketId, messageId: message.id });
}

// Listener
on('message:received', async (evt) => {
  if (!flags.tenantEnabled(evt.tenantId)) return;
  const users = await resolveDestinatarios(evt.tenantId, evt.ticketId);
  for (const u of users) {
    if (!u.notifyOnNewMessage || !isValidE164(u.whatsappNotificationNumber)) continue;
    await queue.add('notify:user:new-message', {
      tenantId: evt.tenantId,
      ticketId: evt.ticketId,
      messageId: evt.messageId,
      userId: u.id,
      number: u.whatsappNotificationNumber,
    }, {
      jobId: makeIdempotentKey(evt, u.id),
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
    });
  }
});

// Processor
queue.process('notify:user:new-message', CONCURRENCY, async (job) => {
  if (!flags.tenantEnabled(job.data.tenantId)) return;
  if (isCoalesced(job.data)) return; // já coberto por notificação recente
  const ctx = await buildContext(job.data); // ticket, contato, preview
  const text = NotificationFormatter.formatNewMessage(ctx);
  await WhatsappNotificationProvider.send(job.data.tenantId, job.data.number, text);
});
```

---

## Casos Especiais e Regras
- Vários responsáveis: notificar todos os atribuídos, respeitando preferências; opcionalmente limitar a 1º responsável.
- Silêncio/horário: respeitar `quietHours` do usuário (não enviar fora do horário, ou agendar para o próximo horário útil).
- Mídias: enviar apenas marcador no preview; não reenviar mídia como notificação.
- Anti-loop: se o número de notificação pertencer a alguma sessão de atendimento, filtrar para não criar conversas/tickets a partir do envio de notificação. O provider deve usar tag/conteúdo que ignore webhooks de entrada ou enviar por sessão dedicada.
- Multitenancy: isolar contexto por `tenantId` em todas as consultas e envios.

---

## Riscos e Mitigações
- Spam de notificações: coalescência, limites por ticket/tempo, preferências por usuário.
- Falhas no provider: retries com backoff, DLQ, circuit breaker e alertas.
- Vazamento de dados: mascarar logs, validar entrada, limitar preview, evitar anexos.
- Interferência no atendimento: usar sessão dedicada ou identificar mensagens para não abrirem tickets.

---

## Estimativa de Esforço (alto nível)
- Migrations e modelos: 0,5–1 dia
- Eventos, fila e jobs: 1–1,5 dias
- Provider WhatsApp e formatação: 1 dia
- Config/flags e observabilidade: 0,5 dia
- Testes e ajustes: 1 dia
Total: 4–5 dias úteis (varia por contexto do projeto).

---

## Critérios de Aceite
- Campo `whatsappNotificationNumber` e `notifyOnNewMessage` disponíveis e validados.
- Ao receber mensagem de cliente, criar job e enviar notificação ao(s) destinatário(s) corretos.
- Envio assíncrono, sem bloquear salvamento de mensagem.
- Notificações não aparecem na UI de conversas.
- Logs e métricas disponíveis; falhas entram em DLQ.
- Flag global/tenant controla ativação do recurso.

---

## Operação e Manutenção
- Documentar variáveis de ambiente e flags.
- Painel/consulta para DLQ e reprocessamento.
- Alarmes para taxa de falha elevada.
- Guia de solução de problemas (ex.: validação de número, sessão inválida, quota, Redis indisponível).

---

## Checklist de Entrega
- [ ] Migrations aplicadas e reversíveis
- [ ] Modelos/ORM atualizados
- [ ] Endpoints de configuração do usuário/tenant prontos
- [ ] Evento `message:received` publicado
- [ ] Listener e fila `notifications` ativos
- [ ] Processor com retries/backoff/DLQ
- [ ] Provider WhatsApp funcional (com sessão escolhida)
- [ ] Templates de mensagem configuráveis
- [ ] Métricas e logs estruturados
- [ ] Testes unitários e de integração (mocks)
- [ ] Documentação e flags
