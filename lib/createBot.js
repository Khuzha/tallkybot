const Telegraf = require('telegraf')
const mongo = require('mongodb').MongoClient
const path = require('path')
const data = require('./data')
const sendError = require('./sendError')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const TelegrafI18n = require('telegraf-i18n')
const starter = require('./start')
const stage = new Stage()
const bot = new Telegraf(data.token)

const { getToken, getHelloMessage } = require('./createBotScenes')

stage.register(getToken, getHelloMessage)

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: false,
  directory: path.resolve(__dirname, 'locales')
})

bot.use(i18n.middleware())
bot.use(session())
bot.use(stage.middleware())


mongo.connect(data.mongoLink, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    sendError(err)
  }

  bot.context.db = client.db('tallkybot')
  bot.startPolling()
})


bot.start(({ i18n, replyWithHTML, from }) => {
  starter(i18n, replyWithHTML, from)
})

bot.hears(TelegrafI18n.match('buttons.createBot'), ({ scene }) => {
  scene.enter('getToken')
})