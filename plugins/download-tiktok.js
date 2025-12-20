// Código Dev-fedexyz13 

import fetch from 'node-fetch';

const handler = async (m, { conn, args}) => {
  const emoji = '📥';

  const url = args[0];
  if (!url ||!url.startsWith('http')) {
    return conn.reply(m.chat, `${emoji} Por favor, proporciona un enlace válido de TikTok.`, m);
}

  await conn.reply(m.chat, `${emoji} Procesando tu solicitud...`, m);

  try {
    const videoData = await fetchTikTokVideo(url);

    if (!videoData?.data?.play) {
      return conn.reply(m.chat, `${emoji} No se pudo obtener el video. Verifica el enlace.`, m);
}

    const videoURL = videoData.data.play;

    await conn.sendFile(m.chat, videoURL, 'tiktok.mp4', `${emoji} Aquí tienes tu video 🎬`, m);
} catch (error) {
    console.error('Error al descargar TikTok:', error);
    return conn.reply(m.chat, `${emoji} Ocurrió un error: ${error.message}`, m);
}
};

handler.help = ['tiktok <link>'];
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
handler.group = true;
handler.limit = true;

export default handler;

async function fetchTikTokVideo(url) {
  const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
  const response = await fetch(api);
  if (!response.ok) throw new Error('No se pudo conectar con el servidor TikWM.');
  return await response.json();
}