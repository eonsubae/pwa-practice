// JS Fetch

// Classic XHR
/*
if (window.XMLHttpRequest) {
  request = new XMLHttpRequest();
} else if (window.ActiveXObject) {
  // IE
  try {
    request = new ActiveXObject('Msxml2.XMLHTTP');
  } catch (e) {
    try {
      request = new ActiveXObject('Microsoft.XMLHTTP');
    } catch (e) {}
  }
}

request.open('GET', 'https://api.github.com/users/google/repos', true);
request.send(null);

request.onreadystatechange = (state) => {
  if (request.readyState === 4) {
    console.log(JSON.parse(request.response));
  }
};
*/

fetch('https://api.github.com/users/google/repos')
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    console.log(json);
  })
  .catch((error) => {
    console.log('Fetch Error');
    console.log(error);
  });
