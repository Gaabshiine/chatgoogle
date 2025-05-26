// Search input focus functionality
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

// Resizable panes functionality
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
  const initialLeftWidth = Math.min(385, containerWidth * 0.4); // Use 40% or 385px, whichever is smaller
  const initialRightWidth = containerWidth - initialLeftWidth - resizerWidth;

  leftPane.style.width = `${initialLeftWidth}px`;
  rightPane.style.width = `${initialRightWidth}px`;
}

window.addEventListener("load", initializePanes);
window.addEventListener("resize", initializePanes);


// Sidebar toggle functionality
const sidebar = document.querySelector('.chat-sidebar');
const toggleBtn = document.querySelector('.open_sidebar_btn');
let isPushed = false;

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

// Chat item click functionality
document.addEventListener('DOMContentLoaded', function() {
  const chatItems = document.querySelectorAll('.chat-item');
  const emptyChat = document.querySelector('.empty-chat');
  const conversationView = document.querySelector('.conversation-view');

  chatItems.forEach(item => {
    item.addEventListener('click', function() {
      chatItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      
      emptyChat.style.display = 'none';
      conversationView.style.display = 'flex';
      
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