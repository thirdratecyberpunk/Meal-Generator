var request = require('request');

getRecipe([""]).then((output) => {
  console.log("hello");
  console.log(output);
});

function getRecipe(ingredients){
return new Promise((resolve, reject) => {
  request.get(getRequestURL(ingredients), function (error, response, body) {
    var results = JSON.parse(body)["results"];
    var titles = [];
    for (item in results){
      titles.push(results[item]);
    }
    resolve(titles[Math.floor(Math.random() * titles.length)]);
    reject(error);
  });
});
}


function getRequestURL(ingredients){
  var url = "http://www.recipepuppy.com/api";
  if (ingredients.length){
    url += "?i="
    ingredients.forEach(function(elem) {
      if (elem != ""){
        url += elem + ",";
      }
    });
  }
  return url;
}
