const Telegraf = require('telegraf')
const path = require('path')
const data = require('./data')
const sendError = require('./sendError')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const TelegrafI18n = require('telegraf-i18n')
const stage = new Stage()
const bot = new Telegraf(data.token)

const { getToken } = require('./createBotScenes')

stage.register(getToken)

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: false,
  directory: path.resolve(__dirname, 'locales')
})

bot.use(i18n.middleware())
bot.use(session())
bot.use(stage.middleware())

bot.start(({ i18n, replyWithHTML, from }) => {
  try {
    replyWithHTML(
      i18n.t('hello', { name: from.first_name }),
      Extra.markup(Markup.keyboard([
        [i18n.t('buttons.createBot')]
      ]).resize())
    )
  } catch (err) {
    sendError(err, from)
  }  
})

bot.hears(TelegrafI18n.match('buttons.createBot'), ({ scene }) => {
  scene.enter('getToken')
})


bot.startPolling()