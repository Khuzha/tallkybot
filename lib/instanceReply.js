const Scene = require('telegraf/scenes/base')
const sendError = require('./sendError')

const instanceReply = new Scene('reply')

instanceReply.enter(async (ctx) => {
  try {
    ctx.reply(ctx.i18n.t('reply'))
  } catch (err) {
    sendError(err, ctx.from)
  }
})

instanceReply.on('message', (ctx) => {

})

module.exports = instanceReply