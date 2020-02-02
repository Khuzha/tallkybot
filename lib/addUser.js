const sendError = require('./sendError')

module.exports = async (db, user) => {
  try {
    await db.collection('allUsers').insertOne(
      { userId: user.id, name: user.first_name }
    )
  } catch (err) {
    sendError(err, user)
  }
}