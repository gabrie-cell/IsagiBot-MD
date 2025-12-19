import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  const namegrupo = 'Grupo Oficial'
  const gp1 = 'https://chat.whatsapp.com/C2nmGWWgzZx8JLVneEyywO' // ← tu link real

  const namechannel = 'Canal de la Bot'
  const channel = 'https://whatsapp.com/channel/0029Vb6nOKBD8SDp0aFtCD3R' // ← tu canal real

  const dev = '💎 Creador: Gabriel ofc'
  const catalogo = 'https://qu.ax/hzgtW' // o './media/grupos.jpg'
  const emojis = '😼'

  let grupos = `
╭─⟪ *GRUPOS OFICIAL DE ISAGI* 
│
│ 😼 *${namegrupo}*
│ ${gp1}
│
│ 😺 *${namechannel}*
│ ${channel}
╰─────────────────╯
`

  await conn.sendFile(m.chat, catalogo, 'grupos.jpg', grupos.trim(), m)
  await m.react(emojis)
}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler