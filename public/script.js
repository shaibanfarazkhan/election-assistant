const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Welcome message on load
window.onload = () => {
    appendMessage('bot', "Namaste 🙏 I'm your Election Guide Assistant. Ask me anything!");
};

// Send message on Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Quick buttons
function sendQuickAction(text) {
    userInput.value = text;
    sendMessage();
}

// MAIN FUNCTION
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
            // delay for human feel
            setTimeout(() => {
                typeMessage(data.answer);
            }, 400);
        } else {
            appendMessage('bot', '⚠️ Error: ' + (data.error || 'Unknown error'));
        }

    } catch (error) {
        removeMessage(loadingId);
        appendMessage('bot', '⏳ Server is waking up... please try again.');
    }
}

// NORMAL MESSAGE
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

// TYPING EFFECT
function typeMessage(text) {
    let index = 0;
    const speed = 15;

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'bot');

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    msgDiv.appendChild(bubble);
    chatArea.appendChild(msgDiv);

    function type() {
        if (index < text.length) {
            bubble.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();

    chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: 'smooth'
    });
}

// LOADING
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

// REMOVE LOADING
function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}