/* app.js: only the demo controls. The motion itself is pure CSS. */

const slider = document.getElementById('distance');
const readout = document.getElementById('distance-value');

/* The slider sets --scrub, which the CSS uses for offset-distance while paused */
slider.addEventListener('input', () => {
    document.getElementById('scrub').checked = true;
    const value = slider.value + '%';
    readout.textContent = value;
    document.documentElement.style.setProperty('--scrub', value);
});

document.getElementById('speed').addEventListener('change', (event) => {
    document.documentElement.style.setProperty('--duration', event.target.value);
});
