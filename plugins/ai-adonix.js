import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🦈 *Gura Multi-IA* está lista~\n\n📌 Usa:\n${usedPrefix + command} [tu pregunta]\n💡 Ejemplo:\n${usedPrefix + command} ¿Qué es JavaScript?`);

  await m.react('🔄');

  const endpoints = [
    query => `https://free-gpt4-api.dev/api/v1/gpt4?prompt=${encodeURIComponent(query)}`,
    query => `https://freegptapi.vercel.app/api/gpt?text=${encodeURIComponent(query)}`,
    query => `https://gpt-api-shaurya.vercel.app/api/gpt?prompt=${encodeURIComponent(query)}`,
    query => `https://gpt4-free-api.vercel.app/api/completion?prompt=${encodeURIComponent(query)}`,
    query => `https://chatgpt-free-pi.vercel.app/?question=${encodeURIComponent(query)}`,
    query => `https://chatgpt-api-shared.vercel.app/?query=${encodeURIComponent(query)}`,
    query => `https://gpt-4-api.vercel.app/api/gpt4?prompt=${encodeURIComponent(query)}`,
    query => `https://chatgpt-api3-lovat.vercel.app/api/gpt?prompt=${encodeURIComponent(query)}`,
    query => `https://gpt-free-open.vercel.app/api?prompt=${encodeURIComponent(query)}`,
    query => `https://gpt-unofficial-api.vercel.app/chat/?query=${encodeURIComponent(query)}`,
  ];

  let success = false;
  let respuestaFinal = '';

  for (let i = 0; i < endpoints.length; i++) {
    try {
      const url = endpoints[i](text);
      const res = await fetch(url);
      const data = await res.json();

      // Intenta detectar diferentes formatos de respuesta
      const respuesta =
        data.reply ||
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.text ||
        data.result ||
        data.response ||
        (typeof data === 'string' ? data : null);

      if (respuesta) {
        respuestaFinal = `🤖 *Gura IA dice:*\n\n${respuesta.trim()}\n\n🌐 Fuente: IA #${i + 1}`;
        success = true;
        break;
      }
    } catch (e) {
      console.log(`❌ Error con IA ${i + 1}:`, e.message);
    }
  }

  if (success) {
    await m.reply(respuestaFinal);
    await m.react('✅');
  } else {
    await m.reply(`❌ Todas las IAs gratuitas fallaron.\nIntenta de nuevo más tarde o cambia la pregunta.`);
    await m.react('❌');
  }
};

handler.help = ['multiia <pregunta>'];
handler.tags = ['ia'];
handler.command = ['multiia', 'ia10', 'iafree'];

export default handler;
