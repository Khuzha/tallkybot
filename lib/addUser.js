import sendError from './sendError.js'

export default async (db, user) => {
  try {
    user.status = 'active'
    await db.collection('allUsers').insertOne(user)

  } catch (err) {
    sendError(err, user)
  }
}