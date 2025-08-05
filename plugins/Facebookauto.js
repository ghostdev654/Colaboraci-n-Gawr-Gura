import { igdl } from 'ruhend-scraper';

const handler = async (m, { conn }) => {
    const fbRegex = /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\/[^\s]+/i;
    const match = m.text.match(fbRegex);
    if (!match) return;

    const url = match[0];
    const sharkEmoji = '✳️';
    const warningEmoji = '⚠️';
    const waitingEmoji = '⏳';
    const successEmoji = '✅';
    const errorEmoji = '❌';
    const oopsEmoji = '🔧';

    let res;
    try {
        await m.react(waitingEmoji);
        res = await igdl(url);
    } catch (e) {
        return conn.reply(m.chat, `${oopsEmoji} *𝙰𝚕𝚐𝚘 𝚜𝚊𝚕𝚒ó 𝚖𝚊𝚕 𝚊𝚕 𝚙𝚛𝚘𝚌𝚎𝚜𝚊𝚛 𝚎𝚕 𝚟𝚒𝚍𝚎𝚘. 𝚁𝚎𝚟𝚒𝚜𝚊 𝚎𝚕 𝚎𝚗𝚕𝚊𝚌𝚎.*`, m);
    }

    let result = res.data;
    if (!result || result.length === 0) {
        return conn.reply(m.chat, `${warningEmoji} *𝙽𝚘 𝚜𝚎 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚛𝚘𝚗 𝚁𝚎𝚜𝚞𝚕𝚝𝚊𝚍𝚘𝚜.*`, m);
    }

    let data;
    try {
        data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
    } catch (e) {
        return conn.reply(m.chat, `${oopsEmoji} *𝙾𝚌𝚞𝚛𝚛𝚒ó 𝚞𝚗 𝙴𝚛𝚛𝚘𝚛 𝚊𝚕 𝚙𝚛𝚘𝚌𝚎𝚜𝚊𝚛 𝚕𝚘𝚜 𝚍𝚊𝚝𝚘𝚜.*`, m);
    }

    if (!data) {
        return conn.reply(m.chat, `${warningEmoji} *𝙽𝚘 𝚜𝚎 𝚎𝚗𝚌𝚘𝚗𝚝𝚛𝚊𝚛𝚘𝚗 𝚁𝚎𝚜𝚘𝚕𝚞𝚌𝚒𝚘𝚗𝚎𝚜.*`, m);
    }

    let video = data.url;
    try {
        await conn.sendMessage(
            m.chat,
            {
                video: { url: video },
                caption: `${sharkEmoji} *¡Aquí tienes tu Video!*`,
                fileName: 'fb.mp4',
                mimetype: 'video/mp4'
            },
            { quoted: m }
        );
        await m.react(successEmoji);
    } catch (e) {
        await m.react(errorEmoji);
        return conn.reply(m.chat, `❌ *𝙾𝚌𝚞𝚛𝚛𝚒ó 𝚞𝚗 𝙴𝚛𝚛𝚘𝚛 𝚊𝚕 𝚙𝚛𝚘𝚌𝚎𝚜𝚊𝚛 𝚎𝚕 𝚟𝚒𝚍𝚎𝚘.*`, m);
    }
};

handler.customPrefix = /https?:\/\/(www\.)?(facebook\.com|fb\.watch)\//i;
handler.command = new RegExp;
handler.group = true;
handler.register = false;
handler.limit = false;

export default handler;
