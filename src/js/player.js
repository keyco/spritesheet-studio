import { cfg, els } from './config.js';

let animationInterval = null;

export function syncConfig() {
    cfg.width = parseInt(els.frameWidthInp.value) || 0;
    cfg.height = parseInt(els.frameHeightInp.value) || 0;
    cfg.layout = els.sheetLayoutSel.value;
    cfg.speed = parseInt(els.speedInput.value) || 0;
    cfg.zoom = parseInt(els.zoomScaleSel.value) || 1;
    cfg.mirrorX = els.flipHorizontalInp.checked;

    if (cfg.layout === 'custom') {
        els.containerCustomList.classList.remove('hidden');
        els.containerTotalFrames.classList.add('hidden');
        els.containerStartX.classList.add('hidden');
        els.containerStartY.classList.add('hidden');

        let tokens = els.customFramesInp.value.trim().split(/\s+/);
        cfg.customFrames = [];
        tokens.forEach(token => {
            let parts = token.split(',');
            if (parts.length === 2) {
                let xVal = parseInt(parts[0]);
                let yVal = parseInt(parts[1]);
                if (!isNaN(xVal) && !isNaN(yVal) && xVal >= 0 && yVal >= 0) {
                    cfg.customFrames.push({ x: xVal, y: yVal });
                }
            }
        });
        cfg.totalFrames = cfg.customFrames.length;
    } else {
        els.containerCustomList.classList.add('hidden');
        els.containerTotalFrames.classList.remove('hidden');
        els.containerStartX.classList.remove('hidden');
        els.containerStartY.classList.remove('hidden');

        cfg.totalFrames = parseInt(els.totalFramesInp.value) || 0;
        cfg.startX = parseInt(els.startColumnInp.value) || 0;
        cfg.startY = parseInt(els.startRowInp.value) || 0;
    }

    els.zoomWrapper.style.transform = `scale(${cfg.zoom})`;
    els.viewer.style.width = `${cfg.width}px`;
    els.viewer.style.height = `${cfg.height}px`;
    els.viewer.style.border = (cfg.width > 0 && cfg.height > 0) ? '1px solid #4caf50' : '1px dashed #555';

    if (cfg.mirrorX) {
        els.viewer.classList.add('flipped-horizontally');
    } else {
        els.viewer.classList.remove('flipped-horizontally');
    }
}

export function updateAnimation(advance = true) {
    if (cfg.totalFrames <= 0 || cfg.width <= 0 || cfg.height <= 0) {
        els.debugInfo.innerText = "Pausado: Configura Dimensiones, Frames > 0 e Imagen...";
        els.gridOverlayBox.style.display = 'none';
        return;
    }

    if (cfg.currentFrame >= cfg.totalFrames) cfg.currentFrame = 0;
    if (cfg.currentFrame < 0) cfg.currentFrame = cfg.totalFrames - 1;

    let posX = 0;
    let posY = 0;

    if (cfg.layout === 'horizontal') {
        posX = (cfg.startX + cfg.currentFrame) * cfg.width;
        posY = cfg.startY * cfg.height;
    } else if (cfg.layout === 'vertical') {
        posX = cfg.startX * cfg.width;
        posY = (cfg.startY + cfg.currentFrame) * cfg.height;
    } else if (cfg.layout === 'custom') {
        let targetFrame = cfg.customFrames[cfg.currentFrame];
        if (targetFrame) {
            posX = targetFrame.x * cfg.width;
            posY = targetFrame.y * cfg.height;
        }
    }

    els.viewer.style.backgroundPosition = `-${posX}px -${posY}px`;

    if (cfg.currentImageSrc) {
        els.gridOverlayBox.style.width = `${cfg.width}px`;
        els.gridOverlayBox.style.height = `${cfg.height}px`;
        els.gridOverlayBox.style.left = `${posX}px`;
        els.gridOverlayBox.style.top = `${posY}px`;
        els.gridOverlayBox.style.display = 'block';
    } else {
        els.gridOverlayBox.style.display = 'none';
    }

    let debugText = `Estado: ${cfg.isPlaying ? '▶️ REPRODUCIENDO' : '⏸️ PAUSADO'}\n`;
    debugText += `Casilla: ${cfg.currentFrame + 1} / ${cfg.totalFrames} | Dimensiones: ${cfg.width}x${cfg.height}px\n`;
    debugText += `Coordenadas CSS: background-position: -${posX}px -${posY}px;`;

    els.debugInfo.innerText = debugText;

    if (advance) {
        cfg.currentFrame = (cfg.currentFrame + 1) % cfg.totalFrames;
    }
}

export function startAnimation() {
    if (animationInterval) clearInterval(animationInterval);
    if (cfg.isPlaying && cfg.speed > 0 && cfg.totalFrames > 0 && cfg.width > 0) {
        animationInterval = setInterval(() => {
            updateAnimation(true);
        }, cfg.speed);
    } else {
        updateAnimation(false);
    }
}

export function resetTimeline() {
    cfg.currentFrame = 0;
    syncConfig();
    startAnimation();
}

export function updatePlayButtonUI() {
    if (cfg.isPlaying) {
        els.btnTogglePlay.innerText = "⏸️ Pausa";
        els.btnTogglePlay.className = "btn btn-pause-state";
    } else {
        els.btnTogglePlay.innerText = "▶️ Play";
        els.btnTogglePlay.className = "btn btn-play-state";
    }
}