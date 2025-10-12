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
const wbot_1 = require("../../libs/wbot");
const GetDefaultWhatsApp_1 = require("../../helpers/GetDefaultWhatsApp");

const provider = {
  send: (whatsappId, to, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Always use the main (default) connection to send notifications
      const def = yield GetDefaultWhatsApp_1.default();
      const wbot = wbot_1.getWbot(def.id);
      if (!wbot) return;
      yield wbot.sendMessage(to, text);
    } catch (e) {
      // swallow to avoid impact in main flow
    }
  })
};

exports.default = provider;
