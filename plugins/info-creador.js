import fetch from 'node-fetch';

// Estilos Gawr Gura: olas, tiburones, azul, kawaii
const DECORACIONES = [
    { arriba: "🌊🦈🌊🦈🌊🦈🌊", centro: "🦈", abajo: "🌊🦈🌊🦈🌊🦈🌊" },
    { arriba: "╭━━━･ﾟ✧ 𓆝 𓆟 𓆞 𓆝✧ﾟ･━━━╮", centro: "𓆝", abajo: "╰━━━･ﾟ✧ 𓆝 𓆟 𓆞 𓆝✧ﾟ･━━━╯" },
    { arriba: "⋆｡˚ ☁️🩵˚｡⋆", centro: "🩵", abajo: "⋆｡˚ ☁️🩵˚｡⋆" },
    { arriba: "︵‿︵‿୨♡୧‿︵‿︵", centro: "୨🦈୧", abajo: "︵‿︵‿୨♡୧‿︵‿︵" },
    { arriba: "⎯⎯⎯⎯⎯⎯⎯⎯", centro: "🌊", abajo: "⎯⎯⎯⎯⎯⎯⎯⎯" },
    { arriba: "✧*｡٩(ˊᗜˋ*)و✧*｡", centro: "🦈🌊", abajo: "✧*｡٩(ˊᗜˋ*)و✧*｡" },
    { arriba: "⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆", centro: "☁️🦈☁️", abajo: "⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆" },
    { arriba: "┏━━━━━━🦈━━━━━━┓", centro: "🌊", abajo: "┗━━━━━━🦈━━━━━━┛" },
    { arriba: "✦━─┉┈🦈┈┉─━✦", centro: "𓆝", abajo: "✦━─┉┈🦈┈┉─━✦" },
    { arriba: "𓆟𓆝𓆟𓆝𓆟", centro: "𓆟", abajo: "𓆟𓆝𓆟𓆝𓆟" },
    { arriba: "🦈⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆", centro: "🦈", abajo: "🦈⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆" },
    { arriba: "⋆⭒˚｡⋆｡˚☽˚｡⋆", centro: "🌊", abajo: "⋆⭒˚｡⋆｡˚☽˚｡⋆" },
    { arriba: "╭╼❀𓆝❀╾╮", centro: "𓆝", abajo: "╰╼❀𓆝❀╾╯" },
    { arriba: "︵‿︵‿୨୧‿︵‿︵", centro: "🩵🦈🩵", abajo: "︵‿︵‿୨୧‿︵‿︵" },
    { arriba: "✧˖°.🦈.•°˖✧", centro: "🦈", abajo: "✧˖°.🦈.•°˖✧" },
    { arriba: "⋆⁺₊⋆ ☾⋆⁺₊⋆", centro: "🌊🦈", abajo: "⋆⁺₊⋆ ☾⋆⁺₊⋆" },
    { arriba: "｡･ﾟﾟ･☽:｡.｡:☽ﾟ･｡ﾟ", centro: "🦈🌊", abajo: "｡･ﾟﾟ･☽:｡.｡:☽ﾟ･｡ﾟ" },
    { arriba: "🦈𓆟🌊𓆝🦈", centro: "𓆟", abajo: "🦈𓆟🌊𓆝🦈" },
    { arriba: "✧*。🦈。*✧", centro: "🌊", abajo: "✧*。🦈。*✧" },
    { arriba: "┏⋆｡˚❃˚｡⋆┓", centro: "🩵", abajo: "┗⋆｡˚❃˚｡⋆┛" }
];

const IMAGENES = [
    "https://i.imgur.com/oH6EJ6F.jpg",
    "https://i.imgur.com/4FZlF6M.jpg",
    "https://i.imgur.com/2zIFrXy.jpg",
    "https://i.imgur.com/nk3NWRP.jpg",
    "https://i.imgur.com/d2k0bDl.jpg",
    "https://i.imgur.com/EqH8hsh.jpg",
    "https://i.imgur.com/3zLq9a1.jpg",
    "https://i.imgur.com/9hyF8hO.jpg",
    "https://i.imgur.com/6zT1eB0.jpg",
    "https://i.imgur.com/7b9wEJ1.jpg",
    "https://i.imgur.com/x4o4u7l.jpg",
    "https://i.imgur.com/CV8eew2.jpg",
    "https://i.imgur.com/0M8fE9H.jpg",
    "https://i.imgur.com/H7w7D1L.jpg",
    "https://i.imgur.com/E5kFhJg.jpg",
    "https://i.imgur.com/oevD5wO.jpg",
    "https://i.imgur.com/z1p6zDd.jpg",
    "https://i.imgur.com/UgY6FhN.jpg",
    "https://i.imgur.com/jEhgwB9.jpg",
    "https://i.imgur.com/6g4w7Xy.jpg"
];

function randomGuraDeco() {
    const index = Math.floor(Math.random() * DECORACIONES.length);
    return { ...DECORACIONES[index], img: IMAGENES[index % IMAGENES.length] };
}

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await m.react('🦈');

    if (!['owner', 'creator', 'creador', 'dueño'].includes(command.toLowerCase())) {
        return conn.sendMessage(m.chat, { text: `El comando ${command} no existe.` });
    }

    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    let edtr = `@${m.sender.split('@')[0]}`;
    let username = await conn.getName(m.sender);

    let list = [{
        displayName: "💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 - Creador de Gawr Gura",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN: 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖  - Bot Developer\nitem1.TEL;waid=573133374132:573133374132\nitem1.X-ABLabel:Número\nitem2.ADR:;;Colombia;;;;\nitem2.X-ABLabel:País\nEND:VCARD`,
    }];

    // Textos mejorados
    function textoCreador(deco) {
        return `${deco.arriba}
${deco.centro} *👑 Contacto oficial del creador 👑*
${deco.abajo}

${deco.centro} *Nombre:* 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖
${deco.centro} *País:* 🇨🇴 Colombia
${deco.centro} *Rol:* Desarrollador de Gawr Gura Bot

${deco.centro} “¡Hola! Soy el creador de *Gawr Gura Bot*, un proyecto hecho con dedicación, cariño y espíritu tiburón.
${deco.centro} Si tienes ideas, encontraste un bug, o quieres apoyar este proyecto azul, puedes escribirme directo.
${deco.centro} ¡Gracias por usar el bot y ser parte de esta marea de sonrisas! 🌊🦈

${deco.centro} _¡Aru~! Shark power~_`;
    }

    // Primer envío
    let deco = randomGuraDeco();
    let texto = textoCreador(deco);

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
                thumbnailUrl: deco.img,
                sourceUrl: 'https://github.com',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    // Mensaje decorado editable
    let sent = await conn.sendMessage(m.chat, { text: texto }, { quoted: m });

    // Animación: cambia decoración e imagen cada 5 segundos por 15 minutos
    let cambios = Math.floor((15 * 60) / 5); // 180 ciclos
    let activo = true;
    let i = 1;
    const editar = async () => {
        if (!activo || i > cambios) return;
        let decoNuevo = randomGuraDeco();
        let textoNuevo = textoCreador(decoNuevo);
        try {
            await conn.sendMessage(m.chat, {
                edit: sent.key,
                text: textoNuevo,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        title: 'Gawr Gura - Bot ',
                        body: 'Creador: 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 ',
                        thumbnailUrl: decoNuevo.img,
                        sourceUrl: 'https://github.com',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        } catch (e) {}
        i++;
        if (i <= cambios) setTimeout(editar, 5000);
    };
    setTimeout(editar, 5000);
    setTimeout(() => { activo = false; }, 15 * 60 * 1000);
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
