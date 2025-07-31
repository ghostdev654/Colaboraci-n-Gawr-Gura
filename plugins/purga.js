const handler = async (m, { conn }) => {
  if (!m.isGroup) throw '❌ Este comando solo funciona en grupos';

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;
  const sender = m.sender;

  const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = participants.find(p => p.id === botNumber)?.admin !== null;
  const isAdmin = participants.find(p => p.id === sender)?.admin !== null;

  if (!isAdmin) throw '❌ Solo los administradores pueden usar este comando';
  if (!isBotAdmin) throw '❌ Necesito ser administrador para eliminar miembros';

  const ownerGroup = groupMetadata.owner || participants.find(p => p.admin === 'superadmin')?.id;

  const toKick = participants
    .filter(p => p.id !== botNumber && p.id !== ownerGroup)
    .map(p => p.id);

  if (!toKick.length) throw '✅ No hay nadie para eliminar.';

  m.reply(`🚫 Eliminando a ${toKick.length} miembros...`);

  for (let user of toKick) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
      await new Promise(res => setTimeout(res, 1500));
    } catch (e) {
      console.log(`❌ No se pudo eliminar a ${user}:`, e);
    }
  }

  m.reply('✅ Purga completada.');
};

handler.command = ['purga'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
