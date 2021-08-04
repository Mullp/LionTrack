const BaseEvent = require("../utils/structures/BaseEvent");
const chalk = require("chalk");
const { MessageEmbed, WebhookClient } = require("discord.js");
const UserModel = require("../database/schemas/UserModel");
const { logHistory } = require("../utils/logHistory");
const AdWebhook = require("../utils/webhooks/AdWebhook");

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(bot, message) {
    if (message.toString().substring(0, 4) !== "[AD]") return;
    const time = new Date().toLocaleTimeString();
    const ad = message.toString().split(" ");
    let rank, advertiser, server;
    if (
      [
        "[VIP]",
        "[PRO]",
        "[LEGEND]",
        "[PATRON]",
        "[ARTIST]",
        "[BUILDER]",
        "[YOUTUBE]",
        "[<3]",
        "[HELPER]",
        "[MOD]",
        "[SRMOD]",
        "[ADMIN]",
      ].includes(ad[1])
    ) {
      [rank, advertiser, server] = [
        ad[1],
        ad[2].slice(0, -1),
        ad[4].toLowerCase(),
      ];
      ad.splice(0, 5);
    } else {
      [rank, advertiser, server] = [
        "[DEFAULT]",
        ad[1].slice(0, -1),
        ad[3].toLowerCase(),
      ];
      ad.splice(0, 4);
    }
    const msg = ad.join(" ");

    logHistory(advertiser, server);

    const adEmbed = new MessageEmbed()
      .setColor("#ff5600")
      .setAuthor(
        "LionTrack",
        "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
        "https://discord.gg/uUejGQ8kGu"
      )
      .setDescription("\u200B")
      .addFields(
        { name: "Server", value: server, inline: true },
        { name: "Rank", value: rank, inline: true },
        { name: "Advertiser", value: advertiser, inline: true },
        { name: "Advertisement message", value: "`" + msg + "`" }
      )
      .setTimestamp()
      .setFooter("Ad sent");

    UserModel.find({ "trackers.serverName": server })
      .then((users) => {
        if (users.length !== 0) {
          console.log(
            chalk.white.dim(time) + " " + chalk.blueBright(message.toString())
          );
          users.forEach((user) => {
            user.trackers.forEach((tracker) => {
              if (tracker.serverName === server) {
                new WebhookClient(tracker.webhookId, tracker.webhookToken)
                  .send("", {
                    username: "LionTrack",
                    avatarURL:
                      "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
                    embeds: [adEmbed],
                  })
                  .catch((err) => {
                    if (
                      err.name === "DiscordAPIError" &&
                      err.message === "Unknown Webhook"
                    ) {
                      console.log(
                        chalk.yellow("‼") +
                          " | Unknown Webhook (Should auto delete whenever I get to it lol)"
                      );
                    }
                  });
              }
            });
          });
        } else {
          console.log(chalk.white.dim(time) + " " + message.toString());
        }
      })
      .catch((err) => console.log(err));

    AdWebhook.send("", {
      username: "LionTrack",
      avatarURL:
        "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
      embeds: [adEmbed],
    }).catch((err) => {
      if (err.name === "DiscordAPIError" && err.message === "Unknown Webhook") {
        console.log(
          chalk.yellow("‼") +
            " | " +
            chalk.red("Somehow I can't get the ad Webhook")
        );
      }
    });
  }
};
