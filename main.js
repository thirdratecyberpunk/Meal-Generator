var request = require('request');

function getRecipe(ingredients){
return new Promise((resolve, reject) => {
  request.get(getRequestURL(ingredients), function (error, response, body) {
    var results = JSON.parse(body)["results"];
    var titles = [];
    for (item in results){
      titles.push(results[item]["title"]);
    }
    resolve(titles);
    reject(error);
  });
});
}


function getRequestURL(ingredients){
  var url = "http://www.recipepuppy.com/api?i=";
  ingredients.forEach(function(elem) {
    url += elem + ",";
  });
  return url;
}
