
let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let name = await conn.getName(m.sender)

    let text = `¡Hola! *@⁨𓆩‌۫᷼ ִֶָღܾ݉͢ғ꯭ᴇ꯭፝ℓɪ꯭ͨא𓆪⁩* soy *Makima ( OficialBot ).* 

╭━━I N F O-B O T━━
┃Creador: 𓆩‌۫᷼ ִֶָღܾ݉͢ғ꯭ᴇ꯭፝ℓɪ꯭ͨא𓆪
┃Tiempo activo: 00:01:26
┃Baileys: Multi device.
┃Base: Oficial.
┃Registros: 63
╰━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮INFO-USER
┃┈➤ Creador: Félix 
┃┈➤ Cliente: ${name}
┃┈➤ Rango: Nuv
┃┈➤ Nivel: 0
┃┈➤ País: Dominican Republic 🇩🇴
╰━━━━━━━━━━━━━

➪ 𝗟𝗜𝗦𝗧𝗔 
       ➪  𝗗𝗘 
           ➪ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮PRINCIPALES
┃┈➤ #estado
┃┈➤ #botreglas
┃┈➤ #menu
┃┈➤ #menu2
┃┈➤ #uptime
┃┈➤ #menulista
╰━━━━━━━━━━━━━

.       ╭ֹ┈ ⵿❀⵿ ┈╮ ㅤ
 ╭ֹ┈ ⵿❀⵿ ┈╮BUSCADORES
┃┈➤ #gitthubsearch
┃┈➤ #google [Búsqueda]
┃┈➤ #tiktoksearch
┃┈➤ #pinterest
┃┈➤ #imagen [querry]
╰━━━━━━━━━━━━━━━━━━

... (continúa con todas las demás secciones que tú ya configuraste)

> © ⍴᥆ᥕᥱrᥱძ ᑲᥡ Félix Manuel`

    await conn.sendMessage(m.chat, {
      image: { url: 'https://files.catbox.moe/0ro3o9.jpg' },
      caption: text,
      footer: '🧠 BLACK CLOVER SYSTEM ☘️',
      buttons: [
        { buttonId: `${_p}grupos`, buttonText: { displayText: '🌐 ＧＲＵＰＯＳ' }, type: 1 },
        { buttonId: `${_p}code`, buttonText: { displayText: '🕹 ＳＥＲＢＯＴ' }, type: 1 },
        { buttonId: `${_p}soporte`, buttonText: { displayText: '🛠️ ＳＯＰＯＲＴＥ' }, type: 1 }
      ],
      viewOnce: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ Error al mostrar el menú.', m)
  }
}

handler.help = ['menutest']
handler.tags = ['main']
handler.command = ['menutest']
handler.register = true
export default handler
