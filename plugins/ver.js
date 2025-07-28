import fs from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  if (!m.quoted) throw '📛 *Responde a un mensaje con imagen o video de "ver una vez".*';

  let q = m.quoted;
  let msg = q.msg || {};
  let isViewOnce = !!msg?.viewOnceMessage || !!msg?.viewOnceMessageV2;

  if (!isViewOnce) throw '⚠️ *Ese mensaje no es de tipo "ver una vez".*';

  try {
    let type = Object.keys(msg)[0];
    let realMsg = msg.viewOnceMessage?.message || msg.viewOnceMessageV2?.message || msg[type]?.message;

    let mediaKey = Object.keys(realMsg)[0];
    let mime = realMsg[mediaKey]?.mimetype || '';

    const buffer = await conn.download(q);
    if (!buffer) throw '⛔ *No se pudo descargar el contenido.*';

    let extension = mime.includes('image') ? '.jpg'
                  : mime.includes('video') ? '.mp4'
                  : '';

    if (!extension) throw '❌ *Solo se soportan imágenes o videos "ver una vez".*';

    const filename = `archivo-${Date.now()}${extension}`;
    const filePath = path.join('./temp', filename);
    fs.writeFileSync(filePath, buffer);

    await conn.sendFile(m.chat, filePath, filename, `📤 *Aquí tienes el archivo original (ver una vez)*`, m);
    fs.unlinkSync(filePath); // eliminar después de enviar
  } catch (e) {
    console.error(e);
    throw '❌ *Ocurrió un error al procesar el mensaje "ver una vez".*';
  }
};

handler.help = ['ver'];
handler.tags = ['tools'];
handler.command = /^ver$/i;

export default handler;
