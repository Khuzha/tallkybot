import sendError from './sendError.js'
import Extra from 'telegraf/extra.js'
import Markup from 'telegraf/markup.js'

export default async (i18n, replyWithHTML, from) => {
  try {
    await replyWithHTML(
      i18n.t('hello', { name: from.first_name }),
      Extra.markup(Markup.keyboard([
        [i18n.t('buttons.createBot')], [i18n.t('buttons.myBots')]
      ]).resize())
    )
  } catch (err) {
    sendError(err, from)
  }  
}