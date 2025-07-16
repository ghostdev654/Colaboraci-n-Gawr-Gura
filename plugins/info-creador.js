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
        displayName: "Wirk - Creador de Mai 🌹",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: Wirk - Bot Developer\nitem1.TEL;waid=50493732693:50493732693\nitem1.X-ABLabel:Número\nitem2.ADR:;;Honduras;;;;\nitem2.X-ABLabel:País\nEND:VCARD`,
    }];

    const imageUrl = 'https://qu.ax/VnCGk.jpg';
    const texto = `╭───────❀\n│ *Contacto del creador*\n╰───────❀\n\n• *Nombre:* Wirk\n• *Desde:* Honduras\n• *Creador de:* Mai\n\n_“El código es temporal, pero la creatividad... esa es eterna.”_\n\nPuedes contactarlo si tienes ideas, bugs o quieres apoyar el proyecto..`;

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contacto`,
            contacts: list
        },
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: 'Mai - Bot Kawaii',
                body: 'Creador: Wirk',
                thumbnailUrl: imageUrl,
                sourceUrl: 'https://github.com/WillZek',
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
