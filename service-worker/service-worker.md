# Service worker

서비스 워커
* 웹 애플리케이션과 네트워크에 있어 근본이 되는 프록시 객체
* 웹 애플리케이션과 독립적으로 실행되며 푸쉬 알림을 받는 것이 가능하다
* 웹 애플리케이션과 독립적이므로 앱이 종료되어도 백그라운드에서 싱크된다
* PWA에서 서비스 워커의 주된 역할은 네트워크가 가능하든 그렇지 않든 요청을 가로채서 응답을 적절하게 보내주는 것이다
* 요청은 캐싱이 가능하며 HTTPS로 보안이 적용된 통신이 가능하다
* 사용하는 API
  - 전통적인 콜백 대신 프로미스를 사용
  - XHR이 아닌 fetch api를 사용

--

Promise
* 서비스워커는 콜백 대신 Promise를 사용한다
* Promise는 전통적인 콜백의 계단식 구조를 더 나은 방식으로 해결하도록 도와주는 API다

예제로 알아보기

```js
function addExtra(price) {
  setTimeout(function () {
    return price + 1;
  }, 300);
}

console.log(addExtra(1));
```
* addExtra는 인자로 넘어온 숫자에 1을 더해 반환하려는 함수다
* 그러나 비동기 이므로 price는 이미 사라져 반환되는 값은 undefined가 된다
* 이 문제를 해결하기 위해 과거에는 콜백 함수를 사용했다

콜백함수를 사용한 해결
```js
function addExtra(price, callback) {
  setTimeout(function () {
    callback(price + 1);
  }, 300);
}

addExtra(1, function (newPrice) {
  console.log(newPrice);
});
```
* 이렇게 콜백함수를 사용해서 비동기 문제를 해결할 수 있다
* 그러나 이런 해결방식의 문제점은 비동기 로직이 중첩된 보다 복잡한 상황을 해결할 때 계단식으로 코드가 한없이 늘어져야만 한다는 점이다

계단식으로 코드가 늘어지는 콜백 헬
```js
addExtra(1, function (newPrice) {
  addExtra(newPrice, function (newPrice2) {
    addExtra(newPrice2, function (newPrice3) {
      console.log(newPrice);
    });
  });
});
```
* 콜백 헬의 더 큰 문제는 수정사항이 생겼을 때 유연하게 대응하기 어렵다는 점이다
* 예를 들어, addExtra함수의 중간에 validation로직이라도 추가한다면 코드는 더욱 끔찍해진다

Validation로직 추가
```js
function addExtra(price, callback) {

  if (price > 2) {
    callback(false, "Price cannot exceed 3");
    return;
  }

  setTimeout(function () {
    callback(price + 1);
  }, 300);
}

addExtra(1, function (newPrice) {
  if (error) {
    console.log(error);
    return;
  }  
  addExtra(newPrice, function (newPrice2) {
    if (error) {
      console.log(error);
      return;
    }
    addExtra(newPrice2, function (newPrice3) {
      if (error) {
        console.log(error);
        return;
      }
      console.log(newPrice);
    });
  });
});
```

Promise로 위 문제를 해결하기
* 콜백은 비동기 이벤트가 완료되자마자 호출된다
* 반면에 프로미스는 간단하게 비동기 이벤트를 분해한다
* 프로미스는 일종의 헬퍼로서 비동기 코드가 끝나는 시점까지 기다리며 감독한다
* Promise가 만들어지면 3가지 상태중 하나가 된다
  - Pending : 초기 상태
  - Resolved : 비동기 작업이 완료된 상태
  - Rejected : 프로미스 액션이 실패한 상태

```js
function addExtra(price) {
  return new Promise((resolve, reject) => {
    if (price > 2) reject('Price cannot exceed 3');

    setTimeout(function () {
      resolve(price + 1);
    }, 300);
  });
}

addExtra(1)
  .then((newPrice) => {
    console.log(newPrice);
  })
  .catch((error) => {
    console.log(error);
  });

```
* price가 2보다 크면 작업의 실패를 알리는 reject의 인자로 에러 메시지를 넘기고 있다
* 모든 조건이 통과하면 resolve함수에 결과를 인자로 넘겨준다
* 프로미스를 리턴하는 함수는 then과 catch함수를 통해 각각 성공, 실패시 작업을 처리할 수 있다
* 위와 같이 프로미스를 사용하면 계단식으로 늘어지는 보기 싫은 코드를 없앨 수 있다

---

Fetch API
* Fetch는 XMLHttpRequest를 대체하는 새로운 브라우저 자바스크립트 API다
* XHR에 사용되는 장황한 코드들을 없애고 직관적으로 사용할 수 있다

XHR을 이용한 전통적인 Ajax사용법
```js
// JS Fetch

// Classic XHR
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
```

Fetch를 사용한 같은 동작을 하는 코드
```js
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
```
* 코드가 훨씬 간결해졌다

---

Lifecycle
* 서비스 워커가 적용되는 과정에 대해 알아보자
* Step1
  - 브라우저가 서비스 워커 스크립트를 읽어냄(Parsing)  
* Step2
  - 서비스 워커 스크립트를 기반으로 태스크를 설치하는 단계
  - ex. Cash
* Step3
  - Wating 이벤트를 설치하기
* Step4
  - Activated(활성화) 단계
  - 서비스 워커가 페이지를 완전히 제어하는 단계

서비스워커 등록 전에 체크해야할 것
* 브라우저가 서비스 워커를 지원하는지를 체크
  - 서비스워커는 HTML API중 navigator의 일부다
  - 따라서 아래 코드의 두 방법 중 하나로 체크할 수 있다

```js
// Way 1
if ('serviceWorker' in navigator) {
  // Register the SW
  navigator.serviceWorker.register('./sw.js');
}

// Way 2
if (navigator.serviceWorker) {
  // Register the SW
  navigator.serviceWorker.register('./sw.js');
}
```

서비스워커 코드 작성하기
```js
self.addEventListener('install', (e) => {
  let installPromise = new Promise((resolve) => {
    // Some async tasks
    setTimeout(resolve, 3000);
  });

  // Tasks for the install event
  e.waitUntil(installPromise);
});

self.addEventListener('activate', (e) => {
  console.log('SW: Activate Event');
});
```
* self는 서비스 워커 자신을 가르키는 변수다
* install 이벤트는 서비스 워커가 실행하는 첫 번째 이벤트이며 한 번만 실행된다
* waitUntil 함수는 프로미스를 전달받아 설치 완료 시점과, 성공 또는 실패를 브라우저에 알린다
* skipWaiting 함수를 사용하면 대기를 방지하고 설치되자마자 서비스 워커를 활성화 시킨다
* 서비스워커가 설치되어 클라이언트를 제어하고 push, sync같은 이벤트를 처리할 준비가 되면 activate이벤트가 발생한다

---

FetchEvent
* 네트워크와 관련된 조작을 도와주는 객체

```js
self.addEventListener('fetch', (e) => {
  if (e.request.url.endsWith('style.css')) {
    console.log('Fetch Event for style.css: ' + e.request.url);
  }
});
```
* event객체의 request프로퍼티는 요청과 관련된 정보를 가지고 있다(ex. url)
* url프로퍼티에 endsWith함수를 사용하면 최종 요청경로를 파악할 수 있다

```js
self.addEventListener('fetch', (e) => {
  if (e.request.url.endsWith('style.css')) {
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
```
* respondWith는 프로미스를 사용해 추가적인 비동기 작업을 처리해준다

이미지를 불러들여와 읽기
```js
// camera_feed.html
<img src="http://placehold.it/500x200" />

// main.js
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
fetch('camera_feed.html')
  .then((res) => {
    return res.text();
  })
  .then((html) => {
    console.log(html);
    document.querySelector('#camera').innerHTML = html;
  });
```
* 위 코드를 추가하고 다시 로딩해보면 이미지를 불러와 추가하는 것을 확인할 수 있다

---