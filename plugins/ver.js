import fs from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  if (!m.quoted) return m.reply('🔁 *Responde a una imagen o video enviada para ver una vez.*');

  const q = m.quoted;
  const msg = q.msg || {};

  // Detectar si es tipo 'ver una vez'
  const isViewOnce = !!msg?.viewOnceMessage || !!msg?.viewOnceMessageV2;
  if (!isViewOnce) return m.reply('⚠️ *Ese mensaje no es de tipo "ver una vez".*');

  try {
    // Obtener el contenido real del mensaje
    const realMsg = msg?.viewOnceMessage?.message || msg?.viewOnceMessageV2?.message;
    if (!realMsg) return m.reply('❌ *No se pudo acceder al contenido.*');

    const mediaType = Object.keys(realMsg)[0]; // ej. 'imageMessage' o 'videoMessage'
    const media = realMsg[mediaType];
    const mimetype = media?.mimetype || '';
    const buffer = await conn.download(q);

    if (!buffer) return m.reply('❌ *No se pudo descargar el archivo.*');

    const ext = mimetype.includes('image') ? '.jpg' :
                mimetype.includes('video') ? '.mp4' : '';
    if (!ext) return m.reply('🚫 *Solo se admiten imágenes o videos.*');

    const filename = `viewonce-${Date.now()}${ext}`;
    const filePath = path.join('./temp', filename);
    fs.writeFileSync(filePath, buffer);

    await conn.sendFile(m.chat, filePath, filename, `📤 *Aquí tienes el archivo normal, sin ver una vez* 👀`, m);
    fs.unlinkSync(filePath); // Eliminar temporal
  } catch (err) {
    console.error(err);
    return m.reply('😿 *Ocurrió un error al procesar el mensaje.*');
  }
};

handler.command = ['ver'];
handler.help = ['ver'];
handler.tags = ['tools'];
export default handler;
