import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'


global.owner = [
  ['573133374132', '💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 ', true],
]


global.mods = []
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'YuriBotMD'
global.namebot ='jim wo sung'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

global.packname = '𝙎𝙃𝙊𝙔𝙊 𝙃𝙄𝙉𝘼𝙏𝘼 ოძ  𝘽 ꂦ Ꮏ'
global.namebot = '𝙎𝙃𝙊𝙔𝙊 𝙃𝙄𝙉𝘼𝙏𝘼 ოძ  𝘽 ꂦ Ꮏ'
global.author = 'HAROLD Y 💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 '


global.namecanal = '𝙎𝙃𝙊𝙔𝙊 𝙃𝙄𝙉𝘼𝙏𝘼 ოძ  𝘽 ꂦ Ꮏ'
global.canal = 'https://whatsapp.com/channel/0029Vb6MFShKGGGBWePRFc0U'
global.idcanal = '120363402552103115@newsletter'

global.ch = {
ch1: '120363402552103115@newsletter',
}

global.multiplier = 69 
global.maxwarn = '2'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
