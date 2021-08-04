const BaseEvent = require("../../utils/structures/BaseEvent");

const chalk = require("chalk");

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client) {
    client.user.setPresence({
      status: "online",
      activity: {
        name: "ads sent on Minehut",
        type: "WATCHING",
      },
    });
    console.log(
      chalk.green("√") +
        " | Discord bot has logged in with username " +
        client.user.tag
    );
  }
};
