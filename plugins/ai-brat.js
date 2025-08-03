
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const text = args.join(' ');
  
  if (!text) {
    return m.reply(`✧･ﾟ: *✧･ﾟ:* 🎨 *¡Escribe el texto para crear tu imagen brat buba~!*\n\n*Ejemplo:* ${usedPrefix}${command} Gawr Gura`);
  }

  try {
    await m.react('🎨');
    
    // API para generar imagen estilo brat
    const apiUrl = `https://api.popcat.xyz/brat?text=${encodeURIComponent(text)}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('No se pudo generar la imagen brat');
    }

    const buffer = await response.buffer();

    const bratMessage = `
✧･ﾟ: *✧･ﾟ:* 🎨 *ʙʀᴀᴛ ɢᴇɴᴇʀᴀᴛᴏʀ* 🎨 :･ﾟ✧*:･ﾟ✧

📝 *Texto:* ${text}
🦈 *Generado por:* @${m.sender.split('@')[0]}

꒰ 💚 *¡Tu imagen brat está lista buba~!* 💚 ꒱
`;

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: bratMessage,
      mentions: [m.sender]
    }, { quoted: m });

    await m.react('✅');

  } catch (error) {
    console.error('Error generando imagen brat:', error);
    
    // Fallback con otra API
    try {
      const fallbackUrl = `https://api.memegen.link/images/custom/_/${encodeURIComponent(text)}.png?style=brat&background=lime&color=black`;
      
      await conn.sendMessage(m.chat, {
        image: { url: fallbackUrl },
        caption: `
✧･ﾟ: *✧･ﾟ:* 🎨 *ʙʀᴀᴛ ɢᴇɴᴇʀᴀᴛᴏʀ* 🎨 :･ﾟ✧*:･ﾟ✧

📝 *Texto:* ${text}
🦈 *Generado por:* @${m.sender.split('@')[0]}

꒰ 💚 *¡Tu imagen brat está lista buba~!* 💚 ꒱
`,
        mentions: [m.sender]
      }, { quoted: m });
      
      await m.react('✅');
      
    } catch (fallbackError) {
      console.error('Error con API fallback:', fallbackError);
      await m.reply('❌ *¡Hyaaa~! No se pudo generar la imagen brat buba~*\n\n*Intenta de nuevo más tarde desu~*');
      await m.react('❌');
    }
  }
};

handler.help = ['brat'];
handler.command = ['brat'];
handler.tags = ['maker', 'tools'];
handler.register = false;

export default handler;
