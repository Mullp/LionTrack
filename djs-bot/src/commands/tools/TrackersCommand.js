const { MessageEmbed, WebhookClient } = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const UserModel = require("../../database/models/UserModel");

module.exports = class TrackersCommand extends BaseCommand {
  constructor() {
    super("trackers", "tools", ["list"]);
  }

  async run(client, message, args) {
    // message.channel.send("trackers command works");
    if (message.channel.type === "dm") {
      await UserModel.findOne({ discordId: message.author.id })
        .then((user) => {
          // console.log(user.trackers);
          let trackers = [];
          for (const tracker in user.trackers) {
            trackers.push(
              user.trackers[tracker].serverName +
                " `(Webhook ID: " +
                user.trackers[tracker].webhookId +
                ")`"
            );
          }

          const createEmbed = new MessageEmbed()
            .setColor("#ff5600")
            .setAuthor(
              "LionTrack",
              "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
              "https://discord.gg/uUejGQ8kGu"
            )
            .setDescription("\u200B")
            .addFields({
              name:
                "Your trackers | (" +
                user.trackers.length +
                "/" +
                user.trackerSlots +
                ") trackers active",
              value: trackers,
            })
            .setTimestamp();

          message.lineReply(createEmbed);
        })
        .catch((err) => {
          message.lineReply(
            "You don't own any trackers, create one with the `>create` command."
          );
          // console.log(err);
        });
    }
  }
};
