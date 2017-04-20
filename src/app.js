document.addEventListener("DOMContentLoaded", () => {
    let isPushEnabled = false;

    const pushButton = document.querySelector('#push-subscription-button');
    if (!pushButton) {
        return;
    }

    pushButton.addEventListener('click', function() {
        if (isPushEnabled) {
            push_unsubscribe();
        } else {
            push_subscribe();
        }
    });

    if (!('serviceWorker' in navigator)) {
        console.warn("Service workers are not supported by this browser");
        changePushButtonState('incompatible');
        return;
    }

    if (!('PushManager' in window)) {
        console.warn('Push notifications are not supported by this browser');
        changePushButtonState('incompatible');
        return;
    }

    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications are not supported by this browser');
        changePushButtonState('incompatible');
        return;
    }

    navigator.serviceWorker.register("serviceWorker.js")
    .then(() => {
        console.log('[SW] Service worker has been registered');
    }, e => {
        console.error('[SW] Service worker registration failed', e);
        changePushButtonState('incompatible');
    });

    function changePushButtonState (state) {
        switch (state) {
            case 'enabled':
                pushButton.disabled = false;
                pushButton.title = "Push notifications enabled";
                isPushEnabled = true;
                break;
            case 'disabled':
                pushButton.disabled = false;
                pushButton.title = "Push notifications disabled";
                isPushEnabled = false;
                break;
            case 'computing':
                pushButton.disabled = true;
                pushButton.title = "Loading...";
                break;
            case 'incompatible':
                pushButton.disabled = true;
                pushButton.title = "Push notifications are not compatible with this browser";
                break;
            default:
                console.error('Unhandled push button state', state);
                break;
        }
    }

    function push_subscribe() {
        changePushButtonState('computing');
    }

    function push_unsubscribe() {
        changePushButtonState('computing');
    }
});