import { webp2mp4 } from '../lib/webp2mp4.js';
import { webp2png } from '../lib/webp2mp4.js'; // Usa el mismo archivo auxiliar
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || m.quoted.mtype !== 'stickerMessage')
    throw `✳️ Responde a un sticker con *${usedPrefix + command}* para convertirlo a imagen o video.`;

  const mime = m.quoted.mime || '';
  const isAnimated = m.quoted.msg.isAnimated;

  try {
    const sticker = await m.quoted.download();

    if (isAnimated) {
      // Sticker animado → convertir a video mp4
      const mp4Url = await webp2mp4(sticker);
      await conn.sendFile(m.chat, mp4Url, 'sticker.mp4', '🎞️ Aquí tienes tu sticker animado convertido a video.', m);
    } else {
      // Sticker estático → convertir a imagen
      const imgUrl = await webp2png(sticker);
      await conn.sendFile(m.chat, imgUrl, 'sticker.png', '🖼️ Aquí tienes tu sticker convertido a imagen.', m);
    }
  } catch (e) {
    console.error(e);
    throw '❌ Ocurrió un error al convertir el sticker.';
  }
};

handler.help = ['toimg'];
handler.tags = ['convertidor', 'herramientas'];
handler.command = /^toimg$/i;

export default handler;
