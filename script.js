window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
        loader.classList.add('hidden');
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // LeetCode Stats Fetcher
    // Using a public proxy since direct LeetCode API has CORS
    const leetCodeUsername = 'labony_sur';
    const totalSolvedEl = document.getElementById('lc-total');
    const rankingEl = document.getElementById('lc-ranking');

    if (totalSolvedEl) {
        fetch(`https://leetcode-stats-api.herokuapp.com/${leetCodeUsername}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    totalSolvedEl.innerText = data.totalSolved;
                    rankingEl.innerText = data.ranking || 'N/A';
                } else {
                    totalSolvedEl.innerText = 'Profile Found';
                    rankingEl.innerText = '-';
                }
            })
            .catch(error => {
                console.error('Error fetching LeetCode stats:', error);
                totalSolvedEl.innerText = 'Check Profile';
            });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // AI Assistant Logic
    const petContainer = document.getElementById('ai-pet-container');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    let messagesContext = [];

    if (petContainer && chatWindow) {
        // Toggle chat window
        petContainer.addEventListener('click', () => {
            petContainer.classList.add('hidden');
            chatWindow.classList.remove('hidden');
        });

        closeChatBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            petContainer.classList.remove('hidden');
        });

        const appendMessage = (content, role) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message', role === 'user' ? 'user-message' : 'ai-message');
            msgDiv.textContent = content;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const showTyping = () => {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('typing-indicator');
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const hideTyping = () => {
            const typingDiv = document.getElementById('typing-indicator');
            if (typingDiv) typingDiv.remove();
        };

        const sendMessage = async () => {
            const text = chatInput.value.trim();
            if (!text) return;

            // Add user message
            appendMessage(text, 'user');
            messagesContext.push({ role: 'user', content: text });
            chatInput.value = '';

            // Show typing indicator
            showTyping();

            try {
                // Call our Vercel Serverless Function securely
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: messagesContext })
                });

                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                const aiResponse = data.choices[0].message.content;
                
                hideTyping();
                appendMessage(aiResponse, 'assistant');
                messagesContext.push({ role: 'assistant', content: aiResponse });
                
            } catch (error) {
                console.error("Chat error:", error);
                hideTyping();
                appendMessage("Oops! I'm having trouble connecting right now.", 'assistant');
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
