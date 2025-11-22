const menuSections = {
    '✰ DESCARGAS ✰': [
        '#facebook + <url>',
        '#play + <texto>',
        '#tiktok + <url>',
        '#video + <texto>',
        '#audiodoc',
        '#videodoc',
        '#ig + <url>',
        '#mediafire + <url>',
        '#spotify + <url>',
        '#anime',
        '#animedl',
    ],
    '✰ BÚSQUEDAS ✰': [
        '#pinterest + <texto>',
        '#tiktoksearch + <texto>',
        '#tweetpost',
        '#wikipedia <búsqueda>',
    ],
    '✰ CONFIGURACIÓN ✰': [
        '#antibot',
        '#antidelete',
        '#antilink',
        '#antilink2',
        '#antiprivado',
        '#antispam',
        '#antisubbots',
        '#antitoxic',
        '#antitrabas',
        '#antiver',
        '#autoaceptar',
        '#autorechazar',
        '#autoresponder',
        '#autosticker',
    ],
    '✰ GRUPOS ✰': [
        '#promote',
        '#setbye',
        '#setwelcome',
        '#setprimary',
        '#tag',
    ],
    '✰ TOOLS ✰': [
        '#s',
        '#qc',
        '#toimg',
        '#p',
        '#cbx',
        '#toghibli',
        '#imagedit',
        '#tofigure',
        '#hd',
    ]
};

const PREFIX_SYMBOL = '⁖ฺ۟̇࣪·֗٬̤⃟⚡';
const COMMAND_START = '#'; 

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
                .map(cmd => `│${PREFIX_SYMBOL}${cmd.startsWith(COMMAND_START) ? cmd : COMMAND_START + cmd}`)
                .join('\n');
            return `\n╭─⬣「 ${title} 」⬣\n${commandsList}\n╰─⬣`;
        })
        .join('\n');

    return `
¡Hola ${name}! Me llamo ${botname} 

╭━━ INFO - BOT ━ 
┃Tiempo activo: ${uptime}
┃Registros: ${totalreg}
┃Comandos: ${totalCommands}
┃✦ Canal: https://whatsapp.com/channel/0029VbAt0n3It5rv4WOUcH00
╰━━━━━━━━━━━━━

¿Quieres ser un sub bot?
Utiliza *#qr* ó *#code*
 
✰ Lista de comandos:
${sectionsText}

> © Powered by Staff Mita Bot
`.trim();
}

let handler = async (m, { conn }) => {
    const userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    const name = conn.getName(userId);
    const _uptime = process.uptime() * 1000;

    const metrics = {
        name: name,
        botname: global.botname || 'Tu Bot', 
        uptime: clockString(_uptime),
        totalreg: Object.keys(global.db?.data?.users || {}).length,
        totalCommands: Object.values(global.plugins || {}).filter((v) => v.help && v.tags).length,
    };

    const menuText = buildMenuText(metrics);

    await conn.sendMessage(m.chat, {
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: global.canalNombreM?.[0] || 'Isagi - Bot',
                body: 'Isagi bot',
                thumbnailUrl: 'https://files.catbox.moe/fba87o.jpg',
                sourceUrl: 'https://github.com/dev-fedexyzz',
                mediaType: 1,
                renderLargerThumbnail: true
            },
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.canalIdM?.[0] || '',
                newsletterName: 'Isagi - 𝖡𝗈𝗍',
                serverMessageId: -1
            }
        }
    }, { quoted: m });
};


handler.help = ['menu']; 
handler.tags = ['main'];
handler.command =  ['menu', 'menú', 'help']; 
handler.register = true; 

export default handler;
