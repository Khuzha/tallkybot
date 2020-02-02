const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const data = require('./data')
const { telegram } = new Telegraf(data.token)

const sendError = async (err, from, txt) => {
  try {
    console.log('aisdhiaushduiashidh')
    console.log(err)
    
    const preText = from ? 
      `<b>Ошибка у пользователя</b> <a href="tg://user?id=${from.id}">${from.first_name}</a>:` :
      `<b>Ошибка (${txt}):</b>`
    
    await telegram.sendMessage(
      data.devId, 
      `${preText} <code>${err.toString()}.</code> \n\n<b>Полная ошибка:</b> \n${JSON.stringify(err)}`,
      Extra.HTML()
    )
  } catch (err) {
    console.log(err)
  }
}

module.exports = sendError