const sendError = require('./sendError')

const saveToken = async (db, token, mess, user) => {
  try {
    await db.collection('allBots').insertOne(
      { token: token, mess: mess, owner: user.id }
    )
  } catch (err) {
    sendError(err, user)
  }
}

module.exports = saveToken