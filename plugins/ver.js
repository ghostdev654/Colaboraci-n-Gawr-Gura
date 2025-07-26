const handler = async (m, { conn, usedPrefix, command }) => {
  const quoted = m.quoted;

  if (!quoted)
    throw `❗Responde a un mensaje que contenga una imagen o video enviado para ver una sola vez usando *${usedPrefix + command}*`;

  const type = quoted.mtype || '';

  if (!/viewOnce/i.test(JSON.stringify(quoted.msg)))
    throw '⚠️ Ese mensaje no es de tipo "ver una vez".';

  try {
    const media = await quoted.download();
    const mime = quoted?.mime || '';

    if (/image/.test(mime)) {
      await conn.sendFile(m.chat, media, 'ver.jpg', '🖼️ Aquí tienes la imagen vista una vez.', m);
    } else if (/video/.test(mime)) {
      await conn.sendFile(m.chat, media, 'ver.mp4', '🎞️ Aquí tienes el video visto una vez.', m);
    } else {
      throw '❌ No es una imagen o video válido.';
    }
  } catch (err) {
    console.error(err);
    throw '❌ Ocurrió un error al intentar recuperar el archivo.';
  }
};

handler.help = ['ver'];
handler.tags = ['descargas', 'utilidades'];
handler.command = /^ver$/i;

export default handler;
