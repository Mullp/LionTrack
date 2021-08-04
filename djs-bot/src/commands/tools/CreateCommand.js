const fetch = require("node-fetch");
const { MessageEmbed, WebhookClient } = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");
const UserModel = require("../../database/models/UserModel");

module.exports = class CreateCommand extends BaseCommand {
  constructor() {
    super("create", "tools", []);
  }

  async run(client, message, args) {
    if (message.channel.type === "dm") {
      if (
        /^[a-zA-Z0-9]{4,10}$/.test(args[0]) &&
        /^https:\/\/discord\.com\/api\/webhooks\/[0-9]{10,20}\/[a-zA-Z0-9-_]{60,80}$/.test(
          args[1]
        )
      ) {
        await fetch(args[1])
          .then((res) => res.json())
          .then((json) => {
            if (json.hasOwnProperty("token")) {
              UserModel.findOne({
                discordId: message.author.id,
              })
                .then((user) => {
                  if (user.trackers.length < user.trackerSlots) {
                    if (
                      !user.trackers.some(
                        (tracker) =>
                          tracker._doc.serverName === args[0].toLowerCase()
                      )
                    ) {
                      UserModel.updateOne(
                        { _id: user._id },
                        {
                          $push: {
                            trackers: {
                              serverName: args[0].toLowerCase(),
                              webhookId: args[1].split("/")[5],
                              webhookToken: args[1].split("/")[6],
                            },
                          },
                        }
                      )
                        .then(() => {
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
                                "Creation | (" +
                                (user.trackers.length + 1) +
                                "/" +
                                user.trackerSlots +
                                ") trackers active",
                              value:
                                "Created tracker for the server `" +
                                args[0] +
                                "`",
                            })
                            .setTimestamp();

                          message.lineReply(createEmbed);

                          new WebhookClient(
                            args[1].split("/")[5],
                            args[1].split("/")[6]
                          ).send(
                            "This channel will now be used to track ads for `" +
                              args[0] +
                              "`",
                            {
                              username: "LionTrack",
                              avatarURL:
                                "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
                            }
                          );
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } else {
                      message.lineReply(
                        "You already have a tracker for `" + args[0] + "`"
                      );
                    }
                  } else {
                    message.lineReply(
                      "You already have " +
                        user.trackers.length +
                        "/" +
                        user.trackerSlots +
                        " trackers."
                    );
                  }
                })
                .catch((err) => {
                  UserModel.create({
                    discordId: message.author.id,
                    trackerSlots: 4,
                    trackers: [
                      {
                        serverName: args[0].toLowerCase(),
                        webhookId: args[1].split("/")[5],
                        webhookToken: args[1].split("/")[6],
                      },
                    ],
                  })
                    .then(() => {
                      const createEmbed = new MessageEmbed()
                        .setColor("#ff5600")
                        .setAuthor(
                          "LionTrack",
                          "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
                          "https://discord.gg/uUejGQ8kGu"
                        )
                        .setDescription("\u200B")
                        .addFields({
                          name: "Creation | (1/4) trackers active",
                          value:
                            "Created tracker for the server `" + args[0] + "`",
                        })
                        .setTimestamp();

                      message.lineReply(createEmbed);

                      new WebhookClient(
                        args[1].split("/")[5],
                        args[1].split("/")[6]
                      ).send(
                        "This channel will now be used to track ads for `" +
                          args[0] +
                          "`",
                        {
                          username: "LionTrack",
                          avatarURL:
                            "https://cdn.discordapp.com/avatars/835251343668674590/fb792cb55ccbe190d417c6b53e52163f.png",
                        }
                      );
                    })
                    .catch((err) => console.log(err));
                });
            } else {
              message.lineReply("Discord Webhook doesn't exist.");
            }
          });
      } else {
        message.lineReply("Server name or Discord Webhook URL is not valid.");
      }
    }
  }
};

// UserModel.find({ "trackers.serverName": "loopgens" })
//   .then((value) => console.log(value))
//   .catch((err) => console.log(err));
