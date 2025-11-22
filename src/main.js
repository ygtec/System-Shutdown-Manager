const { app, BrowserWindow, ipcMain, Notification, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

let mainWindow = null;
let tray = null;
const schedules = new Map(); // id -> timeout
let nextScheduleId = 1;
let currentLang = 'zh'; // 默认中文

const i18n = {
  zh: {
    appName: 'System Shutdown Manager',
    trayTooltip: '定时关机管理器',
    trayShow: '显示窗口',
    trayQuit: '退出应用',
    notifyScheduled: '计划已设置',
    notifyScheduledMsg: '将在 {time} 执行关机',
    notifyCancelled: '计划已取消',
    notifyCancelledMsg: '已取消计划',
    notifyShutdown: '正在关机',
    notifyShutdownMsg: '达到计划时间，系统将立即关机',
    notifyNow: '立即关机',
    notifyNowMsg: '即将执行关机指令'
  },
  en: {
    appName: 'System Shutdown Manager',
    trayTooltip: 'Shutdown Scheduler',
    trayShow: 'Show Window',
    trayQuit: 'Quit',
    notifyScheduled: 'Schedule Set',
    notifyScheduledMsg: 'Shutdown scheduled at {time}',
    notifyCancelled: 'Schedule Cancelled',
    notifyCancelledMsg: 'Schedule cancelled',
    notifyShutdown: 'Shutting Down',
    notifyShutdownMsg: 'Scheduled time reached, system will shutdown now',
    notifyNow: 'Shutdown Now',
    notifyNowMsg: 'Shutdown command will execute now'
  }
};

function t(key, params = {}) {
  let text = i18n[currentLang][key] || i18n['zh'][key] || key;
  Object.keys(params).forEach(k => {
    text = text.replace(`{${k}}`, params[k]);
  });
  return text;
}

function createTray() {
  const iconPath = path.join(__dirname, '..', 'build', 'icons', 'win', 'icon.ico');
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon.resize({ width: 16, height: 16 }));
  tray.setToolTip(t('trayTooltip'));
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: t('trayShow'),
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: t('trayQuit'),
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 720,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    minimizable: true,
    frame: false,
    title: 'System Shutdown Manager',
    icon: path.join(__dirname, '..', 'build', 'icons', 'win', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function shutdownNow() {
  const platform = os.platform();
  if (platform === 'win32') {
    exec('shutdown /s /t 0', (error) => {
      if (error) console.error('Shutdown error:', error);
    });
  } else if (platform === 'darwin') {
    const cmd = 'osascript -e "tell application \"System Events\" to shut down"';
    exec(cmd, (error) => {
      if (error) console.error('Shutdown error:', error);
    });
  } else {
    exec('shutdown -h now', (error) => {
      if (error) console.error('Shutdown error:', error);
    });
  }
}

function scheduleShutdownAt(timestamp) {
  const delay = Math.max(0, timestamp - Date.now());
  const id = nextScheduleId++;
  const timeout = setTimeout(() => {
    notify(t('notifyShutdown'), t('notifyShutdownMsg'));
    shutdownNow();
    schedules.delete(id);
  }, delay);
  schedules.set(id, timeout);
  const timeStr = new Date(timestamp).toLocaleString();
  notify(t('notifyScheduled'), t('notifyScheduledMsg', { time: timeStr }));
  return id;
}

function cancelShutdown(id) {
  const timeout = schedules.get(id);
  if (timeout) {
    clearTimeout(timeout);
    schedules.delete(id);
    notify(t('notifyCancelled'), t('notifyCancelledMsg'));
    return true;
  }
  return false;
}

function notify(title, body) {
  try {
    new Notification({ title, body }).show();
  } catch (e) {
    console.warn('Notification failed:', e);
  }
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.example.system-shutdown-manager');
  
  // 检测系统语言
  const locale = app.getLocale();
  if (locale.startsWith('zh')) {
    currentLang = 'zh';
  } else {
    currentLang = 'en';
  }
  
  createTray();
  createWindow();

  ipcMain.handle('get-platform', () => os.platform());

  ipcMain.handle('shutdown-now', () => {
    notify(t('notifyNow'), t('notifyNowMsg'));
    shutdownNow();
    return true;
  });

  ipcMain.handle('schedule-shutdown', (event, timestamp) => {
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      throw new Error('Invalid timestamp');
    }
    const id = scheduleShutdownAt(timestamp);
    return { id };
  });

  ipcMain.handle('cancel-shutdown', (event, id) => {
    return { success: cancelShutdown(id) };
  });

  ipcMain.handle('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window-close', () => {
    if (mainWindow) mainWindow.hide();
  });

  ipcMain.handle('get-lang', () => currentLang);

  ipcMain.handle('set-lang', (event, lang) => {
    if (i18n[lang]) {
      currentLang = lang;
      // 更新托盘菜单
      if (tray) {
        const contextMenu = Menu.buildFromTemplate([
          {
            label: t('trayShow'),
            click: () => {
              if (mainWindow) {
                mainWindow.show();
                mainWindow.focus();
              }
            }
          },
          { type: 'separator' },
          {
            label: t('trayQuit'),
            click: () => {
              app.isQuiting = true;
              app.quit();
            }
          }
        ]);
        tray.setContextMenu(contextMenu);
        tray.setToolTip(t('trayTooltip'));
      }
      return currentLang;
    }
    return currentLang;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
