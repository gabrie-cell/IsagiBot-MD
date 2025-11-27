import WAMessageStubType from '@whiskeysockets/baileys'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const lidCache = new Map()

const handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return

    const chat = global.db.data.chats[m.chat]
    const primaryBot = chat.primaryBot
    
    if (primaryBot && conn.user.jid !== primaryBot) return

    if (!chat.detect) {
        if (m.messageStubType !== WAMessageStubType.GROUP_ADMIN_INVITE) {
            console.log({
                messageStubType: m.messageStubType,
                messageStubParameters: m.messageStubParameters,
                type: WAMessageStubType[m.messageStubType],
            })
        }
        return
    }

    const [usuario, ppBuffer, thumbnailBuffer] = await Promise.all([
        resolveLidToRealJid(m.sender, conn, m.chat),
        conn.profilePictureUrl(m.chat, 'image').catch(() => null),
        fetch(global.icono).then(res => res.buffer()).catch(() => Buffer.from(''))
    ])

    const groupAdmins = participants.filter(p => p.admin).map(p => p.id)
    const pp = ppBuffer || 'https://files.catbox.moe/xr2m6u.jpg'
    const users = m.messageStubParameters?.[0]
    const usuarioJid = usuario.split('@')[0]
    
    const rcanal = { 
        contextInfo: { 
            isForwarded: true, 
            forwardedNewsletterMessageInfo: { 
                newsletterJid: global.channelRD.id, 
                serverMessageId: '', 
                newsletterName: global.channelRD.name 
            }, 
            externalAdReply: { 
                title: "𐔌 . ⋮ ᗩ ᐯ I Տ O .ᐟ ֹ ₊ ꒱", 
                body: global.textbot, 
                mediaUrl: null, 
                description: null, 
                previewType: "PHOTO", 
                thumbnail: thumbnailBuffer, 
                sourceUrl: global.redes, 
                mediaType: 1, 
                renderLargerThumbnail: false 
            }, 
            mentionedJid: [usuario, ...groupAdmins].filter(Boolean)
        }
    }

    const messages = { 
        [WAMessageStubType.GROUP_CHANGE_NAME]: {
            text: `*📌 Nuevo Nombre del Grupo*\n\n> El grupo ha sido renombrado a:\n> *${users}*\n> 👤 Acción realizada por: @${usuarioJid}`, 
        }, 

        [WAMessageStubType.GROUP_CHANGE_ICON]: {
            text: `*🖼️ Nueva Imagen del Grupo*\n\n> Se ha actualizado la foto de perfil del grupo.\n> 👤 Acción realizada por: @${usuarioJid}`, 
            type: 'image', 
            url: pp, 
        }, 

        [WAMessageStubType.GROUP_CHANGE_INVITE_LINK]: {
            text: `*🔗 Enlace de Invitación Restablecido*\n\n> El enlace de invitación del grupo ha sido renovado.\n> 👤 Acción realizada por: @${usuarioJid}`, 
        }, 

        [WAMessageStubType.GROUP_CHANGE_RESTRICT]: {
            text: `*⚙️ Configuración de Grupo*\n\n> Los ajustes de edición del grupo ahora permiten que *${users === 'on' ? 'SOLO ADMINISTRADORES' : 'TODOS LOS PARTICIPANTES'}* puedan configurarlo.\n> 👤 Acción realizada por: @${usuarioJid}`, 
        }, 

        [WAMessageStubType.GROUP_CHANGE_ANNOUNCE]: {
            text: `*📢 Sala de Mensajes*\n\n> El envío de mensajes está *${users === 'on' ? 'RESTRINGIDO' : 'ABIERTO'}* a ${users === 'on' ? 'solo administradores' : 'todos los participantes'}.\n> 👤 Acción realizada por: @${usuarioJid}`, 
        }, 

        [WAMessageStubType.PROMOTE_PARTICIPANT]: {
            text: `*👑 Nuevo Administrador*\n\n> 🎉 ¡Felicidades! @${users?.split('@')[0]} ha sido *promovido* a administrador.\n> 👤 Promovido por: @${usuarioJid}`, 
            additionalMentions: [users] 
        }, 

        [WAMessageStubType.DEMOTE_PARTICIPANT]: {
            text: `*📉 Administrador Degradado*\n\n> 😔 @${users?.split('@')[0]} ya *no es administrador* del grupo.\n> 👤 Acción realizada por: @${usuarioJid}`, 
            additionalMentions: [users] 
        } 
    }

    const stubType = m.messageStubType
    const action = messages[stubType]

    if (stubType === WAMessageStubType.GROUP_ADMIN_INVITE) {
        const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0]
        const sessionPath = `./${global.sessions}/`
        try {
            const files = await fs.promises.readdir(sessionPath)
            for (const file of files) {
                if (file.includes(uniqid)) {
                    await fs.promises.unlink(path.join(sessionPath, file))
                    console.log(`${chalk.yellow.bold('✎ Delete!')} ${chalk.greenBright(`'${file}'`)}\n${chalk.redBright('Que provoca el "undefined" en el chat.')}`)
                }
            }
        } catch (e) {
            console.error('Error al limpiar archivos de sesión:', e)
        }
    }
    
    if (action) {
        const message = {}
        const finalRcanal = { ...rcanal }

        if (action.additionalMentions) {
            finalRcanal.contextInfo.mentionedJid = [...finalRcanal.contextInfo.mentionedJid, ...action.additionalMentions].filter(Boolean)
        }

        if (action.type === 'image') {
            message.image = { url: action.url }
            message.caption = action.text
        } else {
            message.text = action.text
        }
        
        await conn.sendMessage(m.chat, { ...message, ...finalRcanal }, { quoted: null })
    }
}

export default handler

async function resolveLidToRealJid(lid, conn, groupChatId, maxRetries = 3, retryDelay = 60000) {
    const inputJid = lid?.toString()
    if (!inputJid?.endsWith("@lid") || !groupChatId?.endsWith("@g.us")) {
        return inputJid?.includes("@") ? inputJid : `${inputJid}@s.whatsapp.net`
    }

    if (lidCache.has(inputJid)) {
        return lidCache.get(inputJid)
    }

    const lidToFind = inputJid.split("@")[0]
    let attempts = 0

    while (attempts < maxRetries) {
        try {
            const metadata = await conn?.groupMetadata(groupChatId)

            if (!metadata?.participants?.length) {
                throw new Error("No se obtuvieron participantes o lista vacía")
            }

            for (const participant of metadata.participants) {
                if (!participant?.id) continue
                
                const contactDetails = await conn?.onWhatsApp(participant.id)
                const possibleLid = contactDetails?.[0]?.lid?.split("@")[0]
                
                if (possibleLid === lidToFind) {
                    lidCache.set(inputJid, participant.id)
                    return participant.id
                }
            }

            lidCache.set(inputJid, inputJid)
            return inputJid

        } catch (e) {
            console.error(`Error al resolver LID (Intento ${attempts + 1}/${maxRetries}):`, e.message)
            if (++attempts >= maxRetries) {
                lidCache.set(inputJid, inputJid)
                return inputJid
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelay))
        }
    }
    
    return inputJid
}