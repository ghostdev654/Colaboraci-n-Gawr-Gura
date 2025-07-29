/** 🌊 By @MoonContentCreator || https://github.com/MoonContentCreator/BixbyBot-Md **/
import fetch from 'node-fetch'

const handler = async (m, { conn, command, text, isAdmin }) => {
  let user = m.mentionedJid?.[0] || m.quoted?.sender || text
  const isMute = global.db.data.users[user]?.muted
  const isOwner = global.owner[0][0] + '@s.whatsapp.net'
  const creator = conn.user.jid

  // 🦈✨ Estilo Gura decorado
  const thumbnail = await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer()
  const thumbnail2 = await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer()
  const guraStyle = {
    key: {
      participants: "0@s.whatsapp.net",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: "🦈 Gawr Gura - Acción del Bot",
        jpegThumbnail: thumbnail,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Gawr;Gura;;;\nFN:Gura\nORG:HoloBot\nTITLE:\nTEL;waid=19709001746:+1 (970) 900-1746\nX-WA-BIZ-NAME:Gura Shark\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  const groupData = await conn.groupMetadata(m.chat)
  const groupOwner = groupData.owner || m.chat.split`-`[0] + '@s.whatsapp.net'

  if (command === 'mute') {
    if (!isAdmin) throw '🫧 *Solo los admin pueden silenciar usando a Gura uwu.*'
    if (m.mentionedJid?.[0] === isOwner) throw '❌ *¡Nyaa! ¡No puedes mutear al creador del bot! >~<*'
    if (user === creator) throw '🫣 *¡No puedes mutearme a mí, soy Gura senpai!*'
    if (!user) return conn.reply(m.chat, '🌊 *Menciona a quien quieres mutear usando a Gura~!*', m)
    if (global.db.data.users[user]?.muted === true) throw '🚫 *Ese usuario ya fue silenciado por Gura-chan.*'

    global.db.data.users[user] = { ...global.db.data.users[user], muted: true }
    conn.reply(m.chat, `🔇 *${user.split('@')[0]} ha sido silenciado por Gura-desu~*`, guraStyle, null, { mentions: [user] })
  }

  if (command === 'unmute') {
    if (!isAdmin) throw '🌟 *Solo admin pueden quitar el silencio con poderes de Gura!*'
    if (user === m.sender) throw '🐬 *No puedes quitarte el silencio a ti mismo, pide ayuda nya~*'
    if (!user) return conn.reply(m.chat, '🍭 *Menciona a quien quieres desmutear, porfa~*', m)
    if (global.db.data.users[user]?.muted === false) throw '📢 *Ese usuario ya puede hablar, no está muteado Gura-chan!*'

    global.db.data.users[user].muted = false
    conn.reply(m.chat, `🔊 *¡${user.split('@')[0]} ahora puede hablar! Gura dice: Bienvenid@ de nuevo! 💙*`, {
      ...guraStyle,
      message: {
        locationMessage: {
          name: "🦈 Gawr Gura - Acción del Bot",
          jpegThumbnail: thumbnail2,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Gawr;Gura;;;\nFN:Gura\nORG:HoloBot\nTITLE:\nTEL;waid=19709001746:+1 (970) 900-1746\nX-WA-BIZ-NAME:Gura Shark\nEND:VCARD`
        }
      }
    }, null, { mentions: [user] })
  }
}

handler.command = ['mute', 'unmute']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
