var slides, currentPageNumber, activeSlide, incremental,
    revealedCls = 'revealed', incrementalSelector = '.incremental',
    querySelector = 'querySelector', loc = location, doc = document, document_body;

document_body = doc.body;
slides = Array.from(doc[querySelector + 'All']('section'));

function setPage(newPageNumber) {
    currentPageNumber = Math.min(slides.length, newPageNumber || 1);
    activeSlide = slides[currentPageNumber - 1];
    Array.from(activeSlide[querySelector + 'All'](incrementalSelector)).forEach(function (el) {
        el.classList.remove(revealedCls);
    });
    loc.hash = currentPageNumber;
    document_body.style.background = activeSlide.dataset.bg || '';
    document_body.dataset.slide_id = activeSlide.dataset.id || currentPageNumber;
}

/*window.*/addEventListener('keydown', function (e, preventDefault) {
    switch (e.keyCode - 32) { // - 32 for better compression
    case 32 - 32: // space
    case 34 - 32: // pgDn
    case 39 - 32: // right arrow
    case 40 - 32: // down arrow
    //case 90 - 32: // z abuse (Incutex Mini Wireless Presenter)
        incremental = activeSlide[querySelector](incrementalSelector + ':not(.' + revealedCls + ')');
        if (incremental) {
            incremental.classList.add(revealedCls);
        } else {
            setPage(currentPageNumber + 1);
        }
        preventDefault = 1;
        break;
    case 33 - 32: // pgUp
    case 37 - 32: // left
    case 38 - 32: // up
    //case 116 - 32: // F5 abuse (Incutex Mini Wireless Presenter)
        setPage(currentPageNumber - 1);
        preventDefault = 1;
        break;
    case 27 - 32: // esc
        document_body.classList.toggle('muted');
        preventDefault = 1;
        break;
    case 36 - 32: // home
        setPage(1);
        preventDefault = 1;
        break;
    case 35 - 32: // end
        setPage(Infinity); // shorter than slides.length, since it gets compressed to 1/0
        preventDefault = 1;
        break;
    }
    if (preventDefault) {
        e.preventDefault();
    }
});

slides.forEach(function (slide, i) {
    slide.id = i + 1;
});

function processHash(newPageNumber) {
    newPageNumber = loc.hash.substr(1);
    if (newPageNumber != currentPageNumber) {
        setPage(newPageNumber);
    }
}
processHash();
document_body.classList.add('loaded');
setInterval(processHash, 99);
