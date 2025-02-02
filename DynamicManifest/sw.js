importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');
importScripts('idb.js');
workbox.skipWaiting();
workbox.clientsClaim();
var dbPromise = idb.open('DynamicManifest');

function getStartURL() {
    return dbPromise.then(function(db) {
        var tx = db.transaction('UserSettings', 'readonly');
        var store = tx.objectStore('UserSettings');
        return store.get('start_url');
    }).then(val => {
        if (!val)
            return 'index.html';
        return val.value;
    });
}
const handler = ({ url, event }) => {
    console.log("responding");
    return getStartURL().then(page => {
        return fetch(page)
    });
};
workbox.routing.registerRoute(
    /index\.html\?homescreen=1/,
    handler
);
