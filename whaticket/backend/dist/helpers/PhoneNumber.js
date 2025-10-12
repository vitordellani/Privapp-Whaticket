"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.isValidE164 = (number) => {
  if (!number || typeof number !== "string") return false;
  const trimmed = number.trim();
  return /^\+?[1-9]\d{7,14}$/.test(trimmed.replace(/\s|-/g, ""));
};

exports.toWhatsappId = (number) => {
  const digits = (number || "").replace(/\D/g, "");
  if (!digits) return null;
  return `${digits}@c.us`;
};

