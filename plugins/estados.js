const handler = async (m, { conn, text }) => {
  let nuevoEstado = text || (m.quoted && m.quoted.text)

  if (!nuevoEstado) throw '*⚠️ Escribe el texto o responde a un mensaje con el texto que quieras poner como descripción del bot.*'

  try {
    await conn.updateProfileStatus(nuevoEstado)
    m.reply(`✅ La descripción del perfil fue actualizada correctamente:\n\n"${nuevoEstado}"`)
  } catch (e) {
    console.error(e)
    throw '❌ No se pudo actualizar la descripción. Asegúrate de que el número del bot esté activo y no tenga restricciones.'
  }
}

handler.help = ['descripcion <texto>']
handler.tags = ['herramientas']
handler.command = /^descripcion$/i
handler.owner = true // solo el owner puede cambiarlo (opcional)

export default handler
