const chatArea = document.getElementById('chat-area');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

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
            await typeMessage('bot', data.answer);
        } else {
            appendMessage('bot', 'Sorry, an error occurred: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        removeMessage(loadingId);
        appendMessage('bot', 'Network error. Please make sure the server is running.');
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    if (sender === 'bot') {
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        bubble.innerHTML = formattedText;
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

async function typeMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    msgDiv.appendChild(bubble);
    chatArea.appendChild(msgDiv);
    
    // Convert newlines to <br> explicitly to help splitting, and ** to <strong>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    
    bubble.innerHTML = '';
    let currentHTML = '';
    
    // Split by tags
    const parts = formattedText.split(/(<[^>]+>)/g);
    
    for (let part of parts) {
        if (!part) continue;
        
        if (part.startsWith('<')) {
            // It's a tag, add entirely
            currentHTML += part;
            bubble.innerHTML = currentHTML;
        } else {
            // It's text, type character by character
            for (let char of part) {
                currentHTML += char;
                bubble.innerHTML = currentHTML;
                chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
                // Small delay for typing effect
                await new Promise(r => setTimeout(r, 15)); 
            }
        }
    }
    
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