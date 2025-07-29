import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import fluent from 'fluent-ffmpeg'
import { fileTypeFromBuffer as fromBuffer } from 'file-type'
import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, args }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''
  let buffer

  try {
    // 🦈 Gura detectando el tipo de archivo...
    if (/image|video|webp|tgs|webm/g.test(mime) && q.download) {
      if (/video|webm/.test(mime) && (q.msg || q).seconds > 11) {
        return conn.reply(m.chat, `🌊 Uwaah~ Este video dura más de *10 segundos*.\n✨ Usa uno más cortito para que Gura lo convierta en sticker.`, m)
      }
      buffer = await q.download()
    } else if (args[0] && isUrl(args[0])) {
      const res = await fetch(args[0])
      buffer = await res.buffer()
    } else {
      return conn.reply(m.chat, `🫧 Hiii~ Responde a una *imagen, sticker, video, webm o tgs* para que Gura lo convierta en un sticker kawaii~! 💬`, m)
    }

    await m.react('🕐') // cargando...

    const stickerData = await toWebp(buffer)
    const finalSticker = await addExif(stickerData, packname, author)

    await conn.sendFile(m.chat, finalSticker, 'sticker.webp', `✨ Aquí tienes tu sticker bonito~! 🐬`, m)
    await m.react('✅') // éxito~

  } catch (e) {
    await m.react('❌')
    console.error('✖️ Gura encontró un error creando tu sticker:', e)
    await conn.reply(m.chat, `💔 Uuuh... algo salió mal.\n🐟 Intenta de nuevo o usa otro archivo, desu~`, m)
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

async function toWebp(buffer, opts = {}) {
  const { ext } = await fromBuffer(buffer)
  if (!/(png|jpg|jpeg|mp4|mkv|m4p|gif|webp|webm|tgs)/i.test(ext)) {
    throw '🚫 Este tipo de archivo no es compatible, nyan~'
  }

  const tempDir = global.tempDir || './tmp'
  const input = path.join(tempDir, `${Date.now()}.${ext}`)
  const output = path.join(tempDir, `${Date.now()}.webp`)

  fs.writeFileSync(input, buffer)

  const aspectRatio = opts.isFull
    ? `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease`
    : `scale='if(gt(iw,ih),-1,299):if(gt(iw,ih),299,-1)', crop=299:299:exact=1`

  const options = [
    '-vcodec', 'libwebp',
    '-vf', `${aspectRatio}, fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`,
    ...(ext.match(/(mp4|mkv|m4p|gif|webm)/)
      ? ['-loop', '0', '-ss', '00:00:00', '-t', '00:00:10', '-preset', 'default', '-an', '-vsync', '0']
      : []
    )
  ]

  return new Promise((resolve, reject) => {
    fluent(input)
      .addOutputOptions(options)
      .toFormat('webp')
      .save(output)
      .on('end', () => {
        const result = fs.readFileSync(output)
        fs.unlinkSync(input)
        fs.unlinkSync(output)
        resolve(result)
      })
      .on('error', (err) => {
        fs.unlinkSync(input)
        reject(err)
      })
  })
}

function isUrl(text) {
  return /^https?:\/\/\S+\.(jpg|jpeg|png|gif|webp)$/i.test(text)
}
