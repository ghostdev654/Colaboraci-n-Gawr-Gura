import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, createReadStream } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { randomUUID } from 'crypto';

const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || m.quoted.mtype !== 'stickerMessage')
    throw `✳️ Responde a un sticker con *${usedPrefix + command}* para convertirlo a imagen o video.`;

  const isAnimated = m.quoted.msg?.isAnimated;

  const stickerBuffer = await m.quoted.download();
  const id = randomUUID();
  const inputPath = path.join(tmpdir(), `${id}.webp`);
  const outputPath = path.join(tmpdir(), isAnimated ? `${id}.mp4` : `${id}.png`);

  writeFileSync(inputPath, stickerBuffer);

  await new Promise((resolve, reject) => {
    const args = isAnimated
      ? ['-i', inputPath, '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outputPath]
      : ['-i', inputPath, outputPath];

    spawn('ffmpeg', args)
      .on('close', resolve)
      .on('error', reject);
  });

  const form = new FormData();
  form.append('file', createReadStream(outputPath));

  const res = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders(),
  });

  const url = res.data.files?.[0]?.url || res.data.url;

  unlinkSync(inputPath);
  unlinkSync(outputPath);

  if (!url) throw '❌ No se pudo subir el archivo convertido.';

  const filename = isAnimated ? 'sticker.mp4' : 'sticker.png';
  const mensaje = isAnimated
    ? '🎞️ Aquí tienes tu sticker animado convertido a video.'
    : '🖼️ Aquí tienes tu sticker convertido a imagen.';

  await conn.sendFile(m.chat, url, filename, mensaje, m);
};

handler.help = ['toimg'];
handler.tags = ['herramientas', 'convertidor'];
handler.command = /^toimg$/i;

export default handler;
