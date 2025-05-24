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
