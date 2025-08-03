
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import fs from 'fs';

const execAsync = promisify(exec);

const handler = async (m, { conn }) => {
  try {
    await m.react('📊');

    // Obtener información del sistema
    const uptime = process.uptime();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const cpuUsage = os.loadavg()[0];
    const platform = os.platform();
    const arch = os.arch();
    const nodeVersion = process.version;

    // Estadísticas de la base de datos
    const stats = global.db.data.stats || {};
    const users = Object.keys(global.db.data.users || {}).length;
    const chats = Object.keys(global.db.data.chats || {}).length;

    // Contar comandos ejecutados
    let totalCommands = 0;
    let successCommands = 0;
    for (const [plugin, data] of Object.entries(stats)) {
      totalCommands += data.total || 0;
      successCommands += data.success || 0;
    }

    // Plugins activos
    const activePlugins = Object.keys(global.plugins || {}).length;

    // Sub-bots conectados
    const subBots = global.conns ? global.conns.filter(conn => conn.user).length : 0;

    // Formatear tiempo de actividad
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    // Formatear bytes
    const formatBytes = (bytes) => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Obtener información del bot actual
    const botNumber = conn.user?.jid?.split('@')[0] || 'Unknown';
    const botName = global.namebot || '🌊🦈 𝙂𝘼𝙒𝙍 𝙂𝙐𝙍𝘼 🦈🌊';

    // Top 5 comandos más usados
    const topCommands = Object.entries(stats)
      .sort((a, b) => (b[1].total || 0) - (a[1].total || 0))
      .slice(0, 5)
      .map(([plugin, data], index) => {
        const name = plugin.replace(/\.js$/, '').replace(/^[^-]+-/, '');
        return `${index + 1}. ${name}: ${data.total || 0} usos`;
      })
      .join('\n   ');

    const infoMessage = `
╭───────────────༺☆༻───────────────╮
🌊🦈 *Gawr Gura's Bot Statistics* 🦈🌊
╰───────────────༺☆༻───────────────╯

╭─❍ 📊 *Estadísticas Generales:*
│ 🤖 *Bot:* ${botName}
│ 📱 *Número:* +${botNumber}
│ ⏰ *Tiempo Activa:* ${formatUptime(uptime)}
│ 👥 *Usuarios:* ${users}
│ 💬 *Chats:* ${chats}
│ 🔌 *Plugins:* ${activePlugins}
│ 🦈 *Sub-bots:* ${subBots}
╰───────────────────────────────╯

╭─❍ 📈 *Comandos Ejecutados:*
│ 📋 *Total:* ${totalCommands}
│ ✅ *Exitosos:* ${successCommands}
│ ❌ *Fallidos:* ${totalCommands - successCommands}
│ 📊 *Tasa éxito:* ${totalCommands > 0 ? Math.round((successCommands / totalCommands) * 100) : 0}%
╰───────────────────────────────╯

╭─❍ 🏆 *Top Comandos:*
   ${topCommands || 'Sin datos disponibles'}
╰───────────────────────────────╯

╭─❍ 💻 *Sistema:*
│ 🖥️ *Plataforma:* ${platform} (${arch})
│ 🟢 *Node.js:* ${nodeVersion}
│ 🧠 *Memoria:* ${formatBytes(usedMemory)} / ${formatBytes(totalMemory)}
│ 📊 *Uso RAM:* ${Math.round((usedMemory / totalMemory) * 100)}%
│ ⚡ *CPU Load:* ${Math.round(cpuUsage * 100)}%
╰───────────────────────────────╯

╭─❍ 🦈 *Estado del Bot:*
│ 🟢 *Estado:* Online y funcionando
│ 🔄 *Última actualización:* ${new Date().toLocaleString('es-MX')}
│ 💙 *Desarrollado con:* Node.js & Baileys
╰───────────────────────────────╯

꒰ 💫 *¡Gawr Gura siempre lista para ayudar buba~!* 💫 ꒱
`;

    await conn.sendMessage(m.chat, {
      text: infoMessage
    }, { quoted: m });

    await m.react('📈');

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    await m.reply('❌ *¡Hyaaa~! No se pudieron obtener las estadísticas buba~*');
    await m.react('❌');
  }
};

handler.help = ['infobot', 'stats', 'estadisticas'];
handler.command = ['infobot', 'stats', 'estadisticas', 'info'];
handler.tags = ['info'];
handler.register = false;

export default handler;
