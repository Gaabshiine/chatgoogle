const input = document.getElementById("navSearchInput");
function focusSearchInput() {
  const input = document.getElementById("navSearchInput");
  if (input) {
    input.focus();
    input.classList.add("is-active");
  }

  if (input) {
    input.classList.add("navbar-search-btn");
    input.focus();
  }
}

// implement resizable divs
const resizer = document.getElementById("room-resizer");
const rightPane = document.getElementById("right-pane");

let isResizing = false;

resizer.addEventListener("mousedown", e => {
  isResizing = true;
  document.body.style.cursor = "col-resize";
});

document.addEventListener("mousemove", e => {
  if (!isResizing) return;

  const containerOffsetLeft = document.querySelector(
    ".chat-container"
  ).offsetLeft;
  const newLeftWidth = e.clientX - containerOffsetLeft - 72; /* sidebar width */

  if (newLeftWidth > 150 && newLeftWidth < 600) {
    leftPane.style.width = `${newLeftWidth}px`;
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = "default";
});

// Sidebar toggle functionality
const sidebar = document.querySelector('.chat-sidebar');
const toggleBtn = document.querySelector('.open_sidebar_btn');
const leftPane = document.querySelector('.chats-panel');
let isPushed = false;

// Toggle button click handler
toggleBtn.addEventListener('click', function() {
  isPushed = !isPushed;
  
  if (isPushed) {
    sidebar.classList.add('pushed');
    leftPane.classList.add('pushed');
  } else {
    sidebar.classList.remove('pushed');
    leftPane.classList.remove('pushed');
  }
});


// Update your chat item click handler to include this
// Update your chat item click handler
document.addEventListener('DOMContentLoaded', function() {
  const chatItems = document.querySelectorAll('.chat-item');
  const emptyChat = document.querySelector('.empty-chat');
  const conversationView = document.querySelector('.conversation-view');

  chatItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      chatItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Show conversation view and hide empty state
      emptyChat.style.display = 'none';
      conversationView.style.display = 'flex';
      
      // Scroll to bottom of conversation
      const conversationBody = document.querySelector('.conversation-body');
      conversationBody.scrollTop = conversationBody.scrollHeight;
    });
  });

  // Auto-scroll to bottom when new messages are added
  const observer = new MutationObserver(function(mutations) {
    const conversationBody = document.querySelector('.conversation-body');
    conversationBody.scrollTop = conversationBody.scrollHeight;
  });

  const config = { childList: true, subtree: true };
  const messageHistory = document.querySelector('.message-history');
  if (messageHistory) {
    observer.observe(messageHistory, config);
  }
});