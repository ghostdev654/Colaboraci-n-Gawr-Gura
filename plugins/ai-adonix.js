import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n\nEjemplo:\n${usedPrefix + command} haz un código JS que sume dos números`);
  }

  try {
    await m.react('🕒');

    const apiURL = `https://theadonix-api.vercel.app/api/adonix?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiURL);
    const data = await res.json();

    // 📷 Imagen generada
    if (data.imagen_generada) {
      await conn.sendMessage(m.chat, {
        image: { url: data.imagen_generada },
        caption: `🖼️ *Adonix IA* generó esta imagen:\n\n📌 _${data.pregunta}_\n${data.mensaje || ''}`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // 🎤 Audio tipo PTT sin externalAdReply
    if (data.audio && typeof data.audio === 'string') {
      await conn.sendMessage(m.chat, {
        audio: { url: data.audio },
        ptt: true,
        mimetype: 'audio/mpeg',
        fileName: `adonix-voz.mp3`
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // 🧠 Texto con o sin código
    if (data.respuesta && typeof data.respuesta === 'string') {
      const [mensaje, ...codigo] = data.respuesta.split(/```(?:javascript|js|html|)/i);
      let respuestaFinal = `🌵 *Adonix IA :*\n\n${mensaje.trim()}`;

      if (codigo.length > 0) {
        respuestaFinal += `\n\n💻 *Código:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
      }

      await m.reply(respuestaFinal);
      await m.react('✅');
      return;
    }

    // ❌ Ninguna respuesta válida
    await m.react('❌');
    return m.reply('❌ No se pudo procesar la respuesta de Adonix IA.');

  } catch (e) {
    console.error('[ERROR ADONIX IA]', e);
    await m.react('❌');
    return m.reply(`❌ Error al usar Adonix IA:\n\n${e.message}`);
  }
};

handler.help = ['adonix <pregunta>'];
handler.tags = ['ia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;
