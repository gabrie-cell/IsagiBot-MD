// antiarabepriv.js
const ownerNumber = "180650938249287@lid" // tu número como owner
const arabicPrefixes = ['212', '20', '971', '965', '966', '974', '973', '962']

const handler = async (m, { conn, args }) => {
  if (!global.db.data.settings) global.db.data.settings = {}
  const settings = global.db.data.settings

  if (m.sender !== ownerNumber) return m.reply('❌ Solo el owner puede usar este comando.')

  const option = (args[0] || '').toLowerCase()
  if (!['on', 'off'].includes(option)) {
    return m.reply(`✳️ Usa:\n*.antiarabepriv on* / *.antiarabepriv off*`)
  }

  settings.antiarabepriv = option === 'on'
  return m.reply(`✅ Antiarabe Priv ${option === 'on' ? 'activado' : 'desactivado'}.`)
}

handler.command = ['antiarabepriv']
handler.owner = true
handler.group = false
handler.private = false
handler.tags = ['owner']
handler.help = ['antiarabepriv on', 'antiarabepriv off']

// Antes de procesar cualquier mensaje privado
handler.before = async (m, { conn }) => {
  if (m.isGroup) return
  if (!global.db.data.settings) global.db.data.settings = {}
  const settings = global.db.data.settings

  if (settings.antiarabepriv) {
    const jid = m.chat
    const number = jid.split('@')[0]
    const isArab = arabicPrefixes.some(prefix => number.startsWith(prefix))

    if (isArab) {
      try {
        await conn.updateBlockStatus(jid, 'block')
        console.log(`Bloqueado número árabe en privado: ${jid}`)
      } catch (e) {
        console.log('Error al bloquear:', e)
      }
      return true
    }
  }
}

export default handler