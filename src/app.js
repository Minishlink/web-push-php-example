document.addEventListener("DOMContentLoaded", () => {
    const applicationServerKey = "BCmti7ScwxxVAlB7WAyxoOXtV7J8vVCXwEDIFXjKvD-ma-yJx_eHJLdADyyzzTKRGb395bSAtxlh4wuDycO3Ih4";
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

    // Check the current Notification permission.
    // If its denied, the button should appears as such, until the user changes the permission manually
    if (Notification.permission === 'denied') {
        console.warn('Notifications are denied by the user');
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

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function push_subscribe() {
        changePushButtonState('computing');

        navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
            serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
            })
            .then(subscription => {
                changePushButtonState('enabled'); // Subscription was successful
                // TODO create subscription
            })
            .catch(e => {
                if (Notification.permission === 'denied') {
                    // The user denied the notification permission which
                    // means we failed to subscribe and the user will need
                    // to manually change the notification permission to
                    // subscribe to push messages
                    console.warn('Notifications are denied by the user.');
                    changePushButtonState('incompatible');
                } else {
                    // A problem occurred with the subscription; common reasons
                    // include network errors or the user skipped the permission
                    console.error('Impossible to subscribe to push notifications', e);
                    changePushButtonState('disabled');
                }
            });
        });
    }

    function push_unsubscribe() {
        changePushButtonState('computing');
    }
});