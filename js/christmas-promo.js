(function () {
    'use strict';
    var modal = document.getElementById('christmas-promo');
    if (!modal || typeof modal.showModal !== 'function') return;

    var readyAt = Date.now() + 2000;
    window.addEventListener('scroll', function () {
        setTimeout(function () {
            var previousOverflow = document.documentElement.style.overflow;
            var previousFocus = document.activeElement;
            modal.addEventListener('close', function () {
                document.documentElement.style.overflow = previousOverflow;
                if (previousFocus) previousFocus.focus({ preventScroll: true });
            }, { once: true });
            modal.showModal();
            document.documentElement.style.overflow = 'hidden';
        }, Math.max(0, readyAt - Date.now()));
    }, { once: true, passive: true });

    modal.querySelector('button').addEventListener('click', function () {
        modal.close();
    });
}());
