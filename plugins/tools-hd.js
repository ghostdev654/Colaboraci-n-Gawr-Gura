import uploadImage from '../lib/uploadImage.js'
import fetch from 'node-fetch'

export const handler = async (m, { conn, usedPrefix, command }) => {
  const msgData = m.quoted || m
  const mime = msgData.mimetype || (msgData.msg ? msgData.msg.mimetype : '')

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    throw `🌊 *Hii~!* Para usar este comando debes enviar o responder a una *imagen JPG o PNG*, nya~\n\n✨ Usa: *${usedPrefix + command}*`
  }

  const imageData = await msgData.download()
  if (!imageData) throw '💔 *Gura no pudo descargar tu imagen...*\nRevisa que esté bien enviada.'

  const imageUrl = await uploadImage(imageData)
  const apiUrl = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(imageUrl)}`

  await conn.sendMessage(m.chat, { react: { text: '🍥', key: m.key } }) // Esperando~

  try {
    await conn.sendMessage(m.chat, {
      image: { url: apiUrl },
      caption: `✨ *「UwU~ Imagen en HD lista!」*\n\nTu imagen fue mejorada con mucho amor de Gura 💙`
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '🦈', key: m.key } }) // Confirmación Gura style

  } catch (err) {
    throw `💔 *Oops!* No se pudo mejorar la imagen...\n\n🚨 _Error:_ ${err}`
  }
}

handler.command = ['remini', 'hd', 'enhance']
export default handler
