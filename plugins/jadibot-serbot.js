/*
╭─────────────🌊─────────────╮
│     🦈 Gawr Gura Sub-Bot System      │
│       100% Cute & Sharky 🐟💙       │
╰─────────────🌊─────────────╯
*/

const {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion
} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import chalk from 'chalk';
import util from 'util';
import * as ws from 'ws';
const { CONNECTING } = ws;
import { makeWASocket } from '../lib/simple.js';
import { fileURLToPath } from 'url';

const { spawn } = await import('child_process');

// 🐬 Mensajes mágicos del océano
let qrText = `
╭─── 🦈 *Gawr Gura Sub Bot QR* ───╮
│ 📱 Escanea el código QR con tu WhatsApp:
│ 🔐 Ir a "Dispositivos vinculados" y conectar.
│
│ ⚠️ ¡Este QR es único para tu número!
╰─────────────────────────────╯
`.trim();

let codeText = `
╭─── 🦈 *Gawr Gura Sub Bot Código* ───╮
│ 📲 Usa el modo código manual:
│ 🔐 Ir a "Vincular con número de teléfono"
│
│ ⚠️ ¡Este código es solo para ti, tiburoncito!
╰──────────────────────────────────╯
`.trim();

// 📁 Rutas mágicas del sistema
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📚 Configuración temporal
const yukiJBOptions = {};
if (!(global.conns instanceof Array)) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000;

  const subBots = [...new Set([...global.conns.filter(conn =>
    conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)])];

  const subBotsCount = subBots.length;

  if (subBotsCount === 25) {
    return m.reply(`❌ Ya hay 25 sub bots activos 🐠 Intenta más tarde, sharky.`);
  }

  let who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);
  let id = `${who.split`@`[0]}`;
  let pathYukiJadiBot = path.join(`./jadibot/`, id);

  if (!fs.existsSync(pathYukiJadiBot)) {
    fs.mkdirSync(pathYukiJadiBot, { recursive: true });
  }

  Object.assign(yukiJBOptions, {
    pathYukiJadiBot,
    m,
    conn,
    args,
    usedPrefix,
    command,
    fromCommand: true
  });

  await yukiJadiBot(yukiJBOptions);
  global.db.data.users[m.sender].Subs = new Date * 1;
};

handler.help = ['qr', 'code'];
handler.tags = ['serbot'];
handler.command = ['qr', 'code'];
export default handler;

// ─── 🦈 Función para activar un sub-bot personalizado ───
async function yukiJadiBot(options = {}) {
  const {
    pathYukiJadiBot,
    m,
    conn,
    args,
    usedPrefix,
    command,
    fromCommand
  } = options;

  let { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot);

  let version = await fetchLatestBaileysVersion();
  let conn2 = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
    },
    browser: ['GawrGura-MiniShark', 'Safari', '3.0'],
    logger: pino({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
    shouldIgnoreJid: jid => !jid
  });

  conn2.ev.on('creds.update', saveCreds);

  // 📸 Enviar código QR
  if (fromCommand) {
    conn2.ev.on('connection.update', async (update) => {
      const { qr, connection, lastDisconnect } = update;

      if (qr) {
        let QRImage = await qrcode.toDataURL(qr, { scale: 8 });
        let buffer = Buffer.from(QRImage.split(',')[1], 'base64');
        await m.reply(qrText);
        await conn.sendFile(m.chat, buffer, "qr.png", "🔐 *Escanea para conectar*", m);
      }

      if (connection === 'close') {
        let reason = lastDisconnect?.error?.output?.statusCode;

        if (reason !== DisconnectReason.loggedOut) {
          yukiJadiBot(options); // Reintenta si no fue logout
        } else {
          console.log("🌊 Sesión cerrada del sub bot");
        }
      }

      if (connection === 'open') {
        m.reply(`✅ Sub bot activado 🦈 ¡Hola desde el mar profundo!`);
        conn2.sendMessage(conn2.user.id, {
          text: `✨ ¡Hola! Este es tu sub bot activo 🦈`
        });
        global.conns.push(conn2);
      }
    });
  }
}
