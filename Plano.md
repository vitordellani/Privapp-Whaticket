# Plano de Implementação - Sistema de Notificações via WhatsApp

## Visão Geral
Este plano detalha a implementação de um sistema de notificações via WhatsApp para a aplicação Whaticket, que enviará mensagens automáticas para os usuários sempre que novas mensagens forem recebidas.

## Análise da Arquitetura Atual

### Tecnologias Utilizadas
- **Backend**: Node.js com TypeScript
- **Banco de Dados**: MySQL/PostgreSQL com Sequelize ORM
- **WhatsApp**: whatsapp-web.js para integração
- **Arquitetura**: MVC com serviços separados

### Estrutura Identificada
- **Modelos**: User, Message, Ticket, Contact, Whatsapp
- **Serviços**: CreateMessageService, wbotMessageListener
- **Fluxo**: Mensagens recebidas → wbotMessageListener → CreateMessageService → Socket.IO

## Implementação Detalhada

### 1. Adição do Campo WhatsApp no Cadastro de Usuários

#### 1.1 Alteração do Modelo User
```typescript
// Adicionar ao modelo User (backend/dist/models/User.js)
@AllowNull(true)
@Column
whatsappNumber: string;

@Column
canReceiveNotifications: boolean; // default: true
```

#### 1.2 Criação de Migration
```typescript
// Criar migration: add-whatsapp-fields-to-users.js
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'whatsappNumber', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'canReceiveNotifications', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }),
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'whatsappNumber'),
      queryInterface.removeColumn('Users', 'canReceiveNotifications'),
    ]);
  }
};
```

#### 1.3 Atualização das Validações
- Adicionar validação de formato do número de WhatsApp
- Implementar máscara de entrada no frontend
- Validar código de país (DDI) e DDD

### 2. Serviço de Notificações Assíncronas

#### 2.1 Criação do NotificationService
```typescript
// backend/dist/services/NotificationService/index.ts
import { getIO } from "../../libs/socket";
import Message from "../../models/Message";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";

class NotificationService {
  private static instance: NotificationService;
  private notificationQueue: Array<NotificationData> = [];
  private isProcessing = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async queueNotification(message: Message, ticket: Ticket): Promise<void> {
    const notificationData = {
      messageId: message.id,
      ticketId: ticket.id,
      contactName: ticket.contact.name,
      messageBody: message.body,
      timestamp: new Date(),
    };
    
    this.notificationQueue.push(notificationData);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    
    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      if (notification) {
        await this.sendNotification(notification);
      }
    }
    
    this.isProcessing = false;
  }

  private async sendNotification(data: NotificationData): Promise<void> {
    try {
      // Buscar usuários que devem receber notificações
      const users = await User.findAll({
        where: {
          canReceiveNotifications: true,
          whatsappNumber: { [Op.not]: null }
        }
      });

      for (const user of users) {
        await this.sendWhatsAppNotification(user, data);
      }
    } catch (error) {
      logger.error(`Erro ao enviar notificação: ${error}`);
    }
  }

  private async sendWhatsAppNotification(user: User, data: NotificationData): Promise<void> {
    // Implementação do envio via WhatsApp
    const wbot = await this.getWbotInstance();
    const message = this.formatNotificationMessage(data);
    
    await wbot.sendMessage(`${user.whatsappNumber}@c.us`, message);
  }

  private formatNotificationMessage(data: NotificationData): string {
    return `🔔 *Nova Mensagem Recebida*\n\n` +
           `📱 *De:* ${data.contactName}\n` +
           `💬 *Mensagem:* ${data.messageBody.substring(0, 100)}${data.messageBody.length > 100 ? '...' : ''}\n` +
           `⏰ *Horário:* ${data.timestamp.toLocaleString('pt-BR')}`;
  }
}
```

#### 2.2 Integração com o Fluxo de Mensagens
```typescript
// Modificar CreateMessageService para incluir notificação
const CreateMessageService = async ({ messageData }) => {
  // ... código existente ...
  
  // Adicionar notificação após criar mensagem
  if (!message.fromMe) { // Apenas mensagens recebidas
    const notificationService = NotificationService.getInstance();
    await notificationService.queueNotification(message, message.ticket);
  }
  
  return message;
};
```

### 3. Configurações de Notificação

#### 3.1 Modelo de Configurações
```typescript
// backend/dist/models/NotificationSettings.js
@Table
class NotificationSettings extends Model {
  @Column
  userId: number;
  
  @Column
  notificationType: string; // 'all', 'mentions', 'none'
  
  @Column
  quietHours: boolean;
  
  @Column
  quietHoursStart: string; // HH:MM
  
  @Column
  quietHoursEnd: string; // HH:MM
  
  @Column
  maxNotificationsPerHour: number; // default: 10
}
```

#### 3.2 Middleware de Rate Limiting
```typescript
// backend/dist/middleware/notificationRateLimit.js
const notificationRateLimit = new Map();

export const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const userLimit = notificationRateLimit.get(userId);
  
  if (!userLimit) {
    notificationRateLimit.set(userId, { count: 1, resetTime: now + hour });
    return true;
  }
  
  if (now > userLimit.resetTime) {
    notificationRateLimit.set(userId, { count: 1, resetTime: now + hour });
    return true;
  }
  
  if (userLimit.count >= 10) { // limite de 10 notificações por hora
    return false;
  }
  
  userLimit.count++;
  return true;
};
```

### 4. Segurança e Performance

#### 4.1 Validações de Segurança
- **Sanitização de Dados**: Remover caracteres especiais e scripts
- **Validação de Números**: Verificar formato internacional válido
- **Autenticação**: Garantir que apenas usuários autenticados configurem notificações
- **Criptografia**: Criptografar números de WhatsApp no banco de dados

#### 4.2 Otimizações de Performance
- **Processamento Assíncrono**: Usar filas para processamento em background
- **Cache**: Implementar cache para configurações de usuário
- **Batch Processing**: Agrupar notificações quando possível
- **Lazy Loading**: Carregar dados apenas quando necessário

#### 4.3 Tratamento de Erros
```typescript
// backend/dist/services/NotificationService/errorHandler.ts
export class NotificationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'NotificationError';
  }
}

export const handleNotificationError = async (error: Error, userId: number): Promise<void> => {
  logger.error(`Notification error for user ${userId}: ${error.message}`);
  
  if (error.code === 'INVALID_WHATSAPP_NUMBER') {
    // Desativar notificações para este usuário
    await User.update({ canReceiveNotifications: false }, { where: { id: userId } });
  }
  
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Aguardar antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minuto
  }
};
```

### 5. Interface de Configuração

#### 5.1 API Endpoints
```typescript
// backend/dist/routes/notificationRoutes.js
POST /api/notifications/settings
GET /api/notifications/settings
PUT /api/notifications/settings/:id
DELETE /api/notifications/disable
POST /api/notifications/test
```

#### 5.2 Frontend Integration
- Adicionar campos no formulário de cadastro de usuário
- Criar página de configurações de notificações
- Implementar teste de notificação
- Adicionar indicadores visuais de status

### 6. Monitoramento e Manutenção

#### 6.1 Logs e Métricas
```typescript
// backend/dist/utils/notificationLogger.ts
export const logNotification = async (data: NotificationLog): Promise<void> => {
  await NotificationLog.create({
    userId: data.userId,
    messageId: data.messageId,
    status: data.status, // 'sent', 'failed', 'blocked'
    error: data.error,
    timestamp: new Date(),
  });
};
```

#### 6.2 Dashboard de Monitoramento
- Total de notificações enviadas
- Taxa de sucesso/falha
- Usuários mais ativos
- Erros mais comuns

### 7. Testes e Validação

#### 7.1 Testes Unitários
```typescript
// __tests__/services/NotificationService.spec.ts
describe('NotificationService', () => {
  it('should queue notification for incoming message', async () => {
    // Test implementation
  });
  
  it('should respect rate limiting', async () => {
    // Test implementation
  });
  
  it('should handle WhatsApp errors gracefully', async () => {
    // Test implementation
  });
});
```

#### 7.2 Testes de Integração
- Testar fluxo completo de mensagem → notificação
- Validar integração com WhatsApp Web
- Testar rate limiting em cenários reais
- Validar recuperação de falhas

### 8. Cronograma de Implementação

#### Fase 1: Estrutura Base (2 dias)
- [ ] Criar migration para campos WhatsApp
- [ ] Atualizar modelo User
- [ ] Criar NotificationService base

#### Fase 2: Lógica de Negócio (3 dias)
- [ ] Implementar fila de notificações
- [ ] Criar sistema de rate limiting
- [ ] Adicionar validações de segurança

#### Fase 3: Integração (2 dias)
- [ ] Integrar com CreateMessageService
- [ ] Implementar envio via WhatsApp
- [ ] Adicionar tratamento de erros

#### Fase 4: Interface e Configurações (2 dias)
- [ ] Criar endpoints de API
- [ ] Adicionar campos no frontend
- [ ] Implementar teste de notificação

#### Fase 5: Testes e Ajustes (2 dias)
- [ ] Executar testes unitários
- [ ] Realizar testes de integração
- [ ] Ajustar performance
- [ ] Documentar código

### 9. Considerações de Segurança

#### 9.1 Proteção de Dados
- Criptografar números de WhatsApp no banco
- Implementar validação de entrada rigorosa
- Usar HTTPS para todas as comunicações
- Implementar autenticação de dois fatores para configurações

#### 9.2 Conformidade
- Garantir conformidade com LGPD
- Implementar consentimento explícito do usuário
- Permitir exclusão de dados pessoais
- Manter logs de auditoria

### 10. Manutenção Futura

#### 10.1 Monitoramento Contínuo
- Configurar alertas para falhas
- Monitorar performance do sistema
- Acompanhar taxa de entrega
- Verificar satisfação do usuário

#### 10.2 Escalabilidade
- Preparar para aumento de volume
- Implementar sharding de banco de dados
- Considerar uso de filas dedicadas
- Planejar cluster de aplicação

## Conclusão

Este plano fornece uma implementação robusta e segura para o sistema de notificações via WhatsApp, garantindo:

- ✅ Segurança no envio de dados
- ✅ Baixo impacto na performance
- ✅ Facilidade de manutenção
- ✅ Compatibilidade com arquitetura existente
- ✅ Tratamento robusto de erros
- ✅ Monitoramento completo

A implementação segue as melhores práticas de desenvolvimento e está alinhada com a arquitetura existente do Whaticket, garantindo integração sem quebras e manutenibilidade futura.