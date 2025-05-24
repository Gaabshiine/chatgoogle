
const input = document.getElementById("navSearchInput");
function focusSearchInput() {
  const input = document.getElementById("navSearchInput");
  if (input) {
    input.focus(); // Set focus
    input.classList.add("is-active"); // Optional: Add active class
  }

  if (input) {
    input.classList.add("navbar-search-btn");
    input.focus();
  }
}


// implement resizable divs
const resizer = document.getElementById("room-resizer");
const leftPane = document.getElementById("left-pane");
const rightPane = document.getElementById("right-pane");

let isResizing = false;

resizer.addEventListener("mousedown", e => {
  isResizing = true;
  document.body.style.cursor = "col-resize";
});

document.addEventListener("mousemove", e => {
  if (!isResizing) return;

  const containerOffsetLeft = document.querySelector(
    ".my-rooms-container"
  ).offsetLeft;
  const newLeftWidth =
    e.clientX -
    containerOffsetLeft -
    document.querySelector(".col-2").offsetWidth;

  if (newLeftWidth > 150 && newLeftWidth < 600) {
    leftPane.style.width = `${newLeftWidth}px`;
  }
});

document.addEventListener("mouseup", () => {
  isResizing = false;
  document.body.style.cursor = "default";
});
// implement resizable divs