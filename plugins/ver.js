const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `✳️ Responde a una imagen o video enviado como "ver una vez" con *${usedPrefix + command}*`;

  const msg = m.quoted.msg || {};
  const type = Object.keys(msg)[0]; // Ej: 'imageMessage' o 'videoMessage'

  const isViewOnce = !!msg[type]?.viewOnce;

  if (!isViewOnce) throw '⚠️ El mensaje no es una imagen/video de "ver una vez".';

  try {
    const media = await m.quoted.download();

    const mime = m.quoted.mime || '';
    const filename = mime.includes('image') ? 'ver.jpg' : 'ver.mp4';
    const texto = mime.includes('image')
      ? '🖼️ Aquí tienes la imagen vista una vez.'
      : '🎞️ Aquí tienes el video visto una vez.';

    await conn.sendFile(m.chat, media, filename, texto, m);
  } catch (err) {
    console.error(err);
    throw '❌ Ocurrió un error al recuperar la imagen o video.';
  }
};

handler.help = ['ver'];
handler.tags = ['descargas', 'utilidades'];
handler.command = /^ver$/i;

export default handler;
