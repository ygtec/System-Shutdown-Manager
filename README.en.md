# System Shutdown Manager

A cross-platform shutdown scheduler for Windows and macOS, featuring a clean and elegant interface with bilingual support (Chinese/English).

## ✨ Features

- 🕐 **Scheduled Shutdown**: Set specific time for automatic shutdown
- ⚡ **Instant Shutdown**: One-click quick shutdown
- 🎨 **Beautiful UI**: Modern dark theme with elegant design
- 🌐 **Multi-language**: Chinese/English auto-detection and manual switching
- 🖥️ **System Tray**: Minimize to tray when closing, keep running in background
- 🔔 **Notifications**: System notifications for schedule set, cancel, and execution
- 📦 **Cross-platform**: Support for both Windows and macOS
- 🔄 **Auto-update**: Automatic upgrade overwrites old versions

## 🖼️ Interface Preview

The app features a vertical compact window design (420×720), fixed size, frameless with custom title bar:
- Top: App title + Language switch/Minimize/Hide buttons
- Main: Brand logo + Schedule settings + Instant shutdown
- Tray: Right-click menu for show/quit

### Application Screenshot

![English Interface Screenshot](en.png)

## 📋 System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 10.13 or later
- **Node.js**: v16.x or later (for development only)

## 🚀 Quick Start

### Development Mode

1. **Clone the repository**
```bash
git clone <repository-url>
cd "System Shutdown Manager"
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development mode**
```bash
npm run dev
```

The app will start in development mode with hot reload support.

### Build Installer

#### Windows Platform

Run on Windows:

```bash
npm run build:win
```

The installer will be generated at `dist/System-Shutdown-Manager-1.0.0.exe`

**Installer Features**:
- NSIS installer
- Chinese/English installation interface
- Customizable installation directory
- Auto-create desktop and start menu shortcuts
- Upgrade installation automatically overwrites old versions

#### macOS Platform

Run on macOS:

```bash
npm run build:mac
```

The installer will be generated at `dist/System Shutdown Manager-1.0.0.dmg`

**Note**: macOS packaging must be done on a macOS system. Code signing requires certificate configuration.

## 📁 Project Structure

```
System Shutdown Manager/
├── src/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script (IPC bridge)
│   └── renderer/
│       ├── index.html       # Main UI HTML
│       ├── renderer.js      # Renderer process logic
│       ├── styles.css       # UI styles
│       ├── i18n.js          # Internationalization
│       └── logo.svg         # App icon (SVG)
├── build/
│   ├── icons/
│   │   └── win/
│   │       └── icon.ico     # Windows icon (auto-generated)
│   └── installer.nsh        # NSIS custom install script
├── scripts/
│   └── gen-win-icon.js      # Windows icon generator
├── package.json             # Project config and dependencies
└── README.md                # Documentation
```

## 🛠️ Tech Stack

- **Framework**: Electron 31.x
- **Build Tool**: electron-builder
- **Icon Processing**: sharp + to-ico
- **Frontend**: Native HTML/CSS/JavaScript (no framework)
- **i18n**: Custom implementation

## 📝 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development mode |
| `npm run build` | Build for current platform |
| `npm run build:win` | Build Windows installer (NSIS) |
| `npm run build:mac` | Build macOS installer (DMG) |
| `npm run assets:win` | Generate Windows ICO from SVG |

## 🎯 User Guide

### Schedule Shutdown

1. Click the "Select shutdown time" picker to set a specific time
2. Click the "Schedule" button
3. Status indicator will show the scheduled time
4. **Important**: Keep the app running until the scheduled time

### Cancel Schedule

Click the "Cancel" button to cancel the scheduled shutdown.

### Instant Shutdown

Click the "⚡ Shutdown Now" button to immediately execute shutdown.

### Tray Features

- Click "×" on the top-right corner: Hide to system tray (not quit)
- Click tray icon: Show/hide window
- Right-click tray icon → Quit: Completely close the app

### Language Switch

Click the "🌐" button at the top-right corner to switch between Chinese and English. The app will remember your choice.

## ⚙️ Configuration

### Change App Version

Edit `package.json`:

```json
{
  "version": "1.0.0"
}
```

### Change App ID

Edit `build.appId` in `package.json`:

```json
{
  "build": {
    "appId": "com.example.system-shutdown-manager"
  }
}
```

### Custom Icon

Replace `src/renderer/logo.svg`, then run `npm run assets:win` to regenerate the icon.

## 🔧 Troubleshooting

### Windows Icon Not Updated

- Clean dist directory: Delete the `dist` folder
- Regenerate icon: `npm run assets:win`
- Rebuild: `npm run build:win`
- Clear system icon cache: Restart Windows Explorer

### Installation Prompt Already Installed

New versions will automatically detect and overwrite old versions, no manual uninstallation needed.

### Tray Icon Not Showing

- Windows: Ensure `build/icons/win/icon.ico` exists
- macOS: Requires `.icns` format icon (to be configured)

### Scheduled Shutdown Not Executed

- Ensure the app is running (tray icon visible)
- Do not shut down the system or enter sleep mode
- Check if the scheduled time is correct

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📧 Contact

For questions or suggestions, please submit an Issue.
