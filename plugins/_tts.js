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
    return m.reply(`🦈 *Uso correcto, buba~:*\n.${command} <voz> <texto>\n\n🌊 *Voces disponibles:*\n${vocesDisponibles.join(', ')}`)
  }

  const voiceModel = args[0].toLowerCase()
  const text = args.slice(1).join(' ')

  if (!vocesDisponibles.includes(voiceModel)) {
    return m.reply(`💢 *¡Eh?! Voz "${voiceModel}" no encontrada desu~...*\n🌊 *Voces disponibles:*\n${vocesDisponibles.join(', ')}`)
  }

  try {
    const res = await fetch(`https://zenzxz.dpdns.org/tools/text2speech?text=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.status || !Array.isArray(json.results)) {
      return m.reply('💦 *Awww~ Hubo un error al obtener los datos de la API... inténtalo otra vez, buba!*')
    }

    const voice = json.results.find(v => v.model === voiceModel)
    if (!voice || !voice.audio_url) {
      return m.reply('💔 *Hyaaa~ No pude generar el audio con esa voz desu~... ¡Prueba con otra buba!*')
    }

    const audioRes = await fetch(voice.audio_url)
    const audioBuffer = await audioRes.arrayBuffer()

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('💢 *¡Gyaa~! Algo salió mal al generar el audio desu~... inténtalo otra vez, uwu!*')
  }
}

handler.command = /^ttsx$/i
export default handler
