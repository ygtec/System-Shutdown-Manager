const i18n = {
  zh: {
    appTitle: 'System Shutdown Manager',
    appSubtitle: '简洁美观的定时定点关机工具',
    labelTime: '⏰ 选择关机时间',
    btnSchedule: '设置计划',
    btnCancel: '取消计划',
    btnShutdownNow: '⚡ 立即关机',
    statusIdle: '📌 尚未设置计划',
    statusScheduled: '✅ 已设置：将在 {time} 关机',
    statusCancelled: '📌 已取消计划',
    statusShuttingDown: '⚡ 即将立刻关机...',
    hintKeepRunning: '🔔 提示：请确保应用在计划时间前保持运行',
    platformInfo: '当前平台：{platform}',
    toastSelectTime: '请选择一个时间',
    toastInvalidTime: '时间格式不正确',
    toastFutureTime: '请选择未来时间',
    toastScheduleFailed: '❌ 设置计划失败',
    toastCancelFailed: '❌ 取消失败，可能计划不存在',
    langSwitch: '🌐'
  },
  en: {
    appTitle: 'System Shutdown Manager',
    appSubtitle: 'Simple & elegant shutdown scheduler',
    labelTime: '⏰ Select shutdown time',
    btnSchedule: 'Schedule',
    btnCancel: 'Cancel',
    btnShutdownNow: '⚡ Shutdown Now',
    statusIdle: '📌 No schedule set',
    statusScheduled: '✅ Scheduled: Shutdown at {time}',
    statusCancelled: '📌 Schedule cancelled',
    statusShuttingDown: '⚡ Shutting down now...',
    hintKeepRunning: '🔔 Keep app running until scheduled time',
    platformInfo: 'Platform: {platform}',
    toastSelectTime: 'Please select a time',
    toastInvalidTime: 'Invalid time format',
    toastFutureTime: 'Please select a future time',
    toastScheduleFailed: '❌ Failed to schedule',
    toastCancelFailed: '❌ Failed to cancel',
    langSwitch: '🌐'
  }
};

let currentLang = 'zh';

function t(key, params = {}) {
  let text = i18n[currentLang][key] || i18n['zh'][key] || key;
  Object.keys(params).forEach(k => {
    text = text.replace(`{${k}}`, params[k]);
  });
  return text;
}

function updateUI() {
  document.querySelector('header h1').textContent = t('appTitle');
  document.querySelector('.subtitle').textContent = t('appSubtitle');
  document.querySelector('label[for="datetime"]').textContent = t('labelTime');
  document.getElementById('scheduleBtn').textContent = t('btnSchedule');
  document.getElementById('cancelBtn').textContent = t('btnCancel');
  document.getElementById('shutdownNowBtn').textContent = t('btnShutdownNow');
  document.querySelector('.hint').textContent = t('hintKeepRunning');
  
  const platform = platformInfoEl.dataset.platform;
  if (platform) {
    const platformName = platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : platform;
    platformInfoEl.textContent = t('platformInfo', { platform: platformName });
  }
  
  if (!currentScheduleId) {
    statusEl.textContent = t('statusIdle');
  }
}

async function toggleLang() {
  const newLang = currentLang === 'zh' ? 'en' : 'zh';
  currentLang = newLang;
  await window.system.setLang(newLang);
  updateUI();
}
