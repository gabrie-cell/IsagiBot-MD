for (const dirname of tmpPaths) {
const files = readdirSync(dirname)
for (const file of files) {
const fullPath = join(dirname, file)
const stats = statSync(fullPath)
if (stats.isDirectory()) continue
unlinkSync(fullPath)
totalDeleted++
}}
await m.react('✔️')
conn.reply(m.chat, `🪷 *Listo, se eliminaron ${totalDeleted} archivos de las carpetas temporales*.`, m)
break
}}} catch (err) {
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${err.message}`, m)
}}

handler.help = ['delai', 'dsowner', 'cleartmp', 'vaciartmp']
handler.tags = ['owner']
handler.command = ['delai', 'dsowner', 'cleartmp', 'vaciartmp']

export default handler