// Service worker

/* Lifecycle
self.addEventListener('install', (e) => {
  let installPromise = new Promise((resolve) => {
    // Some async tasks
    setTimeout(resolve, 3000);
  });

  // Tasks for the install event
  e.waitUntil(installPromise);
});

self.addEventListener('activate', (e) => {
  console.log('SW2 Activated');
});
*/

/*
self.addEventListener('fetch', (e) => {
  if (e.request.url.endsWith('style.css')) {
    console.log('Fetch Event for style.css: ' + e.request.url);
    e.respondWith( fetch('/style2.css') );
  }

  if (e.request.url.endsWith('/greet')) {
    let headers = new Headers({ 'Content-Type': 'text/html' });

    let customRes = new Response('<h1>Hello World</h1>', {
      headers,
    });

    e.respondWith(customRes);
  }
});
*/

self.addEventListener('fetch', (e) => {
  if (e.request.url.endsWith('./camera_feed.html')) {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res.ok) return res;

        return new Response('Camera feed currently not available');
      })
    );
  }
});
