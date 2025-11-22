const datetimeEl = document.getElementById('datetime');
const scheduleBtn = document.getElementById('scheduleBtn');
const cancelBtn = document.getElementById('cancelBtn');
const statusEl = document.getElementById('status');
const shutdownNowBtn = document.getElementById('shutdownNowBtn');
const platformInfoEl = document.getElementById('platformInfo');
const minBtn = document.getElementById('minBtn');
const closeBtn = document.getElementById('closeBtn');
const langBtn = document.getElementById('langBtn');

if (minBtn) {
  minBtn.addEventListener('click', () => window.system.windowMinimize());
}
if (closeBtn) {
  closeBtn.addEventListener('click', () => window.system.windowClose());
}
if (langBtn) {
  langBtn.addEventListener('click', () => toggleLang());
}

let currentScheduleId = null;

(async function init() {
  const platform = await window.system.getPlatform();
  const lang = await window.system.getLang();
  currentLang = lang;
  
  const platformName = platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : platform;
  platformInfoEl.dataset.platform = platform;
  platformInfoEl.textContent = t('platformInfo', { platform: platformName });

  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  datetimeEl.value = formatForInput(now);
  
  updateUI();
})();

scheduleBtn.addEventListener('click', async () => {
  const value = datetimeEl.value;
  if (!value) {
    toast(t('toastSelectTime'));
    return;
  }
  const ts = Date.parse(value);
  if (isNaN(ts)) {
    toast(t('toastInvalidTime'));
    return;
  }
  if (ts <= Date.now()) {
    toast(t('toastFutureTime'));
    return;
  }
  try {
    const { id } = await window.system.scheduleShutdown(ts);
    currentScheduleId = id;
    statusEl.textContent = t('statusScheduled', { time: new Date(ts).toLocaleString() });
    cancelBtn.disabled = false;
  } catch (e) {
    toast(t('toastScheduleFailed'));
    console.error(e);
  }
});

cancelBtn.addEventListener('click', async () => {
  if (!currentScheduleId) return;
  const { success } = await window.system.cancelShutdown(currentScheduleId);
  if (success) {
    statusEl.textContent = t('statusCancelled');
    cancelBtn.disabled = true;
    currentScheduleId = null;
  } else {
    toast(t('toastCancelFailed'));
  }
});

shutdownNowBtn.addEventListener('click', async () => {
  statusEl.textContent = t('statusShuttingDown');
  await window.system.shutdownNow();
});

function formatForInput(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}

function toast(message) {
  statusEl.textContent = message;
}
