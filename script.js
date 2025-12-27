// ===========================
// State Management
// ===========================
const state = {
    isVisible: false,
    recentCommands: [],
    maxRecentCommands: 5,
    chatHistory: [],
    isMac: /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
};

// ===========================
// DOM Elements
// ===========================
const elements = {
    activationHint: null,
    launcherContainer: null,
    commandInput: null,
    chatContainer: null,
    chatMessages: null,
    typingIndicator: null,
    recentItems: null,
    suggestionCards: null,
    closeBtn: null,
    micBtn: null,
    settingsBtn: null
};

// ===========================
// Initialize
// ===========================
function init() {
    // Get DOM elements
    elements.activationHint = document.querySelector('.activation-hint');
    elements.launcherContainer = document.querySelector('.launcher-container');
    elements.commandInput = document.getElementById('command-input');
    elements.chatContainer = document.querySelector('.chat-container');
    elements.chatMessages = document.getElementById('chat-messages');
    elements.typingIndicator = document.querySelector('.typing-indicator');
    elements.recentItems = document.getElementById('recent-items');
    elements.suggestionCards = document.querySelectorAll('.suggestion-card');
    elements.closeBtn = document.querySelector('.close-btn');
    elements.micBtn = document.querySelector('.mic-btn');
    elements.settingsBtn = document.querySelector('.settings-btn');

    // Load recent commands from localStorage
    loadRecentCommands();

    // Setup event listeners
    setupEventListeners();

    // Initial render of recent items
    renderRecentItems();

    // Update activation hint based on platform
    updateActivationHint();

    console.log('AI Launcher initialized');
    console.log('Platform:', state.isMac ? 'Mac' : 'Other');
}

// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    // Input events
    elements.commandInput.addEventListener('keydown', handleInputKeyDown);
    elements.commandInput.addEventListener('input', handleInputChange);

    // Suggestion cards
    elements.suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const command = card.getAttribute('data-command');
            handleSuggestionClick(command, card.querySelector('.card-title').textContent);
        });
    });

    // Close button
    elements.closeBtn.addEventListener('click', closeChat);

    // Mic button
    elements.micBtn.addEventListener('click', handleMicClick);

    // Settings button
    elements.settingsBtn.addEventListener('click', handleSettingsClick);

    // Test toggle button
    const testBtn = document.getElementById('test-toggle-btn');
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            console.log('Test button clicked!');
            toggleLauncher();
        });
    }
}

// ===========================
// Keyboard Handling
// ===========================
function handleKeyDown(e) {
    // Toggle launcher with SHIFT+CMD+SPACE (Mac) or Ctrl+Space (other platforms)
    const isSpace = e.code === 'Space' || e.key === ' ' || e.keyCode === 32;

    // Log all Space key presses for debugging
    if (isSpace) {
        console.log('Space key detected:', {
            isMac: state.isMac,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
            ctrlKey: e.ctrlKey,
            altKey: e.altKey
        });
    }

    // Mac: SHIFT + CMD + SPACE, Other: Ctrl + Space
    const isShortcut = state.isMac
        ? (e.shiftKey && e.metaKey && isSpace)
        : (e.ctrlKey && isSpace);

    // Debug logging
    if (isShortcut) {
        console.log('✅ Launcher shortcut detected!', {
            isMac: state.isMac,
            shiftKey: e.shiftKey,
            metaKey: e.metaKey,
            ctrlKey: e.ctrlKey,
            isSpace: isSpace
        });
    }

    if (isShortcut) {
        e.preventDefault();
        toggleLauncher();
        return;
    }

    // Close with Escape
    if (e.code === 'Escape' && state.isVisible) {
        e.preventDefault();
        closeLauncher();
        return;
    }
}

function handleInputKeyDown(e) {
    // Submit on Enter
    if (e.key === 'Enter' && elements.commandInput.value.trim() !== '') {
        e.preventDefault();
        submitCommand(elements.commandInput.value.trim());
    }
}

function handleInputChange(e) {
    // Could add real-time search/filtering here
    const value = e.target.value;
    console.log('Input changed:', value);
}

// ===========================
// Launcher Control
// ===========================
function toggleLauncher() {
    if (state.isVisible) {
        closeLauncher();
    } else {
        openLauncher();
    }
}

function openLauncher() {
    state.isVisible = true;
    elements.launcherContainer.classList.add('visible');
    elements.activationHint.classList.add('hidden');

    // Focus input with a slight delay for animation
    setTimeout(() => {
        elements.commandInput.focus();
    }, 100);

    console.log('Launcher opened');
}

function closeLauncher() {
    state.isVisible = false;
    elements.launcherContainer.classList.remove('visible');
    elements.activationHint.classList.remove('hidden');
    elements.commandInput.value = '';
    elements.commandInput.blur();

    // Close chat if open
    if (elements.chatContainer.classList.contains('visible')) {
        closeChat();
    }

    console.log('Launcher closed');
}

// ===========================
// Chat Management
// ===========================
function openChat() {
    elements.chatContainer.classList.add('visible');
}

function closeChat() {
    elements.chatContainer.classList.remove('visible');
    // Clear chat after animation
    setTimeout(() => {
        elements.chatMessages.innerHTML = '';
        state.chatHistory = [];
    }, 300);
}

function addMessage(text, type = 'user') {
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    message.textContent = text;
    elements.chatMessages.appendChild(message);

    // Scroll to bottom
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

    // Add to history
    state.chatHistory.push({ text, type, timestamp: Date.now() });
}

function showTypingIndicator() {
    elements.typingIndicator.classList.add('visible');
    // Scroll to show typing indicator
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    elements.typingIndicator.classList.remove('visible');
}

async function submitCommand(command) {
    // Add to recent commands
    addRecentCommand(command);

    // Clear input
    elements.commandInput.value = '';

    // Open chat if not already open
    if (!elements.chatContainer.classList.contains('visible')) {
        openChat();
    }

    // Add user message
    addMessage(command, 'user');

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response (replace with actual AI integration)
    await simulateAIResponse(command);

    // Hide typing indicator
    hideTypingIndicator();

    // Add AI response
    const response = generateAIResponse(command);
    addMessage(response, 'ai');
}

async function simulateAIResponse(command) {
    // Simulate network delay
    const delay = 1500 + Math.random() * 1000; // 1.5-2.5 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
}

function generateAIResponse(command) {
    // Generate contextual responses based on command
    const responses = {
        analyze: "I've analyzed the current context. Here are the key insights: Your workflow appears optimized, with several opportunities for automation. Would you like me to elaborate on specific areas?",
        search: `I found several relevant results for "${command}". The most relevant items have been highlighted. Would you like me to search more specifically?`,
        generate: "I've generated content based on your request. The output has been formatted and is ready for use. Would you like me to make any adjustments?",
        assistant: "I'm your AI assistant, ready to help! I can analyze data, search for information, generate content, and much more. What would you like me to help you with?"
    };

    // Check if command matches any quick action
    for (const [key, response] of Object.entries(responses)) {
        if (command.toLowerCase().includes(key)) {
            return response;
        }
    }

    // Default response
    return `I've processed your request: "${command}". As an AI assistant, I'm here to help you with various tasks including analysis, search, content generation, and more. How else can I assist you today?`;
}

function handleSuggestionClick(command, title) {
    console.log('Suggestion clicked:', command, title);

    // Set input value
    elements.commandInput.value = `${title}: `;
    elements.commandInput.focus();

    // Or directly submit the command
    // submitCommand(title);
}

// ===========================
// Recent Commands Management
// ===========================
function loadRecentCommands() {
    try {
        const saved = localStorage.getItem('aiLauncherRecent');
        if (saved) {
            state.recentCommands = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load recent commands:', error);
        state.recentCommands = [];
    }
}

function saveRecentCommands() {
    try {
        localStorage.setItem('aiLauncherRecent', JSON.stringify(state.recentCommands));
    } catch (error) {
        console.error('Failed to save recent commands:', error);
    }
}

function addRecentCommand(command) {
    // Remove if already exists
    state.recentCommands = state.recentCommands.filter(item => item.text !== command);

    // Add to beginning
    state.recentCommands.unshift({
        text: command,
        timestamp: Date.now()
    });

    // Limit to max recent commands
    if (state.recentCommands.length > state.maxRecentCommands) {
        state.recentCommands = state.recentCommands.slice(0, state.maxRecentCommands);
    }

    // Save and render
    saveRecentCommands();
    renderRecentItems();
}

function renderRecentItems() {
    if (state.recentCommands.length === 0) {
        elements.recentItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <span>No recent commands</span>
            </div>
        `;
        return;
    }

    elements.recentItems.innerHTML = state.recentCommands
        .map(item => {
            const timeAgo = getTimeAgo(item.timestamp);
            return `
                <div class="recent-item" data-command="${escapeHtml(item.text)}">
                    <i class="fas fa-terminal"></i>
                    <span>${escapeHtml(item.text)}</span>
                    <span class="recent-time">${timeAgo}</span>
                </div>
            `;
        })
        .join('');

    // Add click handlers to recent items
    document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', () => {
            const command = item.getAttribute('data-command');
            submitCommand(command);
        });
    });
}

// ===========================
// Button Handlers
// ===========================
function handleMicClick() {
    console.log('Microphone button clicked');
    // Implement voice input functionality here
    alert('Voice input feature coming soon!');
}

function handleSettingsClick() {
    console.log('Settings button clicked');
    // Implement settings panel here
    alert('Settings panel coming soon!');
}

// ===========================
// Utility Functions
// ===========================
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateActivationHint() {
    const hintElement = elements.activationHint;
    if (hintElement) {
        if (state.isMac) {
            hintElement.innerHTML = `
                <span class="hint-key">SHIFT</span> + <span class="hint-key">CMD</span> + <span class="hint-key">Space</span> to launch
            `;
        } else {
            hintElement.innerHTML = `
                <span class="hint-key">Ctrl</span> + <span class="hint-key">Space</span> to launch
            `;
        }
    }
}

// ===========================
// Initialize on DOM ready
// ===========================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===========================
// Export for debugging (optional)
// ===========================
window.aiLauncher = {
    state,
    elements,
    toggleLauncher,
    submitCommand,
    closeChat
};
