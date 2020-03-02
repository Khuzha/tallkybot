const sendError = require('./sendError')

const saveToken = async (db, token, mess, lang, userId, botName) => {
  try {
    await db.collection('allBots').insertOne(
      { token: token, mess: mess, lang: lang, ownerId: userId, botName: botName}
    )
  } catch (err) {
    sendError(err, user)
  }
}

module.exports = saveToken