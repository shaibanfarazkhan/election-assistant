const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Send message on Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendQuickAction(text) {
    userInput.value = text;
    sendMessage();
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Clear input
    userInput.value = '';

    // Add user message to chat
    appendMessage('user', text);

    // Show loading indicator
    const loadingId = showLoading();

    try {
        const response = await fetch('http://localhost:3000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: text })
        });

        const data = await response.json();
        
        // Remove loading
        removeMessage(loadingId);

        if (response.ok) {
            appendMessage('bot', data.answer);
        } else {
            appendMessage('bot', 'Sorry, I encountered an error: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        removeMessage(loadingId);
        appendMessage('bot', 'Network error. Please make sure the server is running on port 3000.');
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Bold titles if it's the bot response
    if (sender === 'bot') {
        // Find the first line and wrap it in strong tags if it's a title
        const lines = text.split('\n');
        if (lines.length > 0 && lines[0].trim() !== '') {
            lines[0] = `<strong>${lines[0]}</strong>`;
        }
        bubble.innerHTML = lines.join('<br>');
    } else {
        bubble.textContent = text;
    }
    
    msgDiv.appendChild(bubble);
    chatArea.appendChild(msgDiv);
    
    // Smooth scroll to bottom
    chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: 'smooth'
    });
}

function showLoading() {
    const id = 'loading-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'bot');
    msgDiv.id = id;
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    const dots = document.createElement('div');
    dots.classList.add('loading-dots');
    dots.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    
    bubble.appendChild(dots);
    msgDiv.appendChild(bubble);
    chatArea.appendChild(msgDiv);
    
    chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: 'smooth'
    });
    return id;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) {
        el.remove();
    }
}
