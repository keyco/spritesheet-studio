import { cfg, els, showToast } from './config.js';
import { resetTimeline } from './player.js';

let isDragging = false;
let startMouseX = 0;
let startMouseY = 0;

export function suggestImageMetadata(img) {
    const w = img.width;
    const h = img.height;
    els.metaResolution.innerText = `${w} x ${h} px`;

    let cols = 4;
    let rows = 4;
    let calculatedWidth = Math.round(w / cols);
    let calculatedHeight = Math.round(h / rows);

    els.metaSuggest.innerText = `Posible Matriz ${cols}x${rows} (${calculatedWidth}x${calculatedHeight}px por frame)`;
}

export function initSelectorEvents() {
    els.sheetWrapper.addEventListener('mousedown', (e) => {
        if (!cfg.currentImageSrc) return;
        const rect = els.sheetWrapper.getBoundingClientRect();
        isDragging = true;
        startMouseX = e.clientX - rect.left;
        startMouseY = e.clientY - rect.top;

        els.dragSelectionBox.style.left = `${startMouseX}px`;
        els.dragSelectionBox.style.top = `${startMouseY}px`;
        els.dragSelectionBox.style.width = '0px';
        els.dragSelectionBox.style.height = '0px';
        els.dragSelectionBox.style.display = 'block';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = els.sheetWrapper.getBoundingClientRect();
        let currentX = e.clientX - rect.left;
        let currentY = e.clientY - rect.top;

        currentX = Math.max(0, Math.min(currentX, cfg.loadedImageObj.width));
        currentY = Math.max(0, Math.min(currentY, cfg.loadedImageObj.height));

        let width = Math.abs(currentX - startMouseX);
        let height = Math.abs(currentY - startMouseY);
        let left = Math.min(startMouseX, currentX);
        let top = Math.min(startMouseY, currentY);

        els.dragSelectionBox.style.left = `${left}px`;
        els.dragSelectionBox.style.top = `${top}px`;
        els.dragSelectionBox.style.width = `${width}px`;
        els.dragSelectionBox.style.height = `${height}px`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        els.dragSelectionBox.style.display = 'none';

        let drawnWidth = parseInt(els.dragSelectionBox.style.width);
        let drawnHeight = parseInt(els.dragSelectionBox.style.height);

        if (drawnWidth > 5 && drawnHeight > 5) {
            els.frameWidthInp.value = drawnWidth;
            els.frameHeightInp.value = drawnHeight;

            let leftPx = parseInt(els.dragSelectionBox.style.left);
            let topPx = parseInt(els.dragSelectionBox.style.top);

            els.startColumnInp.value = Math.floor(leftPx / drawnWidth);
            els.startRowInp.value = Math.floor(topPx / drawnHeight);

            let framesCalculados = Math.floor((cfg.loadedImageObj.width - leftPx) / drawnWidth) || 1;
            els.totalFramesInp.value = framesCalculados;

            showToast(`📐 Recorte fijado: ${drawnWidth}x${drawnHeight}px.`);
            resetTimeline();
        }
    });
}