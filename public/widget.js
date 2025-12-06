(function () {
  const script = document.currentScript || document.querySelector('script[data-widget-id]');
  const widgetId = script?.getAttribute('data-widget-id');
  const API_BASE = script ? new URL(script.src).origin : 'https://widget-maker.vercel.app'; // Fallback to production URL if script tag not found

  if (!widgetId) {
    console.error('WidgetMaker: data-widget-id is required');
    return;
  }

  // Styles
  const styles = `
    .wm-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .wm-launcher {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: transform 0.2s;
    }
    .wm-launcher:hover {
      transform: scale(1.05);
    }
    .wm-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: all 0.2s ease-out;
    }
    .wm-chat-window.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .wm-header {
      padding: 16px;
      background: #000;
      color: #fff;
    }
    .wm-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
    .wm-header p { margin: 4px 0 0; font-size: 12px; opacity: 0.8; }
    .wm-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .wm-message {
      padding: 10px 14px;
      border-radius: 12px;
      max-width: 85%;
      font-size: 14px;
      line-height: 1.5;
    }
    .wm-message.user {
      align-self: flex-end;
      background: #000 !important;
      color: #fff !important;
      border-bottom-right-radius: 2px;
    }
    .wm-message.assistant {
      align-self: flex-start;
      background: #fff !important;
      color: #334155 !important;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 2px;
    }
    .wm-input-area {
      padding: 16px;
      background: #fff;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 8px;
    }
    .wm-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      outline: none;
      font-family: inherit;
      background: #ffffff !important;
      color: #0f172a !important;
    }
    .wm-input::placeholder {
      color: #94a3b8 !important;
    }
    .wm-input:focus {
      border-color: #000;
    }
    .wm-send-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #000;
      padding: 8px;
    }
    .wm-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.8);
      cursor: pointer;
    }
  `;

  // Inject Styles
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Initialize
  console.log('WidgetMaker: Initializing...', { widgetId, API_BASE });
  // alert('WidgetMaker: Starting init for ' + widgetId); // Uncomment if console is hidden

  fetch(`${API_BASE}/api/widget/${widgetId}`, { mode: 'cors', credentials: 'omit' })
    .then(res => {
      console.log('WidgetMaker: Fetch response', res.status);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(config => {
      console.log('WidgetMaker: Config loaded', config);
      initWidget(config);
    })
    .catch(err => {
      console.error('WidgetMaker: Failed to load config', err);
      // alert('WidgetMaker Error: ' + err.message);
    });

  function initWidget(config) {
    const container = document.createElement('div');
    container.className = 'wm-widget-container';

    // Check if conversation exists
    let conversationId = localStorage.getItem(`wm_conversation_${widgetId}`);
    let messages = [];

    // Launcher
    const launcher = document.createElement('div');
    launcher.className = 'wm-launcher';
    launcher.style.background = config.primaryColor;
    launcher.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

    // Window
    const windowEl = document.createElement('div');
    windowEl.className = 'wm-chat-window';
    windowEl.innerHTML = `
      <div class="wm-header" style="background: ${config.primaryColor}">
        <h3>${config.name}</h3>
        <p>${config.companyName}</p>
        <button class="wm-close">✕</button>
      </div>
      <div class="wm-messages">
        <div class="wm-message assistant">${config.welcomeMessage}</div>
      </div>
      <div class="wm-input-area">
        <input class="wm-input" placeholder="Type a message..." />
        <button class="wm-send-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${config.primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;

    container.appendChild(windowEl);
    container.appendChild(launcher);
    document.body.appendChild(container);

    const messagesContainer = windowEl.querySelector('.wm-messages');
    const input = windowEl.querySelector('.wm-input');
    const sendBtn = windowEl.querySelector('.wm-send-btn');
    const closeBtn = windowEl.querySelector('.wm-close');

    // Toggle
    let isOpen = false;
    launcher.onclick = () => {
      isOpen = !isOpen;
      windowEl.classList.toggle('open', isOpen);
      if (isOpen) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        input.focus();
      }
    };
    closeBtn.onclick = () => {
      isOpen = false;
      windowEl.classList.remove('open');
    };

    // Chat Logic
    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      // Add User Message
      appendMessage('user', text);
      input.value = '';
      messages.push({ role: 'user', content: text });

      // Loading state
      const loadingId = appendMessage('assistant', '...');

      try {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId,
            messages: messages,
            conversationId
          })
        });

        const data = await res.json();

        // Remove loading and add actual message
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove(); // Or replace content

        appendMessage('assistant', data.content);
        messages.push({ role: 'assistant', content: data.content });

        if (data.conversationId) {
          conversationId = data.conversationId;
          localStorage.setItem(`wm_conversation_${widgetId}`, conversationId);
        }

      } catch (err) {
        console.error(err);
        appendMessage('assistant', 'Sorry, something went wrong.');
      }
    }

    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') sendMessage();
    };

    function appendMessage(role, text) {
      const msg = document.createElement('div');
      msg.className = `wm-message ${role}`;
      msg.textContent = text;
      const id = 'msg-' + Math.random().toString(36).substr(2, 9);
      msg.id = id;
      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return id;
    }
  }

})();
