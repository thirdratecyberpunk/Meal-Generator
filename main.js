var request = require('request');

return new Promise((resolve, reject) => {
  request.get(getRandomRecipeTitle(["eggs", "kidney beans"]), function (error, response, body) {
    var results = JSON.parse(body)["results"];
    var titles = [];
    for (item in results){
      titles.push(results[item]["title"]);
    }
    resolve(titles);
    reject(error);
  });
});


function getRandomRecipeTitle(ingredients){
  var request = "http://www.recipepuppy.com/api?i=";
  for (item in ingredients){
    request.push(item + ",");
  }
  console.log(request);
  return request;
}
