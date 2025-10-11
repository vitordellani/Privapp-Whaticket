# Notificações por WhatsApp — Tickets Pendentes de Aceitação

Este documento descreve as alterações realizadas e como funciona o novo sistema de notificações por WhatsApp, focado exclusivamente em avisar sobre tickets pendentes de aceitação.

## Visão Geral
- Notificação única: apenas para tickets no status `pending` (pendente de aceitação).
- Quem recebe: todos os usuários que ativaram a preferência de notificação e informaram um número em E.164.
- Envio: sempre pelo WhatsApp da conexão padrão (default) da aplicação.
- Desempenho e robustez: processamento assíncrono, coalescência contra spam e tratamento de erros para não afetar o fluxo principal.

---

## O que foi alterado

### Backend — Dados e APIs
- Campos no usuário (Users):
  - `whatsappNotificationNumber` (string, E.164) — número que recebe a notificação.
  - `notifyOnNewMessage` (boolean, default `false`) — preferência de receber/notificar.
- Migração adicionada: `whaticket/backend/dist/database/migrations/20251010152000-add-notification-fields-to-users.js`.
- Modelo: `whaticket/backend/dist/models/User.js` — adiciona os campos acima.
- Serialização: `whaticket/backend/dist/helpers/SerializeUser.js` — inclui os campos no retorno das APIs.
- Serviços de usuário:
  - CreateUserService: `whaticket/backend/dist/services/UserServices/CreateUserService.js` — aceita e persiste os novos campos.
  - UpdateUserService: `whaticket/backend/dist/services/UserServices/UpdateUserService.js` — valida e atualiza; usuários não-admin podem alterar apenas as próprias preferências de notificação (controller trata isso).
  - ShowUserService: `whaticket/backend/dist/services/UserServices/ShowUserService.js` — retorna os novos campos.
- Controller: `whaticket/backend/dist/controllers/UserController.js` —
  - store: passa campos para criação.
  - update: permite que usuários comuns atualizem somente `whatsappNotificationNumber` e `notifyOnNewMessage` no próprio registro.

### Backend — Notificações
- Serviço principal (pendente): `whaticket/backend/dist/services/NotificationService/NotifyOnTicketPending.js`
  - Seleciona todos os usuários com preferência ativa e número válido.
  - Coalescência por `ticketId:userId` (configurável via `NOTIFY_COALESCE_MS`, default 60000 ms).
  - Parâmetro `force` ignora a coalescência quando a transição para `pending` é explícita (reabertura, criação).
  - Mensagem: prefixada com `\u200e` (U+200E) para não poluir a UI e evitar laços indesejados.
  - Envio via conexão WhatsApp padrão.
- Formatação do título/nome: `whaticket/backend/dist/helpers/GetAppTitle.js`
  - Ordem de resolução do título:
    1. `process.env.REACT_APP_TITLE` ou `process.env.APP_TITLE` (backend)
    2. `whaticket/frontend/.env` → variável `REACT_APP_TITLE` (aceita variações como `REACT_APP_TITILE` e similares)
    3. Fallback: `Whaticket`
  - Mensagem final: `‎{TÍTULO} -  Ticket #{id} pendente de aceitação para *{Contato}*.`
- Disparos do serviço de notificação:
  - Em toda mudança de status para `pending`: `whaticket/backend/dist/services/TicketServices/UpdateTicketService.js` (dispara com `force=true`).
  - Ao criar/reativar ticket como `pending` no fluxo de novas mensagens: `whaticket/backend/dist/services/TicketServices/FindOrCreateTicketService.js` (dispara com `force=true`).
- Provider de envio: `whaticket/backend/dist/services/NotificationService/WhatsappNotificationProvider.js`
  - Usa a sessão WhatsApp padrão (default) obtida via `GetDefaultWhatsApp`.

### Backend — Estabilidade
- Tratamento de erros no módulo TypeBOT (axios) para evitar `unhandledRejection` derrubando a aplicação: `whaticket/backend/dist/libs/wbot.js`.
- Handlers globais para `unhandledRejection` e `uncaughtException`: `whaticket/backend/dist/server.js`.

### Frontend — Configuração no Modal de Usuário
- `whaticket/frontend/src/components/UserModal/index.js`
  - Campo de texto: `Notification number (E.164)` → mapeado a `whatsappNotificationNumber`.
  - Chave liga/desliga: `Notify on new messages` → mapeado a `notifyOnNewMessage`.
- Traduções: EN/ES ajustadas; PT pode exibir rótulo equivalente caso deseje personalizar posteriormente.

---

## Como funciona (resumo)
1. Uma mensagem recebida do contato cria/reativa o ticket para o status `pending` quando ainda não foi aceito.
2. A transição para `pending` dispara o serviço `NotifyOnTicketPending` (com `force=true`).
3. O serviço:
   - Obtém todos os usuários com preferência ativa e número válido.
   - Monta a mensagem com o título da aplicação (lido do frontend/.env ou do env do backend) e o nome do contato em negrito.
   - Envia a mensagem via conexão padrão do WhatsApp, de forma assíncrona.
   - Aplica coalescência (se não for `force`) para evitar spam repetido por curto intervalo.

---

## Variáveis de Ambiente
- Backend (`whaticket/backend/.env`):
  - `NOTIFY_NEW_MESSAGE_ENABLED` → `true` para habilitar o recurso.
  - `NOTIFY_COALESCE_MS` → janela de coalescência em ms (opcional, default 60000).
  - `APP_TITLE` (opcional) → sobrescreve o título da aplicação.
- Frontend (`whaticket/frontend/.env`):
  - `REACT_APP_TITLE` → título a ser exibido no início da mensagem.

---

## Requisitos e Passos de Implantação
1. Aplicar migrações:
   - `cd whaticket/backend`
   - `npx sequelize db:migrate`
2. Garantir a existência de uma conexão WhatsApp padrão (default) — as notificações usam sempre essa sessão.
3. Configurar os usuários que devem receber notificações:
   - Ativar `Notify on new messages` no modal.
   - Preencher `Notification number (E.164)` (ex.: `+5511999999999`).
4. Definir `REACT_APP_TITLE` no `whaticket/frontend/.env` (ou `APP_TITLE` no backend) se quiser personalização do prefixo.
5. Reiniciar o backend após alterações de `.env`.

---

## Formato e Antiloop
- Prefixo invisível: `\u200e` prefixa o texto, ajudando a evitar que a mensagem seja interpretada como parte da conversa na interface.
- Nome do contato: em negrito com `*` (padrão WhatsApp).
- A mensagem nunca é publicada na timeline de mensagens do ticket; é apenas enviada aos números dos usuários responsáveis/inscritos.

---

## Coalescência e Força de Envio
- Coalescência (`NOTIFY_COALESCE_MS`) limita notificações repetidas do mesmo `ticketId:userId` em curto intervalo.
- O parâmetro `force=true` é aplicado em mudanças explícitas para `pending` (criação/reativação/reabertura) para garantir que o aviso seja enviado independentemente da janela de coalescência.

---

## Segurança e Boas Práticas
- Validação do número no formato E.164 antes do envio.
- Sem persistência de conteúdo sensível na mensagem de notificação.
- Sem bloqueio do fluxo de gravação de mensagens (envio assíncrono via `setImmediate`).

---

## Solução de Problemas
- Não recebo notificações:
  - Verifique `NOTIFY_NEW_MESSAGE_ENABLED=true` no backend.
  - Verifique se há conexão WhatsApp padrão (default) conectada.
  - Confirme que o usuário possui `whatsappNotificationNumber` válido (E.164) e `notifyOnNewMessage=true`.
  - Confira se o ticket está realmente em `pending`.
- Título exibido como "Whaticket":
  - Garanta `REACT_APP_TITLE` no `whaticket/frontend/.env` (ou `APP_TITLE` no backend), reinicie o backend.
- Envios repetidos em sequência:
  - Ajuste `NOTIFY_COALESCE_MS` para uma janela maior.

---

## Arquivos Impactados (referência)
- Backend (núcleo):
  - `whaticket/backend/dist/services/NotificationService/NotifyOnTicketPending.js`
  - `whaticket/backend/dist/helpers/GetAppTitle.js`
  - `whaticket/backend/dist/services/TicketServices/UpdateTicketService.js`
  - `whaticket/backend/dist/services/TicketServices/FindOrCreateTicketService.js`
  - `whaticket/backend/dist/services/NotificationService/WhatsappNotificationProvider.js`
- Backend (usuários):
  - `whaticket/backend/dist/models/User.js`
  - `whaticket/backend/dist/helpers/SerializeUser.js`
  - `whaticket/backend/dist/services/UserServices/CreateUserService.js`
  - `whaticket/backend/dist/services/UserServices/UpdateUserService.js`
  - `whaticket/backend/dist/services/UserServices/ShowUserService.js`
  - `whaticket/backend/dist/controllers/UserController.js`
  - Migração: `whaticket/backend/dist/database/migrations/20251010152000-add-notification-fields-to-users.js`
- Frontend:
  - `whaticket/frontend/src/components/UserModal/index.js`
  - Traduções EN/ES em `whaticket/frontend/src/translate/languages/`

---

## Exemplo de Mensagem
```
‎Privapp -  Ticket #22 pendente de aceitação para *Julie*.
```

---

Se quiser, posso adicionar logs de debug temporários para acompanhar destinatários e o título resolvido durante os testes.
