import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (global.db.data == null) await global.loadDatabase()

    try {
        m = smsg(this, m) || m
        if (!m) return
        m.exp = 0
        m.limit = false

        try {
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}

            user = global.db.data.users[m.sender]  // actualizar referencia

            if (!isNumber(user.exp)) user.exp = 0
            if (!isNumber(user.limit)) user.limit = 10
            if (!('premium' in user)) user.premium = false
            if (!user.premium) user.premiumTime = 0
            if (!('registered' in user)) user.registered = false

            if (!user.registered) {
                if (!('name' in user)) user.name = m.name
                if (!isNumber(user.age)) user.age = -1
                if (!isNumber(user.regTime)) user.regTime = -1
            }

            if (!isNumber(user.afk)) user.afk = -1
            if (!('afkReason' in user)) user.afkReason = ''
            if (!('banned' in user)) user.banned = false
            if (!('useDocument' in user)) user.useDocument = false
            if (!isNumber(user.level)) user.level = 0
            if (!isNumber(user.bank)) user.bank = 0

            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}

            chat = global.db.data.chats[m.chat]  // actualizar referencia

            if (!('isBanned' in chat)) chat.isBanned = false
            if (!('bienvenida' in chat)) chat.bienvenida = true 
            if (!('antiLink' in chat)) chat.antiLink = false
            if (!('onlyLatinos' in chat)) chat.onlyLatinos = false
            if (!('nsfw' in chat)) chat.nsfw = false
            if (!isNumber(chat.expired)) chat.expired = 0

            var settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}

            settings = global.db.data.settings[this.user.jid]  // actualizar referencia

            if (!('self' in settings)) settings.self = false
            if (!('autoread' in settings)) settings.autoread = false
        } catch (e) {
            console.error(e)
        }

        if (opts['nyimak']) return
        if (!m.fromMe && opts['self']) return
        if (opts['swonly'] && m.chat !== 'status@broadcast') return
        if (typeof m.text !== 'string') m.text = ''

        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)]
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user?.premium == true

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys) return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix

        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {}
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false
        const isBotAdmin = bot?.admin || false

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin) continue
            if (plugin.disabled) continue

            const __filename = join(___dirname, name)

            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, { chatUpdate, __dirname: ___dirname, __filename })
                } catch (e) {
                    console.error(e)
                }
            }

            if (!opts['restrict'] && plugin.tags && plugin.tags.includes('admin')) continue

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix

            let match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])

            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match, conn: this, participants, groupMetadata, user, bot,
                    isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems,
                    chatUpdate, __dirname: ___dirname, __filename
                })) continue
            }

            if (typeof plugin !== 'function') continue

            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                        plugin.command.some(cmd => cmd instanceof RegExp ?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ?
                            plugin.command === command :
                            false

                if (!isAccept) continue

                m.plugin = name

                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    let setting = global.db.data.settings[this.user.jid]
                    if (name != 'group-unbanchat.js' && chat?.isBanned) return
                    if (name != 'owner-unbanuser.js' && user?.banned) return
                    if (name != 'owner-unbanbot.js' && setting?.banned) return
                }

                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) {
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) {
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) {
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) {
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) {
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) {
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) {
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) {
                    fail('unreg', m, this)
                    continue
                }

                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
                if (xp > 200) m.reply('chirrido -_-')
                else m.exp += xp

                if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    conn.reply(m.chat, `Se agotaron tus *Chocos*`, m, rcanal)
                    continue
                }

                let extra = {
                    match, usedPrefix, noPrefix, _args, args, command, text, conn: this,
                    participants, groupMetadata, user, bot,
                    isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, isPrems,
                    chatUpdate, __dirname: ___dirname, __filename
                }

                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems) m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit) conn.reply(m.chat, `Utilizaste *${+m.limit}* ✿`, m, rcanal)
                }

                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
        }

        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            if (m.plugin) {
                let now = +new Date()
                let stat = stats[m.plugin] || {
                    total: 0,
                    success: 0,
                    last: 0,
                    lastSuccess: 0
                }

                stat.total = (stat.total || 0) + 1
                stat.last = now
                if (m.error == null) {
                    stat.success = (stat.success || 0) + 1
                    stat.lastSuccess = now
                }

                stats[m.plugin] = stat
            }
        }

        try {
            if (!opts['noprint']) {
                const print = await import(`./lib/print.js`)
                await print.default(m, this)
            }
        } catch (e) {
            console.log(m, m.quoted, e)
        }

        const settingsREAD = global.db.data.settings[this.user.jid] || {}
        if (opts['autoread']) await this.readMessages([m.key])
        if (settingsREAD.autoread) await this.readMessages([m.key])
    }
}

global.dfail = (type, m, conn, usedPrefix) => {
    const mensajes = {
        rowner: '❌ *𝚂𝚘𝚕𝚘 𝚎𝚕 𝙾𝚠𝚗𝚎𝚛 𝚍𝚎𝚕 𝚋𝚘𝚝 𝚙𝚞𝚎𝚍𝚎 𝚞𝚝𝚒𝚕𝚒𝚣𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘.*',
        owner: '❌ *𝚂𝚘𝚕𝚘 𝚎𝚕 𝚙𝚛𝚘𝚙𝚒𝚎𝚝𝚊𝚛𝚒𝚘 𝚍𝚎𝚕 𝚂𝚞𝚋-𝙱𝚘𝚝 𝚙𝚞𝚎𝚍𝚎 𝚞𝚝𝚒𝚕𝚒𝚣𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘.*',
        mods: '❌ *𝚂𝚘𝚕𝚘 𝚕𝚘𝚜 𝙼𝚘𝚍𝚎𝚛𝚊𝚍𝚘𝚛𝚎𝚜 𝚙𝚞𝚎𝚍𝚎𝚗 𝚞𝚜𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘.*',
        premium: '❌ *𝚂𝚘𝚕𝚘 𝚞𝚜𝚞𝚊𝚛𝚒𝚘𝚜 𝙿𝚛𝚎𝚖𝚒𝚞𝚖 𝚙𝚞𝚎𝚍𝚎𝚗 𝚞𝚜𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘.*',
        group: '❌ *𝙴𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚜𝚘𝚕𝚘 𝚙𝚞𝚎𝚍𝚎 𝚞𝚜𝚊𝚛𝚜𝚎 𝚎𝚗 𝚐𝚛𝚞𝚙𝚘𝚜.*',
        private: '❌ *𝚂𝚘𝚕𝚘 𝚎𝚗 𝙲𝚑𝚊𝚝 𝙿𝚛𝚒𝚟𝚊𝚍𝚘 𝚙𝚞𝚎𝚍𝚎𝚜 𝚞𝚜𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘.*',
        admin: '❌ *𝙴𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚜𝚘𝚕𝚘 𝚙𝚞𝚎𝚍𝚎 𝚜𝚎𝚛 𝚞𝚝𝚒𝚕𝚒𝚣𝚊𝚍𝚘 𝚙𝚘𝚛 𝙰𝚍𝚖𝚒𝚗𝚜.*',
        botAdmin: '❌ *𝙿𝚊𝚛𝚊 𝚎𝚓𝚎𝚌𝚞𝚝𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘, 𝚎𝚜 𝚗𝚎𝚌𝚎𝚜𝚊𝚛𝚒𝚘 𝚚𝚞𝚎 𝚜𝚎𝚊 𝙰𝚍𝚖𝚒𝚗.*',
        unreg: '❌ *𝙳𝚎𝚋𝚎𝚜 𝚎𝚜𝚝𝚊𝚛 𝚁𝚎𝚐𝚒𝚜𝚝𝚛𝚊𝚍𝚘 𝚙𝚊𝚛𝚊 𝚞𝚜𝚊𝚛 𝚎𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘.*',
        restrict: '❌ *𝙴𝚜𝚝𝚎 𝚌𝚘𝚖𝚊𝚗𝚍𝚘 𝚎𝚜𝚝á 𝚍𝚎𝚜𝚑𝚊𝚋𝚒𝚕𝚒𝚝𝚊𝚍𝚘.*'
    }

    const msg = mensajes[type]
    if (msg) return conn.reply(m.chat, msg, m, rcanal).then(() => m.react('❌'))
}

const file = fileURLToPath(import.meta.url)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("Se actualizo 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
