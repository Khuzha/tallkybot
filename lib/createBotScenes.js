const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const checkToken = require('./checkToken')
const saveToken = require('./saveToken')
const addUser = require('./addUser')
const createInstance = require('./createInstance')
const sendError = require('./sendError')

const getToken = new Scene('getToken')

getToken.enter(async ({ replyWithHTML, i18n, from }) => {
  try {
    await replyWithHTML(
      i18n.t('getToken'),
      Extra.markup(Markup.keyboard([
        [i18n.t('buttons.cancel')]
      ]).resize())
    )
  } catch (err) {
    sendError(err, from)
  }
})

getToken.hears(/^[0-9]:[a-zA-Z0-9_]/, async ({ message, replyWithHTML, i18n, db, from, scene }) => {
  try {
    const token = message.text
    if (!(await checkToken(token, from))) { 
      await replyWithHTML(
        i18n.t('notToken')
      )
      return scene.enter('getToken')
    }
    const botInDB = await db.collection('allBots').findOne({ token: token })
    if (botInDB) {
      await replyWithHTML(i18n.t('alreadyAdded')) // need to continue interface
      return scene.enter('getToken')
    }
    await saveToken(db, token, from)
    await createInstance(token)

    await replyWithHTML( // need to continue interface
      i18n.t('tokenReady'),
      Extra.markup(Markup.keyboard([
        ['a']
      ]).resize())
    )

    const userInDB = await db.collection('allBots').findOne({ userId: from.id })
    if (!userInDB) {
      await addUser(db, from)
    }  
  } catch (err) {
    sendError(err, from)
  }
})

getToken.on('message', async ({ replyWithHTML, i18n, scene, from }) => {
  try {
    await replyWithHTML(
      i18n.t('notToken')
    )
    scene.enter('getToken')
  } catch (err) {
    sendError(err, from)
  }
})


module.exports = { getToken }