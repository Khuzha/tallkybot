const sendError = require('./sendError')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const starter = async (i18n, replyWithHTML, from) => {
  try {
    replyWithHTML(
      i18n.t('hello', { name: from.first_name }),
      Extra.markup(Markup.keyboard([
        [i18n.t('buttons.createBot')] //, [i18n.t('buttons.myBots')]
      ]).resize())
    )
  } catch (err) {
    sendError(err, from)
  }  
}

module.exports = starter