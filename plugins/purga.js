const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const handler = async (m, { conn }) => {
  if (!m.isGroup) throw '❌ Este comando solo funciona en grupos';

  // Obtener metadata y participantes
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;

  // ID del usuario que ejecuta el comando
  const sender = m.sender;
  const senderIsAdmin = participants.find(p => p.id === sender)?.admin != null;

  // Obtener ID real del bot (adaptado por si usa múltiples dispositivos)
  const botNumber = conn.decodeJid(conn.user.id);
  const botIsAdmin = participants.find(p => p.id === botNumber)?.admin != null;

  if (!senderIsAdmin) throw '❌ Solo los administradores pueden usar este comando';
  if (!botIsAdmin) throw '❌ El bot necesita ser administrador para eliminar miembros';

  // ID del dueño del grupo
  const ownerGroup = groupMetadata.owner || participants.find(p => p.admin === 'superadmin')?.id;

  // Filtrar personas a eliminar
  const usersToKick = participants
    .filter(p => p.id !== ownerGroup && p.id !== botNumber) // no borrar dueño ni al bot
    .map(p => p.id);

  if (!usersToKick.length) throw '✅ No hay nadie para eliminar.';

  m.reply(`🚫 Eliminando a ${usersToKick.length} miembros...`);

  for (let user of usersToKick) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      await delay(1000); // evita spam (puedes ajustar)
    } catch (e) {
      m.reply(`❌ No se pudo eliminar a @${user.split('@')[0]}`, null, {
        mentions: [user]
      });
    }
  }

  m.reply('✅ Purga completada.');
};

handler.command = ['purga'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
