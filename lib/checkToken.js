<<<<<<< HEAD
const Telegraf = require('telegraf')
const sendError = require('./sendError')
=======
import Telegraf from 'telegraf'
import sendError from './sendError'
>>>>>>> parent of 3afb5c2... refractore: make import ... from instead of const ... require

const checkToken = async (token, from) => {
  try {
    const bot = new Telegraf(token)
    await bot.telegram.getMe()
    return true
  } catch (err) {
    if (err.code == 401) {
      console.log(err)
      return false
    }
    sendError(err, from)
    return false
  }
}

module.exports = checkToken