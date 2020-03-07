import Telegraf from 'telegraf'
import path from 'path'
import Extra from 'telegraf/extra.js'
import Markup from 'telegraf/markup.js'
import TelegrafI18n from 'telegraf-i18n'
import Stage from 'telegraf/stage.js'
import session from 'telegraf/session.js'
import sendError from './sendError.js'
import instanceReply from './instanceReply.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
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
        return await ctx.reply(ctx.i18n.t('choose'))
      }
      if (ctx.message.text === '/start') {
        return
      }

      const username = ctx.from.username ? ` (@${ctx.from.username})` : ''
      if (ctx.message.text) {
        ctx.message.text = ctx.i18n.t('newMessage', {
          userId: ctx.from.id, name: ctx.from.first_name, nick: username
        }) + ctx.message.text
      } else {
        ctx.message.caption = ctx.i18n.t('newMessage', {
          userId: ctx.from.id, name: ctx.from.first_name, nick: username
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
      
      ctx.answerCbQuery()
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


export default createBot