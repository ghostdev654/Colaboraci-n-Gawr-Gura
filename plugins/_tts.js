import fetch from 'node-fetch'

let handler = async (m, { conn, args, command }) => {
  const vocesDisponibles = [
    'optimus_prime',
    'eminem',
    'taylor_swift',
    'nahida',
    'miku',
    'nami',
    'goku',
    'ana',
    'elon_musk',
    'mickey_mouse',
    'kendrick_lamar',
    'angela_adkinsh'
  ]

  if (args.length < 2) {
    return m.reply(`*✳️ Uso correcto:*\n\n.${command} <voz> <texto>\n\n🗣️ *Voces disponibles:*
> ${vocesDisponibles.join(', ')}`)
  }

  const voiceModel = args[0].toLowerCase()
  const text = args.slice(1).join(' ')

  if (!vocesDisponibles.includes(voiceModel)) {
    return m.reply(`❌ *Voz* "_${voiceModel}_" *no encontrada.*\n\n🗣️ *Voces disponibles:*\n> ${vocesDisponibles.join(', ')}`)
  }

  // Lista de APIs (principal y de respaldo)
  const apis = [
    `https://zenzxz.dpdns.org/tools/text2speech?text=${encodeURIComponent(text)}`, // API principal
    `https://api.streamelements.com/kappa/v2/speech?voice=${voiceModel}&text=${encodeURIComponent(text)}`, // Respaldo 1
    `https://freetts.com/Home/PlayAudio?Language=en-US&Voice=${encodeURIComponent(voiceModel)}&Text=${encodeURIComponent(text)}` // Respaldo 2
  ]

  let audioUrl = null

  for (const apiUrl of apis) {
    try {
      const res = await fetch(apiUrl)
      
      if (res.ok) {
        // Determinar formato de respuesta según API
        if (apiUrl.includes('zenzxz')) {
          const json = await res.json()
          audioUrl = json.audio_url
        } else if (apiUrl.includes('streamelements')) {
          const json = await res.json()
          audioUrl = json.audio_url
        } else if (apiUrl.includes('freetts')) {
          audioUrl = apiUrl // FreeTTS devuelve el audio directamente
        }

        if (audioUrl) break // Salir del bucle si se obtiene audio
      }
    } catch (e) {
      console.error(`Error con la API: ${apiUrl}`, e)
    }
  }

  if (!audioUrl) {
    return m.reply('❌ *Error:* All APIs failed.\n> Intenta más tarde.')
  }

  try {
    const audioRes = await fetch(audioUrl)
    const audioBuffer = await audioRes.arrayBuffer()

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ *Ocurrió un error al enviar el audio*\n> Intenta más tarde.')
  }
}

handler.command = /^ttsx$/i
export default handler
