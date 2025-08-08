import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const prompt = args.join(' ')
  if (!prompt) return m.reply(`⚠️ *_USO CORRECTO:_* :\n${usedPrefix + command} <texto para la imagen>\n\nEjemplo:\n${usedPrefix + command} Auto Deportivo GT3`)

  try {
    m.react('🕒')

    const api = `https://theadonix-api.vercel.app/api/IAimagen?prompt=${encodeURIComponent(prompt)}`
    const res = await fetch(api)
    const json = await res.json()

    if (json.status !== 200 || !json.result?.image)
      throw new Error('❌ No se pudo generar la imagen')

    await conn.sendMessage(m.chat, {
      image: { url: json.result.image },
      caption: `📍 *Prompt:* ${prompt}\n> 👤 Usando Adonix API`
    }, { quoted: m })

  } catch (e) {
    console.error('Error generando imagen:', e)
    m.reply('⚠️ Ocurrió un error al generar la imagen. Intenta de nuevo más tarde.')
  }
}

handler.command = ['dalle']
handler.help = ['dalle <texto>']
handler.tags = ['ia']
handler.register = false

export default handler
