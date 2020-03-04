const Telegraf = require('telegraf')
const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const TelegrafI18n = require('telegraf-i18n')
const checkToken = require('./checkToken')
const saveToken = require('./saveToken')
const addUser = require('./addUser')
const createInstance = require('./createInstance')
const starter = require('./start')
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

getToken.hears(TelegrafI18n.match('buttons.cancel'), ({ scene, i18n, replyWithHTML, from }) => {
  starter(i18n, replyWithHTML, from)
  scene.leave()
})

getToken.hears(/[0-9]:.*/, async ({ session, message, replyWithHTML, i18n, db, from, scene }) => {
  try {
    const token = message.text
    const thisBot = new Telegraf(token)
    const botData = await thisBot.telegram.getMe()

    const botInDB = await db.collection('allBots').findOne({ token: token })
    if (botInDB) {
      await replyWithHTML(i18n.t('alreadyAdded')) // need to continue interface
      return scene.enter('getToken')
    }

    session.token = token
    session.botName = botData.username
    scene.enter('getHelloMessage')
  } catch (err) {
    if ([401, 404].includes(err.code)) {
      await replyWithHTML(
        i18n.t('notToken')
      )
      return scene.enter('getToken')
    }
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

getHelloMessage.hears(TelegrafI18n.match('buttons.cancel'), ({ scene, i18n, replyWithHTML, from }) => {
  starter(i18n, replyWithHTML, from)
  scene.leave()
})

getHelloMessage.on('text', async ({ session, message, replyWithHTML, i18n, db, from, scene }) => {
  try {
    const mess = message.text
    if (mess.length > 3000) {
      return scene.enter('getHelloMessage')
    }

    const token = session.token
    const lang = i18n.shortLanguageCode
    await saveToken(db, token, mess, lang, from.id, session.botName)
    await createInstance(token, mess, lang, from.id)

    await replyWithHTML( // need to continue interface
      i18n.t('tokenReady'),
      Extra.markup(Markup.keyboard([
        ['a']
      ]).resize())
    )

    const userInDB = await db.collection('allBots').findOne({ id: from.id })
    if (!userInDB) {
      from.lang = lang
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