const sendError = require('./sendError')

module.exports = async (db, user) => {
  try {
    user.status = 'active'
    await db.collection('allUsers').insertOne(user)

  } catch (err) {
    sendError(err, user)
  }
}