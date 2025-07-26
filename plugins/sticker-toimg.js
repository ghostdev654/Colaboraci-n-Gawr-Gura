import { webp2png } from '../lib/webp2mp4.js';
import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn, usedPrefix, command }) => {
  // Verifica si está respondiendo a un sticker
  if (!m.quoted || m.quoted.mtype !== 'stickerMessage')
    throw `✳️ Responde a un sticker con *${usedPrefix + command}* para convertirlo a imagen.`;

  try {
    const sticker = await m.quoted.download();
    const imageUrl = await webp2png(sticker);
    conn.sendFile(m.chat, imageUrl, 'sticker.png', '✅ Aquí tienes tu sticker convertido a imagen.', m);
  } catch (e) {
    console.error(e);
    throw '❌ Error al convertir el sticker. Asegúrate de que sea un sticker válido.';
  }
};

handler.help = ['toimg'];
handler.tags = ['herramientas', 'convertidor'];
handler.command = /^toimg$/i;

export default handler;
