const Telegraf = require('telegraf')
const mongo = require('mongodb').MongoClient
const path = require('path')
const data = require('./data')
const sendError = require('./sendError')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const TelegrafI18n = require('telegraf-i18n')
const getMyBots = require('./getMyBots')
const start = require('./start')
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

bot.hears(TelegrafI18n.match('buttons.createBot'), ({ scene }) => {
  scene.enter('getToken')
})

bot.hears(TelegrafI18n.match('buttons.myBots'), ({ from, db, replyWithHTML, i18n }) => {
  getMyBots(from, db, replyWithHTML, i18n)
})

bot.on('message', ({ i18n, replyWithHTML, from }) => {
  start(i18n, replyWithHTML, from)
})