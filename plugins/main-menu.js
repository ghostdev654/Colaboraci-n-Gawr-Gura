var handler = async (m, { conn, args }) => {
  let group = m.chat
  let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

  // Decoraciones dinámicas
  const decorations = [
    '✧･ﾟ: *✧･ﾟ: 🦈* :･ﾟ✧ :･ﾟ✧', // Decoración 1
    '✿･ﾟ: *✿･ﾟ: 🌊* :･ﾟ✿ :･ﾟ✿', // Decoración 2
    '☁︎･ﾟ: *☁︎･ﾟ: 🐟* :･ﾟ☁︎ :･ﾟ☁︎', // Decoración 3
    '✦･ﾟ: *✦･ﾟ: 🐚* :･ﾟ✦ :･ﾟ✦', // Decoración 4
    '✸･ﾟ: *✸･ﾟ: 💙* :･ﾟ✸ :･ﾟ✸'  // Decoración 5
  ]

  let message = null
  let startTime = Date.now()

  // Animación por 5 segundos
  while (Date.now() - startTime < 5000) {
    const randomDecoration = decorations[Math.floor(Math.random() * decorations.length)]
    message = `
${randomDecoration}

🌊 *Aquí tienes el link del grupo buba~:* ✨

➤ ${link}

꒰ 🌟 *Únete y nada con nosotros en este hermoso grupo desu~!* 🌟 ꒱

🌊 *- Gawr Gura 🦈*
`
    await conn.reply(m.chat, message, m, { detectLink: true })
    await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar 1 segundo antes de actualizar
  }

  // Mensaje final después de completar la animación
  const finalDecoration = decorations[0] // Usa la primera decoración como estática
  const finalMessage = `
${finalDecoration}

🌊 *Aquí está el link del grupo buba~:* ✨

➤ ${link}

꒰ 🌟 *Espero te diviertas en el grupo desu~!* 🌟 ꒱

🌊 *- Gawr Gura 🦈*
`
  await conn.reply(m.chat, finalMessage, m, { detectLink: true })
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link', 'enlace']
handler.group = true
handler.botAdmin = true

export default handler
