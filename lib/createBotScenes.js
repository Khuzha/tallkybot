const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const TelegrafI18n = require('telegraf-i18n')
const checkToken = require('./checkToken')
const saveToken = require('./saveToken')
const addUser = require('./addUser')
const createInstance = require('./createInstance')
const sendError = require('./sendError')

const getToken = new Scene('getToken')
const getHelloMessage = new Scene('getHelloMessage')

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

getToken.hears(TelegrafI18n.match('buttons.cancel'), ({ scene }) => {
  scene.leave()
})

getToken.hears(/^[0-9]:[a-zA-Z0-9_.-]/, async ({ session, message, replyWithHTML, i18n, db, from, scene }) => {
  try {
    console.log(1)
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

    session.token = token
  } catch (err) {
    sendError(err, from)
  }
})

getToken.on('message', async ({ replyWithHTML, i18n, scene, from }) => {
  try {
    console.log('2on')
    await replyWithHTML(
      i18n.t('notToken')
    )
    scene.enter('getToken')
  } catch (err) {
    sendError(err, from)
  }
})

getHelloMessage.enter(async ({ replyWithHTML, i18n, from }) => {
  try {
    await replyWithHTML(
      i18n.t('getHelloMessage'),
      Extra.markup(Markup.keyboard([
        [i18n.t('buttons.back'), i18n.t('buttons.cancel')]
      ]).resize())
    )
  } catch (err) {
    sendError(err, from)
  }
})

getHelloMessage.hears(TelegrafI18n.match('buttons.back'), ({ scene }) => {
  scene.enter('getToken')
})

getHelloMessage.hears(TelegrafI18n.match('buttons.cancel'), ({ scene }) => {
  scene.leave()
})

getHelloMessage.on('text', async ({ session, message, replyWithHTML, i18n, db, from, scene }) => {
  try {
    const mess = message.text
    const token = session.token
    await saveToken(db, token, mess, from)
    await createInstance(token, from.id, i18n.shortLanguageCode)

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

    scene.leave()
  } catch (err) {
    sendError(err, from)
  }
})

getHelloMessage.on('message', async ({ replyWithHTML, i18n, scene, from }) => {
  try {
    await replyWithHTML(
      i18n.t('notText')
    )
    scene.enter('getHelloMessage')
  } catch (err) {
    sendError(err,)
  }
})

module.exports = { getToken, getHelloMessage }