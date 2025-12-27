// ===========================
// State Management
// ===========================
const state = {
    isVisible: false,
    selectedIndex: -1,
    items: []
};

// ===========================
// DOM Elements
// ===========================
const elements = {
    activationHint: null,
    launcherContainer: null,
    commandInput: null,
    submitBtn: null,
    chatItems: null,
    actionItems: null,
    quickActionBtns: null,
    switchBtns: null,
    shortcutBtns: null
};

// ===========================
// Initialize
// ===========================
function init() {
    // Get DOM elements
    elements.activationHint = document.querySelector('.activation-hint');
    elements.launcherContainer = document.querySelector('.launcher-container');
    elements.commandInput = document.getElementById('command-input');
    elements.submitBtn = document.getElementById('submit-btn');
    elements.chatItems = document.querySelectorAll('.chat-item');
    elements.actionItems = document.querySelectorAll('.action-item');
    elements.quickActionBtns = document.querySelectorAll('.quick-action-btn');
    elements.switchBtns = document.querySelectorAll('.switch-btn');
    elements.shortcutBtns = document.querySelectorAll('.shortcut-btn');

    // Build items list for navigation
    buildItemsList();

    // Setup event listeners
    setupEventListeners();

    console.log('AI Launcher initialized');
}

// ===========================
// Build navigable items list
// ===========================
function buildItemsList() {
    state.items = [
        ...elements.chatItems,
        ...elements.actionItems
    ];
}

// ===========================
// Event Listeners
// ===========================
function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    // Input events
    elements.commandInput.addEventListener('keydown', handleInputKeyDown);

    // Submit button
    elements.submitBtn.addEventListener('click', handleSubmit);

    // Chat items
    elements.chatItems.forEach(item => {
        item.addEventListener('click', () => handleChatItemClick(item));
    });

    // Action items
    elements.actionItems.forEach(item => {
        item.addEventListener('click', () => handleActionItemClick(item));
    });

    // Quick action buttons
    elements.quickActionBtns.forEach(btn => {
        btn.addEventListener('click', () => handleQuickActionClick(btn));
    });

    // Switch buttons - prevent propagation
    elements.switchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleSwitchClick(btn);
        });
    });

    // Shortcut buttons - prevent propagation
    elements.shortcutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleShortcutClick(btn);
        });
    });
}

// ===========================
// Keyboard Handling
// ===========================
function handleKeyDown(e) {
    // Toggle launcher with Shift + Cmd + Space (Mac) or Shift + Ctrl + Space (Windows/Linux)
    if (e.code === 'Space' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
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

    // Navigation with arrow keys when launcher is visible
    if (state.isVisible && state.items.length > 0) {
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            navigateItems(1);
        } else if (e.code === 'ArrowUp') {
            e.preventDefault();
            navigateItems(-1);
        } else if (e.code === 'Enter' && state.selectedIndex >= 0) {
            e.preventDefault();
            selectCurrentItem();
        }
    }
}

function handleInputKeyDown(e) {
    // Submit on Enter
    if (e.key === 'Enter' && elements.commandInput.value.trim() !== '') {
        e.preventDefault();
        handleSubmit();
    }
}

// ===========================
// Navigation
// ===========================
function navigateItems(direction) {
    // Clear previous selection
    if (state.selectedIndex >= 0 && state.items[state.selectedIndex]) {
        state.items[state.selectedIndex].classList.remove('selected');
    }

    // Update index
    state.selectedIndex += direction;

    // Wrap around
    if (state.selectedIndex < 0) {
        state.selectedIndex = state.items.length - 1;
    } else if (state.selectedIndex >= state.items.length) {
        state.selectedIndex = 0;
    }

    // Apply selection
    if (state.items[state.selectedIndex]) {
        state.items[state.selectedIndex].classList.add('selected');
        state.items[state.selectedIndex].scrollIntoView({ block: 'nearest' });
    }
}

function selectCurrentItem() {
    if (state.selectedIndex >= 0 && state.items[state.selectedIndex]) {
        state.items[state.selectedIndex].click();
    }
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
    state.selectedIndex = -1;
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
    state.selectedIndex = -1;
    elements.launcherContainer.classList.remove('visible');
    elements.activationHint.classList.remove('hidden');
    elements.commandInput.value = '';
    elements.commandInput.blur();

    // Clear selection
    state.items.forEach(item => item.classList.remove('selected'));

    console.log('Launcher closed');
}

// ===========================
// Click Handlers
// ===========================
function handleChatItemClick(item) {
    const chatName = item.querySelector('.chat-name').textContent;
    console.log('Chat clicked:', chatName);
    // Here you would switch to the chat
    showNotification(`Switching to chat: ${chatName}`);
}

function handleActionItemClick(item) {
    const actionName = item.querySelector('.action-name').textContent;
    console.log('Action clicked:', actionName);
    // Here you would perform the action
    showNotification(`Executing: ${actionName}`);
}

function handleQuickActionClick(btn) {
    const actionText = btn.querySelector('span').textContent;
    console.log('Quick action clicked:', actionText);
    showNotification(`${actionText} activated`);
}

function handleSwitchClick(btn) {
    const btnText = btn.textContent.trim();
    console.log('Switch clicked:', btnText);
    showNotification(btnText);
}

function handleShortcutClick(btn) {
    const shortcut = btn.textContent;
    console.log('Shortcut clicked:', shortcut);
    showNotification(`Shortcut ${shortcut} triggered`);
}

function handleSubmit() {
    const query = elements.commandInput.value.trim();
    if (query) {
        console.log('Submitted:', query);
        showNotification(`Processing: ${query}`);
        elements.commandInput.value = '';
    }
}

// ===========================
// Notification Helper
// ===========================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: rgba(30, 32, 40, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: slideUp 0.3s ease;
    `;

    // Add animation keyframes if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            .chat-item.selected,
            .action-item.selected {
                background: rgba(255, 255, 255, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
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
// Export for debugging
// ===========================
window.aiLauncher = {
    state,
    elements,
    toggleLauncher,
    openLauncher,
    closeLauncher
};
