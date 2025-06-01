// Search input focus functionality
function focusSearchInput() {
  const input = document.getElementById("navSearchInput");
  if (input) {
    input.focus();
    input.classList.add("is-active");
    input.classList.add("navbar-search-btn");
  }
}

// Resizable panes functionality
function setupResizablePanes() {
  const resizer = document.getElementById("room-resizer");
  const leftPane = document.getElementById("left-pane");
  const rightPane = document.getElementById("right-pane");
  const chatContainer = document.querySelector(".chat-container");

  let isResizing = false;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    const containerRect = chatContainer.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const containerWidth = containerRect.width;
    const resizerWidth = resizer.offsetWidth;

    // Set constraints
    const minLeftWidth = 150;
    const maxLeftWidth = containerWidth * 0.7;
    const minRightWidth = 300;

    // Calculate new widths
    let newLeftWidth = Math.max(minLeftWidth, Math.min(mouseX, maxLeftWidth));
    let newRightWidth = containerWidth - newLeftWidth - resizerWidth;

    // Ensure right pane doesn't go below minimum
    if (newRightWidth < minRightWidth) {
      newRightWidth = minRightWidth;
      newLeftWidth = containerWidth - minRightWidth - resizerWidth;
    }

    // Apply new widths
    leftPane.style.width = `${newLeftWidth}px`;
    rightPane.style.width = `${newRightWidth}px`;
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  });

  // Initialize panes
  function initializePanes() {
    const containerWidth = chatContainer.offsetWidth;
    const resizerWidth = resizer.offsetWidth;
    const initialLeftWidth = Math.min(385, containerWidth * 0.4);
    const initialRightWidth = containerWidth - initialLeftWidth - resizerWidth;

    leftPane.style.width = `${initialLeftWidth}px`;
    rightPane.style.width = `${initialRightWidth}px`;
  }

  window.addEventListener("load", initializePanes);
  window.addEventListener("resize", initializePanes);
}

// Sidebar functionality
function setupSidebar() {
  const sidebar = document.querySelector('.chat-sidebar');
  const toggleBtn = document.querySelector('.open_sidebar_btn');
  let isPushed = true;

  // Create overlay element
  const sidebarOverlay = document.createElement('div');
  sidebarOverlay.className = 'sidebar-overlay';

  const newChatBtn = document.createElement('div');
  newChatBtn.className = 'sidebar-newchat sidebar-newchat-overlay';
  newChatBtn.innerHTML = `
    <span class="material-symbols-outlined">chat</span>
    <span class="newchat-label">New chat</span>
  `;
  sidebarOverlay.appendChild(newChatBtn);
  
  // Clone and modify sidebar items for overlay
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    const clone = item.cloneNode(true);
    const textSpan = clone.querySelector('span:last-child');
    
    // Ensure text is visible in overlay
    if (textSpan) {
      textSpan.style.display = 'inline';
      textSpan.style.fontSize = '14px';
    }
    
    clone.style.flexDirection = 'row';
    clone.style.justifyContent = 'flex-start';
    clone.style.padding = '2px 16px';
    clone.style.gap = '16px';
    sidebarOverlay.appendChild(clone);
  });

  // Add overlay to sidebar
  sidebar.appendChild(sidebarOverlay);

  // Toggle button functionality
  toggleBtn.addEventListener('click', function() {
    isPushed = !isPushed;
    
    if (isPushed) {
      sidebar.classList.add('pushed');
      document.querySelector('#left-pane').classList.add('pushed');
      sidebarOverlay.style.display = 'none';
    } else {
      sidebar.classList.remove('pushed');
      document.querySelector('#left-pane').classList.remove('pushed');
    }
  });

  // Hover functionality
  let hoverTimeout;
  const hoverDelay = 200; // milliseconds

  sidebar.addEventListener('mouseenter', () => {
    if (isPushed) return;
    
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      sidebarOverlay.style.display = 'block';
      setTimeout(() => {
        sidebarOverlay.style.opacity = '1';
      }, 10);
    }, hoverDelay);
  });

  sidebar.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    if (isPushed) return;
    
    sidebarOverlay.style.opacity = '0';
    setTimeout(() => {
      if (sidebarOverlay.style.opacity === '0') {
        sidebarOverlay.style.display = 'none';
      }
    }, 200);
  });

  // Keep overlay open when hovering over it
  sidebarOverlay.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
    sidebarOverlay.style.display = 'block';
    sidebarOverlay.style.opacity = '1';
  });

  sidebarOverlay.addEventListener('mouseleave', () => {
    if (!isPushed) {
      sidebarOverlay.style.opacity = '0';
      setTimeout(() => {
        if (sidebarOverlay.style.opacity === '0') {
          sidebarOverlay.style.display = 'none';
        }
      }, 200);
    }
  });

  // Close overlay when clicking outside
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !e.target.classList.contains('open_sidebar_btn')) {
      sidebarOverlay.style.opacity = '0';
      setTimeout(() => {
        sidebarOverlay.style.display = 'none';
      }, 200);
    }
  });

  // Touch device support
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }

  if (isTouchDevice()) {
    sidebar.addEventListener('click', (e) => {
      if (!isPushed && e.target.closest('.sidebar-item')) {
        sidebarOverlay.style.display = 
          sidebarOverlay.style.display === 'block' ? 'none' : 'block';
        sidebarOverlay.style.opacity = 
          sidebarOverlay.style.opacity === '1' ? '0' : '1';
      }
    });
  }
}

// Chat item functionality
function setupChatItems() {
  const chatItems = document.querySelectorAll('.chat-item');
  const emptyChat = document.querySelector('.empty-chat');
  const conversationView = document.querySelector('.conversation-view');

  chatItems.forEach(item => {
    item.addEventListener('click', function() {
      chatItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      if (emptyChat) emptyChat.style.display = 'none';
      if (conversationView) conversationView.style.display = 'flex';
      
      const conversationBody = document.querySelector('.conversation-body');
      if (conversationBody) {
        conversationBody.scrollTop = conversationBody.scrollHeight;
      }
    });
  });

  // Auto-scroll to bottom when new messages are added
  const observer = new MutationObserver(function(mutations) {
    const conversationBody = document.querySelector('.conversation-body');
    if (conversationBody) {
      conversationBody.scrollTop = conversationBody.scrollHeight;
    }
  });

  const config = { childList: true, subtree: true };
  const messageHistory = document.querySelector('.message-history');
  if (messageHistory) {
    observer.observe(messageHistory, config);
  }
}

function setupMessageInput() {
  const messageInput = document.querySelector('.message-input');
  const sendButton = document.querySelector('.send-button');
  const emojiIcon = document.querySelector('.icon-emoji');
  const emojiInputPickerContainer = document.querySelector('.emoji-input-picker-container');
  const emojiInputPicker = document.querySelector('.emoji-input-picker');
  
  // Toggle input emoji picker
  emojiIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiInputPickerContainer.classList.toggle('active');
  });

  // Handle emoji selection for INPUT ONLY
  emojiInputPicker.addEventListener('emoji-click', (event) => {
    const emoji = event.detail.unicode;
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
    
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.focus();
    messageInput.selectionStart = cursorPos + emoji.length;
    messageInput.selectionEnd = cursorPos + emoji.length;
    
    messageInput.dispatchEvent(new Event('input'));
    emojiInputPickerContainer.classList.remove('active');
  });

  // Close input picker when clicking outside
  document.addEventListener('click', (e) => {
    if (!emojiInputPickerContainer.contains(e.target) && e.target !== emojiIcon) {
      emojiInputPickerContainer.classList.remove('active');
    }
  });
  
  if (!messageInput) return;

  // Auto-resize functionality
  function adjustHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    
    // Limit to max height (show scrollbar if needed)
    if (messageInput.scrollHeight > 120) {
      messageInput.style.overflowY = 'auto';
    } else {
      messageInput.style.overflowY = 'hidden';
    }
  }

  // Initial adjustment
  adjustHeight();

  // Handle input events
  messageInput.addEventListener('input', adjustHeight);

  // Handle keydown for Shift+Enter and Enter
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter - allow line break and expand
        adjustHeight();
      } else {
        // Just Enter - send message (prevent default to avoid newline)
        e.preventDefault();
        sendMessage();
      }
    }
  });

  // Send button click handler
  sendButton.addEventListener('click', sendMessage);

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      // Here you would normally send the message
      console.log('Message sent:', message);
      
      // Reset input
      messageInput.value = '';
      messageInput.style.height = 'auto';
      messageInput.style.height = '44px'; // Reset to initial height
    }
  }
}

function setupReactionPickers() {
  // Initialize all reaction pickers
  document.querySelectorAll('.reaction-wrapper').forEach(wrapper => {
    const reactionIcon = wrapper.querySelector('.action-icon');
    const pickerContainer = wrapper.querySelector('.reaction-picker-container');
    const picker = wrapper.querySelector('.reaction-picker');
    const message = wrapper.closest('.message');
    const reactionsContainer = message.querySelector('.message-reactions');
    
    // Toggle reaction picker
    reactionIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close all other pickers first
      document.querySelectorAll('.reaction-picker-container, .emoji-input-picker-container').forEach(container => {
        if (container !== pickerContainer) {
          container.classList.remove('active');
        }
      });
      pickerContainer.classList.toggle('active');
    });
    
    // Handle emoji selection FOR REACTIONS ONLY
    picker.addEventListener('emoji-click', (event) => {
      event.stopPropagation();
      const emoji = event.detail.unicode;
      toggleReaction(message, emoji);
      pickerContainer.classList.remove('active');
    });
  });
  
  // Close all pickers when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.reaction-picker-container') && 
        !e.target.closest('.emoji-input-picker-container') &&
        !e.target.closest('.action-icon[data-action="add_reaction"]') &&
        !e.target.closest('.icon-emoji')) {
      document.querySelectorAll('.reaction-picker-container, .emoji-input-picker-container').forEach(container => {
        container.classList.remove('active');
      });
    }
  });
}



function toggleReaction(message, emoji) {
  const reactionsContainer = message.querySelector('.message-reactions');
  const existingReaction = Array.from(reactionsContainer.children).find(
    el => el.textContent.trim() === emoji
  );
  
  if (existingReaction) {
    // Remove reaction if it exists
    existingReaction.remove();
  } else {
    // Add new reaction
    const reactionEl = document.createElement('div');
    reactionEl.className = 'reaction';
    reactionEl.textContent = emoji;
    reactionsContainer.appendChild(reactionEl);
    
    // Click handler to remove reaction
    reactionEl.addEventListener('click', (e) => {
      e.stopPropagation();
      reactionEl.remove();
    });
  }
}

function setupMoreVertMenu() {
  document.addEventListener('click', function (e) {
    // Close if clicking outside of both button and popup
    if (!e.target.closest('.more-vert-btn') && !e.target.closest('.more-vert-popup')) {
      closeAllMenus();
    }
  });

  document.querySelectorAll('.more-vert-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const chatMeta = btn.closest('.chat-meta');
      const popup = chatMeta.querySelector('.more-vert-popup');

      const isShowing = popup.classList.contains('show');
      closeAllMenus();

      if (!isShowing) {
        popup.classList.add('show');
        btn.classList.add('active');
      }
    });
  });

  function closeAllMenus() {
    document.querySelectorAll('.more-vert-popup').forEach(p => p.classList.remove('show'));
    document.querySelectorAll('.more-vert-btn').forEach(btn => btn.classList.remove('active'));
  }
}


function setupNewChatPopup() {
  const newChatBtn = document.querySelector('.sidebar-newchat');
  const newChatPopup = document.querySelector('.new-chat-popup');
  const searchInput = document.getElementById('chat-search-input');
  
  if (!newChatBtn || !newChatPopup) {
    console.error("Couldn't find new chat button or popup");
    return;
  }

  // Click handler for new chat button
  newChatBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isShowing = newChatPopup.classList.contains('show');
    closeAllPopups();
    
    if (!isShowing) {
      newChatPopup.classList.add('show');
      searchInput.focus(); // Focus search input when popup opens
    }
  });
  
  // Search functionality
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const items = newChatPopup.querySelectorAll('.popup-item');
    
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
    
    // Show/hide section titles based on visible items
    const sections = newChatPopup.querySelectorAll('.popup-section');
    sections.forEach(section => {
      const visibleItems = section.querySelectorAll('.popup-item[style="display: flex;"]');
      const sectionTitle = section.querySelector('.section-title');
      
      if (sectionTitle) {
        if (visibleItems.length > 0 || searchTerm === '') {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      } else {
        // For sections without titles (like the first one)
        if (visibleItems.length > 0 || searchTerm === '') {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      }
    });
  });
  
  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.new-chat-popup') && 
        !e.target.closest('.sidebar-newchat')) {
      closeNewChatPopup();
    }
  });
  
  function closeNewChatPopup() {
    newChatPopup.classList.remove('show');
    searchInput.value = ''; // Clear search on close
    
    // Reset all items to visible
    const items = newChatPopup.querySelectorAll('.popup-item');
    items.forEach(item => {
      item.style.display = 'flex';
    });
    
    // Reset all sections to visible
    const sections = newChatPopup.querySelectorAll('.popup-section');
    sections.forEach(section => {
      section.style.display = 'block';
    });
  }
  
  function closeAllPopups() {
    document.querySelectorAll('.more-vert-popup, .new-chat-popup').forEach(p => {
      p.classList.remove('show');
    });
    document.querySelectorAll('.more-vert-btn').forEach(btn => {
      btn.classList.remove('active');
    });
  }
}



// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
  setupNewChatPopup();
  setupMoreVertMenu();
  setupResizablePanes();
  setupSidebar();
  setupChatItems();
  setupMessageInput();
  setupReactionPickers();
});

