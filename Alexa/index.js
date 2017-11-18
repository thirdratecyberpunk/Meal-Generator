'use strict';
var request = require('request');

function buildSpeechletResponse(output, shouldEndSession){

    return{
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },

        card: {
            type: 'Standard',
        },

        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse){
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

function getRecipe(ingredients){
return new Promise((resolve, reject) => {
  request.get(getRequestURL(ingredients), function (error, response, body) {
    var results = JSON.parse(body)["results"];
    var titles = [];
    for (item in results){
      titles.push(results[item]["title"]);
    }
    resolve(titles[Math.floor(Math.random() * titles.length]);
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


function help(callback){
    callback({}, buildSpeechletResponse("Say to Alexa get me a meal if you want to get a meal, if you want your meal to be based on the ingredients you currently have, say my ingredients are ", false));
}

function getMeal(session, callback){
  if(session.attributes == null){
      getRecipe([""]).then((output) => {
        callback({}, buildSpeechletResponse({}, "Why don't you try " + output));
      });
  }
}

function inputIngedients(session, callback){

}

function welcome(session, callback){

}

function sessionEnd(intent, session, callback){

}

function onSessionStarted(sessionStartedRequest, session) {
    console.log('sessionStartedRequest requestId = ${sessionStartedRequest.requestId}, sessionId = ${session.sessionId}');
}

function onLaunch(launchRequest, session, callback) {
        welcome(session, callback);
}

function onIntent(intentRequest, session, callback) {

    console.log('intentRequest requestId = ${intentRequest.requestId}, sessionId = ${session.sessionId}');

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

        switch(intentName){

        case 'welcome':
            break;

        case 'inputIngredients' :
            break;

        case 'getMeAMeal' :
            break;

        case 'AMAZON.HelpIntent' :
            help(callback);
            break;

        case 'AMAZON.StopIntent' :
        case 'AMAZON.CancelIntent' :
            sessionEnd(callback);
            break;

        default :
            throw new Error('Invalid intent');
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log('onSessionEnded requestId = ${sessionEndedRequest.requestId}, sessionId = ${session.sessionId}');
}


exports.handler = (event, context, callback) => {
    try {

        if (event.session.application.applicationId !==  "amzn1.ask.skill.74d039fe-deb9-471e-914d-d2bc14f899ce") {
            callback('invalid application ID');
        }

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session, (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
        }

        else if (event.request.type === 'IntentRequest') {
            onIntent(event.request, event.session, (sessionAttributes, speechletResponse) => {
                callback(null, buildResponse(sessionAttributes, speechletResponse));
            });
        }
        else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }

    }

    catch (err) {
        callback(err);
    }
};
