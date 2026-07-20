export const cfg = {
    width: 0,
    height: 0,
    layout: 'horizontal',
    totalFrames: 0,
    startX: 0,
    startY: 0,
    speed: 130,
    customFrames: [],
    mirrorX: false,
    zoom: 2,
    isPlaying: false,
    currentFrame: 0,
    currentImageSrc: '',
    loadedImageObj: new Image()
};

export const els = {
    viewer: document.getElementById('sprite-viewer'),
    zoomWrapper: document.getElementById('zoom-wrapper'),
    fileInput: document.getElementById('file-input'),
    frameWidthInp: document.getElementById('frame-width'),
    frameHeightInp: document.getElementById('frame-height'),
    sheetLayoutSel: document.getElementById('sheet-layout'),
    totalFramesInp: document.getElementById('total-frames'),
    startColumnInp: document.getElementById('start-column-x'),
    startRowInp: document.getElementById('start-row-y'),
    speedInput: document.getElementById('speed-input'),
    zoomScaleSel: document.getElementById('zoom-scale'),
    debugInfo: document.getElementById('debug-info'),
    toast: document.getElementById('toast-notification'),
    containerCustomList: document.getElementById('container-custom-list'),
    customFramesInp: document.getElementById('custom-frames-input'),
    containerTotalFrames: document.getElementById('container-total-frames'),
    containerStartX: document.getElementById('container-start-x'),
    containerStartY: document.getElementById('container-start-y'),
    flipHorizontalInp: document.getElementById('flip-horizontal'),
    btnTogglePlay: document.getElementById('btn-toggle-play'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    fullSheetImg: document.getElementById('full-sheet-img'),
    sheetWrapper: document.getElementById('sheet-wrapper'),
    gridOverlayBox: document.getElementById('grid-overlay-box'),
    dragSelectionBox: document.getElementById('drag-selection-box'),
    metaResolution: document.getElementById('meta-resolution'),
    metaSuggest: document.getElementById('meta-suggest')
};

export function showToast(message) {
    els.toast.innerText = message;
    els.toast.style.opacity = '1';
    setTimeout(() => { els.toast.style.opacity = '0'; }, 2500);
}