const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `✳️ Responde a una imagen o video de "ver una vez" con *${usedPrefix + command}*`;

  try {
    const viewOnce = m.quoted?.msg?.viewOnceMessageV2 || m.quoted?.msg?.viewOnceMessage || null;

    if (!viewOnce) throw '⚠️ Ese mensaje no es de tipo "ver una vez".';

    const message = viewOnce.message;
    const type = Object.keys(message)[0]; // 'imageMessage' o 'videoMessage'
    const media = await conn.downloadAndSaveMediaMessage({ key: m.quoted.key, message }, 'ver-unica');

    const fileName = type === 'imageMessage' ? 'imagen.jpg' : 'video.mp4';
    const texto = type === 'imageMessage'
      ? '🖼️ Aquí tienes la imagen de una sola vista.'
      : '🎞️ Aquí tienes el video de una sola vista.';

    await conn.sendFile(m.chat, media, fileName, texto, m);
  } catch (err) {
    console.error(err);
    throw '❌ No se pudo extraer la imagen o video. Asegúrate de responder correctamente.';
  }
};

handler.help = ['ver'];
handler.tags = ['descargas', 'herramientas'];
handler.command = /^ver$/i;

export default handler;
