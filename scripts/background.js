const PUBLIC_BLOCKLIST_URL = 'https://raw.githubusercontent.com/your-repo/BookLens/main/data/public_blocklist.json';

chrome.runtime.onInstalled.addListener(() => {
  fetchAndCachePublicBlocklist();
  // Set up an alarm to update the list daily
  if (chrome.alarms) {
    chrome.alarms.create('updatePublicBlocklist', { periodInMinutes: 60 * 24 });
  } else {
    console.warn("BookLens: 'alarms' permission is missing or not loaded yet.");
  }
});

if (chrome.alarms) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'updatePublicBlocklist') {
      fetchAndCachePublicBlocklist();
    }
  });
}

async function fetchAndCachePublicBlocklist() {
  try {
    // In a real scenario, we'd fetch from PUBLIC_BLOCKLIST_URL
    // For now, let's simulate with a local fetch or just use the local data
    const response = await fetch(chrome.runtime.getURL('data/public_blocklist.json'));
    const data = await response.json();
    
    await chrome.storage.local.set({ 'publicBlocklist': data });
    console.log('Public blocklist updated and cached');
  } catch (error) {
    console.error('Failed to fetch public blocklist:', error);
  }
}