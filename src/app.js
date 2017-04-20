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
        push_updateSubscription();
    }, e => {
        console.error('[SW] Service worker registration failed', e);
        changePushButtonState('incompatible');
    });

    function changePushButtonState (state) {
        switch (state) {
            case 'enabled':
                pushButton.disabled = false;
                pushButton.textContent = "Push notifications enabled";
                isPushEnabled = true;
                break;
            case 'disabled':
                pushButton.disabled = false;
                pushButton.textContent = "Push notifications disabled";
                isPushEnabled = false;
                break;
            case 'computing':
                pushButton.disabled = true;
                pushButton.textContent = "Loading...";
                break;
            case 'incompatible':
                pushButton.disabled = true;
                pushButton.textContent = "Push notifications are not compatible with this browser";
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
                // TODO create subscription on your server
                console.log('User is subscribed');
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

    function push_updateSubscription() {
        navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
            serviceWorkerRegistration.pushManager.getSubscription()
            .then(subscription => {
                changePushButtonState('disabled');

                if (!subscription) {
                    // We aren't subscribed to push, so set UI to allow the user to enable push
                    return;
                }

                // TODO Keep your server in sync with the latest endpoint

                // Set your UI to show they have subscribed for push messages
                changePushButtonState('enabled');
            })
            .catch(e => {
                console.error('Error when updating the subscription', e);
            });
        });
    }

    function push_unsubscribe() {
        changePushButtonState('computing');

        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            // To unsubscribe from push messaging, you need to get the subscription object
            serviceWorkerRegistration.pushManager.getSubscription().then(subscription => {
                // Check that we have a subscription to unsubscribe
                if (!subscription) {
                    // No subscription object, so set the state
                    // to allow the user to subscribe to push
                    changePushButtonState('disabled');
                    return;
                }

                // We have a subscription, unsubscribe
                // TODO remove push subscription from server
                subscription.unsubscribe().then(() => {
                    changePushButtonState('disabled');
                    console.log('User is unsubscribed');
                })
                .catch(e => {
                    // We failed to unsubscribe, this can lead to
                    // an unusual state, so  it may be best to remove
                    // the users data from your data store and
                    // inform the user that you have done so
                    console.error('Error when unsubscribing the user', e);
                    changePushButtonState('disabled');
                });
            })
            .catch(e => {
                console.error('Error when getting the subscription to unsubscribe', e);
            });
        });
    }
});