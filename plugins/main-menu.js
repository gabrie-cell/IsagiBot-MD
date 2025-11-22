const MEDIA_CONFIG = {
    videos: [
        'https://files.catbox.moe/slo1l0.mp4',
        'https://files.catbox.moe/awoz6k.mp4',
        'https://files.catbox.moe/mci2sn.mp4',
        'https://files.catbox.moe/n1rtnl.mp4'
    ],
    images: [
        'https://files.catbox.moe/fba87o.jpg',
        'https://files.catbox.moe/u3itih.jpg',
        'https://files.catbox.moe/j3ijr0.jpg'
    ],
    videoProbability: 0.4
};

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
    const { videos, images, videoProbability } = MEDIA_CONFIG;
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

    const txt = buildMenuText(metrics);
    
    let messageOptions = {};
    let selectedMediaUrl;
    const useVideo = Math.random() < videoProbability && videos.length > 0;

    if (useVideo) {
        selectedMediaUrl = videos[Math.floor(Math.random() * videos.length)];
        messageOptions = {
            video: { url: selectedMediaUrl },
            gifPlayback: true, 
            caption: txt,
            mentions: [m.sender, userId] 
        };
    } else if (images.length > 0) {
        selectedMediaUrl = images[Math.floor(Math.random() * images.length)];
        
        const channelId = global.channelRD?.id || '120363214532588487@newsletter'; 
        const channelName = global.channelRD?.name || 'Canal';
        
        messageOptions = {
            text: txt,
            contextInfo: {
                mentionedJid: [m.sender, userId],
                isForwarded: false, 
               forwardedNewsletterMessageInfo: { 
                   newsletterJid: channelId,
                   newsletterName: channelName,
                   serverMessageId: -1, 
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: global.botname || 'Tu Bot', 
                    body: global.textbot || 'Bot de WhatsApp', 
                    thumbnailUrl: selectedMediaUrl, 
                    sourceUrl: global.redes || 'https://whatsapp.com/', 
                    mediaType: 1, 
                    showAdAttribution: false, 
                    renderLargerThumbnail: true 
                }
            }
        };
    } else {
        messageOptions = {
            text: txt,
            mentions: [m.sender, userId]
        };
        console.warn("Advertencia: No se encontraron URLs en la configuración de medios. Enviando solo texto.");
    }

    try {
        await conn.sendMessage(m.chat, messageOptions, { quoted: m });
    } catch (error) {
        console.error("Error al enviar el mensaje del menú (Intentando fallback a solo texto):", error);
        await conn.reply(m.chat, `¡Error al intentar mostrar el menú con multimedia! \n\n${txt}`, m);
    }
};


handler.help = ['menu']; 
handler.tags = ['main'];
handler.command =  ['menu', 'menú', 'help']; 
handler.register = true; 

export default handler;
