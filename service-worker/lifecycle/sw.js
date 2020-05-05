// Service worker

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
