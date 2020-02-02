const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

let createBot = async (token) => {
  const bot = new Telegraf(token)

  bot.start((ctx) => ctx.reply('ЭВРИКА! Работает!'))

  bot.startPolling()
}

module.exports = createBot