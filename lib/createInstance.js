const Telegraf = require('telegraf')
const path = require('path')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const TelegrafI18n = require('telegraf-i18n')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const sendError = require('./sendError')
const instanceReply = require('./instanceReply')
const stage = new Stage()

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: false, 
  directory: path.resolve(__dirname, 'locales')
})

let createBot = async (token, mess, lang, ownerId) => {
  try {
    const bot = new Telegraf(token)

    stage.register(instanceReply)
    bot.use(i18n.middleware())
    bot.use(session())
    bot.use(stage.middleware())

    bot.start(async (ctx) => await ctx.reply(mess + ctx.i18n.t('credits')))

    bot.on('message', async (ctx) => {
      if (ctx.from.id === ownerId) {
        return await ctx.reply(ctx.i18n.t('itsYou'))
      }
      if (ctx.message.text === '/start') {
        return
      }
      
      const username = ctx.from.first_name ? ` (@${ctx.from.first_name})` : ''
      if (ctx.message.text) {
        ctx.message.text = ctx.i18n.t('newMessage', {
          userId: ctx.from.id, name: ctx.from.first_name, nick: username
        }) + ctx.message.text
      } else {
        ctx.message.caption = ctx.i18n.t('newMessage', {
          userId: ctx.from.id, name: ctx.from.first_name
        }) + ctx.message.caption
      }

      await bot.telegram.sendCopy(
        ownerId, 
        ctx.message,
        Extra.markup(Markup.inlineKeyboard([
          [Markup.callbackButton(i18n.t(lang, 'buttons.reply'), `reply_${ctx.from.id}_${ctx.from.first_name}`)]
        ])).HTML()
      )
    })

    bot.action(/reply_[0-9]_*/, async (ctx) => {
      if (ctx.from.id !== ownerId) {
        return
      }
      
      const str = ctx.update.callback_query.data
      ctx.session.userId = str.match(/[0-9]+/)[0]
      ctx.session.userName = str.substr(str.replace('_', '').indexOf('_') + 2)
      ctx.scene.enter('instanceReply')
    })

    
  
    bot.startPolling()
  } catch (err) {
    sendError(err, null, 'create instance')
  }
}

module.exports = createBot