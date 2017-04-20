document.addEventListener("DOMContentLoaded", () => {
    if (!('serviceWorker' in navigator)) {
        console.warn("Service workers aren't supported on this browser");
        return;
    }

    navigator.serviceWorker.register("serviceWorker.js")
    .then(() => {
        console.log('[SW] Service worker has been registered');
    }, e => {
        console.error('[SW] Service worker registration failed', e);
    });
});
