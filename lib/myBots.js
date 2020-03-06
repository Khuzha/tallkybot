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

const getMyBots = async (from, db, messageFunc, i18n) => {
  try {
    let bots = await db.collection('allBots').find({ ownerId: from.id }).toArray()
    if (bots.length == 0) {
      await messageFunc(
        i18n.t('noBots', { name: from.first_name }),
        Extra.markup(Markup.keyboard([
          [i18n.t('buttons.createBot')], [i18n.t('buttons.myBots')]
        ]).resize())
      )
      return
    }

    const buttonsArr = makeButtonsArr(bots)
    await messageFunc(
      i18n.t('yourBots'),
      Extra.markup(Markup.inlineKeyboard(buttonsArr))
    )
  } catch (err) {
    sendError(err, from)
  }
}

const manageBot = async (db, botDbId, editMessageText, from, i18n) => {
  try {
    const botInfo = await db.collection('allBots').findOne({dbId: botDbId})
    await editMessageText(
      i18n.t('manageBot', { botUsername: botInfo.botUn }),
      Extra.markup(Markup.inlineKeyboard([
        [Markup.callbackButton(i18n.t('buttons.editToken'), `editToken_${botDbId}`)],
        [Markup.callbackButton(i18n.t('buttons.deleteBot'), `delete_${botDbId}`)],
        [Markup.callbackButton(i18n.t('buttons.back'), 'toMyBots')]
      ]))
    )
  } catch (err) {
    sendError(err, from)
  }
}

module.exports = { getMyBots, manageBot }