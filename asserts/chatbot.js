(function(){
// Configuration
const CONFIG = {
  API_URL: 'https://aichatbot-s2fl.onrender.com/chat',
  TITLE: "Aarif's AI Assistant",
  BRAND_COLOR: '#d4af37',
  ACCENT_COLOR: '#f4d03f',
  RATE_LIMIT_MS: 800,
  RETRY_DELAY_MS: 3000,
  MAX_RETRIES: 2
};

// CSS Styles
const styles = `
.aarif-chatbot{position:fixed;bottom:20px;right:20px;z-index:10000;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.aarif-btn{width:65px;height:65px;border-radius:50%;background:linear-gradient(135deg,${CONFIG.BRAND_COLOR},${CONFIG.ACCENT_COLOR});border:0;cursor:pointer;box-shadow:0 8px 32px rgba(212,175,55,.4),0 0 20px rgba(212,175,55,.2);display:flex;align-items:center;justify-content:center;transition:all .4s cubic-bezier(0.4,0,0.2,1);color:#0a0a0a;font-size:26px;position:relative;overflow:hidden}
.aarif-btn::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(45deg,transparent,rgba(255,255,255,.2),transparent);transform:translateX(-100%);transition:transform .6s}
.aarif-btn:hover{transform:scale(1.1) rotate(5deg);box-shadow:0 12px 40px rgba(212,175,55,.6),0 0 30px rgba(212,175,55,.4)}
.aarif-btn:hover::before{transform:translateX(100%)}
.aarif-btn:focus{outline:2px solid ${CONFIG.BRAND_COLOR};outline-offset:3px}
.aarif-panel{position:absolute;bottom:85px;right:0;width:380px;height:520px;background:#0a0a0a;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.8),0 0 40px rgba(212,175,55,.1);display:none;flex-direction:column;overflow:hidden;border:2px solid #333;backdrop-filter:blur(20px)}
.aarif-header{background:linear-gradient(135deg,${CONFIG.BRAND_COLOR},${CONFIG.ACCENT_COLOR});color:#0a0a0a;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;position:relative}
.aarif-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)}
.aarif-title{font-weight:700;font-size:18px;font-family:'Playfair Display',serif;text-shadow:0 1px 2px rgba(0,0,0,.2)}
.aarif-close{background:rgba(0,0,0,.1);border:0;color:#0a0a0a;font-size:22px;cursor:pointer;padding:8px;border-radius:8px;transition:all .3s;font-weight:bold}
.aarif-close:hover{background:rgba(0,0,0,.2);transform:rotate(90deg)}
.aarif-close:focus{outline:2px solid #0a0a0a}
.aarif-messages{flex:1;padding:24px;overflow-y:auto;display:flex;flex-direction:column;gap:16px;scroll-behavior:smooth;background:linear-gradient(180deg,#0a0a0a 0%,#111111 100%)}
.aarif-msg{max-width:85%;padding:14px 18px;border-radius:20px;font-size:14px;line-height:1.5;word-wrap:break-word;position:relative;animation:slideIn .3s ease-out}
.aarif-msg.user{background:linear-gradient(135deg,${CONFIG.BRAND_COLOR},${CONFIG.ACCENT_COLOR});color:#0a0a0a;align-self:flex-end;border-bottom-right-radius:6px;font-weight:500;box-shadow:0 4px 12px rgba(212,175,55,.3)}
.aarif-msg.bot{background:#1a1a1a;color:#e0e0e0;align-self:flex-start;border-bottom-left-radius:6px;border:1px solid #333;box-shadow:0 4px 12px rgba(0,0,0,.3)}
.aarif-msg.bot::before{content:'🤖';position:absolute;top:-8px;left:12px;background:#1a1a1a;padding:2px 6px;border-radius:8px;font-size:12px;border:1px solid #333}
.aarif-msg pre{background:#0a0a0a;padding:12px;border-radius:8px;overflow-x:auto;margin:12px 0;border:1px solid ${CONFIG.BRAND_COLOR}}
.aarif-msg code{background:#0a0a0a;padding:3px 6px;border-radius:4px;font-family:'Fira Code',monospace;font-size:13px;color:${CONFIG.BRAND_COLOR}}
.aarif-msg pre code{background:none;padding:0;color:#e0e0e0}
.aarif-msg strong{font-weight:700;color:${CONFIG.BRAND_COLOR}}
.aarif-msg em{font-style:italic;color:${CONFIG.ACCENT_COLOR}}
.aarif-msg ul,.aarif-msg ol{margin:12px 0;padding-left:24px}
.aarif-copy-btn{position:absolute;top:8px;right:8px;background:${CONFIG.BRAND_COLOR};border:0;color:#0a0a0a;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;opacity:0;transition:all .3s}
.aarif-msg:hover .aarif-copy-btn{opacity:1;transform:translateY(-2px)}
.aarif-copy-btn:hover{background:${CONFIG.ACCENT_COLOR};box-shadow:0 4px 8px rgba(212,175,55,.4)}
.aarif-typing{display:none;align-self:flex-start;background:#1a1a1a;color:${CONFIG.BRAND_COLOR};padding:14px 18px;border-radius:20px;border-bottom-left-radius:6px;font-size:14px;border:1px solid #333;font-weight:500}
.aarif-typing::after{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:${CONFIG.BRAND_COLOR};margin-left:8px;animation:aarif-pulse 1.5s infinite}
@keyframes aarif-pulse{0%,60%,100%{opacity:.3;transform:scale(.8)}30%{opacity:1;transform:scale(1.2)}}
@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.aarif-input-container{padding:20px 24px;border-top:1px solid #333;display:flex;gap:12px;align-items:flex-end;background:#111111}
.aarif-input{flex:1;background:#1a1a1a;border:2px solid #333;border-radius:24px;padding:12px 18px;color:#fff;font-size:14px;outline:0;resize:none;min-height:20px;max-height:80px;font-family:inherit;transition:all .3s}
.aarif-input:focus{border-color:${CONFIG.BRAND_COLOR};box-shadow:0 0 0 3px rgba(212,175,55,.2)}
.aarif-input::placeholder{color:#666}
.aarif-send{background:linear-gradient(135deg,${CONFIG.BRAND_COLOR},${CONFIG.ACCENT_COLOR});border:0;border-radius:50%;width:44px;height:44px;color:#0a0a0a;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all .3s;flex-shrink:0;font-weight:bold;box-shadow:0 4px 12px rgba(212,175,55,.3)}
.aarif-send:hover:not(:disabled){transform:scale(1.1) rotate(15deg);box-shadow:0 6px 20px rgba(212,175,55,.5)}
.aarif-send:disabled{background:#666;cursor:not-allowed;transform:none;box-shadow:none}
.aarif-controls{display:flex;gap:12px;padding:0 24px 20px;justify-content:center}
.aarif-clear{background:transparent;border:2px solid #333;color:#ccc;padding:8px 16px;border-radius:20px;font-size:12px;cursor:pointer;transition:all .3s;font-weight:500}
.aarif-clear:hover{border-color:${CONFIG.BRAND_COLOR};color:${CONFIG.BRAND_COLOR};transform:translateY(-2px);box-shadow:0 4px 8px rgba(212,175,55,.2)}
@media (max-width:480px){.aarif-panel{width:calc(100vw - 40px);height:75vh;bottom:85px;right:20px;left:20px}.aarif-btn{width:60px;height:60px;font-size:24px}}
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
  <button class="aarif-btn" id="aarif-toggle" aria-label="Open chat assistant" role="button">🤖</button>
  <div class="aarif-panel" id="aarif-panel" role="dialog" aria-labelledby="aarif-title" aria-hidden="true">
    <div class="aarif-header">
      <div class="aarif-title" id="aarif-title">${CONFIG.TITLE}</div>
      <button class="aarif-close" id="aarif-close" aria-label="Close chat">×</button>
    </div>
    <div class="aarif-messages" id="aarif-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>
    <div class="aarif-typing" id="aarif-typing" aria-label="Assistant is typing">Assistant is thinking</div>
    <div class="aarif-controls">
      <button class="aarif-clear" id="aarif-clear">✨ Clear Chat</button>
    </div>
    <div class="aarif-input-container">
      <textarea class="aarif-input" id="aarif-input" placeholder="Ask me about Aarif's work..." rows="1" aria-label="Message input"></textarea>
      <button class="aarif-send" id="aarif-send" aria-label="Send message">🚀</button>
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
        addMessage("🚀 **AI Assistant - Coming Soon!**\n\nI'm currently being developed to help answer questions about Aarif's *skills*, *projects*, and *experience*. \n\n✨ **Features in development:**\n• Smart Q&A about portfolio\n• Project deep-dives\n• Technical expertise insights\n\n🎯 Stay tuned for the launch!", false);
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
    
    addMessage(message, true);
    input.value = '';
    input.style.height = 'auto';
    
    // Show coming soon message
    setTimeout(() => {
      addMessage("✨ **Thanks for your interest!** \n\nThe AI assistant is coming soon with exciting features. For now, please explore the portfolio sections above to learn about Aarif's work.\n\n🔍 **What you can explore:**\n• Portfolio projects\n• Achievements & certifications\n• Technical skills\n• Mentor network", false);
    }, 500);
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