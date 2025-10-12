"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.addColumn("Users", "whatsappNotificationNumber", {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Users", "notifyOnNewMessage", {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      })
    ]);
  },
  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn("Users", "whatsappNotificationNumber"),
      queryInterface.removeColumn("Users", "notifyOnNewMessage")
    ]);
  }
};

