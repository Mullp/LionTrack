const BaseEvent = require("../utils/structures/BaseEvent");
const config = require("../../config.json");
const chalk = require("chalk");
const mineflayerViewer = require("prismarine-viewer").mineflayer;

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("spawn");
  }
  async run(bot) {
    console.log(chalk.green("√") + " | " + bot.username + " has spawned.");
    if (bot.viewer) bot.viewer.close();
    mineflayerViewer(bot, {
      port: config.mineflayer.viewer.port,
      firstPerson: config.mineflayer.viewer.firstPerson,
    }); // This is cool. I can see my bot on the server from the browser by just going to localhost:3007
  }
};
