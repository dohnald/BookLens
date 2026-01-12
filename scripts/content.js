let blocklist = {
  publishers: [],
  authors: []
};

async function init() {
  // Load user blocklist
  const savedBlocklist = await utils.storage.get('blocklist');
  if (savedBlocklist) {
    blocklist = savedBlocklist;
  }
  
  // Load and merge public blocklist
  const localData = await new Promise(resolve => {
    chrome.storage.local.get(['publicBlocklist'], (result) => {
      resolve(result.publicBlocklist);
    });
  });

  if (localData) {
    if (localData.publishers) {
      blocklist.publishers = [...new Set([...blocklist.publishers, ...localData.publishers])];
    }
    if (localData.authors) {
      blocklist.authors = [...new Set([...blocklist.authors, ...localData.authors])];
    }
  }
  
  utils.log('Initialized with merged blocklist:', blocklist);
  
  const site = getSiteType();
  if (site) {
    applyFiltering(site);
    setupObserver(site);
  }
}

function getSiteType() {
  const host = window.location.host;
  if (host.includes('aladin.co.kr')) return 'aladin';
  if (host.includes('yes24.com')) return 'yes24';
  if (host.includes('kyobobook.co.kr')) return 'kyobobook';
  return null;
}

function applyFiltering(site) {
  const selectors = SELECTORS[site];
  if (!selectors) return;

  const items = document.querySelectorAll(selectors.listItems);
  items.forEach(item => {
    processItem(item, site, selectors);
  });
}

function processItem(item, site, selectors) {
  if (item.classList.contains('booklens-processed')) return;
  
  const titleEl = item.querySelector(selectors.title);
  const titleText = titleEl ? titleEl.textContent.trim() : '제목 없음';
  
  const publisherEl = item.querySelector(selectors.publisher);
  const publisherName = publisherEl ? publisherEl.textContent.trim() : null;

  const authorEl = item.querySelector(selectors.author);
  const authorName = authorEl ? authorEl.textContent.trim() : null;
  const fullAuthorText = authorEl ? authorEl.textContent.trim() : '저자 미상';
  
  // Filtering Logic
  let isBlocked = false;
  let blockReason = '';

  // 1. Publisher Filtering
  if (publisherName) {
    const isPublisherBlocked = blocklist.publishers.includes(publisherName);
    injectControlButton(publisherEl, publisherName, 'publisher', isPublisherBlocked);
    
    if (isPublisherBlocked) {
      isBlocked = true;
      blockReason = `🚫 [${publisherName}]`;
    }
  }

  // 2. Author Filtering
  if (authorName) {
    const isAuthorBlocked = blocklist.authors.includes(authorName);
    injectControlButton(authorEl, authorName, 'author', isAuthorBlocked);
    
    if (isAuthorBlocked && !isBlocked) {
      isBlocked = true;
      blockReason = `🚫 [${authorName}]`;
    }
  }

  // Apply Block
  if (isBlocked) {
    collapseItem(item, blockReason, titleText, fullAuthorText);
  }

  item.classList.add('booklens-processed');
}

function injectControlButton(targetEl, name, type, isBlocked) {
  const nextSibling = targetEl.nextElementSibling;
  if (nextSibling && nextSibling.classList.contains('booklens-control-btn')) {
    updateButtonState(nextSibling, name, type, isBlocked);
    return;
  }
  
  const btn = document.createElement('button');
  btn.className = 'booklens-control-btn';
  targetEl.after(btn);
  
  updateButtonState(btn, name, type, isBlocked);
}

function updateButtonState(btn, name, type, isBlocked) {
  btn.textContent = isBlocked ? '✅' : '🚫';
  btn.title = isBlocked ? `${name} 차단 해제` : `${name} 차단하기`;
  btn.className = `booklens-control-btn ${isBlocked ? 'unblock' : 'block'}`;
  btn.dataset.name = name;
  btn.dataset.type = type;
  
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBlocked) {
      if (confirm(`'${name}' 차단을 해제하시겠습니까?`)) {
        toggleBlock(name, type, false);
      }
    } else {
      if (confirm(`'${name}'(을)를 차단 목록에 추가하시겠습니까?`)) {
        toggleBlock(name, type, true);
      }
    }
  };
}

async function toggleBlock(name, type, shouldBlock) {
  const key = type === 'publisher' ? 'publishers' : 'authors';
  
  if (shouldBlock) {
    if (!blocklist[key].includes(name)) {
      blocklist[key].push(name);
    }
  } else {
    blocklist[key] = blocklist[key].filter(item => item !== name);
  }
  
  await utils.storage.set('blocklist', blocklist);
  utils.log(`${shouldBlock ? 'Added' : 'Removed'} ${name} from ${key} blocklist`);
  
  refreshAllItems();
}

function refreshAllItems() {
  const site = getSiteType();
  if (!site) return;
  
  const selectors = SELECTORS[site];
  const items = document.querySelectorAll(selectors.listItems);
  
  items.forEach(item => {
    const titleEl = item.querySelector(selectors.title);
    const titleText = titleEl ? titleEl.textContent.trim() : '제목 없음';

    const publisherEl = item.querySelector(selectors.publisher);
    const publisherName = publisherEl ? publisherEl.textContent.trim() : null;
    
    const authorEl = item.querySelector(selectors.author);
    const authorName = authorEl ? authorEl.textContent.trim() : null;
    const fullAuthorText = authorEl ? authorEl.textContent.trim() : '저자 미상';

    let shouldBlock = false;
    let blockReason = '';
    
    // Check Publisher
    const isPublisherBlocked = publisherName && blocklist.publishers.includes(publisherName);
    if (publisherEl) {
       let sibling = publisherEl.nextElementSibling;
       while(sibling) {
         if (sibling.classList.contains('booklens-control-btn') && sibling.dataset.type === 'publisher') {
            updateButtonState(sibling, publisherName, 'publisher', isPublisherBlocked);
            break;
         }
         sibling = sibling.nextElementSibling;
       }
    }

    if (isPublisherBlocked) {
      shouldBlock = true;
      blockReason = `🚫 [${publisherName}]`;
    }

    // Check Author
    const isAuthorBlocked = authorName && blocklist.authors.includes(authorName);
    if (authorEl) {
       let sibling = authorEl.nextElementSibling;
       while(sibling) {
         if (sibling.classList.contains('booklens-control-btn') && sibling.dataset.type === 'author') {
            updateButtonState(sibling, authorName, 'author', isAuthorBlocked);
            break;
         }
         sibling = sibling.nextElementSibling;
       }
    }

    if (isAuthorBlocked && !shouldBlock) {
      shouldBlock = true;
      blockReason = `🚫 [${authorName}]`;
    }

    if (shouldBlock) {
      collapseItem(item, blockReason, titleText, fullAuthorText);
    } else {
      expandItem(item);
    }
  });
}

function collapseItem(item, reason, title, author) {
  item.classList.add('booklens-collapsed');
  
  // Check if placeholder already exists
  let placeholder = item.querySelector('.booklens-placeholder');
  if (!placeholder) {
    placeholder = document.createElement('div');
    placeholder.className = 'booklens-placeholder';
    item.appendChild(placeholder);
  }
  
  // Update content
  placeholder.innerHTML = `
    <div class="bl-reason">${reason} - 숨겨진 도서입니다 (클릭하여 보기)</div>
    <div class="bl-info">${title} - ${author}</div>
  `;
  
  item.onclick = (e) => {
    if (item.classList.contains('booklens-collapsed')) {
      e.preventDefault();
      e.stopPropagation();
      expandItem(item);
    }
  };
}

function expandItem(item) {
  item.classList.remove('booklens-collapsed');
  const placeholder = item.querySelector('.booklens-placeholder');
  if (placeholder) {
    placeholder.remove();
  }
  item.onclick = null; 
}

function setupObserver(site) {
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        shouldUpdate = true;
      }
    });
    
    if (shouldUpdate) {
      applyFiltering(site);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

init();