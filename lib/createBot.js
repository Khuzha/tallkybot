<<<<<<< HEAD
const Telegraf = require('telegraf')
const mongo = require('mongodb').MongoClient
const path = require('path')
const data = require('./data')
const sendError = require('./sendError')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const TelegrafI18n = require('telegraf-i18n')
const myBots = require('./myBots')
const start = require('./start')
const stage = new Stage()
const bot = new Telegraf(data.token)

const { getToken, getHelloMessage } = require('./createBotScenes')
=======
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
>>>>>>> parent of 3afb5c2... refractore: make import ... from instead of const ... require

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
  myBots.getMyBots(from, db, replyWithHTML, i18n)
})

bot.hears('pusk', async ({db}) => {
  const bots = await db.collection('allBots').find({}).toArray()

  for (let bot of bots) {
    const thisBot = new Telegraf(bot.token)
    const tgInfo = await thisBot.telegram.getMe()
    await db.collection('allBots').update({dbId: bot.dbId}, {$set: {botName: tgInfo.first_name, botUn: tgInfo.username}})
  }
})

bot.action(/manage_[0-9]*/, ({ update, answerCbQuery, replyWithHTML, from }) => {
  const botDbId = +update.callback_query.data.substr(7)
  answerCbQuery()
  myBots.manageBot(botDbId, replyWithHTML, from)
  // answerCbQuery('Function is yet in development', true)
})

bot.on('message', ({ i18n, replyWithHTML, from }) => {
  start(i18n, replyWithHTML, from)
})