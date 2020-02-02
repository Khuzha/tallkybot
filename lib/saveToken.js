const sendError = require('./sendError')

const saveToken = async (db, token, user) => {
  try {
    await db.collection('allBots').insertOne(
      { token: token, owner: user.id }
    )
    await db.collection('allUsers').updateOne(
      { userId: user.id },
      { $set: { name: user.first_name } },
      { new: true, upset: true }
    )
  } catch (err) {
    sendError(err, user)
  }
}

module.exports = saveToken