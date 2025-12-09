
console.log('WidgetMaker: SCRIPT START');
// alert('WidgetMaker: Script Loaded!'); 

const script = document.currentScript || document.querySelector('script[data-widget-id]');
const widgetId = script?.getAttribute('data-widget-id');
const API_BASE = script ? new URL(script.src).origin : 'https://widget-maker.vercel.app';

if (!widgetId) {
  console.error('WidgetMaker: data-widget-id is required');
} else {

  // Styles
  const styles = `
    .wm-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647; /* Max Z-Index */
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
      overflow: hidden; /* For image */
    }
    .wm-launcher:hover {
      transform: scale(1.05);
    }
    .wm-launcher img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
    
    /* Message Wrappers for Avatar Layout */
    .wm-message-wrap {
      display: flex;
      gap: 8px;
      max-width: 85%;
    }
    .wm-message-wrap.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .wm-message-wrap.assistant {
      align-self: flex-start;
    }
    
    .wm-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ccc;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      overflow: hidden;
    }
    .wm-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .wm-message {
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .wm-message.user {
      background: #000 !important;
      color: #fff !important;
      border-bottom-right-radius: 2px;
    }
    .wm-message.assistant {
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
    
    /* Lead Capture Popup */
    .wm-lead-popup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 1000;
      width: 90%;
      max-width: 320px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .wm-lead-popup.show {
      opacity: 1;
      pointer-events: auto;
    }
    .wm-lead-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    .wm-lead-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .wm-lead-popup h4 {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
    }
    .wm-lead-popup p {
      margin: 0 0 20px;
      font-size: 14px;
      color: #64748b;
    }
    .wm-lead-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .wm-lead-input {
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      outline: none;
      background: #ffffff !important;
      color: #0f172a !important;
    }
    .wm-lead-input::placeholder {
      color: #94a3b8 !important;
    }
    .wm-lead-input:focus {
      border-color: #000;
    }
    .wm-lead-textarea {
      min-height: 80px;
      resize: vertical;
      font-family: inherit;
    }
    .wm-lead-submit {
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #000;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .wm-lead-submit:hover {
      opacity: 0.9;
    }
    .wm-lead-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .wm-lead-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
    }
  `;

  // Inject Styles
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Initialize
  console.log('WidgetMaker: Initializing...', { widgetId, API_BASE });

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

    if (config.avatarUrl) {
      launcher.innerHTML = `<img src="${config.avatarUrl}" alt="Chat">`;
      launcher.style.background = 'none';
    } else {
      launcher.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    }

    // Avatar HTML helper
    const getAvatarHtml = () => {
      if (config.avatarUrl) {
        return `<div class="wm-avatar"><img src="${config.avatarUrl}"></div>`;
      }
      return `<div class="wm-avatar" style="background: ${config.primaryColor}">AI</div>`;
    };

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
        <div class="wm-message-wrap assistant">
            ${getAvatarHtml()}
            <div class="wm-message assistant">${config.welcomeMessage}</div>
        </div>
      </div>
      <div class="wm-input-area">
        <input class="wm-input" placeholder="Type a message..." />
        <button class="wm-send-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${config.primaryColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
      <div class="wm-lead-overlay"></div>
      <div class="wm-lead-popup">
        <button class="wm-lead-close">✕</button>
        <h4 style="color: ${config.primaryColor}">${config.leadFormMessage || "Interested? Let's connect!"}</h4>
        <p>Share your details and we'll get back to you!</p>
        <form class="wm-lead-form">
          <input type="text" class="wm-lead-input" name="name" placeholder="Your name" required />
          <input type="email" class="wm-lead-input" name="email" placeholder="Your email" required />
          <textarea class="wm-lead-input wm-lead-textarea" name="interest" placeholder="What are you interested in?" required></textarea>
          <button type="submit" class="wm-lead-submit" style="background: ${config.primaryColor}">Send</button>
        </form>
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
        removeMessage(loadingId);

        appendMessage('assistant', data.content);
        messages.push({ role: 'assistant', content: data.content });

        if (data.conversationId) {
          conversationId = data.conversationId;
          localStorage.setItem(`wm_conversation_${widgetId}`, conversationId);
        }

        // Check if lead collection is enabled and user hasn't submitted yet
        if (config.enableLeadCollection !== false && !localStorage.getItem(`wm_lead_submitted_${widgetId}`)) {
          // Get keywords from config (comma-separated string) or use defaults
          const keywordsString = config.leadKeywords || 'price,pricing,cost,how much,interested,quote,buy,purchase,get started,sign up,contact,demo,trial';
          const interestKeywords = keywordsString.split(',').map(k => k.trim().toLowerCase());

          const combinedText = (text + ' ' + data.content).toLowerCase();
          const hasInterest = interestKeywords.some(keyword => combinedText.includes(keyword));

          // Get threshold from config or use default
          const threshold = config.leadMessageThreshold || 6;

          // Show popup if interest detected OR message count reached
          if (hasInterest || messages.length >= threshold) {
            setTimeout(() => showLeadPopup(), 1000);
          }
        }

      } catch (err) {
        console.error(err);
        removeMessage(loadingId);
        appendMessage('assistant', 'Sorry, something went wrong.');
      }
    }

    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') sendMessage();
    };

    function appendMessage(role, text) {
      const wrap = document.createElement('div');
      wrap.className = `wm-message-wrap ${role}`;
      // ID for removal
      const id = 'msg-' + Math.random().toString(36).substr(2, 9);
      wrap.id = id;

      let html = '';
      if (role === 'assistant') {
        html += getAvatarHtml();
      }

      html += `<div class="wm-message ${role}">${text}</div>`;

      wrap.innerHTML = html;

      messagesContainer.appendChild(wrap);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return id;
    }

    function removeMessage(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    }

    // Lead Popup Logic
    const leadPopup = windowEl.querySelector('.wm-lead-popup');
    const leadOverlay = windowEl.querySelector('.wm-lead-overlay');
    const leadForm = windowEl.querySelector('.wm-lead-form');
    const leadCloseBtn = windowEl.querySelector('.wm-lead-close');

    function showLeadPopup() {
      leadPopup.classList.add('show');
      leadOverlay.classList.add('show');
    }

    function hideLeadPopup() {
      leadPopup.classList.remove('show');
      leadOverlay.classList.remove('show');
    }

    leadCloseBtn.onclick = hideLeadPopup;
    leadOverlay.onclick = hideLeadPopup;

    leadForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(leadForm);
      const submitBtn = leadForm.querySelector('.wm-lead-submit');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch(`${API_BASE}/api/leads`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            widgetId,
            name: formData.get('name'),
            email: formData.get('email'),
            interest: formData.get('interest'),
            conversationId
          })
        });

        if (res.ok) {
          localStorage.setItem(`wm_lead_submitted_${widgetId}`, 'true');
          submitBtn.textContent = 'Thank you!';
          setTimeout(() => {
            hideLeadPopup();
            appendMessage('assistant', 'Thanks for sharing your details! We\'ll be in touch soon. 😊');
          }, 1500);
        } else {
          throw new Error('Failed to submit');
        }
      } catch (err) {
        console.error('Lead submission error:', err);
        submitBtn.textContent = 'Try again';
        submitBtn.disabled = false;
      }
    };
  }
}
