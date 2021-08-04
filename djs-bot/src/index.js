const { Client } = require("discord.js");
require("discord-reply");
const { registerCommands, registerEvents } = require("./utils/registry");
const config = require("../config.json");
const mongoose = require("mongoose");
const chalk = require("chalk");

const client = new Client();

mongoose
  .connect(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(console.log(chalk.green("√") + " | Connected to MongoDB"))
  .catch((err) =>
    console.log(chalk.yellow("‼") + " | Connection to MongoDB failed: " + err)
  );

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.discord.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.login(config.discord.token);
})();
