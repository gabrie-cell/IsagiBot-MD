const SECCION_DESCARGAS_TEXTO = `
⬇️ DESCARGAS ⬇️
#facebook + <url>
#play + <texto>
#tiktok + <url>
#instagram + <url>
#mediafire + <url>
#yts + <texto>
#mp4 + <url de yt>
#apk + <texto>
#spotify + <url>
#descarga1
#descarga2
`;

const SECCION_BUSQUEDAS_TEXTO = `
🔍 BÚSQUEDAS 🔍
#tiktoksearch + <texto>
#pinterest + <texto>
#google + <texto>
#buscar4
`;

const SECCION_CONFIGURACION_TEXTO = `
⚙️ CONFIGURACIÓN ⚙️
#antibot
#antidelete
#antilink
#antilink2
#antiprivado
#antispam
#antisubbots
#antitoxic
#antitrabas
#antiver
#autoaceptar
#autorechazar
#autoresponder
#autosticker
`;

const SECCION_GRUPOS_TEXTO = `
👥 GRUPOS 👥
#promote
#demote
#kicknum
#setprimary
#tag
#advertencia
`;

const SECCION_TOOLS_TEXTO = `
🛠️ TOOLS 🛠️
#s
#qc
#brat + <texto>
#p
#calculadora + <ejemplo 5+7
#toghibli
#inspeccionar + <url>
#wikipedia + <texto>
#hd
`;

const SECCION_OWNER_TEXTO = `
👑 OWNER 👑
#update
#p
#creador
#banned <@mencion>
#banlist
`;

const SECCION_ANIMES_TEXTO = `
✨ ANIMES ✨
#slap <@mencion>
#kill <@mencion>
#morder <@mencion>
#bite
#bañarse
#enojado
#angry <@mencion>
#sonrojarse <@mencion>
#blush <@mencion>
#lengua <@mencion>
#bleh <@mencion>
#kiss <@mencion>
#acurrucarse <@mencion>
#cuddle <@mencion>
#cry
#cafe
#coffee
#clap <@mencion>
#bored
#aburrido
#llorar <@mencion>
`;

const SECCION_ECONOMIA_TEXTO = `
💰 ECONOMIA 💰
#baltop
#trabajar
#minar
#daily
#transferir
#banco
#inventario
#rank
#shop
#gamble
#robar
#apostar
#lotería
#retirar
#semanal
#robar
#slut
#slot
#ruleta
#pescar
#pay
#depositar
`;

const menuSections = [
    SECCION_DESCARGAS_TEXTO,
    SECCION_BUSQUEDAS_TEXTO,
    SECCION_CONFIGURACION_TEXTO,
    SECCION_GRUPOS_TEXTO,
    SECCION_TOOLS_TEXTO,
    SECCION_OWNER_TEXTO,
    SECCION_ANIMES_TEXTO,
    SECCION_ECONOMIA_TEXTO,
];

const PREFIX_SYMBOL = '🌷';

function clockString(ms) {
    if (isNaN(ms)) return '--:--:--';
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600) % 24;
    const m = Math.floor(totalSeconds / 60) % 60;
    const s = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

function processSectionText(sectionText) {
    const lines = sectionText.trim().split('\n').map(line => line.trim());
    
    const title = lines[0].trim();
    
    const commands = lines.slice(1).filter(cmd => cmd.length > 0);

    const cleanCommands = commands.map(cmd => 
        cmd.split(' + ')[0].split(' <')[0].trim()
    );

    const commandsList = cleanCommands
        .map(cmd => `${PREFIX_SYMBOL}${cmd}`)
        .join(' | ');
            
    return `\n*${title}*\n> ${commandsList}`;
}

function buildMenuText({ name, botname, uptime, totalreg, totalCommands }) {
    const sectionsText = menuSections
        .map(processSectionText)
        .join('\n---');

    return `
¡Hola ${name}! Me llamo ${botname}

╭━━「 𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐁𝐎𝐓 」━━
┃ 👑 *Activo:* ${uptime}
┃ 👥 *Usuarios:* ${totalreg}
┃ 📚 *Comandos:* ${totalCommands}
┃ 📣 *Canal:
https://whatsapp.com/channel/0029Vb6nOKBD8SDp0aFtCD3R
╰━━━━━━━━━━━━━━━

¿*Quieres ser un sub bot?
Utiliza* *#qr* ó *#code*

---
✦ Lista de comandos:
${sectionsText}
---

> © Powered by Staff isagi Bot
`.trim();
}

let handler = async (m, { conn }) => {
    const userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    const name = conn.getName(userId);
    const _uptime = process.uptime() * 1000;

    const metrics = {
        name: name,
        botname: global.botname || 'Isagi Bot',
        uptime: clockString(_uptime),
        totalreg: Object.keys(global.db?.data?.users || {}).length,
        totalCommands: Object.values(global.plugins || {}).filter((v) => v.help && v.tags).length,
    };

    const menuText = buildMenuText(metrics);

    const videoUrl = 'https://files.catbox.moe/oakq7t.mp4';

    await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        gifPlayback: true,
        caption: menuText,
        contextInfo: {
            externalAdReply: {
                title: 'Isagi - Bot',
                body: metrics.botname,
                thumbnailUrl: 'https://files.catbox.moe/6orur7.jpg',
                mediaType: 1,
            },
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.canalIdM?.[0] || '',
                newsletterName: 'Isagi - MD',
                serverMessageId: -1
            }
        }
    }, { quoted: m });
};


handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'menú', 'help'];
handler.register = true;

export default handler;
