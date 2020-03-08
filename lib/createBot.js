import Telegraf from '@telegraf/core'
import mongo from 'mongodb' //.MongoClient
import path from 'path'
import data from './data'
import sendError from './sendError'
import session from 'telegraf/session'
import Stage from 'telegraf/stage'
import TelegrafI18n from 'telegraf-i18n'
import myBots from './myBots'
import start from './start'
const stage = new Stage()
const bot = new Telegraf(data.token)

import { getToken, getHelloMessage } from './createBotScenes')
import editToken from './editToken')

stage.register(getToken, getHelloMessage, editToken)

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
  myBots.getMyBots(from, db, replyWithHTML, i18n)
})

bot.action('toMyBots', ({ from, db, editMessageText, i18n }) => {
  myBots.getMyBots(from, db, editMessageText, i18n)
})

bot.action(/manage_[0-9]*/, ({ update, answerCbQuery, editMessageText, from, i18n, db }) => {
  answerCbQuery()
  const botDbId = +update.callback_query.data.substr(7)
  myBots.manageBot(db, botDbId, editMessageText, from, i18n)
})

bot.action(/editToken_[0-9]*/, ({ update, session, scene }) => {
  session.botDbId = +update.callback_query.data.substr(10)
  scene.enter('editToken')
})

bot.action(/delete_[0-9]*/, ({ answerCbQuery, update, session, scene }) => {
  answerCbQuery('This function is still in the development.', true)
  // session.botDbId = +update.callback_query.data.substr(7)
})

bot.on('message', ({ i18n, replyWithHTML, from }) => {
  start(i18n, replyWithHTML, from)
})