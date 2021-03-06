// Progressive Enhancement (SW supported)

/* Way 1
if ('serviceWorker' in navigator) {
  // Register the SW
  navigator.serviceWorker.register('./sw.js');
}
*/

if (navigator.serviceWorker) {
  // Register the SW
  navigator.serviceWorker
    .register('./sw.js')
    .then((registration) => {
      console.log('SW Registered');
    })
    .catch(console.log);
}

// Get camera feed
/*
fetch('camera_feed.html')
  .then((res) => {
    return res.text();
  })
  .then((html) => {
    console.log(html);
    document.querySelector('#camera').innerHTML = html;
  });
*/
