import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'


global.owner = [
  ['5491151545427', '｢Owner｣メ Ġᶏmԑя', true],
  ['573133374132', '💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 ', true],
]


global.mods = []
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.vs = '2.2.0'
global.nameqr = 'YuriBotMD'
global.namebot ='Gawr Gura'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

global.packname = 'Gawr Gura'
global.namebot = 'Gawr Gura'
global.author = '💖💝 Y⃟o⃟ S⃟o⃟y⃟ Y⃟o⃟ 💝 💖 '


global.namecanal = ''
global.canal = ''
global.idcanal = ''

global.ch = {
ch1: '',
}

global.multiplier = 69 
global.maxwarn = '2'


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
