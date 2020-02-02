const sendError = require('./sendError')

module.exports = async (db, user, lang) => {
  try {
    user.status = 'active'
    user.lang = lang
    await db.collection('allUsers').insertOne(user)

  } catch (err) {
    sendError(err, user)
  }
}