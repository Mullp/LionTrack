const { MessageEmbed, WebhookClient } = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const UserModel = require("../../database/models/UserModel");

module.exports = class DeleteCommand extends BaseCommand {
  constructor() {
    super("delete", "tools", ["remove"]);
  }

  async run(client, message, args) {
    if (message.channel.type === "dm") {
      if (args.length === 1) {
        if (/^[a-zA-Z0-9]{4,10}$/.test(args[0])) {
          await UserModel.updateOne(
            { discordId: message.author.id },
            { $pull: { trackers: { serverName: args[0].toLowerCase() } } }
          )
            .then((res) => {
              if (res.nModified !== 0) {
                const deletedEmbed = new MessageEmbed()
                  .setColor("#ff5600")
                  .setAuthor(
                    "LionTrack",
                    "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
                    "https://discord.gg/uUejGQ8kGu"
                  )
                  .setDescription("\u200B")
                  .addFields({
                    name: "Deleted",
                    value: "Deleted your tracker for `" + args[0] + "`",
                  })
                  .setTimestamp();

                message.lineReply(deletedEmbed);
              } else {
                message.lineReply(
                  "You don't own a tracker for `" +
                    args[0] +
                    "`. Run `>trackers` to list all your trackers."
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          message.lineReply("Server name not valid");
        }
      }
    }
  }
};
