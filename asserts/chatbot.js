(function(){
// Configuration
const CONFIG = {
  API_URL: 'https://aichatbot-s2fl.onrender.com/chat',
  TITLE: "Aarif's AI Assistant",
  BRAND_COLOR: '#11b3c9',
  RATE_LIMIT_MS: 800,
  RETRY_DELAY_MS: 3000,
  MAX_RETRIES: 2
};

// CSS Styles
const styles = `
.aarif-chatbot{position:fixed;bottom:20px;right:20px;z-index:10000;font-family:-apple-system,BlinkMacSystemFont,sans-serif}
.aarif-btn{width:60px;height:60px;border-radius:50%;background:${CONFIG.BRAND_COLOR};border:0;cursor:pointer;box-shadow:0 4px 20px rgba(17,179,201,.3);display:flex;align-items:center;justify-content:center;transition:all .3s;color:#fff;font-size:24px}
.aarif-btn:hover{transform:scale(1.1)}
.aarif-btn:focus{outline:2px solid #fff;outline-offset:2px}
.aarif-panel{position:absolute;bottom:80px;right:0;width:350px;height:500px;background:#121212;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.3);display:none;flex-direction:column;overflow:hidden;border:1px solid #333}
.aarif-header{background:${CONFIG.BRAND_COLOR};color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center}
.aarif-title{font-weight:600;font-size:16px}
.aarif-close{background:0;border:0;color:#fff;font-size:20px;cursor:pointer;padding:4px;border-radius:4px;transition:background .2s}
.aarif-close:hover{background:rgba(255,255,255,.2)}
.aarif-close:focus{outline:2px solid #fff}
.aarif-messages{flex:1;padding:20px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
.aarif-msg{max-width:80%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.4;word-wrap:break-word;position:relative}
.aarif-msg.user{background:${CONFIG.BRAND_COLOR};color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.aarif-msg.bot{background:#2a2a2a;color:#e0e0e0;align-self:flex-start;border-bottom-left-radius:4px}
.aarif-msg pre{background:#1a1a1a;padding:8px;border-radius:4px;overflow-x:auto;margin:8px 0;border:1px solid #444}
.aarif-msg code{background:#1a1a1a;padding:2px 4px;border-radius:3px;font-family:monospace;font-size:13px}
.aarif-msg pre code{background:none;padding:0}
.aarif-msg strong{font-weight:600}
.aarif-msg em{font-style:italic}
.aarif-msg ul,.aarif-msg ol{margin:8px 0;padding-left:20px}
.aarif-copy-btn{position:absolute;top:8px;right:8px;background:#444;border:0;color:#ccc;padding:4px 6px;border-radius:3px;cursor:pointer;font-size:11px;opacity:0;transition:opacity .2s}
.aarif-msg:hover .aarif-copy-btn{opacity:1}
.aarif-copy-btn:hover{background:#555}
.aarif-typing{display:none;align-self:flex-start;background:#2a2a2a;color:#888;padding:12px 16px;border-radius:18px;border-bottom-left-radius:4px;font-size:14px}
.aarif-typing::after{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:#888;margin-left:4px;animation:aarif-pulse 1.5s infinite}
@keyframes aarif-pulse{0%,60%,100%{opacity:.3}30%{opacity:1}}
.aarif-input-container{padding:16px 20px;border-top:1px solid #333;display:flex;gap:8px;align-items:flex-end}
.aarif-input{flex:1;background:#2a2a2a;border:1px solid #444;border-radius:20px;padding:10px 16px;color:#fff;font-size:14px;outline:0;resize:none;min-height:20px;max-height:80px;font-family:inherit}
.aarif-input:focus{border-color:${CONFIG.BRAND_COLOR}}
.aarif-send{background:${CONFIG.BRAND_COLOR};border:0;border-radius:50%;width:40px;height:40px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .2s;flex-shrink:0}
.aarif-send:hover:not(:disabled){background:#0ea5b8}
.aarif-send:disabled{background:#666;cursor:not-allowed}
.aarif-controls{display:flex;gap:8px;padding:0 20px 16px;justify-content:center}
.aarif-clear{background:transparent;border:1px solid #444;color:#ccc;padding:6px 12px;border-radius:16px;font-size:12px;cursor:pointer;transition:all .2s}
.aarif-clear:hover{border-color:#666;color:#fff}
@media (max-width:480px){.aarif-panel{width:calc(100vw - 40px);height:70vh;bottom:80px;right:20px;left:20px}}
`;

// Utility functions
function getSessionId() {
  let sessionId = localStorage.getItem('aarif-chatbot-session');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('aarif-chatbot-session', sessionId);
  }
  return sessionId;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderMarkdown(text) {
  let html = escapeHtml(text);
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text).then(() => {
    // Could show a brief success indicator here
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
}

// Main widget HTML
const widgetHTML = `
<div class="aarif-chatbot">
  <button class="aarif-btn" id="aarif-toggle" aria-label="Open chat assistant" role="button">💬</button>
  <div class="aarif-panel" id="aarif-panel" role="dialog" aria-labelledby="aarif-title" aria-hidden="true">
    <div class="aarif-header">
      <div class="aarif-title" id="aarif-title">${CONFIG.TITLE}</div>
      <button class="aarif-close" id="aarif-close" aria-label="Close chat">×</button>
    </div>
    <div class="aarif-messages" id="aarif-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>
    <div class="aarif-typing" id="aarif-typing" aria-label="Assistant is typing">Typing</div>
    <div class="aarif-controls">
      <button class="aarif-clear" id="aarif-clear">Clear Chat</button>
    </div>
    <div class="aarif-input-container">
      <textarea class="aarif-input" id="aarif-input" placeholder="Type your message... (Shift+Enter for new line)" rows="1" aria-label="Message input"></textarea>
      <button class="aarif-send" id="aarif-send" aria-label="Send message">➤</button>
    </div>
  </div>
</div>
`;

// Main initialization function
function initChatbot() {
  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
  
  // Inject HTML
  document.body.insertAdjacentHTML('beforeend', widgetHTML);
  
  // Get DOM elements
  const toggleBtn = document.getElementById('aarif-toggle');
  const panel = document.getElementById('aarif-panel');
  const closeBtn = document.getElementById('aarif-close');
  const messages = document.getElementById('aarif-messages');
  const input = document.getElementById('aarif-input');
  const sendBtn = document.getElementById('aarif-send');
  const typing = document.getElementById('aarif-typing');
  const clearBtn = document.getElementById('aarif-clear');
  
  // State
  let isOpen = false;
  let messageQueue = [];
  let isProcessing = false;
  let lastSendTime = 0;
  let hasShownWelcome = false;
  const sessionId = getSessionId();
  
  // Functions
  function togglePanel() {
    isOpen = !isOpen;
    panel.style.display = isOpen ? 'flex' : 'none';
    panel.setAttribute('aria-hidden', !isOpen);
    
    if (isOpen) {
      input.focus();
      if (!hasShownWelcome) {
        addMessage("Hi! I'm Aarif's AI assistant. Ask me anything about his skills, projects, or experience!", false);
        hasShownWelcome = true;
      }
    }
  }
  
  function addMessage(content, isUser = false) {
    const msgEl = document.createElement('div');
    msgEl.className = `aarif-msg ${isUser ? 'user' : 'bot'}`;
    msgEl.setAttribute('role', 'article');
    
    if (isUser) {
      msgEl.textContent = content;
    } else {
      msgEl.innerHTML = renderMarkdown(content);
      
      // Add copy buttons to code blocks
      const codeBlocks = msgEl.querySelectorAll('pre code');
      codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'aarif-copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => copyToClipboard(block.textContent);
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyBtn);
      });
    }
    
    messages.appendChild(msgEl);
    messages.scrollTop = messages.scrollHeight;
  }
  
  function showTyping(show = true) {
    typing.style.display = show ? 'block' : 'none';
    if (show) {
      messages.scrollTop = messages.scrollHeight;
    }
  }
  
  async function sendMessage(message, retryCount = 0) {
    try {
      showTyping(true);
      
      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId })
      });
      
      showTyping(false);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      addMessage(data.reply || 'Sorry, I could not process your request.');
      
    } catch (error) {
      console.error('Chatbot API Error:', error);
      showTyping(false);
      
      // Handle cold start or server errors with retry
      if (retryCount < CONFIG.MAX_RETRIES && (
        error.message.includes('fetch') || 
        error.message.includes('Network') ||
        error.message.includes('500') ||
        error.message.includes('502') ||
        error.message.includes('503')
      )) {
        addMessage('Waking the server… this may take a moment');
        setTimeout(() => {
          // Remove the "waking server" message
          const lastMsg = messages.lastElementChild;
          if (lastMsg && lastMsg.textContent.includes('Waking the server')) {
            messages.removeChild(lastMsg);
          }
          sendMessage(message, retryCount + 1);
        }, CONFIG.RETRY_DELAY_MS);
      } else {
        addMessage('Sorry, I encountered an error. Please try again in a moment.');
      }
    }
  }
  
  async function processMessageQueue() {
    if (isProcessing || messageQueue.length === 0) return;
    
    isProcessing = true;
    const message = messageQueue.shift();
    
    await sendMessage(message);
    
    isProcessing = false;
    
    // Process next message if any
    if (messageQueue.length > 0) {
      setTimeout(processMessageQueue, 100);
    }
  }
  
  function handleSend() {
    const message = input.value.trim();
    if (!message) return;
    
    // Rate limiting
    const now = Date.now();
    if (now - lastSendTime < CONFIG.RATE_LIMIT_MS) {
      return;
    }
    lastSendTime = now;
    
    addMessage(message, true);
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    
    // Add to queue
    messageQueue.push(message);
    processMessageQueue();
    
    setTimeout(() => {
      sendBtn.disabled = false;
    }, CONFIG.RATE_LIMIT_MS);
  }
  
  function clearChat() {
    const botMessages = messages.querySelectorAll('.aarif-msg');
    botMessages.forEach(msg => msg.remove());
    hasShownWelcome = false;
  }
  
  function autoResize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  }
  
  // Event listeners
  toggleBtn.onclick = togglePanel;
  closeBtn.onclick = togglePanel;
  sendBtn.onclick = handleSend;
  clearBtn.onclick = clearChat;
  
  input.addEventListener('input', autoResize);
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
      togglePanel();
    }
  });
  
  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      togglePanel();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}

})();