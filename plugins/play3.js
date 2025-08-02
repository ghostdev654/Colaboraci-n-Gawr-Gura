import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🦈 *Gura te dice:*\n\n✏️ Ingresa un título para buscar en YouTube.\n\n📌 Ejemplo:\n> ${usedPrefix}play Corazón Serrano - Mix Poco Yo`, m)
  }

  await m.react('🔍')

  await conn.sendMessage(m.chat, {
    text: `🌊 *Gura está nadando por YouTube...*\n\n🔎 *Buscando:* _${args.join(" ")}_\n\n⏳ Por favor espera un poco...`,
  }, { quoted: m })

  try {
    const searchResults = await searchVideos(args.join(" "))

    if (!searchResults.length) throw new Error('No se encontraron resultados.')

    const video = searchResults[0]
    const thumbnail = await (await fetch(video.thumbnail)).buffer()

    const mensajePrincipal = formatMessageText(video)
    const sugerencias = formatSuggestions(shuffleArray(searchResults.slice(1)).slice(0, 3))

    const fullMessage = `🦈 *Gura encontró este video:*\n\n${mensajePrincipal}\n\n🔎 *Sugerencias acuáticas:*\n${sugerencias}`

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: fullMessage,
      footer: `✨ Gawr Gura Bot 🩵 powered by Wirk`,
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: "🌐 Ver en YouTube",
            url: video.url,
          },
        },
        {
          index: 2,
          quickReplyButton: {
            displayText: "🎧 Descargar MP3",
            id: `${usedPrefix}ytmp3 ${video.url}`,
          },
        },
        {
          index: 3,
          quickReplyButton: {
            displayText: "🎥 Descargar MP4",
            id: `${usedPrefix}ytmp4 ${video.url}`,
          },
        },
      ],
      headerType: 4, // imageMessage
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '❗ Ocurrió un error mientras buceábamos en YouTube. Inténtalo más tarde.', m)
  }
}

handler.help = ['play3']
handler.tags = ['descargas']
handler.command = ['play3']

export default handler

// Función para buscar videos en YouTube
async function searchVideos(query) {
  try {
    const res = await yts(query)
    return res.videos.slice(0, 10).map(video => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      channel: video.author.name,
      published: video.timestamp || 'Desconocido',
      views: video.views?.toLocaleString() || 'Desconocido',
      duration: video.duration.timestamp || 'Desconocido'
    }))
  } catch (error) {
    console.error('❌ Error en yt-search:', error.message)
    return []
  }
}

// Formato principal del video
function formatMessageText(video) {
  return `📌 *Título:* ${video.title}
⏳ *Duración:* ${video.duration}
🎙️ *Canal:* ${video.channel}
🗓️ *Publicado:* ${convertTimeToSpanish(video.published)}
👁️ *Vistas:* ${video.views}
🔗 *Enlace:* ${video.url}`
}

// Lista de sugerencias formateadas
function formatSuggestions(videos) {
  return videos.map((v, i) =>
    `🔹 ${i + 1}. ${truncateTitle(v.title)}\n🔗 ${v.url}`
  ).join('\n')
}

// Recorta títulos largos
function truncateTitle(title, maxLength = 50) {
  return title.length > maxLength ? title.slice(0, maxLength - 3) + '...' : title
}

// Convierte fechas al español
function convertTimeToSpanish(t) {
  return t
    .replace(/years?/, 'años')
    .replace(/months?/, 'meses')
    .replace(/days?/, 'días')
    .replace(/hours?/, 'horas')
    .replace(/minutes?/, 'minutos')
    .replace(/year/, 'año')
    .replace(/month/, 'mes')
    .replace(/day/, 'día')
    .replace(/hour/, 'hora')
    .replace(/minute/, 'minuto')
}

// Mezcla aleatoriamente un array
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5)
}
