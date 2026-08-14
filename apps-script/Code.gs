const CONFIG = {
  // แก้ 2 บรรทัดนี้หลังเปิด GitHub Pages แล้ว
  GITHUB_APP_URL: 'https://YOUR_USERNAME.github.io/our-memories/app.html',
  GITHUB_DATA_URL: 'https://YOUR_USERNAME.github.io/our-memories/data.json',

  // cache ของ Apps Script เพื่อลดการโหลดซ้ำ
  APP_HTML_CACHE_SECONDS: 60,
  DATA_CACHE_SECONDS: 120
};

function doGet() {
  const html = fetchTextWithCache_(
    'our_memories_app_html',
    CONFIG.GITHUB_APP_URL,
    CONFIG.APP_HTML_CACHE_SECONDS
  );

  return HtmlService
    .createHtmlOutput(html)
    .setTitle('Our Memories')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function verifyPassword(pin) {
  const value = String(pin || '').trim();

  if (!/^\d{6}$/.test(value)) {
    return { ok: false, message: 'Please enter all 6 digits ♡' };
  }

  const savedPin = PropertiesService
    .getScriptProperties()
    .getProperty('APP_PIN');

  if (!savedPin) {
    return {
      ok: false,
      message: 'APP_PIN has not been configured in Script Properties.'
    };
  }

  if (value === String(savedPin).trim()) {
    return { ok: true };
  }

  return { ok: false, message: 'That password is not ours ♡' };
}

function getAppData() {
  const jsonText = fetchTextWithCache_(
    'our_memories_data_json',
    CONFIG.GITHUB_DATA_URL,
    CONFIG.DATA_CACHE_SECONDS
  );

  try {
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error('data.json is not valid JSON: ' + err.message);
  }
}

function clearAppCache() {
  CacheService.getScriptCache().removeAll([
    'our_memories_app_html',
    'our_memories_data_json'
  ]);
  return 'Cache cleared';
}

function testGitHubConnection() {
  const app = UrlFetchApp.fetch(CONFIG.GITHUB_APP_URL, {
    muteHttpExceptions: true,
    followRedirects: true
  });

  const data = UrlFetchApp.fetch(CONFIG.GITHUB_DATA_URL, {
    muteHttpExceptions: true,
    followRedirects: true
  });

  return {
    appStatus: app.getResponseCode(),
    dataStatus: data.getResponseCode(),
    appUrl: CONFIG.GITHUB_APP_URL,
    dataUrl: CONFIG.GITHUB_DATA_URL
  };
}

function fetchTextWithCache_(cacheKey, url, seconds) {
  if (!url || url.indexOf('YOUR_USERNAME') !== -1) {
    throw new Error(
      'Please replace YOUR_USERNAME in Code.gs with your real GitHub username first.'
    );
  }

  const cache = CacheService.getScriptCache();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true
  });

  const status = response.getResponseCode();
  if (status < 200 || status >= 300) {
    throw new Error('GitHub returned HTTP ' + status + ' for ' + url);
  }

  const text = response.getContentText('UTF-8');
  cache.put(cacheKey, text, seconds);
  return text;
}
