/* app.js: three small jobs. The accordion itself needs no JavaScript.

   1. The speed control sets --duration so you can slow the animation down on camera.
   2. Show whether the browser supports interpolate-size.
   3. Optional fallback: if it is NOT supported, animate with scrollHeight instead.
*/

/* 1. Speed control */
document.getElementById('speed').addEventListener('change', (event) => {
    document.documentElement.style.setProperty('--duration', event.target.value);
});

/* 2. Support status */
const supported = CSS.supports('interpolate-size', 'allow-keywords');
document.getElementById('support-status').textContent =
    "CSS.supports('interpolate-size', 'allow-keywords') = " + supported;

/* 3. Fallback, only where the property is missing.
   It sets a pixel height, which would fight height: auto in a browser that
   supports interpolate-size, so it must not run there. */
if (!supported) {
    document.querySelectorAll('.accordion details').forEach((details) => {
        const panel = details.querySelector('.panel');
        details.addEventListener('toggle', () => {
            panel.style.height = details.open ? panel.scrollHeight + 'px' : '0';
        });
    });
}
