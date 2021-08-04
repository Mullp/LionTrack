const config = require("../../../config.json");
const { WebhookClient } = require("discord.js");

module.exports = new WebhookClient(
  config.discord.AdWebhook.id,
  config.discord.AdWebhook.token
);

// Am I doing this the right way? idk
// but here's a cool video while you're
// reading my code ;D
// https://youtu.be/-RAglyw6ySk