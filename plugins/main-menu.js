const menuSections = {
    '🌱 *DESCARGAS* 🌱': [
        '#facebook + <url>',
        '#play + <texto>',
        '#tiktok + <url>',
        '#instagram + <url>',
        '#mediafire + <url>',
        '#yts + <texto>',
        '#mp4 + <url de yt>',
        '#apk + <texto>',
        '#spotify + <url>',
        '#play2 <texto>',
        '#capcut <url>',
    ],
    '🌱 *BÚSQUEDAS* 🌱': [
        '#tiktoksearch + <texto>',
        '#pinterest + <texto>',
        '#google + <texto>',
        '#buscar4',
        '#mercadolibre',
    ],
    '🌱 *CONFIGURACIÓN🌱 ✦': [
        '#antilink',
        '#antispam',
    ],
    '🌱 *GRUPOS* 🌱': [
        '#promote',
        '#demote',
        '#kicknum',
        '#pfp',
        '#tag',
        '#advertencia',
        '#mute <@mencion>',
        '#fantasmas',
        '#kickfantasmas',
    ],
    '🌱 *TOOLS* 🌱': [
        '#s',
        '#qc',
        '#brat + <texto>',
        '#p',
        '#calculadora + <ejemplo 5+7',
        '#toghibli',
        '#inspeccionar + <url>',
        '#wikipedia + <texto>',
        '#hd',
        '#acertijo',
        '#syntax',
    ],
    '🌱 *OWNER* 🌱': [
        '#update',
        '#p',
        '#creador',
        '#banned <@mencion>',
        '#banlist',
        '#spam2',
        '#salir',
    ],
    '🌱 *ANIMES* 🌱': [
        '#slap <@mencion>',
        '#kill <@mencion>',
        '#morder <@mencion>',
        '#bite',
        '#bañarse',
        '#enojado',
        '#angry <@mencion>',
        '#sonrojarse <@mencion>',
        '#blush <@mencion>',
        '#lengua <@mencion>',
        '#bleh <@mencion>',
        '#kiss <@mencion>',
        '#acurrucarse <@mencion>',
        '#cuddle <@mencion>',
        '#cry',
        '#cafe',
        '#coffee',
        '#clap <@mencion>',
        '#bored',
        '#aburrido',
        '#llorar <@mencion>',
    ],
    '🌱 *ECONOMIA* 🌱': [
        '#baltop',
        '#trabajar',
        '#minar',
        '#daily',
        '#transferir',
        '#banco',
        '#inventario',
        '#rank',
        '#shop',
        '#gamble',
        '#robar',
        '#apostar',
        '#lotería',
        '#retirar',
        '#semanal',
        '#robar',
        '#slut',
        '#slot',
        '#ruleta',
        '#pescar',
        '#pay',
    ],
    '🌱 *MENU FUN* 🌱': [
        '#formarpareja5',
        '#formarparejas',
        '#doxear',
        '#top <texto>', 
        '#grupos',  
        '#dance <@mencion>', 
        '#gay2 <@mencion>',
        '#lesbiana <@mencion>',
        '#pajero <@mencion>',
        '#pajera <@mencion>',
        '#puto <@mencion>',
        '#puta  <@mencion>',
        '#manco <@mencion>',
        '#manca <@mencion>',
        '#rata  <@mencion>',
        '#prostituta <@mencion>',
        '#prostituto <@mencion>',
    ],
};

const PREFIX_SYMBOL = '🌴';

function clockString(ms) {
    if (isNaN(ms)) return '--:--:--';
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600) % 24;
    const m = Math.floor(totalSeconds / 60) % 60;
    const s = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

function buildMenuText({ name, botname, uptime, totalreg, totalCommands }) {
    const sectionsText = Object.entries(menuSections)
        .map(([title, commands]) => {
            const commandsList = commands
                .map(cmd => `│${PREFIX_SYMBOL}${cmd}`)
                .join('\n');
            return `\n╭─⬣「 ${title} 」⬣\n${commandsList}\n╰─⬣`;
        })
        .join('\n');

    return `
*🌴Hola ${name}! Me llamo ${botname}*

╭━━「 𝐈𝐍𝐅𝐎 𝐃𝐄𝐋 𝐁𝐎𝐓 」━━
┃ 👑 *Activo:* ${uptime}
┃ 👥 *Usuarios:* ${totalreg}
┃ 📚 *Comandos:* ${totalCommands}
┃ 📣 *Canal*:
https://whatsapp.com/channel/0029Vb6nOKBD8SDp0aFtCD3R
╰━━━━━━━━━━━━━━━

*🌴QUIERES SER SUBBOT*
*🌱PIDE CODE* / *QR*

*🌱 Lista de comandos*:
${sectionsText}

> © POWERED BY DX G😼
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
