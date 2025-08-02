import yts from 'yt-search';
import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🦈 *Gura te dice~*: Ingresa un título para buscar en YouTube.

✨ *Ejemplo:*
> ${usedPrefix}play Corazón Serrano - Mix Poco Yo`, m);
  }

  await m.react('🔍');

  await conn.sendMessage(m.chat, { 
    text: `🌊 *Gura está buceando en YouTube...*\n🔎 _Buscando:_ ${args.join(" ")}\n🐟 Por favor espera unos segundos...`, 
    tts: false 
  }, { quoted: m });

  try {
    const searchResults = await searchVideos(args.join(" "));

    if (!searchResults.length) throw new Error('No se encontraron resultados.');

    const video = searchResults[0];
    const thumbnail = await (await fetch(video.thumbnail)).buffer();

    const messageText = formatMessageText(video);
    const randomSuggestions = shuffleArray(searchResults.slice(1)).slice(0, 3);
    const sugerencias = formatSuggestions(randomSuggestions);

    const fullMessage = 
`🦈 *Gura encontró algo adorable para ti~* 💙

${messageText}

📌 *Sugerencias misteriosas del océano:*
${sugerencias}`;

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: fullMessage,
      footer: `🔱 GuraBot by Wirk — powered by la magia de las olas 🌊`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 2024,
        isForwarded: true
      },
      buttons: generateButtons(video, usedPrefix),
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.react('❌');
    conn.reply(m.chat, '💔 *Gura-chan no pudo encontrar ese video... intenta con otra búsqueda~*', m);
  }
};

handler.help = ['play3'];
handler.tags = ['descargas'];
handler.command = ['play3'];

export default handler;

// 🔍 Búsqueda en YouTube
async function searchVideos(query) {
  try {
    const res = await yts(query);
    return res.videos.slice(0, 10).map(video => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      channel: video.author.name,
      published: video.timestamp || 'Desconocido',
      views: video.views?.toLocaleString() || 'N/A',
      duration: video.duration.timestamp || 'No disponible'
    }));
  } catch (error) {
    console.error('❌ Error en yt-search:', error.message);
    return [];
  }
}

// 🎀 Formato principal del mensaje
function formatMessageText(video) {
  return (
`🎬 *Título:* ${video.title}
⏳ *Duración:* ${video.duration}
👤 *Canal:* ${video.channel}
📅 *Publicado:* ${convertTimeToSpanish(video.published)}
👁️ *Vistas:* ${video.views}
🌐 *Enlace:* ${video.url}`
  );
}

// 🪸 Sugerencias de Gura
function formatSuggestions(suggestions) {
  return suggestions.map((v, i) => 
    `🪷 ${i + 1}. ${truncateTitle(v.title)}\n🔗 ${v.url}`
  ).join('\n');
}

// ⛏️ Recorta títulos largos
function truncateTitle(title, maxLength = 50) {
  return title.length > maxLength ? title.slice(0, maxLength - 3) + '...' : title;
}

// 🧜 Botones para audio y video
function generateButtons(video, usedPrefix) {
  return [
    {
      buttonId: `${usedPrefix}ytmp3 ${video.url}`,
      buttonText: { displayText: '🎧 Descargar MP3' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}ytmp4 ${video.url}`,
      buttonText: { displayText: '🎥 Descargar MP4' },
      type: 1
    }
  ];
}

// 🌊 Traducción de tiempo
function convertTimeToSpanish(timeText) {
  return timeText
    .replace(/years?/, 'años')
    .replace(/months?/, 'meses')
    .replace(/days?/, 'días')
    .replace(/hours?/, 'horas')
    .replace(/minutes?/, 'minutos')
    .replace(/year/, 'año')
    .replace(/month/, 'mes')
    .replace(/day/, 'día')
    .replace(/hour/, 'hora')
    .replace(/minute/, 'minuto');
}

// 🐠 Mezcla sugerencias aleatoriamente
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
