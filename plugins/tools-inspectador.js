// Código adaptado por https://github.com/GataNina-Li
// Código compatible con canales y comunidades de WhatsApp 
// También encontrarás código para comandos enfocados para canales de WhatsApp

import { getUrlFromDirectPath } from "@whiskeysockets/baileys"
import _ from "lodash"
import axios from 'axios'
let handler = async (m, { conn, command, usedPrefix, args, text, groupMetadata, isOwner, isROwner }) => {
const isCommand1 = /^(inspect|inspeccionar)\b$/i.test(command)
const isCommand2 = /^(seguircanal)\b$/i.test(command)
const isCommand3 = /^(noseguircanal)\b$/i.test(command)
const isCommand4 = /^(silenciarcanal)\b$/i.test(command)
const isCommand5 = /^(nosilenciarcanal)\b$/i.test(command)
const isCommand6 = /^(nuevafotochannel)\b$/i.test(command)
const isCommand7 = /^(eliminarfotochannel)\b$/i.test(command)
const isCommand8 = /^(avisoschannel|resiviravisos)\b$/i.test(command)
const isCommand9 = /^(reactioneschannel|reaccioneschannel)\b$/i.test(command)
const isCommand10 = /^(nuevonombrecanal)\b$/i.test(command)
const isCommand11 = /^(nuevadescchannel)\b$/i.test(command)
const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
let txtBotAdminCh = '\n\n> *Verifique que el Bot sea admin en el canal, de lo contrario no funcionará el comando*'
global.fkontak = { key: { participants:"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
async function reportError(e) {
await m.reply(`⚠︎ Ocurrió un error.`)
console.log(e)
}
let thumb = icono
let pp, ch, q, mime, buffer, media, inviteUrlch, imageBuffer
switch (true) {     
case isCommand1:
let inviteCode
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el enlace de grupo/comunidad o canal.`, m)
const MetadataGroupInfo = async (res, isInviteInfo = false) => {
let nameCommunity = "no pertenece a ninguna Comunidad"
let groupPicture = "No se pudo obtener"
if (res.linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(res.linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`Nombre:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(res.id, 'image').catch(e => { return null })
inviteCode = await conn.groupInviteCode(m.chat).catch(e => { return null })
const formatParticipants = (participants) => participants && participants.length > 0 ? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : user.admin === "admin" ? " (admin)" : ""}`).join("\n") : "No encontrado"
let caption = `🆔 *Identificador del grupo:*\n${res.id || "No encontrado"}\n\n` +
`👑 *Creado por:*\n${res.owner ? `@${res.owner?.split("@")[0]}` : "No encontrado"} ${res.creation ? `el ${formatDate(res.creation)}` : "(Fecha no encontrada)"}\n\n` +
`🏷️ *Nombre:*\n${res.subject || "No encontrado"}\n\n` +
`✏️ *Nombre cambiado por:*\n${res.subjectOwner ? `@${res.subjectOwner?.split("@")[0]}` : "No encontrado"} ${res.subjectTime ? `el ${formatDate(res.subjectTime)}` : "(Fecha no encontrada)"}\n\n` +
`📄 *Descripción:*\n${res.desc || "No encontrado"}\n\n` +
`📝 *Descripción cambiado por:*\n${res.descOwner ? `@${res.descOwner?.split("@")[0]}` : "No encontrado"}\n\n` +
`🗃️ *Id de la descripción:*\n${res.descId || "No encontrado"}\n\n` +
`🖼️ *Imagen del grupo:*\n${pp ? pp : groupPicture}\n\n` +
`💫 *Autor:*\n${res.author || "No encontrado"}\n\n` +
`🎫 *Código de invitación:*\n${res.inviteCode || inviteCode || "No disponible"}\n\n` +
`⌛ *Duración:*\n${res.ephemeralDuration !== undefined ? `${res.ephemeralDuration} segundos` : "Desconocido"}\n\n` +
`🛃 *Admins:*\n` + (res.participants && res.participants.length > 0 ? res.participants.filter(user => user.admin === "admin" || user.admin === "superadmin").map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : " (admin)"}`).join("\n") : "No encontrado") + `\n\n` +
`🔰 *Usuarios en total:*\n${res.size || "Cantidad no encontrada"}\n\n` +
`✨ *Información avanzada* ✨\n\n🔎 *Comunidad vinculada al grupo:*\n${res.isCommunity ? "Este grupo es un chat de avisos" : `${res.linkedParent ? "`Id:` " + res.linkedParent : "Este grupo"} ${nameCommunity}`}\n\n` +
`⚠️ *Restricciones:* ${res.restrict ? "✅" : "❌"}\n` +
`📢 *Anuncios:* ${res.announce ? "✅" : "❌"}\n` +
`🏘️ *¿Es comunidad?:* ${res.isCommunity ? "✅" : "❌"}\n` +
`📯 *¿Es anuncio de comunidad?:* ${res.isCommunityAnnounce ? "✅" : "❌"}\n` +
`🤝 *Tiene aprobación de miembros:* ${res.joinApprovalMode ? "✅" : "❌"}\n` +
`🆕 *Puede Agregar futuros miembros:* ${res.memberAddMode ? "✅" : "❌"}\n\n` 
return caption.trim()
}
const inviteGroupInfo = async (groupData) => {
const { id, subject, subjectOwner, subjectTime, size, creation, owner, desc, descId, linkedParent, restrict, announce, isCommunity, isCommunityAnnounce, joinApprovalMode, memberAddMode, ephemeralDuration } = groupData
let nameCommunity = "no pertenece a ninguna Comunidad"
let groupPicture = "No se pudo obtener"
if (linkedParent) {
let linkedGroupMeta = await conn.groupMetadata(linkedParent).catch(e => { return null })
nameCommunity = linkedGroupMeta ? "\n" + ("`Nombre:` " + linkedGroupMeta.subject || "") : nameCommunity
}
pp = await conn.profilePictureUrl(id, 'image').catch(e => { return null })
const formatParticipants = (participants) => participants && participants.length > 0 ? participants.map((user, i) => `${i + 1}. @${user.id?.split("@")[0]}${user.admin === "superadmin" ? " (superadmin)" : user.admin === "admin" ? " (admin)" : ""}`).join("\n") : "No encontrado"
let caption = `🆔 *Identificador del grupo:*\n${id || "No encontrado"}\n\n` +
`👑 *Creado por:*\n${owner ? `@${owner?.split("@")[0]}` : "No encontrado"} ${creation ? `el ${formatDate(creation)}` : "(Fecha no encontrada)"}\n\n` +
`🏷️ *Nombre:*\n${subject || "No encontrado"}\n\n` +
`✏️ *Nombre cambiado por:*\n${subjectOwner ? `@${subjectOwner?.split("@")[0]}` : "No encontrado"} ${subjectTime ? `el ${formatDate(subjectTime)}` : "(Fecha no encontrada)"}\n\n` +
`📄 *Descripción:*\n${desc || "No encontrada"}\n\n` +
`💠 *ID de la descripción:*\n${descId || "No encontrado"}\n\n` +
`🖼️ *Imagen del grupo:*\n${pp ? pp : groupPicture}\n\n` +
`🏆 *Miembros destacados:*\n${formatParticipants(groupData.participants)}\n\n` +
`👥 *Destacados total:*\n${size || "Cantidad no encontrada"}\n\n` +
`✨ *Información avanzada* ✨\n\n🔎 *Comunidad vinculada al grupo:*\n${isCommunity ? "Este grupo es un chat de avisos" : `${linkedParent ? "`Id:` " + linkedParent : "Este grupo"} ${nameCommunity}`}\n\n` +
`📢 *Anuncios:* ${announce ? "✅ Si" : "❌ No"}\n` +
`🏘️ *¿Es comunidad?:* ${isCommunity ? "✅ Si" : "❌ No"}\n` +
`📯 *¿Es anuncio de comunidad?:* ${isCommunityAnnounce ? "✅" : "❌"}\n` +
`🤝 *Tiene aprobación de miembros:* ${joinApprovalMode ? "✅" : "❌"}\n`
return caption.trim()
}
let info
try {
let res = text ? null : await conn.groupMetadata(m.chat)
info = await MetadataGroupInfo(res)
console.log('Método de metadatos')
} catch {
const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1]
let inviteInfo
if (inviteUrl) {
try {
inviteInfo = await conn.groupGetInviteInfo(inviteUrl)
info = await inviteGroupInfo(inviteInfo)
console.log(info)
console.log('✧ Método de enlace')    
} catch (e) {
m.reply('✧ Grupo no encontrado')
return
}}}
if (info) {
await conn.sendMessage(m.chat, { text: info, contextInfo: {
mentionedJid: conn.parseMention(info),
externalAdReply: {
title: "❀ Inspector de Grupos",
body: "✧ ¡Super Inspectador!",
thumbnailUrl: pp ? pp : thumb,
sourceUrl: args[0] ? args[0] : inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : md,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: fkontak })
} else {
let newsletterInfo
if (!channelUrl) return await conn.reply(m.chat, "✧ Verifique que sea un enlace de canal de WhatsApp.", m)
if (channelUrl) {
try {
newsletterInfo = await conn.newsletterMetadata("invite", channelUrl).catch(e => { return null })
if (!newsletterInfo) return await conn.reply(m.chat, "✧ No se encontró información del canal. Verifique que el enlace sea correcto.", m)       
let caption = "*Inspector de enlaces de Canales*\n\n" + processObject(newsletterInfo, "", newsletterInfo?.preview)
if (newsletterInfo?.preview) {
pp = getUrlFromDirectPath(newsletterInfo.preview)
} else {
pp = thumb
}
if (channelUrl && newsletterInfo) {
await conn.sendMessage(m.chat, { text: caption, contextInfo: {
mentionedJid: conn.parseMention(caption),
externalAdReply: {
title: "❀ Inspector de Canales",
body: "✧ ¡Super Inspectador!",
thumbnailUrl: pp,
sourceUrl: args[0],
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: fkontak })}
newsletterInfo.id ? conn.sendMessage(m.chat, { text: newsletterInfo.id }, { quoted: null }) : ''
} catch (e) {
reportError(e)
}}}
break
case isCommand2:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
ch
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp que quiere que el bot siga.\n\nPuede obtener el ID usando el comando:\n${usedPrefix}superinspect enlace${txtBotAdminCh}`, m)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterFollow(ch)
await conn.reply(m.chat, `❀ ${botname} ya ha empezado a seguir el canal *${chtitle}*.`, m) 
} catch (e) {
reportError(e)
}
break
case isCommand3:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
ch
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp que quiere que el bot deje de seguir.\n\nPuede obtener el ID usando el comando:\n${usedPrefix}superinspect enlace${txtBotAdminCh}`, m)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUnfollow(ch)
await conn.reply(m.chat, `❀ ${botname} ha dejado de seguir el canal *${chtitle}*.`, m) 
} catch (e) {
reportError(e)
}
break
case isCommand4:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
ch
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp que quiere que el bot silencie las actualizaciones.\n\nPuede obtener el ID usando el comando:\n*${usedPrefix}superinspect enlace${txtBotAdminCh}`, m)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterMute(ch)
await conn.reply(m.chat, `❀ ${botname} ha silenciado las notificaciones para el canal *${chtitle}* con éxito.`, m) 
} catch (e) {
reportError(e)
}
break
case isCommand5:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
ch
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp que quiere que el bot active las actualizaciones.\n\nPuede obtener el ID usando el comando:\n*${usedPrefix}superinspect* enlace${txtBotAdminCh}`, m)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUnmute(ch)
await conn.reply(m.chat, `❀ ${botname} ha dejado de silenciar las notificaciones para el canal *${chtitle}* con éxito.`, m) 
} catch (e) {
reportError(e)
}
break
case isCommand6:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp respondiendo a una imagen jpg/jpeg/png o agregue un enlace de imagen\n
Respondiendo a una imagen
*${usedPrefix + command}* 12345@newsletter

*Agregando url de imagen*
*${usedPrefix + command}* 12345@newsletter https://example.com/image.jpg\n\nPuede obtener el ID usando el comando:\n*${usedPrefix}superinspect* enlace${txtBotAdminCh}`, m)
const regex = /(\b\w+@newsletter\b)(?:.*?(https?:\/\/[^\s]+?\.(?:jpe?g|png)))?/i
const match = text.match(regex)
let match1 = match ? match[1] ? match[1] : null : null
let match2 = match ? match[2] ? match[2] : null : null
if (m.quoted) {
q = m.quoted ? m.quoted : m
mime = (q.msg || q).mimetype || q.mediaType || ''
if (/image/g.test(mime) && !/webp/g.test(mime)) {
media = await q.download()
} else {
return await conn.reply(m.chat, `❀ *Responda a una imagen jpg/png.*`, m)
}} else { 
const imageUrlRegex = /(https?:\/\/[^\s]+?\.(?:jpe?g|png))/
if (!match2 && !text.match(imageUrlRegex)) return await conn.reply(m.chat, `❀ *Agregué el enlace jpg/png después del ID del canal.*`, m)
try {
const response = await axios.get(match2 ? match2 : text.match(imageUrlRegex), { responseType: 'arraybuffer' })
imageBuffer = Buffer.from(response.data, 'binary')
} catch (error) {
return await conn.reply(m.chat, `⚠︎ Error al descargar la imagen de la URL proporcionada.`, m)
}
media = imageBuffer
}
if (text.includes("@newsletter")) {
if(!match1) return await conn.reply(m.chat, `✧ No se encontró el ID del canal.`, m)
ch = match1
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterUpdatePicture(ch, media)
await conn.sendMessage(ch, { text: `❀ ${botname} ha cambiando la imagen del canal *${chtitle}* con éxito.`, contextInfo: {
externalAdReply: {
title: "【 ✧ 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐂𝐈𝐎́𝐍 ✧ 】",
body: '❀ 𝙽𝚞𝚎𝚟𝚊 𝚒𝚖𝚊𝚐𝚎𝚗 𝚍𝚎 𝚙𝚎𝚛𝚍𝚒𝚕 𝚍𝚎𝚕 𝚌𝚊𝚗𝚊𝚕.',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break
case isCommand7:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
ch
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp que quiere que el bot elimine la imagen del canal.\n\nPuede obtener el ID usando el comando:\n${usedPrefix}superinspect enlace${txtBotAdminCh}`, m)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterRemovePicture(ch)
await conn.sendMessage(ch, { text: `❀ ${botname} ha eliminado la imagen del canal *${chtitle}* con éxito.`, contextInfo: {
externalAdReply: {
title: "【 ✧ 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐂𝐈𝐎́𝐍 ✧ 】",
body: '❀ 𝙸𝚖𝚊𝚐𝚎𝚗 𝚍𝚎 𝚙𝚎𝚛𝚏𝚒𝚕 𝚍𝚎𝚕 𝚌𝚊𝚗𝚊𝚕 𝚑𝚊 𝚜𝚒𝚍𝚘 𝚎𝚕𝚒𝚖𝚒𝚗𝚊𝚍𝚊',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break
case isCommand8:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
ch
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp para que el bot reciba notificaciones en tiempo real.\n\nPuede obtener el ID usando el comando:\n*${usedPrefix}superinspect enlace${txtBotAdminCh}`, m)
if (text.includes("@newsletter")) {
ch = text
} else {
ch = await conn.newsletterMetadata("invite", channelUrl).then(data => data.id).catch(e => null)
}       
try {
const chtitle = await conn.newsletterMetadata(text.includes("@newsletter") ? "jid" : "invite", text.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.subscribeNewsletterUpdates(ch)
await conn.reply(m.chat, `❀ ${botname} recibirá notificaciones del canal *${chtitle}*`, m) 
} catch (e) {
reportError(e)
}
break
case isCommand9:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
ch
if (!text) return await conn.reply(m.chat, `
❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp seguido de un espacio y la opción del modo de reacciones para el canal.

*Modo de reacciones:*
> Use solo el número de la opción.

*Opciones:*
\`\`\`[1]\`\`\` Reacción con cualquier emoji.
\`\`\`[2]\`\`\` Reacción con emojis predeterminados.
\`\`\`[3]\`\`\` Ninguna reacción.

*Ejemplo de uso:*
*${usedPrefix + command}* 12345@newsletter 1

Puede obtener el ID usando el comando:\n*${usedPrefix}superinspect* enlace${txtBotAdminCh}`.trim(), m)
const parts = text.split(' ')
const modeNumber = parseInt(parts.pop())
ch = parts.join(' ')
let mode
switch (modeNumber) {
case 1:
mode = 'ALL'
break
case 2:
mode = 'BASIC'
break
case 3:
mode = 'NONE'
break
default:
return await conn.reply(m.chat, `✧ Modo de reacción no válida.\n
*Modo de reacciones:*
> Use solo el número de la opción.

*Opciones:*
\`\`\`[1]\`\`\` Reacción con cualquier emoji.
\`\`\`[2]\`\`\` Reacción con emojis predeterminados.
\`\`\`[3]\`\`\` Ninguna reacción.

Ejemplo de uso:
*${usedPrefix + command}* 12345@newsletter 1`, m)
}
if (ch.includes("@newsletter")) {
ch = ch.trim()
} else {
ch = await conn.newsletterMetadata("invite", ch).then(data => data.id).catch(e => null)
}
try {
const chtitle = await conn.newsletterMetadata(ch.includes("@newsletter") ? "jid" : "invite", ch.includes("@newsletter") ? ch : channelUrl).then(data => data.name).catch(e => null)
await conn.newsletterReactionMode(ch, mode)
await conn.sendMessage(ch, { text: `❀ ${botname} ha establecido el modo de reacciones como \`"${mode}"\` para el canal *${chtitle}*`, contextInfo: {
externalAdReply: {
title: "【 ✧ 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐂𝐈𝐎́𝐍 ✧ 】",
body: '❀ 𝙰𝚓𝚞𝚜𝚝𝚎𝚜 𝚎𝚗 𝚛𝚎𝚊𝚌𝚌𝚒𝚘𝚗𝚎𝚜.',
thumbnailUrl: pp,
sourceUrl: redes,
mediaType: 1,
showAdAttribution: false,
renderLargerThumbnail: false
}}}, { quoted: null })
} catch (e) {
reportError(e)
}
break
case isCommand10:
if (!isOwner || !isROwner) return await conn.reply(m.chat, `✧ No tienes permiso para usar este comando.`, m)
if (!text) return await conn.reply(m.chat, `❀ Por favor, ingrese el ID o enlace de un canal de WhatsApp para que el bot modifique el nombre del canal.*\n\n
*Parámetros de uso:
*${usedPrefix + command}* \`id\` \`nombre\` 

Ejemplo de uso:
*${usedPrefix + command}* 12345@newsletter NombreDelcanal\n\nPuede obtener el ID usando el comando:\n*${usedPrefix}superinspect* enlace${txtBotAdminCh}`, m)
const [id, ...nameParts] = text.split(' ')
const name = nameParts.join(' ').trim()