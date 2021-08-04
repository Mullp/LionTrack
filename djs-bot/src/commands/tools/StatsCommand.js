const config = require("../../../config.json");
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const PlayerModel = require("../../database/models/PlayerModel");
const ServerModel = require("../../database/models/ServerModel");
const { nameToUUid } = require("../../utils/functions/nameToUUid");

module.exports = class StatsCommand extends BaseCommand {
  constructor() {
    super("stats", "tools", []);
  }

  async run(client, message, args) {
    if (
      message.channel.id === config.discord.cmdChannel ||
      message.channel.type === "dm"
    ) {
      if (args.length === 2) {
        if (args[0] === "user") {
          if (/^[a-zA-Z0-9_]{3,16}$/.test(args[1])) {
            const uuid = await nameToUUid(args[1].toLowerCase());
            await PlayerModel.findOne({ uuid: uuid }).then((player) => {
              let serverSortable = [];
              let advertisedFor = [];
              for (const server in player.to) {
                serverSortable.push([server, player.to[server]]);
              }
              serverSortable.sort(function (a, b) {
                return b[1] - a[1];
              });

              serverSortable.some((server, index) => {
                advertisedFor.push(
                  index + 1 + ". " + server[0] + " `" + server[1] + "`"
                );
                return index === 9 ? true : false;
              });

              if (advertisedFor == "")
                advertisedFor = args[1] + " doesn't have a history yet.";

              const statsEmbed = new MessageEmbed()
                .setColor("#ff5600")
                .setAuthor(
                  "LionTrack",
                  "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
                  "https://discord.gg/uUejGQ8kGu"
                )
                .setDescription("\u200B")
                .addFields(
                  {
                    name: "Stats for " + args[1].split("_").join("\\_"),
                    value: "Advertisements sent: `" + player.sent + " ads`",
                  },
                  { name: "Most advertisements sent to:", value: advertisedFor }
                )
                .setTimestamp();

              message.lineReply(statsEmbed);
            });
          }
        }
      }
    }
  }
};
