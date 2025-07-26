import fs from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  if (!m.quoted) throw '✳️ Responde a una imagen o video de "ver una vez".';

  let q = m.quoted;
  let mime = q?.mime || '';
  let isViewOnce = !!(q.msg?.viewOnceMessage || q.msg?.viewOnceMessageV2);

  if (!isViewOnce) throw '⚠️ Ese mensaje no es de tipo "ver una vez".';

  try {
    const buffer = await q.download();
    if (!buffer) throw '❌ No se pudo descargar el contenido.';

    let extension = mime.includes('image') ? '.jpg'
                  : mime.includes('video') ? '.mp4'
                  : '';

    if (!extension) throw '❌ Solo se soportan imágenes o videos de ver una vez.';

    const filePath = path.join('./temp', `${Date.now()}${extension}`);
    fs.writeFileSync(filePath, buffer);

    await conn.sendFile(m.chat, filePath, `archivo${extension}`, `📤 Aquí tienes el archivo.`, m);
    fs.unlinkSync(filePath); // Borrar temporal después de enviar
  } catch (e) {
    console.error(e);
    throw '❌ Hubo un error al reenviar el archivo.';
  }
};

handler.help = ['ver'];
handler.tags = ['utilidades'];
handler.command = /^ver$/i;

export default handler;
