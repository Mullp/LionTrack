const BaseEvent = require("../utils/structures/BaseEvent");
const chalk = require("chalk");
const { relog } = require("../utils/functions/relog");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("end");
  }

  async run(bot) {
    bot.viewer.close();
    console.log(
      chalk.yellow("‼") +
        " | Bot ended. Attempting to reconnect bot in 30 seconds."
    );
    setTimeout(relog, 30000);
  }
};
