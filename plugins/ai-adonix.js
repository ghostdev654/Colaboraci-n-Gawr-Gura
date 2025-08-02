import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🤖 *Adonix IA* 🤖\n\nUsa:\n${usedPrefix + command} [tu pregunta]\n\nEjemplo:\n${usedPrefix + command} haz un resumen de los dinosaurios`);
  }

  try {
    await m.react('🕒');

    const body = {
      model: "llama-vision-free", // modelo que sí está disponible
      messages: [
        {
          role: "user",
          content: text
        }
      ]
    };

    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 57211fe739784450b94b09a694e128a1", // tu API Key
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const resText = await response.text();

    let data;
    try {
      data = JSON.parse(resText);
    } catch (err) {
      console.error("❌ La respuesta no fue JSON válido:", resText);
      return m.reply("❌ La API respondió un formato no válido:\n\n" + resText);
    }

    if (!data.choices || !data.choices.length || !data.choices[0].message) {
      return m.reply("❌ Ocurrió un error al consultar con la IA. No se obtuvo respuesta válida.");
    }

    const respuesta = data.choices[0].message.content;
    await m.reply(`🌵 *Adonix IA - Llama Vision Free:*\n\n${respuesta}`);
    await m.react('✅');

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
