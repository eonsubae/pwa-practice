if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('/posts/sw.js' /*{ scope: '/posts' }*/)
    .then((registration) => {
      console.log('SW Registered');
    })
    .catch(console.log);
}
