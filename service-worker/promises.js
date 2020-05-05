// JS Promises

// Classic callback

/* undefined
function addExtra(price) {
  setTimeout(function () {
    return price + 1;
  }, 300);
}
*/

/* classic callback solution
function addExtra(price, callback) {
  setTimeout(function () {
    callback(price + 1);
  }, 300);
}

addExtra(1, function (newPrice) {
  console.log(newPrice);
});
*/

// callback hell
/*
addExtra(1, function (newPrice) {
  addExtra(newPrice, function (newPrice2) {
    addExtra(newPrice2, function (newPrice3) {
      console.log(newPrice);
    });
  });
});
*/

/* validation callback hell
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
*/

function addExtra(price) {
  return new Promise((resolve, reject) => {
    if (price > 2) reject('Price cannot exceed 3');

    setTimeout(function () {
      resolve(price + 1);
    }, 300);
  });
}

addExtra(2)
  .then((newPrice) => {
    console.log(newPrice);
  })
  .catch((error) => {
    console.log(error);
  });
