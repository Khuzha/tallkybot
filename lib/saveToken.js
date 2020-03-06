const sendError = require('./sendError')

const saveToken = async (db, token, mess, lang, user, botName) => {
  try {
    let lastId = (await db.collection('configs').findOne({ type: 'lastBotId' })).lastId
    console.log(lastId, typeof lastId)
    await db.collection('allBots').insertOne(
      {
        token: token, mess: mess, lang: lang,
        ownerId: user.id, botName: botName, dbId: ++lastId
      }
    )
    await db.collection('configs').updateOne(
      { type: 'lastBotId' },
      { $set: { lastId: lastId } },
      { upsert: true }
    )
  } catch (err) {
    sendError(err, user)
  }
}

module.exports = saveToken