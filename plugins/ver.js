const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw `✳️ Responde a una imagen, video, sticker o audio (incluyendo "ver una vez") con *${usedPrefix + command}*`;

  try {
    let q = m.quoted;
    let msg = q.msg || {};
    let tipo;
    let contenido;

    // Soporte para mensajes de "ver una vez"
    if (msg?.viewOnceMessageV2) {
      contenido = msg.viewOnceMessageV2.message;
    } else if (msg?.viewOnceMessage) {
      contenido = msg.viewOnceMessage.message;
    } else {
      contenido = msg;
    }

    tipo = Object.keys(contenido || {})[0];

    if (!tipo) throw '❌ No se pudo detectar el tipo de contenido.';

    const mensajeMedia = {
      key: q.key,
      message: {
        [tipo]: contenido[tipo]
      }
    };

    const ruta = await conn.downloadAndSaveMediaMessage(mensajeMedia);
    const nombre = tipo.includes('image') ? 'imagen.jpg'
                : tipo.includes('video') ? 'video.mp4'
                : tipo.includes('audio') ? 'audio.mp3'
                : tipo.includes('sticker') ? (contenido[tipo].isAnimated ? 'sticker.mp4' : 'sticker.webp')
                : 'archivo';

    const texto = `📤 Archivo reenviado correctamente.`;

    await conn.sendFile(m.chat, ruta, nombre, texto, m);
  } catch (e) {
    console.error(e);
    throw '❌ Ocurrió un error al reenviar el archivo. Asegúrate de responder correctamente a un mensaje con contenido multimedia.';
  }
};

handler.help = ['reenviar'];
handler.tags = ['herramientas', 'utilidades'];
handler.command = /^reenviar$/i;

export default handler;
