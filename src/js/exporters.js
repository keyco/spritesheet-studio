import { cfg, showToast } from './config.js';

export function initExporters() {
    document.getElementById('btn-copy-css').addEventListener('click', () => {
        if (cfg.totalFrames <= 0) { showToast("⚠️ No hay frames válidos."); return; }
        const totalDuration = cfg.speed > 0 ? (cfg.speed * cfg.totalFrames) / 1000 : 0;
        let keyframesSteps = "";
        
        for (let i = 0; i < cfg.totalFrames; i++) {
            const percent = ((i / cfg.totalFrames) * 100).toFixed(1);
            let posX = (cfg.startX + i) * cfg.width;
            let posY = cfg.startY * cfg.height;
            keyframesSteps += `    ${percent}% { background-position: -${posX}px -${posY}px; }\n`;
        }

        const cssCode = `@keyframes custom-sprite-anime {\n${keyframesSteps}\n}\n\n.sprite-render {\n    width: ${cfg.width}px;\n    height: ${cfg.height}px;\n    background-image: url('tu-archivo-spritesheet.png');\n    image-rendering: pixelated;\n    animation: custom-sprite-anime ${totalDuration}s steps(1) infinite;\n}`;

        navigator.clipboard.writeText(cssCode).then(() => showToast("¡Código CSS copiado!"));
    });

    document.getElementById('btn-copy-json').addEventListener('click', () => {
        const jsonData = {
            frameWidth: cfg.width,
            frameHeight: cfg.height,
            orientation: cfg.layout,
            totalFrames: cfg.totalFrames,
            frameRateMs: cfg.speed,
            loop: true
        };

        navigator.clipboard.writeText(JSON.stringify(jsonData, null, 4)).then(() => showToast("¡JSON copiado!"));
    });
}