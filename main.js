var request = require('request');

getRecipe(["eggs"]).then((output) => {
  console.log("hello");
  console.log(output);
});

function getRecipe(ingredients){
return new Promise((resolve, reject) => {
  request.get(getRequestURL(ingredients), function (error, response, body) {
    var results = JSON.parse(body)["results"];
    var object;
    if (results != ""){
      object = [];
      for (item in results){
        object.push(results[item]);
      }
      object = object[Math.floor(Math.random() * object.length)];
    }
    else{
      object = "NO-RECIPE-FLAG";
    }
    resolve(object);
    reject(error);
  });
});
}


function getRequestURL(ingredients){
  var url = "http://www.recipepuppy.com/api?";
  if (ingredients.length){
    url += "i="
    ingredients.forEach(function(elem) {
      if (elem != null){
        url += elem + ",";
      }
    });
  }
  url += "&p=1";
  return url;
}
