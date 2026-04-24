const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Send message on Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Button click
sendBtn.addEventListener('click', sendMessage);

// Quick buttons
function sendQuickAction(text) {
    userInput.value = text;
    sendMessage();
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    userInput.value = '';

    appendMessage('user', text);

    const loadingId = showLoading();

    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: text })
        });

        const data = await response.json();

        removeMessage(loadingId);

        if (response.ok) {
            appendMessage('bot', data.answer);
        } else {
            appendMessage('bot', 'Error: ' + (data.error || 'Unknown error'));
        }

    } catch (error) {
        removeMessage(loadingId);
        appendMessage('bot', 'Server waking up... try again.');
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    if (sender === 'bot') {
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
    dots.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;

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
    if (el) el.remove();
}