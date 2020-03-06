const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const sendError = require('./sendError')

const makeButtonsArr = (bots) => {
  let result = []

  for (let bot of bots) {
    result.push([Markup.callbackButton(bot.botName, `manage_${bot.dbId}`)])
  }
  return result
}

const getMyBots = async (from, db, replyWithHTML, i18n) => {
  try {
    let bots = await db.collection('allBots').find({ ownerId: from.id }).toArray()
    if (bots.length == 0) {
      await replyWithHTML(
        i18n.t('noBots', { name: from.first_name }),
        Extra.markup(Markup.keyboard([
          [i18n.t('buttons.createBot')], [i18n.t('buttons.myBots')]
        ]).resize())
      )
      return
    }

    const buttonsArr = makeButtonsArr(bots)
    await replyWithHTML(
      i18n.t('yourBots'),
      Extra.markup(Markup.inlineKeyboard(buttonsArr))
    )
  } catch (err) {
    sendError(err, from)
  }
}

module.exports = getMyBots