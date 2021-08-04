const config = require("../config.json");
const mongoose = require("mongoose");
const mineflayer = require("mineflayer");
const chalk = require("chalk");
const { registerEvents } = require("./utils/registry");

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

const bot = mineflayer.createBot({
  host: config.mineflayer.host,
  port: parseInt(config.mineflayer.port),
  username: config.mineflayer.email,
  password: config.mineflayer.password,
  auth: config.mineflayer.auth,
});

(async () => {
  bot.events = new Map();
  await registerEvents(bot, "../events");
})();
