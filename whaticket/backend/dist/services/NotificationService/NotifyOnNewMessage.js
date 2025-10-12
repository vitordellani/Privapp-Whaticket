"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ticket_1 = require("../../models/Ticket");
const User_1 = require("../../models/User");
const WhatsappNotificationProvider_1 = require("./WhatsappNotificationProvider");
const PhoneNumber_1 = require("../../helpers/PhoneNumber");

// in-memory coalescence map
const lastSent = new Map();
const COALESCE_MS = parseInt(process.env.NOTIFY_COALESCE_MS || "60000", 10);

const buildPreview = (message) => {
  if (message && message.body) {
    const oneLine = String(message.body).replace(/\s+/g, " ").trim();
    return oneLine.length > 140 ? `${oneLine.slice(0, 137)}...` : oneLine;
  }
  if (message && message.mediaType) {
    const label = String(message.mediaType).toLowerCase();
    if (label.includes("audio")) return "[Áudio]";
    if (label.includes("image")) return "[Imagem]";
    if (label.includes("video")) return "[Vídeo]";
    if (label.includes("document")) return "[Documento]";
    return "[Mídia]";
  }
  return "[Mensagem]";
};

const formatText = (ticket, contactName, preview) => {
  const safeName = contactName || (ticket && ticket.contact && ticket.contact.name) || "Contato";
  return "\u200e" + `[Whaticket] Nova mensagem de ${safeName} no ticket #${ticket ? ticket.id : "?"}: ${preview}`;
};

const shouldSend = (ticketId, userId) => {
  const key = `${ticketId}:${userId}`;
  const now = Date.now();
  const last = lastSent.get(key) || 0;
  if (now - last < COALESCE_MS) return false;
  lastSent.set(key, now);
  return true;
};

const NotifyOnNewMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    if (!process.env.NOTIFY_NEW_MESSAGE_ENABLED || process.env.NOTIFY_NEW_MESSAGE_ENABLED !== "true") return;
    if (!message || message.fromMe || message.isDeleted) return;

    // Load ticket with user and whatsapp
    const ticket = yield Ticket_1.default.findByPk(message.ticketId, { include: ["contact", "whatsapp", "user"] });
    if (!ticket) return;

    const recipients = [];
    if (ticket.userId) {
        const u = yield User_1.default.findByPk(ticket.userId);
        if (u) recipients.push(u);
    }
    // Fallback: notify all users who opted in
    if (recipients.length === 0) {
        const all = yield User_1.default.findAll();
        for (const u of all) {
            if (u.get("notifyOnNewMessage") && u.get("whatsappNotificationNumber")) {
                recipients.push(u);
            }
        }
    }

    const preview = buildPreview(message);
    const contactName = ticket && ticket.contact ? ticket.contact.name : undefined;
    const text = formatText(ticket, contactName, preview);
    const whatsappId = ticket && ticket.whatsappId ? ticket.whatsappId : null;

    for (const user of recipients) {
        const number = user.get("whatsappNotificationNumber");
        const enabled = !!user.get("notifyOnNewMessage");
        if (!enabled || !number || !PhoneNumber_1.isValidE164(String(number))) continue;
        if (!shouldSend(ticket.id, user.id)) continue;
        const to = PhoneNumber_1.toWhatsappId(String(number));
        if (!to) continue;
        setImmediate(() => {
            WhatsappNotificationProvider_1.default.send(whatsappId, to, text);
        });
    }
  } catch (e) {
    // avoid throwing
  }
});

exports.default = NotifyOnNewMessage;
