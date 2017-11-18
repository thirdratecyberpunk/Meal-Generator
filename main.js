var request = require('request');

return new Promise((resolve, reject) => {
  request.get('http://www.recipepuppy.com/api', function (error, response, body) {
    var results = JSON.parse(body)["results"];
    var titles = [];
    for (item in results){
      titles.push(results[item]["title"]);
    }
    resolve(titles);
    reject(error);
  });
});
