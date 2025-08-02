import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🦈 *Gura IA sin llave* está lista para ayudarte~\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n📌 Ejemplo:\n${usedPrefix + command} ¿Qué es Gawr Gura?`);
  }

  await m.react('🔹');

  try {
    const response = await fetch(`https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    if (!data || !data.reply && !data.choices) {
      throw new Error('Formato inesperado en respuesta');
    }

    // Algunos endpoints devuelven distinta estructura
    const reply = data.reply || (data.choices?.[0]?.message?.content) || (Array.isArray(data) && data[0]?.text) || JSON.stringify(data);

    await m.reply(`🐬 *Gura dice:*\n\n${reply.trim()}\n\n🌊 _free‑GPT sin llave_`);
    await m.react('✅');
  } catch (e) {
    console.error('[ERROR GURA IA GRATIS]', e);
    await m.react('❌');
    await m.reply(`⚠️ Gura IA no pudo responder:\n\n${e.message}`);
  }
};

handler.help = ['guraia <pregunta>'];
handler.tags = ['ia'];
handler.command = ['guraia', 'gptgratis', 'aifree'];

export default handler;
