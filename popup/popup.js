document.addEventListener('DOMContentLoaded', () => {
  const els = {
    tabs: document.querySelectorAll('.tab-btn'),
    input: document.getElementById('new-item-input'),
    addBtn: document.getElementById('add-btn'),
    list: document.getElementById('block-list'),
    emptyMsg: document.getElementById('empty-msg'),
    totalCount: document.getElementById('total-count')
  };

  let currentTab = 'publishers';
  let blocklist = {
    publishers: [],
    authors: []
  };

  // Initialize
  init();

  function init() {
    loadBlocklist().then(() => {
      render();
    });

    // Event Listeners
    els.tabs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        switchTab(e.target.dataset.tab);
      });
    });

    els.addBtn.addEventListener('click', handleAdd);
    
    els.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAdd();
    });

    // Event delegation for remove buttons
    els.list.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn') || e.target.parentElement.classList.contains('remove-btn')) {
        const btn = e.target.classList.contains('remove-btn') ? e.target : e.target.parentElement;
        const name = btn.dataset.name;
        handleRemove(name);
      }
    });
  }

  async function loadBlocklist() {
    const data = await utils.storage.get('blocklist');
    if (data) {
      // Ensure structure exists
      blocklist = {
        publishers: Array.isArray(data.publishers) ? data.publishers : [],
        authors: Array.isArray(data.authors) ? data.authors : []
      };
    } else {
      // Initialize if empty
      await saveBlocklist();
    }
  }

  async function saveBlocklist() {
    await utils.storage.set('blocklist', blocklist);
    updateStats(); // Update stats immediately after save
  }

  function switchTab(tabName) {
    currentTab = tabName;
    
    // Update active tab UI
    els.tabs.forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update placeholder
    els.input.placeholder = `Enter ${tabName === 'publishers' ? 'publisher' : 'author'} name...`;
    
    render();
  }

  function render() {
    const items = blocklist[currentTab] || [];
    
    els.list.innerHTML = '';
    
    if (items.length === 0) {
      els.emptyMsg.style.display = 'block';
    } else {
      els.emptyMsg.style.display = 'none';
      items.sort().forEach(name => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="item-name">${escapeHtml(name)}</span>
          <button class="remove-btn" data-name="${escapeHtml(name)}" title="Remove">
            &times;
          </button>
        `;
        els.list.appendChild(li);
      });
    }
    
    updateStats();
  }

  function updateStats() {
    const total = (blocklist.publishers ? blocklist.publishers.length : 0) + 
                  (blocklist.authors ? blocklist.authors.length : 0);
    els.totalCount.textContent = total;
  }

  async function handleAdd() {
    const name = els.input.value.trim();
    if (!name) return;

    if (!blocklist[currentTab].includes(name)) {
      blocklist[currentTab].push(name);
      await saveBlocklist();
      render();
      els.input.value = ''; // Clear input
      
      // Flash success visual? (Optional)
    } else {
      alert('This item is already blocked.');
    }
  }

  async function handleRemove(name) {
    if (confirm(`Unblock '${name}'?`)) {
      blocklist[currentTab] = blocklist[currentTab].filter(item => item !== name);
      await saveBlocklist();
      render();
    }
  }

  function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }
});