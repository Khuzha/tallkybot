module.exports = async (err, from) => {
  try {
    console.log(err)
    
    const preText = from ? 
      `<b>Ошибка у пользователя</b> <a href="tg://user?id=${from.id}">${from.first_name}</a>:` :
      `<b>Ошибка при подключении к БД:</b>`
    
    await telegram.sendMessage(
      data.devId, 
      `${preText} <code>${err.toString()}.</code> \n\n<b>Полная ошибка:</b> \n${JSON.stringify(err)}`,
      Extra.HTML()
    )
  } catch (err) {
    console.log(err)
  }
}