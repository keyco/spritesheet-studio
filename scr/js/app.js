import { cfg, els, showToast } from './config.js';
import { syncConfig, updateAnimation, resetTimeline, updatePlayButtonUI, startAnimation } from './player.js';
import { suggestImageMetadata, initSelectorEvents } from './selector.js';
import { initExporters } from './exporters.js';

// Inicializar eventos de entrada e interfaz
[els.frameWidthInp, els.frameHeightInp, els.totalFramesInp, els.startColumnInp, els.startRowInp, els.customFramesInp].forEach(inp => inp.addEventListener('input', resetTimeline));

els.sheetLayoutSel.addEventListener('change', resetTimeline);
els.flipHorizontalInp.addEventListener('change', resetTimeline);
els.zoomScaleSel.addEventListener('change', syncConfig);

els.speedInput.addEventListener('input', () => {
    syncConfig();
    if (cfg.isPlaying) startAnimation();
});

// Controles de Reproducción
els.btnTogglePlay.addEventListener('click', () => {
    if (cfg.totalFrames <= 0 || cfg.width <= 0 || cfg.height <= 0) {
        showToast("⚠️ Define dimensiones y número de frames.");
        return;
    }
    cfg.isPlaying = !cfg.isPlaying;
    updatePlayButtonUI();
    
    if (cfg.isPlaying) {
        syncConfig();
        updateAnimation(true); 
        startAnimation();
    } else {
        startAnimation();
    }
});

els.btnPrev.addEventListener('click', () => {
    cfg.isPlaying = false;
    updatePlayButtonUI();
    if (cfg.totalFrames > 0) cfg.currentFrame = (cfg.currentFrame - 1 + cfg.totalFrames) % cfg.totalFrames;
    updateAnimation(false);
});

els.btnNext.addEventListener('click', () => {
    cfg.isPlaying = false;
    updatePlayButtonUI();
    if (cfg.totalFrames > 0) cfg.currentFrame = (cfg.currentFrame + 1) % cfg.totalFrames;
    updateAnimation(false);
});

// Carga de Archivo de Imagen
els.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            cfg.currentImageSrc = event.target.result;
            els.viewer.style.backgroundImage = `url('${cfg.currentImageSrc}')`;
            els.fullSheetImg.src = cfg.currentImageSrc; 
            
            cfg.loadedImageObj.src = cfg.currentImageSrc;
            cfg.loadedImageObj.onload = function() {
                suggestImageMetadata(this);
                
                if (parseInt(els.frameWidthInp.value) === 0) {
                    els.frameWidthInp.value = Math.round(this.width / 4);
                    els.frameHeightInp.value = Math.round(this.height / 4);
                    els.totalFramesInp.value = 4;
                }
                resetTimeline();
            };
        };
        reader.readAsDataURL(file);
    }
});

// Inicialización de componentes externos
initSelectorEvents();
initExporters();

// Arranque en frío
cfg.isPlaying = false;
updatePlayButtonUI();
syncConfig();
updateAnimation(false);