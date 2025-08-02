import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🦈 *Gawr Gura IA está lista para ayudarte!* 🐬\n\n💬 Usa:\n${usedPrefix + command} [tu pregunta]\n📌 Ejemplo:\n${usedPrefix + command} ¿Quién es Gawr Gura?`);
  }

  await m.react('🌊');

  try {
    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 57211fe739784450b94b09a694e128a1"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("Sin respuesta válida de la IA");
    }

    let reply = data.choices[0].message.content;
    let decorado = `🐟 *Gura dice:* 〰️\n\n${reply.trim()}\n\n🌊 _Modelo: GPT-4o_\n🪸 *aimlapi.com*`;

    await m.reply(decorado);
    await m.react('✅');

  } catch (e) {
    console.error('[❌ ERROR GURA IA]', e);
    await m.react('❌');
    m.reply(`⚠️ Ocurrió un error al consultar la IA.\n\n💢 *Detalles:* ${e.message}`);
  }
};

handler.help = ['guraia <pregunta>'];
handler.tags = ['ia'];
handler.command = ['guraia', 'gptgura', 'gpt4gura', 'ai'];

export default handler;
