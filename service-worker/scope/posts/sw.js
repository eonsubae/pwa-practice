self.addEventListener('activate', (_) => {
  console.log('SW Active');
});

self.addEventListener('fetch', (e) => {
  console.log('SW Fetch : ' + e.request.url);
});
