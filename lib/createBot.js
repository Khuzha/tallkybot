const Telegraf = require('telegraf')
const path = require('path')
const data = require('./data')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const TelegrafI18n = require('telegraf-i18n')
const bot = new Telegraf(data.token)

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: false,
  directory: path.resolve(__dirname, 'locales')
})

bot.use(i18n.middleware())
bot.use(session())

bot.start(({ i18n, replyWithHTML, from }) => {
  replyWithHTML(
    i18n.t('hello', { name: from.first_name }),
    Extra.markup(Markup.keyboard([
      [i18n.t('buttons.createBot')]
    ]).resize())
  )
})



bot.startPolling()