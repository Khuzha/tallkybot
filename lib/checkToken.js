const Telegraf = require('telegraf')
const sendError = require('./sendError')

const checkToken = async (token, from) => {
  try {
    const bot = new Telegraf(token)
    await bot.telegram.getMe()
    return true
  } catch (err) {
    if (err.code == 401) {
      return false
    }
    sendError(err, from)
  }
}

module.exports = checkToken