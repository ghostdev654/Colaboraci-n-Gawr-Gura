import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await m.react('👑');

    if (!['owner', 'creator', 'creador', 'dueño'].includes(command.toLowerCase())) {
        return conn.sendMessage(m.chat, { text: `El comando ${command} no existe.` });
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    let edtr = `@${m.sender.split('@')[0]}`;
    let username = conn.getName(m.sender);

    let list = [{
        displayName: "💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 - Creador de Gawr Gura",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖  - Bot Developer\nitem1.TEL;waid=573133374132:573133374132\nitem1.X-ABLabel:Número\nitem2.ADR:;;Colombia;;;;\nitem2.X-ABLabel:País\nEND:VCARD`,
    }];

    const imageUrl = 'https://qu.ax/VnCGk.jpg';
    const texto = `╭───────❀\n│ *Contacto del creador*\n╰───────❀\n\n• *Nombre:* 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖\n• *Desde:* Colombia\n• *Creador de:* Gawr Gura\n\n_“solo porque si_\n\nPuedes contactarlo si tienes ideas, bugs o quieres apoyar el proyecto..`;

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contacto`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: 'Gawr Gura - Bot ',
                body: 'Creador: 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 ',
                thumbnailUrl: imageUrl,
                sourceUrl: 'https://github.com',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { text: texto }, { quoted: m });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
