import yts from 'yt-search';
import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `✏️ Ingresa un título para buscar en YouTube.

Ejemplo:
> ${usedPrefix}play Corazón Serrano - Mix Poco Yo`, m);
  }

  await m.react('🔍');

  await conn.sendMessage(m.chat, { 
    text: `⏳ *Buscando...*
🔎 ${args.join(" ")}
_Por favor espera un momento..._`, 
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
`${messageText}

🔎 *Sugerencias relacionadas:*
${sugerencias}`;

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: fullMessage,
      footer: `💎 Shadow Ultra Edited 🐻‍❄️ By Wirk 🥮`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 1000,
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
    conn.reply(m.chat, '❗ Ocurrió un error al buscar el video. Inténtalo de nuevo más tarde.', m);
  }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];

export default handler;

// Función de búsqueda YouTube
async function searchVideos(query) {
  try {
    const res = await yts(query);
    return res.videos.slice(0, 10).map(video => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      channel: video.author.name,
      published: video.timestamp || 'No disponible',
      views: video.views?.toLocaleString() || 'No disponible',
      duration: video.duration.timestamp || 'No disponible'
    }));
  } catch (error) {
    console.error('Error en yt-search:', error.message);
    return [];
  }
}

// Formato visual del resultado principal
function formatMessageText(video) {
  return (
    `🎥 *Video encontrado*

📌 Título: ${video.title}
⏳ Duración: ${video.duration}
👤 Canal: ${video.channel}
🗓 Publicado: ${convertTimeToSpanish(video.published)}
👁 Vistas: ${video.views}
🔗 Enlace: ${video.url}`
  );
}

// Formato de sugerencias ordenado
function formatSuggestions(suggestions) {
  return suggestions.map((v, i) => 
    `🔸 ${i + 1}. ${truncateTitle(v.title)}\n🔗 ${v.url}`
  ).join('\n');
}

// Recorta títulos largos
function truncateTitle(title, maxLength = 50) {
  return title.length > maxLength ? title.slice(0, maxLength - 3) + '...' : title;
}

// Botones visuales
function generateButtons(video, usedPrefix) {
  return [
    {
      buttonId: `${usedPrefix}ytmp3 ${video.url}`,
      buttonText: { displayText: '🎧 MP3 (Audio)' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}ytmp4 ${video.url}`,
      buttonText: { displayText: '🎬 MP4 (Video)' },
      type: 1
    }
  ];
}

// Traducir fechas
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

// Array aleatorio
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
