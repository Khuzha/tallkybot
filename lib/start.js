<<<<<<< HEAD
const sendError = require('./sendError')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
=======
import sendError from './sendError')
import Extra from 'telegraf/extra')
import Markup from 'telegraf/markup')
>>>>>>> parent of 3afb5c2... refractore: make import ... from instead of const ... require

const starter = async (i18n, replyWithHTML, from) => {
  try {
    replyWithHTML(
      i18n.t('hello', { name: from.first_name }),
      Extra.markup(Markup.keyboard([
        [i18n.t('buttons.createBot')], [i18n.t('buttons.myBots')]
      ]).resize())
    )
  } catch (err) {
    sendError(err, from)
  }  
}

module.exports = starter