const config = require("../../../config.json");
const mineflayer = require("mineflayer");
const chalk = require("chalk");
const { registerEvents } = require("../../utils/registry");

exports.relog = async function () {
  console.log(chalk.blue("i") + " | Attempting to reconnect...");
  const bot = mineflayer.createBot({
    host: config.mineflayer.host,
    port: parseInt(config.mineflayer.port),
    username: config.mineflayer.email,
    password: config.mineflayer.password,
    auth: config.mineflayer.auth,
  });
  bot.events = new Map();
  await registerEvents(bot, "../events");
};
