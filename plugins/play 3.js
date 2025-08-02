import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";
import ytdl from 'ytdl-core';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `🎌 *Ingrese el nombre de un video de YouTube*\n\nEjemplo: ${usedPrefix + command} New West - Those Eyes`, m);
  try {
    m.react('🔍');
    const search = await yts(text);
    const video = search.videos[0];
    if (!video) return conn.reply(m.chat, '🚫 No se encontraron resultados.', m);

    const { title, timestamp, views, url, author, thumbnail } = video;
    const canal = author.name || 'Desconocido';
    const tipo = command === 'play4' ? 'video' : 'audio';

    const mensaje = `*∘ Título:* ${title}\n*∘ Duración:* ${timestamp}\n*∘ Vistas:* ${views}\n*∘ Canal:* ${canal}\n*∘ Enlace:* ${url}\n\n*Enviando ${tipo}...*\n⏳ Espere un momento`;

    const thumb = (await conn.getFile(thumbnail))?.data;
    await conn.sendMessage(m.chat, {
      text: mensaje,
      contextInfo: {
        externalAdReply: {
          title,
          body: 'YouTube Downloader',
          thumbnail: thumb,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    let success = false;

    // 🌐 Intento 1: Neoxr API
    try {
      const api = await (await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=${tipo}&quality=${tipo === 'audio' ? '128kbps' : '720p'}&apikey=GataDios`)).json();
      const result = api.data.url;
      if (!result) throw 'Neoxr falló';

      const content = tipo === 'audio' ?
        { audio: { url: result }, fileName: `${api.data.filename}.mp3`, mimetype: 'audio/mpeg' } :
        { video: { url: result }, fileName: `${api.data.filename}.mp4`, mimetype: 'video/mp4', caption: '🎬', thumbnail };

      await conn.sendMessage(m.chat, content, { quoted: m });
      success = true;
    } catch {}

    // 🔁 Intento 2: Bochilteam
    if (!success) {
      try {
        const yt = await youtubedl(url).catch(async _ => await youtubedlv2(url));
        const dl_url = tipo === 'audio' ? yt.audio['128kbps'].download() : yt.video['360p'].download();
        const mimetype = tipo === 'audio' ? 'audio/mpeg' : 'video/mp4';
        const content = tipo === 'audio' ?
          { audio: { url: await dl_url }, mimetype } :
          { video: { url: await dl_url }, mimetype, fileName: `${yt.title}.mp4`, caption: `🎬 ${yt.title}` };
        await conn.sendMessage(m.chat, content, { quoted: m });
        success = true;
      } catch {}
    }

    // 🔁 Intento 3: Akuari
    if (!success && tipo === 'audio') {
      try {
        const res = await fetch(`https://api.akuari.my.id/downloader/youtube?link=${url}`);
        const json = await res.json();
        await conn.sendMessage(m.chat, { audio: { url: json.mp3[1].url }, mimetype: 'audio/mpeg' }, { quoted: m });
        success = true;
      } catch {}
    }

    // 🔁 Intento 4: lolhuman
    if (!success) {
      try {
        const api = tipo === 'audio' ?
          await fetch(`https://api.lolhuman.xyz/api/ytplay?apikey=GataDios&query=${title}`) :
          await fetch(`https://api.lolhuman.xyz/api/ytvideo?apikey=GataDios&url=${url}`);
        const json = await api.json();
        const link = tipo === 'audio' ? json.result.audio.link : json.result.link;
        const content = tipo === 'audio' ?
          { audio: { url: link }, mimetype: 'audio/mpeg' } :
          { video: { url: link }, fileName: `${json.result.title || 'video'}.mp4`, caption: `🎬`, thumbnail };
        await conn.sendMessage(m.chat, content, { quoted: m });
        success = true;
      } catch {}
    }

    // 🔁 Intento 5: ytdl directo
    if (!success && tipo === 'audio') {
      try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
        await conn.sendMessage(m.chat, { audio: { url: format.url }, mimetype: 'audio/mpeg' }, { quoted: m });
        success = true;
      } catch {}
    }

    if (!success) throw new Error('Todos los métodos fallaron.');

  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, '❌ Ocurrió un error: ' + e.message, m);
  }
};

handler.help = ['play3', 'play4'];
handler.tags = ['descargas'];
handler.command = /^play3|play4$/i;
handler.limit = true;
handler.register = true;

export default handler;
