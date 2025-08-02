import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🦈 *Gura IA Multifuente*\n\nUsa:\n${usedPrefix + command} [tu pregunta]\nEjemplo:\n${usedPrefix + command} ¿Qué es HTML?`);
  }

  await m.react('🔍');

  const fuentes = [
    q => `https://freegptapi.vercel.app/api/gpt?text=${encodeURIComponent(q)}`,
    q => `https://gpt-api.shaurya.workers.dev/?prompt=${encodeURIComponent(q)}`,
    q => `https://gpt4api.up.railway.app/ask?prompt=${encodeURIComponent(q)}`,
    q => `https://api.binjie.fun/api/gpt?text=${encodeURIComponent(q)}`,
    q => `https://gpt-api.pawan.krd/api/gpt?text=${encodeURIComponent(q)}`,
    q => `https://chatgpt-api.shn.hk/v1/?msg=${encodeURIComponent(q)}`,
    q => `https://gpt-app.fly.dev/api/gpt?prompt=${encodeURIComponent(q)}`,
    q => `https://askgpt.vercel.app/api?query=${encodeURIComponent(q)}`,
    q => `https://api.llama.fyi/api/text?text=${encodeURIComponent(q)}`,
    q => `https://ai.ls/api?text=${encodeURIComponent(q)}`,
    q => `https://chatfree.cloudflareapps.com/api?text=${encodeURIComponent(q)}`,
    q => `https://api.itsrose.life/gpt4free?query=${encodeURIComponent(q)}`,
    q => `https://gpt-cyber-api.vercel.app/api?q=${encodeURIComponent(q)}`,
    q => `https://gptflask.openai-apis.workers.dev/api?q=${encodeURIComponent(q)}`,
    q => `https://chatgpt-server.touhid.workers.dev/?text=${encodeURIComponent(q)}`,
    q => `https://api.deepseek.one/freegpt?q=${encodeURIComponent(q)}`,
    q => `https://api.lupin.chat/v1/chat?question=${encodeURIComponent(q)}`,
    q => `https://chatforai.net/api?text=${encodeURIComponent(q)}`,
    q => `https://proxygpt.vercel.app/api?prompt=${encodeURIComponent(q)}`,
    q => `https://api.obabo.xyz/v1/chat?message=${encodeURIComponent(q)}`
  ];

  let respuestaFinal = '';

  for (let i = 0; i < fuentes.length; i++) {
    try {
      const res = await fetch(fuentes[i](text));
      const data = await res.json();

      const reply =
        data.reply ||
        data.response ||
        data.result ||
        data.message ||
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.text ||
        (typeof data === 'string' ? data : null);

      if (reply) {
        respuestaFinal = `🧠 *Gura IA (Fuente #${i + 1}) responde:*\n\n${reply.trim()}\n\n🌊 _Rescatado del océano de IAs gratis_`;
        break;
      }
    } catch (e) {
      console.log(`⚠️ Fuente ${i + 1} falló: ${e.message}`);
    }
  }

  if (respuestaFinal) {
    await m.reply(respuestaFinal);
    await m.react('✅');
  } else {
    await m.reply('❌ Ninguna IA respondió correctamente. Intenta más tarde.');
    await m.react('❌');
  }
};

handler.help = ['multiia <texto>'];
handler.tags = ['ia'];
handler.command = ['multiia', 'ia20', 'guraia'];

export default handler;
