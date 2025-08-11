import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  await m.react('⏳') // ⏳ Espera...

  if (conn.user.jid == conn.user.jid) {
    try {
      let stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''))
      await conn.reply(m.chat, `
╭━━〔 *🖥️ Actualizaciones de Git* 〕━━⬣
┃ 
┃
┃ *📥 Resultado:* 
┃ ${stdout.toString().trim().split('\n').map(l => `┃ ${l}`).join('\n')}
┃
┃ *📌 Nota:* Ya se actualizó a la última versión de Git
╰━━━━━━━━━━━━━━━━━━━━⬣`, m)
      await m.react('✅')
    } catch (e) {
      await conn.reply(m.chat, `
╭❗ *ERROR*
┃ Ocurrió un error al actualizar.
┃ 
┃ *🧨 Error:* 
┃ ${e.message}
╰━━━━━━━━━━━━⬣`, m)
      await m.react('❌')
    }
  }
}

handler.help = ['update']
handler.tags = ['owner']
handler.command = ['update', 'actualizar', 'fix', 'fixed'] 
handler.rowner = true

export default handler
