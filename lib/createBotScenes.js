const Scene = require('telegraf/scenes/base')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const getToken = new Scene('getToken')

getToken.enter(({ replyWithHTML, i18n, from }) => {
  replyWithHTML(
    i18n.t('getToken'),
    Extra.markup(Markup.keyboard([
      [i18n.t('buttons.cancel')]
    ]))
  )
})
'992423853:AAFwE1VyujhzfhtJlO47ulOcNYZsVPLbytY'
getToken.hears(/^[0-9]{9}:[a-zA-Z0-9_]/, ({ message }) => {
  console.log(message.text)
})


module.exports = { getToken }