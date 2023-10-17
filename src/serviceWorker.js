self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = body => {
        // you could refresh a notification badge here with postMessage API
        const title = "Web Push example";

        return self.registration.showNotification(title, {
            body,
        });
    };

    if (event.data) {
        const payload = event.data.json();
        event.waitUntil(sendNotification(payload.message));
    }
});
