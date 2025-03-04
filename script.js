const input = document.getElementById('mind-input');
const inputSection = document.querySelector('.input-section');
const buttons = document.querySelector('.buttons');
const launcherContainer = document.querySelector('.launcher-container');
const chatContainer = document.querySelector('.chat-container');

input.addEventListener('focus', () => {
    inputSection.classList.add('expanded');
    buttons.classList.add('hidden');
});

input.addEventListener('blur', () => {
    inputSection.classList.remove('expanded');
    buttons.classList.remove('hidden');
});

// Ctrl + Space handler
document.addEventListener('keydown', (e) => {
    // Toggle launcher with Ctrl + Space
    if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault();
        
        if (launcherContainer.classList.contains('visible')) {
            // Just hide the launcher without clearing chat
            launcherContainer.classList.add('hiding');
            
            setTimeout(() => {
                launcherContainer.classList.remove('visible', 'hiding');
            }, 600);
        } else {
            // Show launcher and restore chat if it was active
            launcherContainer.classList.remove('hiding');
            launcherContainer.classList.add('visible');
            if (chatContainer.querySelector('.chat-messages').children.length > 0) {
                launcherContainer.classList.add('chat-active');
                chatContainer.classList.add('expanded');
            }
        }
    }
    
    // Keep Escape handler for complete close/clear
    if (e.code === 'Escape' && launcherContainer.classList.contains('visible')) {
        chatContainer.classList.add('closing');
        
        // Clear chat messages immediately
        const chatMessages = chatContainer.querySelector('.chat-messages');
        chatMessages.innerHTML = '';
        
        setTimeout(() => {
            chatContainer.classList.remove('expanded');
            chatContainer.classList.remove('closing');
            launcherContainer.classList.add('hiding');
            
            setTimeout(() => {
                launcherContainer.classList.remove('visible', 'chat-active', 'hiding');
            }, 600);
        }, 300);
        
        input.blur();
    }
});

// Update close button handler with a more reliable animation sequence
const closeBtn = document.querySelector('.close-btn');
closeBtn.addEventListener('click', () => {
    // First add closing class
    chatContainer.classList.add('closing');
    
    // Clear chat messages immediately (they're not visible during animation)
    const chatMessages = chatContainer.querySelector('.chat-messages');
    chatMessages.innerHTML = '';
    
    // Remove expanded class after animation completes
    setTimeout(() => {
        chatContainer.classList.remove('expanded');
        chatContainer.classList.remove('closing');
        launcherContainer.classList.remove('chat-active');
    }, 300); // Match the closing animation duration
});

// Update Enter key handler to always show fresh chat
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && input.value.trim() !== '') {
        e.preventDefault();
        
        // Show chat if hidden and ensure it's empty
        if (!chatContainer.classList.contains('expanded')) {
            chatContainer.querySelector('.chat-messages').innerHTML = '';
        }
        
        chatContainer.classList.add('expanded');
        launcherContainer.classList.add('chat-active');
        
        // Create and add user message
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.textContent = input.value;
        const chatMessages = chatContainer.querySelector('.chat-messages');
        chatMessages.appendChild(message);
        
        // Clear input
        input.value = '';
        
        // Show thinking animation
        const typingIndicator = document.querySelector('.typing-indicator');
        typingIndicator.classList.add('visible');
        
        // Scroll to show the thinking animation
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Wait for animation (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Hide thinking animation
        typingIndicator.classList.remove('visible');
        
        // Add AI response
        const response = document.createElement('div');
        response.className = 'message ai-message';
        response.textContent = "Here's an AI summary of your prompt 🤔. Discusses a significant development in the user experience of Claude. It states that what began as a simple solution to a practical problem led to a more profound transformation. Specifically, when Designer Michael saw the prototype, he recognized its potential to evolve Claude from being just a chatbot into a creative partner that could generate tangible outputs and engage in a more collaborative process.​​​​​​​​​​​​​​​​...";
        chatMessages.appendChild(response);
        
        // Scroll to show the new message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}); 