import Scene from 'telegraf/scenes/base.js'
import Extra from 'telegraf/extra.js'
import sendError from './sendError.js'

const instanceReply = new Scene('instanceReply')

instanceReply.enter(async (ctx) => {
  try {
    await ctx.reply(ctx.i18n.t('reply', {
      userId: ctx.session.userId, name: ctx.session.userName
    }), Extra.HTML())
  } catch (err) {
    sendError(err, ctx.from)
  }
})

instanceReply.on('message', async (ctx) => {
  try {
    await ctx.telegram.sendCopy(ctx.session.userId, ctx.message)
    await ctx.reply(ctx.i18n.t('sent'), Extra.inReplyTo(ctx.message.message_id))
    ctx.scene.leave()
  } catch (err) {
    sendError(err, ctx.from)
  }
})


export default instanceReply