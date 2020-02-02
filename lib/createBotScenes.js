const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
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

getToken.hears(/^[0-9]{9}:[a-zA-Z0-9_]/, async ({ message, session, replyWithHTML, i18n, from }) => {
  try {
    session.token = message.text
    await replyWithHTML(
      i18n.t('tokenReady'),
      Extra.markup(Markup.keyboard([
        ['a']
      ]), resize())
    )
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