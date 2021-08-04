const PlayerModel = require("../database/schemas/PlayerModel");
const ServerModel = require("../database/schemas/ServerModel");
const { nameToUUid } = require("./functions/nameToUUid");

exports.logHistory = async function (advertiser, server) {
  if (!/^[a-zA-Z0-9_]{3,16}$/.test(advertiser)) return;
  const uuid = await nameToUUid(advertiser);
  if (uuid === undefined) return;
  try {
    const str = "to." + server;
    const findPlayer = await PlayerModel.findOneAndUpdate(
      { uuid: uuid },
      {
        $inc: { sent: 1, [str]: 1 },
      },
      { new: true }
    );
    if (!findPlayer) {
      PlayerModel.create({
        uuid: uuid,
        sent: 1,
        to: {
          [server]: 1,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const str = "from." + uuid;
    const findServer = await ServerModel.findOneAndUpdate(
      { serverName: server },
      {
        $inc: { received: 1, [str]: 1 },
      },
      { new: true }
    );
    if (!findServer) {
      ServerModel.create({
        serverName: server,
        received: 1,
        from: {
          [uuid]: 1,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};
