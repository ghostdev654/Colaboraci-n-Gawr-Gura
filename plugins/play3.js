import yts from 'yt-search'
import fetch from 'node-fetch'

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🦈 *Gura dice:*\n\n✏️ Ingresa un título para buscar en YouTube.\n\n📌 Ejemplo:\n> ${usedPrefix}play Un mix bien sabroso`, m)
  }

  await m.react('🔍')

  try {
    const searchResults = await searchVideos(args.join(" "))
    if (!searchResults.length) throw new Error('No se encontraron resultados.')

    const video = searchResults[0]
    const audioInfo = await getYTMP3(video.url)

    if (!audioInfo || !audioInfo.audio || !audioInfo.audio.url) {
      throw new Error('No se pudo obtener el audio.')
    }

    await conn.sendMessage(m.chat, {
      audio: { url: audioInfo.audio.url },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `${video.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: `🎵 ${video.title}`,
          body: '🦈 Gawr Gura Downloader',
          thumbnailUrl: video.thumbnail,
          mediaType: 2,
          mediaUrl: video.url,
          sourceUrl: video.url,
        }
      }
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    conn.reply(m.chat, '❌ Ocurrió un error al buscar o descargar el audio. Intenta con otro título.', m)
  }
}

handler.help = ['play3']
handler.tags = ['descargas']
handler.command = ['play3']

export default handler

// Buscar en YouTube
async function searchVideos(query) {
  try {
    const res = await yts(query)
    return res.videos.slice(0, 5).map(video => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
    }))
  } catch (error) {
    console.error('❌ Error en yt-search:', error.message)
    return []
  }
}

// Obtener enlace MP3 con API pública (no requiere API key)
async function getYTMP3(url) {
  try {
    const res = await fetch(`https://api.lolhuman.xyz/api/ytmusic?apikey=GuraBot&url=${encodeURIComponent(url)}`)
    const json = await res.json()
    return json.status == 200 ? json.result : null
  } catch (e) {
    console.error('❌ Error al obtener MP3:', e.message)
    return null
  }
}
