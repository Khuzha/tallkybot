const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const sendError = require('./sendError')

const instanceReply = new Scene('instanceReply')

instanceReply.enter(async (ctx) => {
  try {
    ctx.reply(ctx.i18n.t('reply', {
      userId: ctx.session.userId, name: ctx.session.userName
    }), Extra.HTML())
  } catch (err) {
    sendError(err, ctx.from)
  }
})

instanceReply.on('message', async (ctx) => {
  try {
    await ctx.telegram.sendCopy(ctx.session.userId, ctx.message)
  } catch (err) {
    sendError(err, ctx.from)
  }
})

module.exports = instanceReply