const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function appendMessage(text, sender, options = {}) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    if (options.typing) {
        msgDiv.innerHTML = '<span class="typing-indicator"><span></span><span></span><span></span></span>';
    } else if (options.typewriter) {
        msgDiv.textContent = '';
        chatWindow.appendChild(msgDiv);
        typeWriterEffect(msgDiv, text);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return msgDiv;
    } else {
        msgDiv.textContent = text;
    }
    // Add delivery status icon for user messages
    if (sender === 'user') {
        const statusSpan = document.createElement('span');
        statusSpan.className = 'msg-status';
        statusSpan.innerHTML = options.status === 'delivered'
            ? '<svg class="delivered" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 10 8 15 17 6"></polyline><polyline points="7 10 12 15 19 6"></polyline></svg>'
            : '<svg class="delivering" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#bdbdbd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="M10 4v6l4 2"/></svg>';
        msgDiv.appendChild(statusSpan);
    }
    msgDiv.style.opacity = 0;
    chatWindow.appendChild(msgDiv);
    setTimeout(() => {
        msgDiv.style.opacity = 1;
    }, 10);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return msgDiv;
}

function typeWriterEffect(element, text, speed = 18) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

async function getGeminiResponse(userMsg) {
    try {
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMsg })
        });
        const data = await res.json();
        return data.reply || "Sorry, I couldn't get a response.";
    } catch (err) {
        return "Error contacting Gemini API.";
    }
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;
    // Show user message with delivering status
    const userMsgDiv = appendMessage(text, 'user', { status: 'delivering' });
    userInput.value = '';
    // Show typing indicator
    const typingDiv = appendMessage('', 'bot', { typing: true });
    const botReply = await getGeminiResponse(text);
    // Remove typing indicator
    if (typingDiv) chatWindow.removeChild(typingDiv);
    // Update user message to delivered
    const statusSpan = userMsgDiv.querySelector('.msg-status');
    if (statusSpan) {
        statusSpan.innerHTML = '<svg class="delivered" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 10 8 15 17 6"></polyline><polyline points="7 10 12 15 19 6"></polyline></svg>';
    }
    // Show bot reply with typewriter effect
    appendMessage(botReply, 'bot', { typewriter: true });
}

sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSend();
});

// Theme toggle logic
function setTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('chatbot-theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const saved = localStorage.getItem('chatbot-theme');
    setTheme(saved === 'dark');
}

themeToggle.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-theme');
    setTheme(isDark);
});

window.addEventListener('DOMContentLoaded', loadTheme); 