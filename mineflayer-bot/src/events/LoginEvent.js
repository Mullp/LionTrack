const BaseEvent = require("../utils/structures/BaseEvent");
const chalk = require("chalk");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("login");
  }
  async run(bot) {
    console.log(chalk.green("√") + " | " + bot.username + " has logged in.");
  }
};
