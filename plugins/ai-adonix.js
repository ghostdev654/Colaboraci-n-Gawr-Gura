import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🦈 *Gura IA* te espera para ayudarte~\n\n📌 Usa:\n${usedPrefix + command} [tu pregunta]\n\n💬 Ejemplo:\n${usedPrefix + command} haz un código JS que sume dos números`);
  }

  try {
    await m.react('💭');

    const apiKey = '57211fe739784450b94b09a694e128a1';
    const url = 'https://aimlapi.com/api/v1/aiml';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        prompt: text,
        // Puedes personalizar más parámetros si la API los admite
      })
    });

    const data = await res.json();

    // 💬 Texto de respuesta
    if (data && data.response) {
      const [mensaje, ...codigo] = data.response.split(/```(?:javascript|js|html)?/i);
      let respuestaFinal = `🌊 *Gura IA responde:*\n\n${mensaje.trim()}`;

      if (codigo.length > 0) {
        respuestaFinal += `\n\n💻 *Código generado:*\n\`\`\`js\n${codigo.join('```').trim().slice(0, 3900)}\n\`\`\``;
      }

      await m.reply(respuestaFinal);
      await m.react('✅');
      return;
    }

    // 🎤 Si viniera audio generado (solo si la API lo soporta)
    if (data.audio) {
      await conn.sendMessage(m.chat, {
        audio: { url: data.audio },
        mimetype: 'audio/mpeg',
        ptt: true,
        fileName: `gura-ai.mp3`
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // 🖼️ Si viniera una imagen generada (si la API lo soporta)
    if (data.image) {
      await conn.sendMessage(m.chat, {
        image: { url: data.image },
        caption: `📷 *Imagen creada por Gura IA*\n\n🖌️ _${text}_`,
      }, { quoted: m });
      await m.react('✅');
      return;
    }

    // ⚠️ Si no hubo respuesta válida
    await m.react('❌');
    return m.reply('❌ Gura-chan no pudo procesar esta pregunta, nyah~');

  } catch (e) {
    console.error('[ERROR GURA IA]', e);
    await m.react('❌');
    return m.reply(`⚠️ *Gura IA falló:* ${e.message}`);
  }
};

handler.help = ['adonix <pregunta>'];
handler.tags = ['ia'];
handler.command = ['adonix', 'ai', 'adonixia'];

export default handler;
