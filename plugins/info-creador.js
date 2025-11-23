let handler = async (m, { conn }) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:𝘋𝘦𝘷-𝘧𝘦𝘥𝘦𝘹𝘺𝘻
ORG:𝘋𝘦𝘷-𝘧𝘦𝘥𝘦𝘹𝘺𝘻
TITLE:Epictetus, Enchiridion — Chapter 1 (verse 1)
EMAIL;type=INTERNET:doxeosjr@gmail.com 
TEL;type=CELL;waid=51941247696:+51941247696
ADR;type=WORK:;;2-chōme-7-5 Fuchūchō;Izumi;Osaka;594-0071;Japan
URL;type=WORK:https://www.instagram.com/DV G Dx
X-WA-BIZ-NAME:I S A G I - Ｂｏｔ
X-WA-BIZ-DESCRIPTION:🄲 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘣𝘺 𝘋𝘦𝘷-𝘧Dani
X-WA-BIZ-HOURS:Mo-Su 00:00-23:59
END:VCARD`;

    const q = {
        key: {
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
        },
        message: {
            contactMessage: {
                displayName: "𝘍𝘦𝘥𝘦 𝘜𝘤𝘩𝘪𝘩𝘢",
                vcard,
            },
        },
    };

    await conn.sendMessage(
        m.chat,
        {
            contacts: {
                displayName: "𝘍𝘦𝘥𝘦 𝘜𝘤𝘩𝘪𝘩𝘢",
                contacts: [{ vcard }],
            },
            contextInfo: {
                externalAdReply: {
                    title: "© 2025–2025 Isagi Project",
                    body: "Contacta con el owner del bot.",
                    thumbnailUrl: "https://files.catbox.moe/12zb63.jpg",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        },
        { quoted: q }
    );
};

handler.help = ["owner"];
handler.tags = ["info"];
handler.command = ['owner', 'creador']

export default handler;