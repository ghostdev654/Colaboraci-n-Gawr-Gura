import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'

const handler = async (m, { conn, text }) => {
  if (!m.quoted && !text) throw '*⚠️ Responde a una imagen/video/webp o escribe un texto para subir como estado.*'

  let media = null
  let mime = m.quoted?.mimetype || ''
  let url = ''
  let caption = text || ''

  // Procesar multimedia si hay
  if (/image|video/.test(mime)) {
    media = await m.quoted.download()
    if (/video/.test(mime)) {
      url = await uploadFile(media)
    } else {
      url = await uploadImage(media)
    }
  } else if (/webp/.test(mime)) {
    media = await m.quoted.download()
    url = await uploadFile(media)
    mime = 'image/webp' // Forzamos a imagen
  }

  // Enviar estado según tipo
  if (url && mime.includes('image')) {
    await conn.sendMessage('status@broadcast', { image: { url }, caption })
  } else if (url && mime.includes('video')) {
    await conn.sendMessage('status@broadcast', { video: { url }, caption })
  } else if (text) {
    await conn.sendMessage('status@broadcast', { text: caption })
  } else {
    throw '*❌ No se pudo procesar el archivo o mensaje para subir como estado.*'
  }

  m.reply('*✅ Estado subido con éxito. Asegúrate de tener agregado al bot como contacto y que él te tenga también para ver los estados.*')
}

handler.help = ['subirestado']
handler.tags = ['general']
handler.command = /^subirestado$/i
handler.register = false

export default handler
