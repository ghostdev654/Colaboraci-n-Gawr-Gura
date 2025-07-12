//código creado x The Carlos 

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) {
    return await m.reply(`
⛔ *ACCESO DENEGADO*  
┏━━━━━━━━━━━━━━━━━━━━━━┓  
┃ 🔐 *PERMISO RESTRINGIDO*  
┃ 🚫 Solo el [ROOT-OVERSEER] puede ejecutar este módulo.  
┃ 🧠 Intento registrado en el núcleo.  
┗━━━━━━━━━━━━━━━━━━━━━━┛  
    `.trim())
  }

  const sleep = ms => new Promise(res => setTimeout(res, ms))
  const group = m.chat
  const metadata = await conn.groupMetadata(group)
  const totalMembers = metadata.participants.length
  const admins = metadata.participants.filter(p => p.admin != null).length

  const chatMessages = conn.chats?.[m.chat]?.messages
  let lastSenders = []
  if (chatMessages) {
    lastSenders = [...new Set(Object.values(chatMessages)
      .map(msg => msg.key.participant)
      .filter(Boolean)
      .reverse())]
      .slice(0, 5)
      .map((jid, i) => `  ${i + 1}. @${jid.split('@')[0]}`)
  }

  const allMentions = metadata.participants.map(u => u.id)

  // Mensaje inicial brutal hacker con tags
  await m.reply(`
⚠️ 🚨 *ALERTA DE SEGURIDAD* 🚨 ⚠️

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
█▄─█─▄█▄─▀█▀─▄█▄─▄█▄─▀█▄─▄█▄─▀█▄─▄█
██─▄▀███─█▄█─███─███─█▄▀─███─█▄▀─██
▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▀▀▄▄▀

👁️‍🗨️ *INTRUSOS DETECTADOS EN EL SISTEMA* 👁️‍🗨️

⏳ Iniciando ataque cibernético en 3 segundos...
`.trim(), null, { mentions: allMentions })

  await sleep(3000)

  // Frases glitch estilo hacker brutales
  const glitchFrases = [
    '💀 A͟L͟E͟R͟T͟A͟: T̷e̷ ̷v̷a̷n̷ ̷a̷ ̷h̷a̷c̷k̷e̷a̷r̷... 💀',
    '👾 A͟c͟c͟e͟d͟i͟e͟n͟d͟o͟ ̷a̷ ̷t̷u̷s̷ ̷d̷a̷t̷o̷s̷ ̷p̷r̷i̷v̷a̷d̷o̷s̷... 👾',
    '⚠️ P̷r̷e̷p̷a̷r̷a̷n̷d̷o̷ ̷v̷i̷r̷u̷s̷ ̷c̷i̷b̷e̷r̷n̷é̷t̷i̷c̷o̷... ⚠️',
    '🧨 ¡B͟o͟m͟b͟a͟ ͟l͟ó͟g͟i͟c͟a͟ ͟a͟c͟t͟i͟v͟a͟d͟a͟! 🧨',
    '💻 I͟n͟y͟e͟c͟c͟i͟ó͟n͟ ͟d͟e͟ ͟c͟ó͟d͟i͟g͟o͟ ͟m͟a͟l͟i͟c͟i͟o͟s͟o͟ ͟e͟n͟ ͟p͟r͟o͟c͟e͟s͟o͟... 💻',
    '🔓 C͟o͟n͟t͟r͟a͟s͟e͟ñ͟a͟s͟ ͟c͟o͟m͟p͟r͟o͟m͟e͟t͟i͟d͟a͟s͟... 🔓',
    '☠️ S͟i͟s͟t͟e͟m͟a͟ ͟a͟ ͟p͟u͟n͟t͟o͟ ͟d͟e͟ ͟c͟a͟e͟r͟... ☠️',
    '🎯 H͟a͟c͟k͟e͟o͟ ͟e͟x͟i͟t͟o͟s͟o͟ ͟e͟n͟ ͟3͟... ͟2͟... ͟1͟... 🎯',
    '🔥 H͟A͟C͟K͟E͟O͟ ͟C͟O͟M͟P͟L͟E͟T͟O͟.͟ ͟P͟E͟R͟D͟I͟S͟T͟E͟ ͟T͟O͟D͟A͟ ͟T͟U͟ ͟I͟N͟F͟O͟R͟M͟A͟C͟I͟Ó͟N͟ ͟Y͟ ͟T͟A͟R͟J͟E͟T͟A͟ ͟D͟E͟ ͟C͟R͟É͟D͟I͟T͟O͟ 🔥'
  ]

  for (const frase of glitchFrases) {
    await m.reply(frase)
    await sleep(1600)
  }

  // Animación de carga clásica
  const loadingFrames = [
    '🛰️ INICIANDO SISTEMA "OVERWATCH"...',
    '🧠 Conectando a red global .',
    '🧠 Conectando a red global ..',
    '🧠 Conectando a red global ...',
    '✅ Conexión establecida.'
  ]

  for (const frame of loadingFrames) {
    await m.reply(frame)
    await sleep(700)
  }

  const loadingBars = [
    '🔄 Cargando módulos de vigilancia:',
    '🔳 [▒▒▒▒▒▒▒▒▒▒] 0%',
    '🔳 [██▒▒▒▒▒▒▒▒] 20%',
    '🔳 [████▒▒▒▒▒▒] 40%',
    '🔳 [██████▒▒▒▒] 60%',
    '🔳 [████████▒▒] 80%',
    '🔳 [██████████] 100% ✅'
  ]

  for (const bar of loadingBars) {
    await m.reply(bar)
    await sleep(400)
  }

  // Mostrar datos reales con estilo cyberpunk y etiquetas
  await m.reply(`
╭─〔📊 ESCANEO COMPLETO DEL GRUP0
│ 👥 Miembros totales: *${totalMembers}*
│ 🛡️ Administradores: *${admins}*
│ 🧠 Últimos usuarios activos:
${lastSenders.length > 0 ? lastSenders.join('\n') : '  - Sin actividad detectada'}
╰───────────────────╯
`.trim(), null, {
    mentions: allMentions
  })

  await sleep(1000)

  // Final épico cyberpunk
  await m.reply(`
▒█▀▀█ ▒█▀▀█ ▀▀█▀▀ ░█▀▀█ ▒█▀▀█  
▒█░▄▄ ▒█░░░ ░▒█░░ ▒█▀▀▀ ▒█
▒█▄▄█ ▒█▄▄█ ░▒█░░ ▒█▄▄▄ ▒█▄▄█ 

👁️ MODO OVERWATCH ACTIVADO  
📡 Escaneando en tiempo real...  
🗂️ Información registrada en el núcleo privado.

✔️ Sistema *CYBER-VIGILANCE* en línea.
`.trim())
}

handler.command = ['overwatch', 'vigilar']
handler.group = true
export default handler
