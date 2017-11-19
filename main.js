var request = require('request');

searchRecipe(["blueberry"]).then((output) => {
  console.log(output.recipe_id);
  getRecipeFromId(output.recipe_id).then((output) => {
    console.log(output);
  });
});

function searchRecipe(ingredients){
  return new Promise((resolve, reject) => {
    request.get(getRequestURL(ingredients), function (error, response, body) {
      var results = JSON.parse(body)["recipes"];
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

function getRecipeFromId(recipe_id){
  return new Promise((resolve, reject) => {
    request.get(getSpecificRecipeURL(recipe_id), function (error, response, body){
      var results = JSON.parse(body);
      console.log(results);
      resolve(results);
      reject(error);
    });
  });
}

/**
* generates the URL to get the recipes object
*/
function getRequestURL(ingredients){
  var url = "http://food2fork.com/api/search?key=0e799db0a42173dfbfd14aad4560b1bc";
  if (ingredients.length){
    url += "&q=";
    ingredients.forEach(function(elem) {
      if (elem != null){
        url += elem + ",";
      }
    });
  }
  url += "&page=1";
  return url;
}

/**
* generates the URL to get the specific recipe object
*/
function getSpecificRecipeURL(recipeId){
  var url = "http://food2fork.com/api/get?key=0e799db0a42173dfbfd14aad4560b1bc";
  url += "&rId=" + recipeId;
  return url;
}
