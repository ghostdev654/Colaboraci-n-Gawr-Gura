
<div align="center">

# 🦈 Gawr Gura WhatsApp Bot 🌊

<img src="https://i.imgur.com/VYBYeUJ.gif" alt="Gawr Gura" width="300"/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Bot-green.svg?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg?style=for-the-badge&logo=javascript)](https://javascript.info/)
[![Replit](https://img.shields.io/badge/Replit-Ready-orange.svg?style=for-the-badge&logo=replit)](https://replit.com/)

*Un bot de WhatsApp kawaii inspirado en Gawr Gura de Hololive 🦈*

---

## ✨ Características Principales

</div>

### 🎮 **Juegos y Entretenimiento**
- 🎲 **Dados virtuales** - Lanza dados con stickers kawaii
- 🎰 **Ruleta diaria** - Gana premios únicos (2% de probabilidad)
- 🏆 **Rankings dinámicos** - TOP 10 de cualquier tema
- 🌸 **Waifus aleatorias** - Imágenes anime de alta calidad

### 👥 **Gestión de Grupos**
- 🔒 **Control de grupo** - Abrir/cerrar grupos con temporizador
- 👋 **Bienvenidas temporales** - Mensajes personalizables por 1 minuto
- 📋 **Sistema de fichas** - Presentaciones personalizadas
- 🏷️ **Menciones masivas** - Invocar a todos los miembros
- ⚡ **Administración avanzada** - Kick, promote, demote y más

### 🛠️ **Herramientas Útiles**
- 📱 **Descargas multimedia** - YouTube, TikTok, Instagram
- 🖼️ **Procesamiento de imágenes** - HD, stickers, conversiones
- 🔍 **Búsquedas inteligentes** - Pinterest, imágenes, música
- 🌐 **Traductor automático** - Múltiples idiomas
- 📊 **Información de grupos** - Inspección detallada

### 🤖 **Inteligencia Artificial**
- 🎨 **DALL-E Integration** - Generación de imágenes IA
- 💬 **Chat inteligente** - Respuestas contextuales
- 🔊 **Text-to-Speech** - Convierte texto a audio

---

<div align="center">

## 🚀 Instalación Rápida en Replit

</div>

### 📋 **Prerrequisitos**
- Cuenta de [Replit](https://replit.com/)
- Número de WhatsApp para el bot
- Conexión a internet estable

### 🔧 **Pasos de Instalación**

1. **Crear un nuevo Repl**
   ```bash
   # En Replit, crea un nuevo proyecto Node.js
   # Importa este repositorio o sube los archivos
   ```

2. **Configurar variables de entorno**
   - Ve a la pestaña **Secrets** en Replit
   - Agrega las siguientes variables:
   ```
   PREFIX = .
   OWNER_NUMBER = 1234567890
   BOT_NAME = Gawr Gura Bot
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Configurar el bot**
   ```javascript
   // Edita config.js con tus datos
   global.owner = [['1234567890', 'Tu Nombre', true]]
   global.botname = 'Gawr Gura Bot'
   ```

5. **Ejecutar el bot**
   ```bash
   npm start
   ```

6. **Escanear código QR**
   - Se generará un código QR en la consola
   - Escanéalo con WhatsApp Web
   - ¡El bot estará listo! 🎉

---

<div align="center">

## 📚 Comandos Principales

</div>

### 🎮 **Entretenimiento**
| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `.dado` | Lanza un dado virtual | `.dado` |
| `.ruleta` | Gira la ruleta (1 vez/día) | `.ruleta` |
| `.top` | Crea rankings divertidos | `.top guapos` |
| `.rw` | Waifu aleatoria | `.rw` |

### 👥 **Administración**
| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `.cerrar` | Cierra el grupo | `.cerrar` |
| `.abrir` | Abre el grupo | `.abrir` |
| `.cerrartemp` | Cierra por tiempo limitado | `.cerrartemp 5m` |
| `.kick` | Expulsa miembros | `.kick @usuario` |
| `.promote` | Da admin | `.promote @usuario` |

### 📋 **Utilidades**
| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `.ficha` | Carta de presentación | `.ficha Hola soy Gura` |
| `.bienvenida` | Activa bienvenidas (1min) | `.bienvenida ¡Hola!` |
| `.invocar` | Menciona a todos | `.invocar Reunión` |
| `.play` | Descarga música | `.play nombre canción` |

### 🛠️ **Herramientas**
| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `.sticker` | Crea stickers | `.sticker` (con imagen) |
| `.hd` | Mejora calidad de imagen | `.hd` (con imagen) |
| `.translate` | Traduce texto | `.translate es hello` |
| `.ss` | Captura de pantalla web | `.ss google.com` |

---

<div align="center">

## ⚙️ Configuración Avanzada

</div>

### 🔐 **Variables de Entorno (Secrets)**
```env
# Bot Configuration
PREFIX=.
OWNER_NUMBER=1234567890
BOT_NAME=Gawr Gura Bot

# API Keys (Opcional)
OPENAI_KEY=your_openai_key
DEEPAI_KEY=your_deepai_key

# Database (Opcional)
MONGODB_URI=your_mongodb_uri
```

### 📁 **Estructura del Proyecto**
```
├── 📂 plugins/          # Comandos del bot
│   ├── 🎮 game-*.js     # Juegos
│   ├── 👥 grupo-*.js    # Gestión de grupos
│   ├── 🛠️ tools-*.js    # Herramientas
│   └── 📱 downloader-*.js # Descargas
├── 📂 lib/              # Librerías principales
├── 📂 database/         # Base de datos local
├── 📂 storage/          # Archivos temporales
├── ⚙️ config.js         # Configuración principal
├── 🚀 main.js           # Archivo principal
└── 📦 package.json      # Dependencias
```

### 🔧 **Personalización**
```javascript
// En config.js - Personaliza mensajes
global.wm = 'Gawr Gura Bot 🦈'
global.footer = 'Powered by Atlantis'
global.packname = 'Gura Stickers'
global.author = '@Gawr_Gura'

// Cambiar prefijos
global.prefix = ['.', '/', '#', '!']
```

---

<div align="center">

## 🤝 Contribución

</div>

### 📝 **Cómo Contribuir**
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 🐛 **Reportar Bugs**
- Usa las [Issues](https://github.com/tu-repo/issues) de GitHub
- Incluye pasos para reproducir el error
- Menciona tu versión de Node.js y sistema operativo

---

<div align="center">

## 📊 Estadísticas del Proyecto

![Languages](https://img.shields.io/github/languages/top/tu-usuario/tu-repo?style=for-the-badge)
![Size](https://img.shields.io/github/repo-size/tu-usuario/tu-repo?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/tu-usuario/tu-repo?style=for-the-badge)
![License](https://img.shields.io/github/license/tu-usuario/tu-repo?style=for-the-badge)

## 💝 Donaciones

Si este proyecto te fue útil, considera apoyar el desarrollo:

[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/tu-paypal)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/tu-kofi)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

---

### 🦈 Hecho por Yo Soy Yo

<img src="https://i.imgur.com/rKVlUIL.gif" alt="Gawr Gura Wave" width="200"/>

*"A~" - Gawr Gura, probably*

</div>

---

<div align="center">

### 🔗 Enlaces Útiles

[📖 Documentación](docs/) • [🐛 Reportar Bug](issues/) • [💬 Discord](https://discord.gg) • [📱 Telegram](https://t.me)

**⭐ Si te gustó el proyecto, dale una estrella en GitHub!**

</div>
