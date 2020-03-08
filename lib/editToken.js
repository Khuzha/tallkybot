const Telegraf = require('telegraf')
const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const saveToken = require('./saveToken')
const createInstance = require('./createInstance')
const starter = require('./start')
const sendError = require('./sendError')

const editToken = new Scene('editToken')

editToken.enter(async ({ editMessageText, i18n, session, from, db }) => {
  try {
    const botDbId = session.botDbId
    const botInfo = await db.collection('allBots').findOne({ dbId: botDbId })
    const messId = await editMessageText(
      i18n.t('editToken', { botUsername: botInfo.botUn }),
      Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton(i18n.t('buttons.back'), `manage_${botDbId}`)
      ]))
    )
    session.messId = messId.message_id
  } catch (err) {
    sendError(err, from)
  }
})

editToken.hears(/[0-9]:.*/, async ({ message, deleteMessage, telegram, 
  i18n, db, from, session, scene, chat }) => {
  try {
    const token = message.text
    const thisBot = new Telegraf(token)
    const botData = await thisBot.telegram.getMe()

    db.collection('allBots').updateOne(
      { dbId: session.botDbId },
      { $set: { botName: botData.first_name, botUn: botData.username, token: message.text } },
      { upsert: true }
    )
    deleteMessage()
    await telegram.editMessageText(
      chat.id, session.messId, null,
      i18n.t('tokenEdited'),
      Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton(i18n.t('buttons.back'), `manage_${session.botDbId}`)
      ]))
    )
    scene.leave()
  } catch (err) {
    if ([401, 404].includes(err.code)) {
      await replyWithHTML(
        i18n.t('notToken')
      )
      return scene.enter('editToken')
    }
    sendError(err, from)
  }
})

editToken.on('message', async ({ telegram, deleteMessage, session, i18n, scene, from, chat }) => {
  try {
    await deleteMessage()
    await telegram.editMessageText(
      chat.id, session.messId, null,
      i18n.t('notToken'),
      Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton(i18n.t('buttons.back'), 'toMyBots')
      ]))
    )
  } catch (err) {
    sendError(err, from)
  }
})


module.exports = editToken