const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `✳️ Responde a una imagen, video, sticker o audio (incluyendo "ver una vez") con *${usedPrefix + command}*`;

  try {
    // Detectar si es "ver una vez"
    let quoted = m.quoted;
    let qmsg = quoted.msg || quoted;
    let tipo;
    let contenido;

    if (qmsg.message) {
      // viewOnceMessage
      if (qmsg.message?.viewOnceMessage) {
        contenido = qmsg.message.viewOnceMessage.message;
      } else if (qmsg.message?.viewOnceMessageV2) {
        contenido = qmsg.message.viewOnceMessageV2.message;
      } else {
        contenido = qmsg.message;
      }
    } else if (quoted.message) {
      contenido = quoted.message;
    } else {
      contenido = quoted;
    }

    tipo = Object.keys(contenido || {})[0];
    if (!tipo) throw '⚠️ Este mensaje no contiene multimedia válida.';

    const mediaMsg = {
      key: quoted.key,
      message: {
        [tipo]: contenido[tipo]
      }
    };

    const ruta = await conn.downloadAndSaveMediaMessage(mediaMsg);
    const nombre = tipo.includes('image') ? 'imagen.jpg'
                : tipo.includes('video') ? 'video.mp4'
                : tipo.includes('audio') ? 'audio.mp3'
                : tipo.includes('sticker') ? (contenido[tipo].isAnimated ? 'sticker.mp4' : 'sticker.webp')
                : 'archivo';

    await conn.sendFile(m.chat, ruta, nombre, `📤 *Archivo reenviado*`, m);
  } catch (e) {
    console.error(e);
    throw `❌ Ocurrió un error. Asegúrate de responder a una imagen, video, sticker o audio (incluso ver una vez).\n\n🔎 Error: ${e.message}`;
  }
};

handler.help = ['reenviar'];
handler.tags = ['herramientas'];
handler.command = /^reenviar$/i;

export default handler;
