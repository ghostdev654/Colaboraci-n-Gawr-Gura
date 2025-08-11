import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

// Decoraciones dinámicas para bordes
const decorations = [
  '✧･ﾟ: *✧･ﾟ: 🦈* :･ﾟ✧ :･ﾟ✧',
  '✿･ﾟ: *✿･ﾟ: 🌊* :･ﾟ✿ :･ﾟ✿',
  '☁︎･ﾟ: *☁︎･ﾟ: 🐟* :･ﾟ☁︎ :･ﾟ☁︎',
  '✦･ﾟ: *✦･ﾟ: 🐚* :･ﾟ✦ :･ﾟ✦',
  '✸･ﾟ: *✸･ﾟ: 💙* :･ﾟ✸ :･ﾟ✸',
]

// Decoraciones dinámicas para textos internos
const textStyles = [
  { greeting: '𝐓𝐢𝐩𝐨:', activity: '🚀 Uptime:', dateText: '📆 Fecha Actual:' },
  { greeting: '𝐓𝐢𝐩𝐨:', activity: '🚀 Uptime:', dateText: '📆 Fecha Actual:' },
  { greeting: '𝐓𝐢𝐩𝐨:', activity: '🚀 Uptime:', dateText: '📆 Fecha Actual:' },
  { greeting: '𝐓𝐢𝐩𝐨:', activity: '🚀 Uptime:', dateText: '📆 Fecha Actual:' },
  { greeting: '𝐓𝐢𝐩𝐨:', activity: '🚀 Uptime:', dateText: '📆 Fecha Actual:' }
];

const tags = {
  serbot: '🤖 𝙎𝙪𝙗-𝘽𝙤𝙩',
  downloader: '📥 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨',
  tools: '🔧 𝙃𝙚𝙧𝙧𝙖𝙢𝙞𝙚𝙣𝙩𝙖𝙨',
  owner: '👑 𝙊𝙬𝙣𝙚𝙧',
  info: 'ℹ️ 𝙄𝙣𝙛𝙤',
  group: '👥 𝙂𝙧𝙪𝙥𝙤𝙨',
  search: '🔎 𝘽𝙪𝙨𝙘𝙖𝙙𝙤𝙧𝙚𝙨',
  sticker: '💟 𝙎𝙩𝙞𝙘𝙠𝙚𝙧𝙨',
  ia: '🤖 𝙄𝘼',
}

const defaultMenu = {
  before: `
> %greeting
( *%tipo* )

┌
│ ¿Qué tal *%name*?
│%activity: %uptime
│%dateText: %date
│
│ ➤ Puedes personalizar el nombre │de tu Sub-Bot con:
│ 📝 .setname
│ *✐ Y cambiar el banner con:*
│ 📝 .setbanner
└
%readmore`.trimStart(),

  header: '\n╭━━━━➤ %category*',
  body: '\n┃ *°* %cmd %islimit %isPremium',
  footer: '╰━━━━━━━━━━━━━',
  after: '\n> *•* _Powered By:_ *Tech-Bot Team*',
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {

    const { exp, limit, level } = global.db.data.users[m.sender]
    const { min, xp, max } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const d = new Date(Date.now() + 3600000)
    const locale = 'es'
    const date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(plugin => ({
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
      }))

    let nombreBot = global.namebot || 'Bot'
    let bannerFinal = './storage/img/Menu3.jpg'

    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = join('./JadiBots', botActual, 'config.json')

    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath))
        if (config.name) nombreBot = config.name
        if (config.banner) bannerFinal = config.banner
      } catch (err) {
        console.log('⚠️ No se pudo leer config del subbot:', err)
      }
    }

    const tipo = botActual === '+5491128967565'.replace(/\D/g, '')
      ? 'Principal 🅥'
      : 'Sub Bot 🅑'

    const menuConfig = conn.menu || defaultMenu

    // Animación indefinida
    let sentMessageID = null
    while (true) {
      const randomDecoration = decorations[Math.floor(Math.random() * decorations.length)]
      const randomTextStyle = textStyles[Math.floor(Math.random() * textStyles.length)]

      const _text = [
        menuConfig.before,
        ...Object.keys(tags).map(tag => {
          return [
            menuConfig.header
              .replace(/%category/g, tags[tag])
              .replace(/%decoration/g, randomDecoration),
            help.filter(menu => menu.tags?.includes(tag)).map(menu =>
              menu.help.map(helpText =>
                menuConfig.body
                  .replace(/%cmd/g, menu.prefix ? helpText : `${_p}${helpText}`)
                  .replace(/%islimit/g, menu.limit ? '◜⭐◞' : '')
                  .replace(/%isPremium/g, menu.premium ? '◜🪪◞' : '')
                  .trim()
              ).join('\n')
            ).join('\n'),
            menuConfig.footer,
          ].join('\n')
        }),
        menuConfig.after,
      ].join('\n')

      const replace = {
        '%': '%',
        p: _p,
        botname: nombreBot,
        taguser: '@' + m.sender.split('@')[0],
        exp: exp - min,
        maxexp: xp,
        totalexp: exp,
        xp4levelup: max - exp,
        level,
        limit,
        name,
        date,
        uptime: clockString(process.uptime() * 1000),
        tipo,
        readmore: readMore,
        greeting: randomTextStyle.greeting,
        activity: randomTextStyle.activity,
        dateText: randomTextStyle.dateText,
      }

      const text = _text.replace(
        new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
        (_, name) => String(replace[name])
      )

      const isURL = typeof bannerFinal === 'string' && /^https?:\/\//i.test(bannerFinal)
      const imageContent = isURL
        ? { image: { url: bannerFinal } }
        : { image: fs.readFileSync(bannerFinal) }

      if (!sentMessageID) {
        const response = await conn.sendMessage(m.chat, {
          ...imageContent,
          caption: text.trim(),
          mentionedJid: conn.parseMention(text),
        }, { quoted: m })
        sentMessageID = response.key.id
      } else {
        try {
          await conn.modifyMessage(m.chat, sentMessageID, {
            ...imageContent,
            caption: text.trim(),
          })
        } catch (e) {
          console.warn('No se pudo editar el mensaje:', e)
          break // Salir del bucle si no se puede editar más
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar 1 segundo antes de actualizar
    }
  } catch (e) {
    console.error('❌ Error en el menú:', e)
    conn.reply(m.chat, '❎ Lo sentimos, ocurrió un error inesperado.', m)
  }
}

handler.command = ['menu', 'help', 'menú']
export default handler

// Utilidades
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
