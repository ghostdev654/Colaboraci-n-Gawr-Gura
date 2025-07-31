const handler = async (m, { conn, participants, isBotAdmin, isAdmin, groupMetadata, text }) => {
  if (!m.isGroup) throw '❌ Este comando solo funciona en grupos';
  if (!isAdmin) throw '❌ Solo los administradores pueden usar este comando';
  if (!isBotAdmin) throw '❌ Necesito ser administrador para eliminar miembros';

  let ownerGroup = groupMetadata.owner || participants.find(p => p.admin === 'superadmin')?.id;

  // Filtrar a todos los que no sean el bot ni el dueño del grupo
  let toKick = participants
    .filter(p => p.id !== conn.user.id && p.id !== ownerGroup)
    .map(p => p.id);

  if (!toKick.length) throw '✅ No hay nadie para eliminar.';

  m.reply(`🚫 Eliminando a ${toKick.length} miembros...`);

  for (let user of toKick) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Espera para evitar spam
    } catch (e) {
      console.log(`❌ No se pudo eliminar a ${user}`);
    }
  }

  m.reply('✅ Purga completada.');
};

handler.command = ['purga'];
handler.group = true;
handler.admin = false;
handler.botAdmin = false;

export default handler;
