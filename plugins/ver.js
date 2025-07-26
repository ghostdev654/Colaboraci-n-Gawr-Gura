const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `✳️ Responde a una imagen o video enviado como "ver una vez" usando *${usedPrefix + command}*`;

  const quotedMsg = m.quoted?.msg || {};
  const type = Object.keys(quotedMsg || {})[0]; // imageMessage o videoMessage
  const mediaData = quotedMsg?.[type];

  if (!mediaData || !mediaData.viewOnce) {
    throw '⚠️ Ese mensaje no es de tipo "ver una vez". Asegúrate de responder directamente a una imagen o video enviado con esa opción.';
  }

  try {
    const buffer = await m.quoted.download();
    const mime = m.quoted.mime || '';

    if (/image/.test(mime)) {
      await conn.sendFile(m.chat, buffer, 'ver.jpg', '🖼️ Aquí tienes la imagen vista una vez.', m);
    } else if (/video/.test(mime)) {
      await conn.sendFile(m.chat, buffer, 'ver.mp4', '🎞️ Aquí tienes el video visto una vez.', m);
    } else {
      throw '❌ No es una imagen o video válido.';
    }
  } catch (err) {
    console.error(err);
    throw '❌ Ocurrió un error al recuperar el archivo. Puede que no sea un mensaje compatible o fue enviado hace mucho.';
  }
};

handler.help = ['ver'];
handler.tags = ['descargas', 'utilidades'];
handler.command = /^ver$/i;

export default handler;
