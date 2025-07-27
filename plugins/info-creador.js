import fetch from 'node-fetch';

// Decoraciones duplicadas (Gawr Gura)
const DECORACIONES = Array.from({ length: 50 }, (_, i) => {
    const shark = "🦈";
    const wave = "🌊";
    const heart = "💙";
    const star = "⭐";
    const fish = "🐟";
    const bubble = "🫧";
    const kawaii = [
        "(｡•̀ᴗ-)✧", "（＾・ω・＾❁）", "(｡♥‿♥｡)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", 
        "(っ˘ω˘ς )", "≧◡≦", "(。U⁄ ⁄ω⁄ ⁄ U。)", "(*≧ω≦)", 
        "( ˘▽˘)っ♨", "( ˘▽˘)っ♨"
    ];
    const patterns = [
        `${wave}${shark}${bubble}${shark}${wave}${i}`,
        `${star}${bubble}${heart}${shark}${wave}${fish}${star}`,
        `╭━━━${shark.repeat((i % 3) + 1)}━━━╮`,
        `⋆｡˚☽˚｡⋆${wave.repeat((i % 4) + 1)}⋆｡˚☽˚｡⋆`,
        `✦━─┉┈${shark}${bubble}┈┉─━✦`,
        `𓆟𓆝𓆟𓆝𓆟${bubble.repeat((i % 2) + 1)}`,
        `🩵${wave}${shark}${wave}${shark}${wave}🩵`,
        `🦈⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆🦈`,
        `⋆⭒˚｡⋆｡˚☽˚｡⋆${kawaii[i % kawaii.length]}`,
        `${heart}${star}${bubble}${shark}${fish}${heart}${star}${bubble}`,
        `【${wave.repeat((i % 6) + 1)}${shark.repeat((i % 2) + 1)}】`,
        `🦈${star}${bubble}${wave}${star}${shark}${bubble}${wave}`,
        `✧*｡٩(ˊᗜˋ*)و✧*｡${bubble}${wave}${shark}${heart}`,
        `┏━━━━━━🦈━━━━━━┓`,
        `⋆｡˚ ☁️🩵˚｡⋆`,
        `╭╼❀𓆝❀╾╮`,
        `︵‿︵‿୨${shark}୧‿︵‿︵`,
        `✧*。🦈。*✧`,
        `𓆟𓆝𓆟𓆝𓆟`,
        `🦈𓆟🌊𓆝🦈`
    ];
    const deco = patterns[i % patterns.length];
    return {
        arriba: deco,
        centro: deco,
        abajo: deco
    };
});

// Imágenes temáticas para Gawr Gura
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

// Genera líneas de código aleatorias
function generarCodigoAleatorio() {
    const palabras = [
        "let", "const", "function", "return", "async", "await", "class", "if", "else", "switch",
        "case", "break", "import", "export", "default", "console.log", "Math.random", "try", "catch",
        "new", "setTimeout", "setInterval", "document.querySelector", "window.addEventListener",
        "JSON.parse", "JSON.stringify", "Error", "prototype", "apply", "call", "bind", "Math.floor"
    ];
    const simbolos = ["=", "==", "===", "=>", "+", "-", "*", "/", "%", "&&", "||", "!", "++", "--", ".", ",", "(", ")", "{", "}"];
    const lineas = [];
    for (let i = 0; i < 10; i++) {
        const linea = [];
        for (let j = 0; j < Math.floor(Math.random() * 5) + 3; j++) {
            if (Math.random() > 0.5) {
                linea.push(palabras[Math.floor(Math.random() * palabras.length)]);
            } else {
                linea.push(simbolos[Math.floor(Math.random() * simbolos.length)]);
            }
        }
        lineas.push(linea.join(" "));
    }
    return lineas.join("\n");
}

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
    await m.react('🦈');

    if (!['owner', 'creator', 'creador', 'dueño'].includes(command.toLowerCase())) {
        return conn.sendMessage(m.chat, { text: `El comando ${command} no existe.` });
    }

    // Simulación de extracción de información
    let sent = await conn.sendMessage(m.chat, { text: "🔍 *Extrayendo información...*\n" }, { quoted: m });
    const TIEMPO_EXTRACCION = 10 * 1000; // 10 segundos
    const INTERVALO = 1000; // Cada 1 segundo
    let tiempoTranscurrido = 0;

    const actualizarExtraccion = async () => {
        if (tiempoTranscurrido >= TIEMPO_EXTRACCION) {
            mostrarInformacion();
            return;
        }
        const codigo = generarCodigoAleatorio();
        await conn.sendMessage(m.chat, { edit: sent.key, text: `🔍 *Extrayendo información...*\n\n\`\`\`${codigo}\`\`\`` });
        tiempoTranscurrido += INTERVALO;
        setTimeout(actualizarExtraccion, INTERVALO);
    };

    const mostrarInformacion = async () => {
        // Selecciona una decoración aleatoria
        let deco = DECORACIONES[Math.floor(Math.random() * DECORACIONES.length)];
        let texto = `${deco.arriba}\n${deco.centro} *👑 Contacto Oficial del Creador 👑*\n${deco.abajo}`;
        texto += `\n\n${deco.centro} *Nombre:* 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖`;
        texto += `\n${deco.centro} *País:* 🇨🇴 Colombia`;
        texto += `\n${deco.centro} *Rol:* Desarrollador de Gawr Gura Bot`;
        texto += `\n\n${deco.centro} “¡Gracias por usar este bot!”`;
        await conn.sendMessage(m.chat, { edit: sent.key, text: texto });
    };

    actualizarExtraccion();
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
