import fs from 'fs'
import path from 'path'

// Lista de bordes aleatorios con pares de bordes superior e inferior
const borders = [
  { top: '╭───────────────🌊🦈🌊───────────────╮', bottom: '╰───────────────🌊🦈🌊───────────────╯' },
  { top: '╭═══════════════🐟✨🐟═══════════════╮', bottom: '╰═══════════════🐟✨🐟═══════════════╯' },
  { top: '╔═══════════════💙🦈💙═══════════════╗', bottom: '╚═══════════════💙🦈💙═══════════════╝' },
  { top: '╔────────────────🐬🌊🐬────────────────╗', bottom: '╚────────────────🐬🌊🐬────────────────╝' },
  { top: '╭✧･ﾟ: *✧･ﾟ: 🦈* :･ﾟ✧ :･ﾟ✧╮', bottom: '╰✧･ﾟ: *✧･ﾟ: 🦈* :･ﾟ✧ :･ﾟ✧╯' },
  { top: '╭━━━━━ 🌟 🦈 🌟 ━━━━━╮', bottom: '╰━━━━━ 🌟 🦈 🌟 ━━━━━╯' },
]

const handler = async (m, { conn }) => {
  const start = Date.now()

  // Obtener el número del bot actual (la sesión activa)
  const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
  const configPath = path.join('./JadiBots', botActual, 'config.json')

  let nombreBot = global.namebot || '🌊🦈 𝙂𝘼𝙒𝙍 𝙂𝙐𝙍𝘼 🦈🌊'

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      if (config.name) nombreBot = config.name
    } catch (err) {
      console.log('⚠️ No se pudo leer config del subbot:', err)
    }
  }

  const latency = Date.now() - start

  // Seleccionar un par de bordes aleatorio
  const randomBorder = borders[Math.floor(Math.random() * borders.length)]

  // Crear el mensaje decorado
  const decoratedMessage = `
${randomBorder.top}
│                                    │
│   🌟 *Ping:* ${latency} ms                 │
│   🌊 *Bot:* ${nombreBot} está aquí ~ 🦈     │
│                                    │
${randomBorder.bottom}
`

  await conn.sendMessage(m.chat, { 
    text: decoratedMessage 
  }, { quoted: m })
}

handler.command = ['p']
export default handler
