const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `✳️ Responde a una imagen o video de "ver una vez" con *${usedPrefix + command}*`;

  let message = m.quoted.msg || {};
  let type;
  let content;

  try {
    if (message?.viewOnceMessageV2) {
      content = message.viewOnceMessageV2.message;
    } else if (message?.viewOnceMessage) {
      content = message.viewOnceMessage.message;
    } else {
      throw '⚠️ El mensaje no es de tipo "ver una vez".';
    }

    type = Object.keys(content)[0]; // imageMessage o videoMessage

    const mediaMessage = {
      key: m.quoted.key,
      message: {
        [type]: content[type],
      },
    };

    const filePath = await conn.downloadAndSaveMediaMessage(mediaMessage);
    const fileName = type === 'imageMessage' ? 'imagen.jpg' : 'video.mp4';
    const texto = type === 'imageMessage'
      ? '🖼️ Aquí tienes la imagen vista una vez.'
      : '🎞️ Aquí tienes el video visto una vez.';

    await conn.sendFile(m.chat, filePath, fileName, texto, m);
  } catch (err) {
    console.error(err);
    throw '❌ No se pudo recuperar la imagen o video. Asegúrate de responder correctamente al mensaje "ver una vez".';
  }
};

handler.help = ['ver'];
handler.tags = ['herramientas', 'descargas'];
handler.command = /^ver$/i;

export default handler;

