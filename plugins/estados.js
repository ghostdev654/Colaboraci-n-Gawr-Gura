import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'

const handler = async (m, { conn, text }) => {
  if (!m.quoted && !text) throw '*⚠️ Responde a una imagen, video, sticker o escribe un texto para subir como estado.*'

  let media = null
  let mime = m.quoted?.mimetype || ''
  let url = ''
  let caption = text || ''

  const userMention = `@${m.sender.split('@')[0]}`
  const chatMention = m.isGroup ? `📢 Estado enviado desde el grupo: *${m.chat.split('@')[0]}*` : ''
  const fullCaption = `${caption}\n\n👤 Publicado por: ${userMention}\n${chatMention}`.trim()

  // Subir medios
  if (/image|video/.test(mime)) {
    media = await m.quoted.download()
    url = /video/.test(mime) ? await uploadFile(media) : await uploadImage(media)
  } else if (/webp/.test(mime)) {
    media = await m.quoted.download()
    url = await uploadFile(media)
    mime = 'image/webp'
  }

  // Enviar estado
  if (url && mime.includes('image')) {
    await conn.sendMessage('status@broadcast', { image: { url }, caption: fullCaption, mentions: [m.sender] })
  } else if (url && mime.includes('video')) {
    await conn.sendMessage('status@broadcast', { video: { url }, caption: fullCaption, mentions: [m.sender] })
  } else if (text) {
    await conn.sendMessage('status@broadcast', {
      text: fullCaption,
      mentions: [m.sender]
    })
  } else {
    throw '*❌ No se pudo procesar el archivo o mensaje para subir como estado.*'
  }

  m.reply(`✅ Estado subido exitosamente. Mencionado como: ${userMention}`)
}

handler.help = ['subirestado']
handler.tags = ['general']
handler.command = /^subirestado$/i
handler.register = false

export default handler
