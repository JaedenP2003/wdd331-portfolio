/* app.js: only two jobs, and neither one positions a tooltip with the new CSS.

   1. The "old way" tooltip in section 1, to show what anchor positioning replaces.
   2. Dragging the anchor in section 4, so you can push it into a corner.
*/

/* ---------- 1. Old way: measure the button, then set top and left ---------- */
const oldBtn = document.querySelector('.old-btn');
const oldTip = document.querySelector('.old-tip');

function placeOldTip() {
    const rect = oldBtn.getBoundingClientRect();
    oldTip.style.top = rect.top + window.scrollY - oldTip.offsetHeight - 8 + 'px';
    oldTip.style.left = rect.left + window.scrollX + rect.width / 2 - oldTip.offsetWidth / 2 + 'px';
}

function showOldTip() {
    oldTip.hidden = false;
    placeOldTip();
}

function hideOldTip() {
    oldTip.hidden = true;
}

oldBtn.addEventListener('mouseenter', showOldTip);
oldBtn.addEventListener('focus', showOldTip);
oldBtn.addEventListener('mouseleave', hideOldTip);
oldBtn.addEventListener('blur', hideOldTip);
/* Every case that moves the button needs its own listener, and there is
   still no logic here for running out of room at an edge. */
window.addEventListener('resize', () => { if (!oldTip.hidden) placeOldTip(); });
window.addEventListener('scroll', () => { if (!oldTip.hidden) placeOldTip(); });


/* ---------- 4. Drag the anchor around the stage ---------- */
const stage = document.querySelector('.drag-stage');
const dragAnchor = document.querySelector('.drag-anchor');

let offsetX = 0;
let offsetY = 0;

dragAnchor.addEventListener('pointerdown', (e) => {
    const box = dragAnchor.getBoundingClientRect();
    offsetX = e.clientX - box.left;
    offsetY = e.clientY - box.top;
    dragAnchor.setPointerCapture(e.pointerId);
    dragAnchor.addEventListener('pointermove', onDrag);
});

dragAnchor.addEventListener('pointerup', () => {
    dragAnchor.removeEventListener('pointermove', onDrag);
});

function onDrag(e) {
    const stageBox = stage.getBoundingClientRect();
    const maxX = stage.clientWidth - dragAnchor.offsetWidth;
    const maxY = stage.clientHeight - dragAnchor.offsetHeight;
    const x = Math.min(Math.max(e.clientX - stageBox.left - offsetX, 0), maxX);
    const y = Math.min(Math.max(e.clientY - stageBox.top - offsetY, 0), maxY);
    dragAnchor.style.left = x + 'px';
    dragAnchor.style.top = y + 'px';
}

/* Keyboard: arrow keys nudge the anchor */
dragAnchor.addEventListener('keydown', (e) => {
    const step = 20;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    const x = Math.min(Math.max(dragAnchor.offsetLeft + move[0], 0), stage.clientWidth - dragAnchor.offsetWidth);
    const y = Math.min(Math.max(dragAnchor.offsetTop + move[1], 0), stage.clientHeight - dragAnchor.offsetHeight);
    dragAnchor.style.left = x + 'px';
    dragAnchor.style.top = y + 'px';
});
