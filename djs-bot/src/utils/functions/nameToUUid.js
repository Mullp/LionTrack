const fetch = require("node-fetch");
const chalk = require("chalk");
const PlayerCache = require("../cache/PlayerCache");

exports.nameToUUid = async function (name) {
  if (!/^[a-zA-Z0-9_]{3,16}$/.test(name)) return;
  let uuid, playerName;
  if (PlayerCache.has(name.toLowerCase()) === true) {
    uuid = PlayerCache.get(name.toLowerCase())["uuid"];
  } else {
    await fetch("https://api.mojang.com/users/profiles/minecraft/" + name)
      .then((res) => res.json())
      .then((json) => {
        if (!json.hasOwnProperty("error")) {
          [uuid, playerName] = [json["id"], json["name"]];
        } else {
          console.log(
            chalk.yellow("‼") +
              " | Can't fetch uuid of \"" +
              name +
              '": ' +
              JSON.stringify(json)
          );
        }
      })
      .catch((err) => {
        if (err.type !== "invalid-json") {
          console.log(err);
        }
      });
    PlayerCache.set(name.toLowerCase(), { uuid: uuid, name: playerName });
  }
  return uuid;
};
