
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ');

  if (!text) {
    return m.reply(`⚠️ *Proporciona un texto para enviar a la IA* \n\n> Ej: ${usedPrefix}${command} ¿Qué es la inteligencia artificial?`);
  }

  try {
    await m.react('🤖');
    
    const response = await fetch(`https://api.ryzendesu.vip/api/ai/claude?text=${encodeURIComponent(text)}`);

    if (!response.ok) throw new Error('Claude API failed');
    
    const data = await response.json();
    
    if (!data.response) throw new Error('No response from Claude');

    const responseMsg = `

${data.response}

*Pregunta de:* @${m.sender.split('@')[0]}
`;

    await conn.sendMessage(m.chat, {
      text: responseMsg,
      mentions: [m.sender]
    }, { quoted: m });

    await m.react('🧠');

  } catch (error) {
    console.error(error);
    await m.reply(`❌ *ERROR: the API failed*\n\n*Error:* ${error.message}`);
    await m.react('❌');
  }
};

handler.help = ['claude'];
handler.tags = ['ai'];
handler.command = ['claude', 'anthropic'];
handler.register = false;

export default handler;
