const fetch = require("node-fetch");
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
            " \x1b[43m\x1b[30mWARN\x1b[0mCan't fetch uuid of \"" +
              name +
              '": ' +
              JSON.stringify(json)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
    PlayerCache.set(name.toLowerCase(), { uuid: uuid, name: playerName });
  }
  return uuid;
};

// Free function if you want (Works really well)