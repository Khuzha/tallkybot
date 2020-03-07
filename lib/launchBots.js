import mongo from 'mongodb' //.MongoClient
import data from './data.js'
import createInstance from './createInstance.js'
import sendError from './sendError.js'

export default async () => {
  try {
    const client = await mongo.connect(data.mongoLink, { useUnifiedTopology: true })
    const db = client.db('tallkybot')
    const allBots = await db.collection('allBots').find({}).toArray()

    for (let key of allBots) {
      await createInstance(key.token, key.mess, key.lang, key.ownerId)
    }
  } catch (err) {
    sendError(err, null, 'launch bots')
  }
}