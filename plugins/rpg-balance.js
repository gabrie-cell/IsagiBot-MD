if (!(who in global.db.data.users)) return m.reply(`ꕥ El usuario no se encuentra en mi base de datos.`)
let user = global.db.data.users[who]
let coin = user.coin || 0
let bank = user.bank || 0
let total = (user.coin || 0) + (user.bank || 0)
const texto = `ᥫ᭡ Informacion -  Balance ❀
 
ᰔᩚ Usuario » *${name}*   
⛀ Cartera » *¥${coin.toLocaleString()} ${currency}*
⚿ Banco » *¥${bank.toLocaleString()} ${currency}*
⛁ Total » *¥${total.toLocaleString()} ${currency}*

> *Para proteger tu dinero, ¡depósitalo en el banco usando #deposit!*`
await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.group = true 

export default handler