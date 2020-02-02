const Telegraf = require('telegraf')
const path = require('path')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const TelegrafI18n = require('telegraf-i18n')
const sendError = require('./sendError')

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: false, 
  directory: path.resolve(__dirname, 'locales')
})

let createBot = async (token, mess, lang, ownerId) => {
  try {
    const bot = new Telegraf(token)

    bot.start((ctx) => ctx.reply(mess + i18n.t(lang, 'credits')))

    bot.on('message', (ctx) => {
      bot.telegram.sendCopy(
        owner.id, 
        ctx.message,
        Extra.markup(Markup.inlineKeyboard([
          [Markup.callbackButton(i18n.t(lang, 'buttons.reply'))]
        ]))
      )
    })
  
    bot.startPolling()
  } catch (err) {
    sendError(err, null, 'create instance')
  }
}

module.exports = createBot